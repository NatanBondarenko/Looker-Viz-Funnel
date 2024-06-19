// Dynamically load external libraries
function loadScript(src, callback) {
  var script = document.createElement('script');
  script.src = src;
  script.onload = callback;
  document.head.appendChild(script);
}

function loadCSS(href) {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

// Load the required libraries
loadCSS('https://cdn.jsdelivr.net/npm/funnel-graph-js@1.0.10/dist/funnel-graph.min.css');
loadScript('https://cdn.jsdelivr.net/npm/vue-funnel-graph-js/dist/vue-funnel-graph.min.js', function() {

  looker.plugins.visualizations.add({
    id: "funnel_graph",
    label: "Funnel Graph",
    options: {
      colors: {
        type: "array",
        label: "Colors",
        section: "Style",
        placeholder: "#FF6384, #36A2EB, #FFCE56"
      }
    },
    create: function(element, config) {
      element.innerHTML = '<div id="funnel-graph"></div>';
    },
    updateAsync: function(data, element, config, queryResponse, details, done) {
      if (!queryResponse.fields.dimensions || !queryResponse.fields.dimensions.length) {
        this.addError({title: "No Dimensions", message: "This chart requires dimensions."});
        return;
      }

      const dimension = queryResponse.fields.dimensions[0].name;
      const measure = queryResponse.fields.measures[0].name;

      const labels = data.map(row => row[dimension].value);
      const values = data.map(row => row[measure].value);

      const colors = config.colors && config.colors.length ? config.colors : ["#FF6384", "#36A2EB", "#FFCE56"];

      const funnelData = {
        labels: labels,
        subLabels: [],
        colors: [colors],
        values: [values]
      };

      const graph = new FunnelGraph({
        container: '#funnel-graph',
        gradientDirection: 'horizontal',
        data: funnelData,
        displayPercent: true
      });

      graph.draw();

      done();
    }
  });

});
