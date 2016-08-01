(function() {
  var featuresForType, slugify;

  featuresForType = function(features, type) {
    return _.filter(features, function(d) {
      return d.properties.energietrager === type;
    });
  };

  slugify = function(s) {
    return s.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
  };

  d3.csv("data/percentage_region.csv", function(data) {
    var chart;
    chart = stacked();
    chart.screenWidth(1200);
    d3.select("#chart").datum(data).call(chart);
    return chart.sortBy('Steinkohle');
  });

  d3.json("data/stacked.json", function(spec) {
    spec.width = d3.select('#stacked').node().getBoundingClientRect()['width'];
    return vg.parse.spec(spec, function(chart) {
      var view;
      view = chart({
        el: '#stacked',
        renderer: 'svg'
      }).update();
    });
  });

  d3.json("data/stacked_typ.json", function(spec) {
    spec.width = d3.select('#stacked-typ').node().getBoundingClientRect()['width'];
    return vg.parse.spec(spec, function(chart) {
      var view;
      view = chart({
        el: '#stacked-typ',
        renderer: 'svg'
      }).update();
    });
  });

  d3.json("data/overall-short.json", function(spec) {
    spec.width = d3.select('#overall-production').node().getBoundingClientRect()['width'];
    return vg.parse.spec(spec, function(chart) {
      var view;
      view = chart({
        el: '#overall-production',
        renderer: 'svg'
      }).update();
    });
  });

  queue().defer(d3.json, "data/deu.topo.json").defer(d3.json, "data/plants.geojson").defer(d3.json, "data/energy.json").defer(d3.csv, "data/gesamt_typ_bl.csv").await(function(error, topojson, data, energy, production) {
    var color, colorScale, colors, dataMax, energyTypes, fill, mapGermany, plantScale, radius, tooltip, type, typeClass;
    colors = (function() {
      var results;
      results = [];
      for (type in energy) {
        color = energy[type];
        results.push(color);
      }
      return results;
    })();
    energyTypes = (function() {
      var results;
      results = [];
      for (type in energy) {
        color = energy[type];
        results.push(type);
      }
      return results;
    })();
    dataMax = d3.max(data.features, function(d) {
      return Math.sqrt(d.properties.netto_nennleistung_elektrische_wirkleistung_in_mw / Math.PI);
    });
    plantScale = d3.scale.linear().domain([0, dataMax]).range([1, 20]);
    colorScale = d3.scale.ordinal().domain(energyTypes).range(colors);
    radius = function(d) {
      return plantScale(Math.sqrt(d.properties.netto_nennleistung_elektrische_wirkleistung_in_mw / Math.PI));
    };
    fill = function(d) {
      return colorScale(d.properties.energietrager);
    };
    typeClass = function(d) {
      return slugify(d.properties.energietrager);
    };
    tooltip = function(d) {
      var energyCountry, prouductionCountry, summe;
      prouductionCountry = _.where(production, {
        BL: d.properties.code
      });
      prouductionCountry = _.sortBy(prouductionCountry, function(d) {
        return parseInt(d.Produktionsvolumen);
      });
      summe = prouductionCountry.pop();
      energyCountry = _.last(prouductionCountry, 5).reverse();
      return {
        name: d.properties.name,
        gesamt: summe.Produktionsvolumen,
        energy: energyCountry
      };
    };
    mapGermany = this.map().center([9.7, 51.4]).scale(3200).height(700).overlayFeatures(data.features).overlayFeatureRadius(radius).featureFill(fill).featureClass(typeClass).templateData(tooltip);
    d3.select("#map-germany").datum(topojson).call(mapGermany);
    return d3.csv("data/gesamt_produktion.csv", function(gesamt) {
      var detailMaps;
      detailMaps = ["Steinkohle", "Braunkohle", "Kernenergie", "Erdgas", "Solare Strahlungsenergie", "Windenergie (Onshore-Anlage)"];
      return detailMaps.forEach(function(type) {
        var features, mapDetail, parent, plantScaleDetail, produktion, radiusDetail;
        produktion = _.findWhere(gesamt, {
          Typ: type
        });
        features = featuresForType(data.features, type);
        plantScaleDetail = d3.scale.linear().domain([0, dataMax]).range([1, 20]);
        radiusDetail = function(d) {
          return plantScale(Math.sqrt(d.properties.netto_nennleistung_elektrische_wirkleistung_in_mw / Math.PI));
        };
        mapDetail = this.map().center([9.7, 51.4]).scale(1500).height(350).overlayFeatures(features).overlayFeatureRadius(radiusDetail).featureFill(fill);
        d3.select("#map-germany-" + (slugify(type))).datum(topojson).call(mapDetail);
        parent = d3.select("#" + (slugify(type)));
        parent.select('.count').text(features.length);
        return parent.select('.prozent').text((Math.round(produktion.Prozent * 100)) + " %");
      });
    });
  });

  d3.json("data/stacked_multiples.json", function(spec) {
    return vg.parse.spec(spec, function(chart) {
      var view;
      view = chart({
        el: '#bundesland-multiples',
        renderer: 'svg'
      }).update();
    });
  });

}).call(this);
