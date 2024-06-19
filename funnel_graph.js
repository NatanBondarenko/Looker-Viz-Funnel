looker.plugins.visualizations.add({
  id: "vue_funnel_graph",
  label: "Vue Funnel Graph",
  options: {
    colors: {
      type: "array",
      label: "Colors",
      section: "Style",
      placeholder: "#FF6384, #36A2EB, #FFCE56"
    }
  },
  create: function(element, config) {
    element.innerHTML = `
      <div id="app">
        <funnel-graph :data="data" :colors="colors" :labels="labels"></funnel-graph>
      </div>
    `;

    var vueApp = new Vue({
      el: '#app',
      data: {
        data: [],
        colors: [],
        labels: []
      }
    });

    this.vueApp = vueApp;
  },
  updateAsync: function(data, element, config, queryResponse, details, done) {
    if (!queryResponse.fields.dimensions || !queryResponse.fields.dimensions.length) {
      this.addError({title: "No Dimensions", message: "This chart requires dimensions."});
      return;
    }

    const dimensions = queryResponse.fields.dimensions.map(d => d.name);
    const labels = data.map(row => row[dimensions[0]] ? row[dimensions[0]].value : 'Unknown');
    const values = data.map(row => row[dimensions[1]] ? row[dimensions[1]].value : 0);

    this.vueApp.data = [{
      label: 'Funnel',
      values: values
    }];
    this.vueApp.colors = config.colors || ["#FF6384", "#36A2EB", "#FFCE56"];
    this.vueApp.labels = labels;

    done();
  }
});
