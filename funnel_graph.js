// Ensure the FunnelGraph library and styles are loaded
function loadFunnelGraphResources() {
  // Load CSS files
  const themeCssLink = document.createElement("link");
  themeCssLink.rel = "stylesheet";
  themeCssLink.href = "https://unpkg.com/funnel-graph-js@1.3.9/dist/css/theme.min.css";
  document.head.appendChild(themeCssLink);

  const mainCssLink = document.createElement("link");
  mainCssLink.rel = "stylesheet";
  mainCssLink.href = "https://unpkg.com/funnel-graph-js@1.3.9/dist/css/main.min.css";
  document.head.appendChild(mainCssLink);

  // Load JS file
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/funnel-graph-js@1.3.9/dist/js/funnel-graph.min.js";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

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

    // Load FunnelGraph resources
    loadFunnelGraphResources().then(() => {
      // Resources loaded, ready to use FunnelGraph
      this._resourcesLoaded = true;
      if (this._pendingUpdate) {
        this.update(...this._pendingUpdate);
        this._pendingUpdate = null;
      }
    }).catch(error => {
      console.error("Failed to load FunnelGraph resources", error);
      this.addError({ title: "Failed to load resources", message: error.message });
    });
  },
  update: function(data, element, config, queryResponse) {
    if (!this._resourcesLoaded) {
      // If resources are not yet loaded, store the update arguments to use later
      this._pendingUpdate = [data, element, config, queryResponse];
      return;
    }

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
