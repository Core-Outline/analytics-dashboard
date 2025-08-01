// This is a sample response for the /sample-chart-code API endpoint.
// It returns a string of code that renders a ReactECharts chart.

module.exports = {
  code: `(
    <ReactECharts
      option={{
        title: { text: 'Dummy Sales Trend' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
        yAxis: { type: 'value' },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110],
            type: 'line',
            smooth: true,
            areaStyle: {},
          },
        ],
      }}
      style={{ height: 320 }}
    />
  )`
};
