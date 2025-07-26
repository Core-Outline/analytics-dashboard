import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { MoreHorizontal } from 'lucide-react';

const CustomerSatisfactionCard: React.FC = () => {
  const [visibleSegments, setVisibleSegments] = useState({
    'Positive': true,
    'Negative': true
  });

  // Sample data for customer satisfaction
  const satisfactionData = [
    { name: 'Positive', value: 150, percentage: '23.3%', color: '#3b82f6', trend: 'up' },
    { name: 'Negative', value: 20, percentage: '5.23%', color: '#93c5fd', trend: 'down' }
  ];

  const toggleSegment = (segmentName: string) => {
    setVisibleSegments(prev => ({
      ...prev,
      [segmentName]: !prev[segmentName]
    }));
  };

  // Filter data based on visibility
  const visibleData = satisfactionData.filter(item => visibleSegments[item.name]);

  const chartOption = {
    series: [
      {
        type: 'pie',
        radius: ['0%', '80%'],
        center: ['50%', '50%'],
        data: visibleData.map(item => ({
          value: item.value,
          name: item.name,
          itemStyle: { 
            color: item.color,
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          }
        })),
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        emphasis: {
          scale: true,
          scaleSize: 5
        }
      }
    ],
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
      show: false
    }
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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6">
        {satisfactionData.map((item) => (
          <div key={item.name} className="text-center">
            <div className="text-sm text-gray-600 mb-1">{item.name}</div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl font-bold text-gray-900">{item.value}</span>
              <span className={`text-sm font-medium ${
                item.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.trend === 'up' ? '↗' : '↘'} {item.percentage}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerSatisfactionCard;