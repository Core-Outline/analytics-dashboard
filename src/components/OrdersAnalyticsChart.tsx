import React from 'react';
import ReactECharts from 'echarts-for-react';

const OrdersAnalyticsChart: React.FC = () => {
  const option = {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
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
      min: 0,
      max: 100,
      interval: 20,
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
        name: 'Online orders',
        type: 'line',
        data: [20, 25, 30, 40, 45, 35, 50],
        smooth: true,
        lineStyle: {
          color: '#f59e0b',
          width: 2
        },
        symbol: 'none',
        areaStyle: {
          opacity: 0
        }
      },
      {
        name: 'Offline orders',
        type: 'line',
        data: [10, 15, 20, 30, 25, 20, 35],
        smooth: true,
        lineStyle: {
          color: '#1f2937',
          width: 2
        },
        symbol: 'none',
        areaStyle: {
          opacity: 0
        }
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
        if (params[0].dataIndex === 2) { // March
          return `
            <div style="font-size: 12px; color: #6b7280;">15 Aug 2022</div>
            <div style="font-size: 14px; font-weight: 600; color: #111827;">$59,492.10</div>
          `;
        }
        return params.map((param: any) => 
          `<div>${param.marker} ${param.seriesName}: ${param.value}</div>`
        ).join('');
      }
    },
    legend: {
      show: false
    }
  };

  return (
    <div className="relative">
      <ReactECharts 
        option={option} 
        style={{ height: '280px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
      {/* Highlight overlay for March */}
      <div className="absolute top-12 left-1/3 w-16 bg-gray-200 bg-opacity-30 h-48 pointer-events-none"></div>
      <div className="absolute top-8 left-1/3 ml-4">
        <div className="text-xs text-gray-600">15 Aug 2022</div>
        <div className="text-sm font-bold text-gray-900">$59,492.10</div>
      </div>
    </div>
  );
};

export default OrdersAnalyticsChart;