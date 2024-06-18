// Add this line to include Looker's visualization API
looker.plugins.visualizations.add({
  id: "funnel_graph",
  label: "Funnel Graph",
  options: {},
  create: function(element, config) {
    element.innerHTML = `
      <div class="funnel"></div>
      <div class="method-buttons">
        <button id="makeVertical">Make Vertical</button>
        <button id="makeHorizontal">Make Horizontal</button>
        <button id="toggleDirection">Toggle Direction</button>
        <button id="gradientMakeVertical">Gradient Make Vertical</button>
        <button id="gradientMakeHorizontal">Gradient Make Horizontal</button>
        <button id="gradientToggleDirection">Gradient Toggle Direction</button>
        <button id="useData1">Use DataSet 1</button>
        <button id="useData2">Use DataSet 2</button>
        <button id="useData3">Use DataSet 3</button>
      </div>
    `;

    // Add the external CSS files
    const link1 = document.createElement('link');
    link1.rel = 'stylesheet';
    link1.type = 'text/css';
    link1.href = 'https://rawcdn.githack.com/greghub/funnel-graph-js/d8537ef1f26850d8db157fe972af3c04f3a3c9d1/dist/css/main.css';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.rel = 'stylesheet';
    link2.type = 'text/css';
    link2.href = 'https://rawcdn.githack.com/greghub/funnel-graph-js/d8537ef1f26850d8db157fe972af3c04f3a3c9d1/dist/css/theme.min.css';
    document.head.appendChild(link2);

    // Add the external JS file
    const script = document.createElement('script');
    script.src = 'https://rawcdn.githack.com/greghub/funnel-graph-js/d8537ef1f26850d8db157fe972af3c04f3a3c9d1/dist/js/funnel-graph.js';
    script.onload = () => this.updateViz();
    document.body.appendChild(script);
  },

  update: function(data, element, config, queryResponse) {
    this.updateViz();
  },

  updateViz: function() {
    if (typeof FunnelGraph === "undefined") return;

    var dataExample1 = {
      colors: ['#FFB178', '#FF3C8E'],
      values: [11000, 3000, 240]
    };

    var dataExample2 = {
      labels: ['Impressions 2', 'Add To Cart 2', 'Buy 2'],
      colors: ['#FFB178', '#FF3C8E'],
      values: [12000, 5700, 360]
    };

    var dataExample3 = {
      labels: ['Impressions', 'Add To Cart', 'Buy'],
      subLabels: ['Direct', 'Social Media', 'Ads'],
      colors: [
        ['#FFB178', '#FF78B1', '#FF3C8E'],
        ['#A0BBFF', '#EC77FF'],
        ['#A0F9FF', '#7795FF']
      ],
      values: [
        [3500, 2500, 6500],
        [3300, 1400, 1000],
        [600, 200, 130]
      ],
    };

    var graph = new FunnelGraph({
      container: '.funnel',
      gradientDirection: 'horizontal',
      data: dataExample3,
      displayPercent: true,
      direction: 'horizontal',
      width: 800,
      height: 300,
      subLabelValue: 'raw'
    });

    graph.draw();

    // direction methods
    document.querySelector('#makeVertical').addEventListener('click', function () {
      graph.setWidth(300);
      graph.setHeight(400);
      graph.makeVertical();
    });

    document.querySelector('#makeHorizontal').addEventListener('click', function () {
      graph.setWidth(800);
      graph.setHeight(300);
      graph.makeHorizontal();
    });

    document.querySelector('#toggleDirection').addEventListener('click', function () {
      graph.direction === 'horizontal' ? document.querySelector('#makeVertical').click() :
        document.querySelector('#makeHorizontal').click();
    });

    // gradient methods
    document.querySelector('#gradientMakeVertical').addEventListener('click', function () {
      graph.gradientMakeVertical();
    });

    document.querySelector('#gradientMakeHorizontal').addEventListener('click', function () {
      graph.gradientMakeHorizontal();
    });

    document.querySelector('#gradientToggleDirection').addEventListener('click', function () {
      graph.gradientToggleDirection();
    });

    document.querySelector('#useData1').addEventListener('click', function () {
      graph.updateData(dataExample1);
    });

    document.querySelector('#useData2').addEventListener('click', function () {
      graph.updateData(dataExample2);
    });

    document.querySelector('#useData3').addEventListener('click', function () {
      graph.updateData(dataExample3);
    });
  }
});
