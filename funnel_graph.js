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
    console.log('Received data:', data);
    console.log('Query response:', queryResponse);

    if (!data.length) {
      this.addError({ title: "No data." });
      return;
    }

    if (!queryResponse.fields.dimensions.length) {
      this.addError({ title: "No dimensions." });
      return;
    }

    // Assuming we are working with the first dimension for labels
    const labels = data.map(row => row[queryResponse.fields.dimensions[0].name].value);
    // Assuming we are working with the first measure for values
    const values = data.map(row => row[queryResponse.fields.measures[0].name].value);

    const colors = [config.color1, config.color2];

    const graphData = {
      labels: labels,
      colors: colors,
      values: values
    };

    console.log('Parsed graph data:', graphData);

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