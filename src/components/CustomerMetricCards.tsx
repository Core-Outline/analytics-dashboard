import React from 'react';
import ReactECharts from 'echarts-for-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const CustomerMetricCards: React.FC = () => {
  const metrics = [
    {
      title: 'Customer Growth Rate',
      value: '12.5%',
      target: '15%',
      growth: '+2.3%',
      isPositive: true,
      data: [8.2, 9.1, 10.5, 11.2, 10.8, 11.9, 12.5, 13.1, 12.8, 12.5],
      color: '#3b82f6'
    },
    {
      title: 'Churn Rate',
      value: '3.2%',
      target: '2.5%',
      growth: '-0.8%',
      isPositive: true,
      data: [4.5, 4.2, 3.8, 3.5, 3.9, 3.6, 3.4, 3.2, 3.1, 3.2],
      color: '#ef4444'
    },
    {
      title: 'Average Time to Payback CAC',
      value: '8.3 months',
      target: '6 months',
      growth: '-1.2 months',
      isPositive: true,
      data: [12.5, 11.8, 10.9, 10.2, 9.8, 9.1, 8.7, 8.5, 8.1, 8.3],
      color: '#10b981'
    },
    {
      title: 'LTV:CAC Ratio',
      value: '4.2:1',
      target: '5:1',
      growth: '+0.3',
      isPositive: true,
      data: [3.2, 3.4, 3.6, 3.8, 3.9, 4.0, 4.1, 4.2, 4.1, 4.2],
      color: '#f59e0b'
    },
    {
      title: 'Active Customers',
      value: '12,847',
      target: '15,000',
      growth: '+847',
      isPositive: true,
      data: [10200, 10800, 11200, 11600, 11900, 12100, 12300, 12500, 12700, 12847],
      color: '#8b5cf6'
    }
  ];

  const createChartOption = (data: number[], color: string) => ({
    grid: {
      left: '0%',
      right: '0%',
      bottom: '0%',
      top: '0%',
      containLabel: false
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: data.length }, (_, i) => i),
      show: false
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [
      {
        type: 'line',
        data: data,
        smooth: true,
        lineStyle: {
          color: color,
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
                color: color + '40'
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
  });

  return (
    <div className="grid grid-cols-5 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">{metric.title}</h3>
            <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
            
            {/* Target and Growth */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Target: {metric.target}</span>
              <div className="flex items-center space-x-1">
                {metric.isPositive ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span className={`font-medium ${
                  metric.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.growth}
                </span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-16">
            <ReactECharts 
              option={createChartOption(metric.data, metric.color)} 
              style={{ height: '64px', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerMetricCards;