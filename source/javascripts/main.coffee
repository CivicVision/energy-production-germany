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
        d.properties.netto_nennleistung_elektrische_wirkleistung_in_mw
      )
      plantScale = d3.scale.linear().domain([50, dataMax]).range([2,20])
      colorScale = d3.scale.ordinal().domain(energyTypes).range(colors)
      radius = (d) ->
        plantScale(d.properties.netto_nennleistung_elektrische_wirkleistung_in_mw)
      fill = (d) ->
        colorScale(d.properties.energietrager)

      mapGermany = @map().center([9.7,50.8]).scale(3000).height(650).overlayFeatures(data.features).overlayFeatureRadius(radius).featureFill(fill)
      d3.select("#map-germany").datum(topojson).call(mapGermany)
)
