// Make sure the funnel-graph-js library is included
// <script src="https://unpkg.com/funnel-graph-js@1.3.9/dist/js/funnel-graph.min.js"></script>
// <link rel="stylesheet" href="https://unpkg.com/funnel-graph-js@1.3.9/dist/css/theme.min.css" />
// <link rel="stylesheet" href="https://unpkg.com/funnel-graph-js@1.3.9/dist/css/main.min.css" />

looker.plugins.visualizations.add({
  id: "funnel_graph",
  label: "Funnel Graph",
  options: {
    color1: {
      type: "string",
      label: "Color 1",
      display: "color",
      default: "#FFB178"
    },
    color2: {
      type: "string",
      label: "Color 2",
      display: "color",
      default: "#FF3C8E"
    }
  },
  create: function(element, config) {
    element.innerHTML = `
      <div class="funnel-container" style="width: 100%; height: 100%;"></div>
    `;
    this._container = element.querySelector('.funnel-container');
  },
  update: function(data, element, config, queryResponse) {
    // Clear any previous errors
    this.clearErrors();

    // Check if data is available
    if (!data.length) {
      this.addError({ title: "No data." });
      return;
    }

    // Parse the data from Looker into the format needed for funnel-graph-js
    const labels = data.map(row => row['label_dimension'] && row['label_dimension'].value);
    const values = data.map(row => row['value_measure'] && row['value_measure'].value);

    if (labels.includes(undefined) || values.includes(undefined)) {
      this.addError({ title: "Data format error.", message: "Ensure 'label_dimension' and 'value_measure' fields exist in the data." });
      return;
    }

    const graphData = {
      labels: labels,
      colors: [config.color1, config.color2],
      values: values
    };

    // Clear the container before drawing a new graph
    this._container.innerHTML = '';

    // Check if FunnelGraph is loaded
    if (typeof FunnelGraph !== 'function') {
      this.addError({ title: "Library Error", message: "FunnelGraph library is not loaded." });
      return;
    }

    try {
      // Create the funnel graph
      const graph = new FunnelGraph({
        container: this._container,
        gradientDirection: 'horizontal',
        data: graphData,
        displayPercent: true,
        direction: 'horizontal',
        width: element.clientWidth,
        height: element.clientHeight
      });

      graph.draw();
    } catch (error) {
      this.addError({ title: "Rendering Error", message: error.message });
    }
  }
});
