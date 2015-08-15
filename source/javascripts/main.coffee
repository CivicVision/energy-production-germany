featuresForType = (features, type) ->
  _.filter(features, (d) -> d.properties.energietrager == type)
slugify = (s) ->
  return s.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')

d3.csv("data/percentage_region.csv", (data) ->
  chart = stacked()
  chart.screenWidth(1200)
  d3.select("#chart").datum(data).call(chart)
  chart.sortBy('Steinkohle')
)
d3.json("data/stacked.json", (spec) ->
  vg.parse.spec spec, (chart) ->
    view = chart(
      el: '#stacked'
      renderer: 'svg'
      ).update()
    return
)
d3.json("data/stacked_typ.json", (spec) ->
  vg.parse.spec spec, (chart) ->
    view = chart(
      el: '#stacked-typ'
      renderer: 'svg'
      ).update()
    return
)

d3.json("data/deu.topo.json", (topojson) ->
  d3.json "data/plants.geojson", (data) ->
    d3.json "data/energy.json", (energy) ->
      colors = for type, color of energy
        color
      energyTypes = for type, color of energy
        type
      dataMax = d3.max(data.features, (d) ->
        Math.sqrt(d.properties.netto_nennleistung_elektrische_wirkleistung_in_mw / Math.PI )
      )
      plantScale = d3.scale.linear().domain([0, dataMax]).range([1,20])
      colorScale = d3.scale.ordinal().domain(energyTypes).range(colors)
      radius = (d) ->
        plantScale(Math.sqrt(d.properties.netto_nennleistung_elektrische_wirkleistung_in_mw / Math.PI ))
      fill = (d) ->
        colorScale(d.properties.energietrager)

      mapGermany = @map().center([9.7,50.8]).scale(3000).height(650).overlayFeatures(data.features).overlayFeatureRadius(radius).featureFill(fill)
      d3.select("#map-germany").datum(topojson).call(mapGermany)

      d3.csv "data/gesamt_produktion.csv", (gesamt) ->
        detailMaps = ["Steinkohle", "Braunkohle", "Kernenergie", "Erdgas", "Solare Strahlungsenergie", "Windenergie (Onshore-Anlage)"]
        detailMaps.forEach((type) ->
          produktion = _.findWhere(gesamt, {Typ: type})
          features = featuresForType(data.features, type)
          plantScaleDetail = d3.scale.linear().domain([0, dataMax]).range([1,20])
          radiusDetail = (d) ->
            plantScale(Math.sqrt(d.properties.netto_nennleistung_elektrische_wirkleistung_in_mw / Math.PI ))
          mapDetail = @map().center([9.7,51.4]).scale(1500).height(350).overlayFeatures(features).overlayFeatureRadius(radiusDetail).featureFill(fill)
          d3.select("#map-germany-#{slugify(type)}").datum(topojson).call(mapDetail)
          parent = d3.select("##{slugify(type)}")
          parent.select('.count').text(features.length)
          parent.select('.prozent').text("#{Math.round(produktion.Prozent*100)} %")
        )
)
