// Looker visualization API
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
    if (!data.length) {
      this.addError({ title: "No data." });
      return;
    }

    // Parse the data from Looker into the format needed for funnel-graph-js
    const labels = queryResponse.fields.dimensions.map(dim => dim.label_short);
    const values = data.map(row => row[queryResponse.fields.dimensions[0].name].value);
    const colors = [config.color1, config.color2];

    const graphData = {
      labels: labels,
      colors: colors,
      values: values
    };

    // Clear the previous graph
    this._container.innerHTML = "";

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
  }
});
