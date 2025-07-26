import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { ChevronDown, MoreHorizontal } from 'lucide-react';

const UserSentimentsCard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [visibleSentiments, setVisibleSentiments] = useState({
    'Positive': true,
    'Negative': true,
    'Neutral': true,
    'Mixed': true
  });

  const months = ['January', 'February', 'March', 'April', 'May', 'June'];

  // Sample data for different sentiments
  const sentimentData = {
    'Positive': {
      color: '#3b82f6',
      lightColor: '#93c5fd',
      count: 125,
      percentage: '5.3%',
      trend: 'up',
      data: [45, 58, 62, 35, 45, 55, 65, 75, 55, 65, 72, 45, 55]
    },
    'Negative': {
      color: '#8b5cf6',
      lightColor: '#c4b5fd',
      count: 100,
      percentage: '3.20%',
      trend: 'up',
      data: [38, 42, 35, 41, 28, 45, 42, 38, 32, 44, 41, 32, 35]
    },
    'Neutral': {
      color: '#06b6d4',
      lightColor: '#67e8f9',
      count: 53,
      percentage: '2.3%',
      trend: 'down',
      data: [25, 32, 28, 35, 22, 38, 32, 28, 25, 35, 32, 25, 28]
    },
    'Mixed': {
      color: '#10b981',
      lightColor: '#6ee7b7',
      count: 136,
      percentage: '3.12%',
      trend: 'up',
      data: [42, 48, 45, 52, 38, 55, 48, 45, 42, 52, 48, 42, 45]
    }
  };

  const dates = ['Mar 01', 'Mar 02', 'Mar 03', 'Mar 04', 'Mar 05', 'Mar 06'];

  const toggleSentiment = (sentimentName: string) => {
    setVisibleSentiments(prev => ({
      ...prev,
      [sentimentName]: !prev[sentimentName]
    }));
  };

  // Create series data for the chart
  const series = Object.entries(sentimentData)
    .filter(([name]) => visibleSentiments[name])
    .map(([name, config]) => ({
      name,
      type: 'bar',
      data: config.data.slice(0, 6), // Show only 6 data points for the dates
      itemStyle: {
        color: config.color,
        borderRadius: [4, 4, 0, 0]
      },
      barWidth: '15%',
      barGap: '10%'
    }));

  const chartOption = {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates,
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
      max: 80,
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
    series: series,
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
        let result = `<div style="font-weight: 600; margin-bottom: 4px;">${params[0].axisValue}</div>`;
        params.forEach((param: any) => {
          result += `<div>${param.marker} ${param.seriesName}: ${param.value}</div>`;
        });
        return result;
      }
    },
    legend: {
      show: false
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">User Sentiments</h3>
        <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
      </div>

      {/* Interactive Legend */}
      <div className="flex items-center space-x-6 mb-6">
        {Object.entries(sentimentData).map(([name, config]) => (
          <button
            key={name}
            onClick={() => toggleSentiment(name)}
            className={`flex items-center space-x-2 transition-opacity duration-200 ${
              visibleSentiments[name] ? 'opacity-100' : 'opacity-50'
            }`}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: config.color }}
            ></div>
            <span className="text-sm text-gray-600">{name}</span>
          </button>
        ))}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {Object.entries(sentimentData).map(([name, config]) => (
          <div key={name} className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <span className="text-2xl font-bold text-gray-900">{config.count}</span>
              <span className={`text-sm font-medium ${
                config.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {config.trend === 'up' ? '↗' : '↘'} {config.percentage}
              </span>
            </div>
            <div className="text-sm text-gray-600">{name}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mb-6">
        <ReactECharts 
          option={chartOption} 
          style={{ height: '300px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-2 cursor-pointer">
          <span>{selectedMonth}</span>
          <ChevronDown className="w-4 h-4" />
        </div>
        <div className="text-sm text-blue-600 cursor-pointer hover:text-blue-700">
          View all reports →
        </div>
      </div>
    </div>
  );
};

export default UserSentimentsCard;