import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';

const TabbedMetricsCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Users');

  const tabs = ['Users', 'Sessions', 'Click Through Rate', 'Bounce Rate', 'Session Duration'];

  // Sample data for each metric
  const metricsData = {
    'Users': {
      data: [1200, 1350, 1180, 1420, 1650, 1580, 1720, 1890, 1750, 1920, 2100, 2050],
      color: '#3b82f6',
      gradientColor: 'rgba(59, 130, 246, 0.3)',
      value: '2.05k',
      change: '+12.5%'
    },
    'Sessions': {
      data: [2800, 3100, 2950, 3200, 3450, 3300, 3600, 3850, 3700, 3950, 4200, 4100],
      color: '#10b981',
      gradientColor: 'rgba(16, 185, 129, 0.3)',
      value: '4.1k',
      change: '+8.7%'
    },
    'Click Through Rate': {
      data: [2.1, 2.3, 2.0, 2.5, 2.8, 2.6, 2.9, 3.1, 2.8, 3.2, 3.5, 3.3],
      color: '#f59e0b',
      gradientColor: 'rgba(245, 158, 11, 0.3)',
      value: '3.3%',
      change: '+0.8%'
    },
    'Bounce Rate': {
      data: [45, 42, 48, 40, 38, 41, 35, 33, 36, 31, 28, 30],
      color: '#ef4444',
      gradientColor: 'rgba(239, 68, 68, 0.3)',
      value: '30%',
      change: '-5.2%'
    },
    'Session Duration': {
      data: [180, 195, 175, 210, 225, 205, 240, 255, 235, 270, 285, 275],
      color: '#8b5cf6',
      gradientColor: 'rgba(139, 92, 246, 0.3)',
      value: '4:35',
      change: '+15.3%'
    }
  };

  const currentMetric = metricsData[activeTab];

  const chartOption = {
    grid: {
      left: '0%',
      right: '0%',
      bottom: '0%',
      top: '0%',
      containLabel: false
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      show: false
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [
      {
        type: 'line',
        data: currentMetric.data,
        smooth: true,
        lineStyle: {
          color: currentMetric.color,
          width: 2
        },
        symbol: 'none',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: currentMetric.gradientColor
              },
              {
                offset: 1,
                color: 'rgba(255, 255, 255, 0)'
              }
            ]
          }
        }
      }
    ],
    tooltip: {
      show: false
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Tabs */}
      <div className="flex space-x-6 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-1 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Metric Value and Change */}
      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900 mb-1">{currentMetric.value}</div>
        <div className={`text-sm font-medium ${
          currentMetric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
        }`}>
          {currentMetric.change} vs last month
        </div>
      </div>

      {/* Chart */}
      <div className="h-32">
        <ReactECharts 
          option={chartOption} 
          style={{ height: '128px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </div>
  );
};

export default TabbedMetricsCard;