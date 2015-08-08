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
