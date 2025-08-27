import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

const segmentColors: Record<string, string> = {
  'Prime Customer': '#a78bfa',
  'Elite Customer': '#38bdf8',
  'Standard Customer': '#4ade80',
  'Basic Customer': '#9ca3af',
  'Unknown': '#a3a3a3'
};

const ChurnDistributionChart = () => {
  const [segmentData, setSegmentData] = useState<any[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [averageChurnRate, setAverageChurnRate] = useState('0%');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const organization_id = searchParams.get('organization_id');
    if (!organization_id) return;
    fetch(`https://data.coreoutline.com/churn-segment-analysis?company=${organization_id}`)
      .then(res => res.json())
      .then(data => {
        setSegmentData(data);
        const total = data.reduce((sum: number, s: any) => sum + s.Num_Customers, 0);
        setTotalCustomers(total);
        const avgChurn = data.length > 0 ? (data.reduce((sum: number, s: any) => sum + s.Churn_Rate, 0) / data.length) * 100 : 0;
        setAverageChurnRate(avgChurn.toFixed(1) + '%');
      })
      .catch(() => {});
  }, []);

  // Pie chart data for echarts
  const pieData = segmentData.map(s => ({
    value: s.Num_Customers,
    name: s.Segment_Label,
    itemStyle: { color: segmentColors[s.Segment_Label] || '#a3a3a3' }
  }));

  // ECharts pie chart option
  const pieOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} customers ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      top: 0,
      icon: 'circle',
      itemWidth: 18,
      itemHeight: 18,
      textStyle: { fontSize: 14 },
      data: segmentData.map(s => s.Segment_Label)
    },
    series: [
      {
        name: 'Customer Segments',
        type: 'pie',
        radius: ['60%', '80%'], // donut style
        data: pieData,
        label: {
          show: false // hide labels on chart, like the image
        },
        padAngle: 8, // more padding for separation
        itemStyle: {
          borderRadius: 10, // rounded corners
          borderColor: '#fff',
          borderWidth: 4
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        }
      }
    ]
  };

  // For progress bars
  const maxChurnRate = Math.max(...segmentData.map(s => s.Churn_Rate * 100));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Churn Risk by Customer Segment</h2>
        <div className="text-sm text-gray-500">Next 60 days</div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* Progress Bars (echarts) */}
        <div className="flex-1 space-y-4">
          {segmentData.map((item, idx) => {
            // ECharts option for each progress bar
            const barOption = {
              grid: { left: 0, right: 0, top: 0, bottom: 0 },
              xAxis: { show: false, min: 0, max: 100 },
              yAxis: { show: false, type: 'category', data: [item.Segment_Label] },
              series: [
                {
                  type: 'bar',
                  data: [{
                    value: (item.Churn_Rate * 100),
                    itemStyle: {
                      color: segmentColors[item.Segment_Label] || '#a3a3a3',
                      borderRadius: [6, 6, 6, 6]
                    }
                  }],
                  barWidth: 18,
                  label: {
                    show: false
                  }
                }
              ]
            };
            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ background: segmentColors[item.Segment_Label] || '#a3a3a3' }}></div>
                    <span className="font-medium text-gray-900">{item.Segment_Label}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">{item.Num_Customers} customers</span>
                    <span className="font-bold text-gray-900">{(item.Churn_Rate * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="w-full" style={{ height: 18 }}>
                  <ReactECharts option={barOption} style={{ width: '100%', height: 18 }} />
                </div>
              </div>
            );
          })}
        </div>
        {/* Pie Chart (echarts) */}
        <div className="flex flex-col items-center justify-center w-full md:w-1/2">
          <div className="w-full h-64 rounded-2xl bg-gray-50 flex items-center justify-center">
            <ReactECharts option={pieOption} style={{ width: '90%', height: '90%' }} />
          </div>
          <div className="mt-4 text-sm text-gray-600">Total Customers: <span className="font-bold text-gray-900">{totalCustomers}</span></div>
        </div>
      </div>
      {/* Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="py-2 font-medium">Segment</th>
              <th className="py-2 font-medium">Customers</th>
              <th className="py-2 font-medium">Churn Rate</th>
              <th className="py-2 font-medium">CLTV Avg</th>
              <th className="py-2 font-medium">Monthly Revenue</th>
            </tr>
          </thead>
          <tbody>
            {segmentData.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-2 font-medium flex items-center space-x-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: segmentColors[item.Segment_Label] || '#a3a3a3' }}></span>
                  <span>{item.Segment_Label}</span>
                </td>
                <td className="py-2">{item.Num_Customers}</td>
                <td className="py-2 font-bold text-gray-900">{(item.Churn_Rate * 100).toFixed(1)}%</td>
                <td className="py-2">${item.CLTV_Average.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                <td className="py-2">${item.Monthly_Revenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Average churn rate */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Average churn rate across all segments</span>
          <span className="font-bold text-gray-900">{averageChurnRate}</span>
        </div>
      </div>
    </div>
  );
};

export default ChurnDistributionChart;