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
  mapTooltip = Handlebars.compile(mapTooltipHtml)

  templateData = (d) ->
    {}

  tooltipElement = "#map-tooltip"

  chart = (selection) ->
    selection.each (data,i) =>
      projection.scale(scale).translate([width/2, height/2]).center(center)
      path = d3.geo.path().projection(projection)

      svg = this.append('svg').attr('width', width).attr('height', height).append('g')

      country = svg.selectAll('path.country').data(topojson.feature(data, data.objects.deu).features).enter()
        .append('path')
        .attr('class', 'country')
        .attr('d', path)

      country.on("mouseover", (d) ->
        data = templateData(d)
        d3.select(tooltipElement).html(mapTooltip(data)).style("opacity", 1)
        d3.select(this).classed("active", true)
      ).on("mouseout", (d) ->
        d3.select(this).classed("active", false)
        d3.select(tooltipElement).style("opacity", 0)
      ).on("mousemove", (d) ->
        d3.select(tooltipElement).style("left", (d3.event.pageX + 14) + "px")
        .style("top", (d3.event.pageY - 32) + "px")
      )

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
  chart.templateData = (value) ->
    unless arguments.length
      return templateData
    templateData = value
    chart
  chart.tooltipElement = (value) ->
    unless arguments.length
      return tooltipElement
    tooltipElement = value
    chart
  chart
