(function() {
  this.map = function() {
    var center, chart, featureClass, featureFill, height, mapTooltip, mapTooltipHtml, overlayFeatureRadius, overlayFeatures, projection, scale, templateData, tooltipElement, width;
    width = 600;
    height = 400;
    center = [5, 70];
    scale = 600;
    projection = d3.geo.mercator();
    overlayFeatures = [];
    overlayFeatureRadius = function(d) {
      return 0;
    };
    featureFill = function(d) {
      return "#000";
    };
    featureClass = function(d) {
      return "feature";
    };
    mapTooltipHtml = d3.select("#map-popup").html();
    mapTooltip = Handlebars.compile(mapTooltipHtml);
    templateData = function(d) {
      return {};
    };
    tooltipElement = "#map-tooltip";
    chart = function(selection) {
      return selection.each((function(_this) {
        return function(data, i) {
          var country, featurePath, features, path, svg;
          projection.scale(scale).translate([width / 2, height / 2]).center(center);
          path = d3.geo.path().projection(projection);
          svg = _this.append('svg').attr('width', width).attr('height', height).append('g');
          country = svg.selectAll('path.country').data(topojson.feature(data, data.objects.deu).features).enter().append('path').attr('class', 'country').attr('d', path);
          country.on("mouseover", function(d) {
            data = templateData(d);
            d3.select(tooltipElement).html(mapTooltip(data)).style("opacity", 1);
            return d3.select(this).classed("active", true);
          }).on("mouseout", function(d) {
            d3.select(this).classed("active", false);
            return d3.select(tooltipElement).style("opacity", 0);
          }).on("mousemove", function(d) {
            return d3.select(tooltipElement).style("left", (d3.event.pageX + 14) + "px").style("top", (d3.event.pageY - 32) + "px");
          });
          if (overlayFeatures.length > 0) {
            featurePath = d3.geo.path().projection(projection).pointRadius(overlayFeatureRadius);
            features = svg.selectAll('.features').data(overlayFeatures);
            features.enter().append('path').attr('class', 'features');
            return features.attr('d', featurePath).attr('fill', featureFill).attr('class', function(d) {
              return "features " + (featureClass(d));
            });
          }
        };
      })(this));
    };
    chart.height = function(value) {
      if (!arguments.length) {
        return height;
      }
      height = value;
      return chart;
    };
    chart.width = function(value) {
      if (!arguments.length) {
        return width;
      }
      width = value;
      return chart;
    };
    chart.color = function(value) {
      var color;
      if (!arguments.length) {
        return color;
      }
      color = value;
      return chart;
    };
    chart.center = function(value) {
      if (!arguments.length) {
        return center;
      }
      center = value;
      return chart;
    };
    chart.scale = function(value) {
      if (!arguments.length) {
        return scale;
      }
      scale = value;
      return chart;
    };
    chart.projection = function(value) {
      if (!arguments.length) {
        return projection;
      }
      projection = value;
      return chart;
    };
    chart.overlayFeatures = function(value) {
      if (!arguments.length) {
        return overlayFeatures;
      }
      overlayFeatures = value;
      return chart;
    };
    chart.overlayFeatureRadius = function(value) {
      if (!arguments.length) {
        return overlayFeatureRadius;
      }
      overlayFeatureRadius = value;
      return chart;
    };
    chart.featureFill = function(value) {
      if (!arguments.length) {
        return featureFill;
      }
      featureFill = value;
      return chart;
    };
    chart.featureClass = function(value) {
      if (!arguments.length) {
        return featureClass;
      }
      featureClass = value;
      return chart;
    };
    chart.templateData = function(value) {
      if (!arguments.length) {
        return templateData;
      }
      templateData = value;
      return chart;
    };
    chart.tooltipElement = function(value) {
      if (!arguments.length) {
        return tooltipElement;
      }
      tooltipElement = value;
      return chart;
    };
    return chart;
  };

}).call(this);
