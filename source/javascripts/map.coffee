@map = ->
  width = 600
  height = 400
  center = [5,70]
  scale = 600
  projection = d3.geo.mercator()

  overlayFeatures = []
  overlayFeatureRadius = (d) ->
    0
  featureFill = (d) ->
    "#000"
  featureClass = (d) ->
    "feature"

  mapTooltipHtml = d3.select("#map-popup").html()
  mapTooltip = _.template(mapTooltipHtml)

  chart = (selection) ->
    selection.each (data,i) =>
      projection.scale(scale).translate([width/2, height/2]).center(center)
      path = d3.geo.path().projection(projection)

      svg = this.append('svg').attr('width', width).attr('height', height).append('g')

      svg
        .append('path')
        .datum(topojson.feature(data, data.objects.deu))
        .attr('class', 'country')
        .attr('d', path)

      if overlayFeatures.length > 0
        featurePath = d3.geo.path().projection(projection).pointRadius(overlayFeatureRadius)
        features = svg.selectAll('.features')
          .data(overlayFeatures)
        features
          .enter()
          .append('path')
          .attr('class', 'features')
        features
        .attr('d', featurePath)
        .attr('fill', featureFill)
        .attr('class', (d) -> "features #{featureClass(d)}")

  chart.height = (value) ->
    unless arguments.length
      return height
    height = value
    chart
  chart.width = (value) ->
    unless arguments.length
      return width
    width = value
    chart
  chart.color = (value) ->
    unless arguments.length
      return color
    color = value
    chart
  chart.center = (value) ->
    unless arguments.length
      return center
    center = value
    chart
  chart.scale = (value) ->
    unless arguments.length
      return scale
    scale = value
    chart
  chart.projection = (value) ->
    unless arguments.length
      return projection
    projection = value
    chart
  chart.overlayFeatures= (value) ->
    unless arguments.length
      return overlayFeatures
    overlayFeatures = value
    chart
  chart.overlayFeatureRadius = (value) ->
    unless arguments.length
      return overlayFeatureRadius
    overlayFeatureRadius = value
    chart
  chart.featureFill = (value) ->
    unless arguments.length
      return featureFill
    featureFill = value
    chart
  chart.featureClass = (value) ->
    unless arguments.length
      return featureClass
    featureClass = value
    chart
  chart
