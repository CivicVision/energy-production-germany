function stacked() {
var data = [];



var breakpoint = {
    xs: 480,
    sm: 768,
    md: 992,
    lg: 1200,
    xl: 1500
}

var color = d3.scale.category10();

var colorScheme = {
  //"Coal": "#989798",
  "Coal": "#555",
  "Petroleum": "#ED1C24",
  "Wind": "",
  "Gas": "#F68B28",
  "Hydro": "#0081C5",
  //"Solar": "#D7C944",
    "Solar": "#afb228",
  "Nuclear": "#CF4A9A",
  "Other": "#FFEFD5"
}
colors = {
  "#07FC79":"Abfall",
  "#398C60":"Biomasse",
  "#C96D00":"Braunkohle",
  "#fff":"Deponiegas",
  "#C66B50":"Erdgas",
  "#1F7346":"Geothermie",
  "#fff":"Grubengas",
  "#AC466C":"Kernenergie",
  "#fff":"Klärgas",
  "#fff":"Laufwasser",
  "#fff":"Mehrere Energieträger",
  "#FF8E07":"Mineralölprodukte",
  "#0081C5":"Pumpspeicher",
  "#FFBC07":"Solare Strahlungsenergie",
  "#fff":"Sonstige Energieträger",
  "#fff":"Speicherwasser",
  "#160C00":"Steinkohle",
  "#18":"Unbekannter Energieträger",
  "#19":"Windenergie Offshore",
  "#14AAFB":"Windenergie"
}
var absolute_ordering = ['pctcoal', 'pctnatural_gas', 'pctnuclear', 'pcthydro', 'pctwind', 'pctpetroleum',  'pctsolar', 'pct_other'];
var absolute_ordering = [
  {
    prop: 'Braunkohle',
    color: '#555'
  },
  {
    prop: 'Steinkohle',
    color: '#333'
  },
  {
    prop: 'Erdgas',
    color: '#F68B28'
  },
  {
    prop: 'Kernenergie',
    color: '#CF4A9A'
  },
  {  
    prop:'Pumpspeicher',
    color: '#0081C5'
  },
  {  
  prop:'Laufwasser',
    color: '#0081C5'
  },
  {
    prop: 'Windenergie',
    color: '#0DB14B'
  }, 
  {
    prop: 'Mineralölprodukte',
    color: '#ED1C24'
  },
  {
    prop: 'Abfall',
    color: '#DD1C24'
  },
  {
    prop: 'Biomasse',
    color: '#ADCC24'
  },
  {
    prop: 'Solar',
    color: '#D7C944'
  }];
var absolute_ordering = (function() {
  var i, results;
  results = [];
  for(color in colors) {
    results.push({ prop: colors[color], color: color });
  }
  return results;
})();
var sources = absolute_ordering;
var colors =  ['#555', '#F68B28', '#CF4A9A', '#0081C5', '#0DB14B', '#ED1C24', '#D7C944', '#FFEFD5'];

function getStateSourceValues(datum) {
  return sources.reduce(function(previousVal, source) {
    previousVal.push({
      state: datum.Bundesland,
      source: source,
      pct: +datum[source.prop],
      offset: previousVal.reduce(function(p, d) { 
        return p + +d.pct; }, -1 * +datum[sources[0].prop])
    });

    return previousVal;
  }, []);
}


var height;
var width;
var barWidth;
var barHeight
var rects;
var states;
var scale;
var stateLabels;

var screenWidth;

var renderHorizontally = true;

var formatPercent = d3.format('0%');

function renderHorizontal(d) {
  var margin = {
    top: 10,
    right: 45,
    bottom: 10,
    left: 45
  }
  d.sort(function(a, b) { 
    return d3.descending(a.Braunkohle, b.Braunkohle) || d3.descending(a.Erdgas, b.Erdgas); })
  height = 300 - margin.top - margin.bottom;
  width = d3.select(this).node().getBoundingClientRect().width - margin.right - margin.left;
  barWidth = width / 16;

  scale = d3.scale.linear()
    .range([0, height / 2])
    .domain([0,1]);

  function makeAxis() {
    return d3.svg.axis()
      .scale(scale)
      .orient('left')
      .tickValues([0, 0.25, 0.5, 0.75, 1])
      .tickFormat(formatPercent);
  }

  d3.select(this).select('svg').remove();

  var svg = d3.select(this).append('svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  states = svg.selectAll('g.state')
    .data(d)
    .enter().append('g')
    .attr('transform', function(d, i) { 
      return 'translate(' + (i * barWidth) + ',' + (height / 2) + ')'; });

  rects = states.selectAll('rect.othersource')
    .data(getStateSourceValues)
    .enter().append('rect')
    .attr('class', 'othersource')
    .attr('height', function(d) { 
      return scale(d.pct); })
    .attr('width', barWidth)
    .attr('x', 0)
    .attr('y', 0)
    .attr('fill', function(d, i) { 
      return d.source.color; })
    .attr('stroke', function(d, i) { 
      return d3.rgb(d.source.color).darker(0.5); })
    .attr('transform', function(d) { 
      return 'translate(0,' + scale(d.offset) + ')'; });

  stateLabels = states.append('text')
    .attr('dy', -3)
    .attr('dx', barWidth / 2)
    .style('text-anchor', 'middle')
    .attr('transform', function(d) { return 'translate(0,' + -1 * scale(d.Braunkohle) + ')'; })
    .text(function(d) { return d.BL; });

  svg.append('g')
    .attr('class', 'ticks coal')
    .attr('transform', 'translate(-3,0)')
    .call(makeAxis().scale(scale.domain([1,0])));

  svg.append('g')
    .attr('class', 'axis coal')
    .attr('transform', 'translate(' + width + ',0)')
    .call(makeAxis().tickSize(width));

  svg.append('g')
    .attr('class', 'ticks othersources')
    .attr('transform', 'translate(' + (width + 3) + ',' + (height / 2) + ')')
    .call(makeAxis().scale(scale.domain([0,1])).orient('right'));

  svg.append('g')
    .attr('class', 'axis othersources')
    .attr('transform', 'translate(' + (width) + ',' + height / 2 + ')')
    .call(makeAxis().tickSize(width));
}

function renderVertical(d) {
  d.sort(function(a, b) { 
    return d3.descending(a.pctcoal, b.pctcoal) || d3.descending(a.pctnatural_gas, b.pctnatural_gas); })
  var margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  }
  function makeAxis() {
    return d3.svg.axis()
      .scale(scale)
      .orient('top')
      .tickValues([0, 0.25, 0.5, 0.75, 1])
      .tickFormat(formatPercent);
  }
  width = d3.select(this).node().getBoundingClientRect().width - margin.right - margin.left;
  barHeight = 12;
  height = barHeight * 50;

  scale = d3.scale.linear()
   .range([0, width / 2])
   .domain([0,1]);

  d3.select(this).select('svg').remove();

  var svg = d3.select(this).append('svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  states = svg.selectAll('g.state')
    .data(d)
    .enter().append('g')
    .attr('transform', function(d, i) { 
      return 'translate(' + (width / 2) + ',' + (i * barHeight) + ')'; });

  rects = states.selectAll('rect.othersource')
    .data(getStateSourceValues)
    .enter().append('rect')
    .attr('class', 'othersource')
    .attr('width', function(d) { 
      return scale(d.pct); })
    .attr('height', barHeight)
    .attr('x', 0)
    .attr('y', 0)
    .attr('fill', function(d, i) { 
      return d.source.color; })
    .attr('stroke', function(d, i) { 
      return d3.rgb(d.source.color).darker(0.5); })
    .attr('transform', function(d) { 
      return 'translate(' + scale(d.offset) + ',0)'; });

  stateLabels = states.append('text')
    .attr('dx', -2)
    .attr('dy', barHeight / 2 + 3)
    .style('text-anchor', 'end')
    .attr('transform', function(d) { return 'translate(' + -1 * scale(d.Braunkohle) + ',0)'; })
    .text(function(d) { return d.BL; });

  svg.append('g')
    .attr('class', 'ticks coal')
    .attr('transform', 'translate(0,-3)')
    .call(makeAxis().scale(scale.domain([1,0])));

  svg.append('g')
    .attr('class', 'axis coal')
    .attr('transform', 'translate(0,' + height + ')')
    .call(makeAxis().tickSize(height));

  svg.append('g')
    .attr('class', 'ticks othersources')
    .attr('transform', 'translate(' + (width / 2) + ',' + (height + 3) + ')')
    .call(makeAxis().scale(scale.domain([0,1])).orient('bottom'));

  svg.append('g')
    .attr('class', 'axis othersources')
    .attr('transform', 'translate(' + (width / 2) + ',' + height + ')')
    .call(makeAxis().tickSize(height));
}

function my(selection) {
  selection.each(function(d) {
    if (screenWidth > breakpoint.sm) {
      renderHorizontal.call(this, d);
    } else {
      renderVertical.call(this, d);
    }
  });
}

my.renderHorizontally = function(_) {
  renderHorizontally = _;
  return my;
}

my.screenWidth = function(_) {
  screenWidth = _;
  return my;
}

my.sortBy = function(prop) {
  sourceObj = sources.splice(sources.map(function(d) { return d.prop; }).indexOf(prop), 1);
  sources.sort(function(a, b) { return absolute_ordering.indexOf(a) - absolute_ordering.indexOf(b); });
  sources.unshift(sourceObj[0]);

  /*var rects = states.selectAll('rect.othersource')*/
  rects.data(getStateSourceValues, function(d) { return d.state + d.source.prop; });
  //rects.data(getStateSourceValues);

  rects.transition(rects)
    .duration(750)
    .delay(function(d, i) { return (i*5); })
    .attr('transform', function(d, i) {
      if (screenWidth > breakpoint.sm) {
              return 'translate(0,' + scale(d.offset) + ')';
            } else {
              return 'translate(' + scale(d.offset) + ',0)';
            }
    })

  if (screenWidth > breakpoint.sm) {
    stateLabels.transition(stateLabels)
      .duration(750)
      .delay(function(d, i) { return (i*5); })
      .attr('transform', function(d) { return 'translate(0,' + -1 * scale(d[sources[0].prop]) + ')'; });

  } else {
    stateLabels.transition(stateLabels)
      .duration(750)
      .delay(function(d, i) { return (i*5); })
      .attr('transform', function(d) { return 'translate(' + -1 * scale(d[sources[0].prop]) + ',0)'; });
  }
  
  states.sort(function(a, b) {
    return +b[prop] - +a[prop];
  }).transition(states)
        .duration(750)
        .delay(function(d, i){ return (i * 5);})
        .attr("transform", function(d, i) { 
          if (screenWidth > breakpoint.sm) {
            return 'translate(' + (i * barWidth) + ',' + (height / 2) + ')';
          } else {
            return 'translate(' + (width / 2) + ',' + (i * barHeight) + ')';
          }
        });
}
return my;
}
