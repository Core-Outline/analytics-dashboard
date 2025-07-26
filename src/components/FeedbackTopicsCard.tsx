import React from 'react';
import ReactECharts from 'echarts-for-react';
import { MoreHorizontal, ChevronRight } from 'lucide-react';

const FeedbackTopicsCard: React.FC = () => {
  // Sample topics data
  const topics = [
    { name: 'User Experience', count: 14, color: '#3b82f6' },
    { name: 'Suggestions', count: 16, color: '#10b981' },
    { name: 'Pricing', count: 53, color: '#06b6d4' },
    { name: 'Technical Issues', count: 25, color: '#8b5cf6' }
  ];

  // Sample weekly data for the bar chart
  const weeklyData = [
    { day: 'Mon', value: 85 },
    { day: 'Tue', value: 95 },
    { day: 'Wed', value: 92 },
    { day: 'Thu', value: 110 },
    { day: 'Fri', value: 75 },
    { day: 'Sat', value: 68 },
    { day: 'Sun', value: 62 }
  ];

  const chartOption = {
    grid: {
      left: '8%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: weeklyData.map(item => item.day),
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#9ca3af',
        fontSize: 12,
        fontFamily: 'Inter, system-ui, sans-serif'
      }
    },
    yAxis: {
      type: 'value',
      max: 120,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#9ca3af',
        fontSize: 12,
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      splitLine: {
        lineStyle: {
          color: '#f1f5f9',
          width: 1
        }
      }
    },
    series: [
      {
        type: 'bar',
        data: weeklyData.map(item => item.value),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#60a5fa'
              },
              {
                offset: 1,
                color: '#3b82f6'
              }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: '40%'
      }
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151',
        fontSize: 12
      },
      formatter: function(params: any) {
        return `
          <div style="font-weight: 600; margin-bottom: 4px;">${params[0].axisValue}</div>
          <div>${params[0].value} feedback items</div>
        `;
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Topics</h3>
        <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
      </div>

      {/* Topics List */}
      <div className="space-y-4 mb-8">
        {topics.map((topic, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: topic.color }}
              ></div>
              <span className="text-sm text-gray-700">{topic.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">{topic.count}</span>
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: topic.color }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Chart */}
      <div className="mb-6">
        <ReactECharts 
          option={chartOption} 
          style={{ height: '200px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>

      {/* View All Link */}
      <div className="flex justify-end">
        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
          <span>View all</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FeedbackTopicsCard;