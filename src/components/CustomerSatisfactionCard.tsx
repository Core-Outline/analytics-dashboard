import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { MoreHorizontal } from 'lucide-react';

const CustomerSatisfactionCard: React.FC = () => {
  const [satisfactionData, setSatisfactionData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleSegments, setVisibleSegments] = useState<Record<string, boolean>>({});

  // Fetch data from API
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/get-feedback-sentiments-splits?company_id=301')
      .then(res => res.json())
      .then(data => {
        setSatisfactionData(data);
        // Set all segments visible by default
        const segs: Record<string, boolean> = {};
        data.forEach((item: any) => {
          segs[item.sentiment] = true;
        });
        setVisibleSegments(segs);
      })
      .finally(() => setLoading(false));
  }, []);

  // Custom palette for chart and legend
  const palette = ["#03045e","#0077b6","#00b4d8","#90e0ef","#caf0f8"];
  // Assign palette colors in order to sentiments (for legend dots)
  const sentimentColors: Record<string, string> = {};
  satisfactionData.forEach((item, idx) => {
    sentimentColors[item.sentiment] = palette[idx % palette.length];
  });

  // Prepare chart data and legend (no per-slice color)
  const chartData = satisfactionData
    .filter(item => visibleSegments[item.sentiment])
    .map(item => ({
      value: item.proportion,
      name: item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)
    }));

  const toggleSegment = (segment: string) => {
    setVisibleSegments(prev => ({ ...prev, [segment]: !prev[segment] }));
  };

  const chartOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151',
        fontSize: 12
      },
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      show: true,
      orient: 'vertical',
      right: '5%',
      top: '10%',
      data: satisfactionData.map(item => item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)),
      textStyle: { color: '#6b7280', fontSize: 13 },
      icon: 'circle',
      itemWidth: 16,
      itemHeight: 16,
      // Ensure legend color matches chart
      formatter: function(name: string) {
        const idx = satisfactionData.findIndex(item => item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1) === name);
        const color = palette[idx % palette.length];
        // return '●'name;
        return name;
      },
      textStyleRich: {
        colorDot: {
          fontSize: 18,
          fontFamily: 'monospace',
        }
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['0%', '80%'], // solid pie, no center
        color: palette, // enforce palette for slices
        data: chartData,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        emphasis: {
          scale: true,
          scaleSize: 5,
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            color: '#374151',
            formatter: '{b}\n{d}%'
          }
        }
      }
    ]
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Customer Satisfaction</h3>
        <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
      </div>

      {/* Pie Chart */}
      <div className="mb-6">
        <ReactECharts 
          option={chartOption} 
          style={{ height: '200px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>

      {/* Interactive Legend */}
      <div className="flex items-center justify-center space-x-6 mb-6">
        {satisfactionData.map((item) => (
          <button
            key={item.name}
            onClick={() => toggleSegment(item.name)}
            className={`flex items-center space-x-2 transition-opacity duration-200 ${
              visibleSegments[item.name] ? 'opacity-100' : 'opacity-50'
            }`}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm text-gray-600">{item.name}</span>
          </button>
        ))}
      </div>

      {/* Stats Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white rounded-lg shadow border border-gray-100">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"> </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sentiment</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Count</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Proportion</th>
            </tr>
          </thead>
          <tbody>
            {satisfactionData.map((item, idx) => (
              <tr key={item.sentiment} className="border-t border-gray-100 hover:bg-gray-50 transition">
                <td className="px-4 py-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: palette[idx % palette.length] }}></span>
                </td>
                <td className="px-4 py-2 font-medium text-gray-700">
                  {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                </td>
                <td className="px-4 py-2 text-right text-gray-900 font-semibold">
                  {item.count}
                </td>
                <td className="px-4 py-2 text-right text-gray-600">
                  {item.proportion}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerSatisfactionCard;