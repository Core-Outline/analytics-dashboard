import React from 'react';
import ReactECharts from 'echarts-for-react';

interface TotalSalesChartProps {
  timeUnit: string;
}

const TotalSalesChart: React.FC<TotalSalesChartProps> = ({ timeUnit }) => {
  // Generate time labels and legend based on selected time unit
  const getTimeData = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    switch (timeUnit.toLowerCase()) {
      case 'yearly':
        return {
          labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
          currentPeriod: `${currentYear}`,
          previousPeriod: `${currentYear - 1}`,
          currentData: [45000, 52000, 48000, 65000, 72000, 68000],
          previousData: [38000, 45000, 42000, 58000, 65000, 61000]
        };
      case 'quarterly':
        return {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          currentPeriod: '2024',
          previousPeriod: '2023',
          currentData: [45000, 52000, 48000, 65000],
          previousData: [38000, 45000, 42000, 58000]
        };
      case 'weekly':
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          currentPeriod: 'This Month',
          previousPeriod: 'Last Month',
          currentData: [12000, 15000, 13000, 18000],
          previousData: [10000, 13000, 11000, 16000]
        };
      case 'daily':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          currentPeriod: 'This Week',
          previousPeriod: 'Last Week',
          currentData: [2800, 3200, 2900, 3500, 3800, 4200, 3600],
          previousData: [2500, 2900, 2600, 3200, 3500, 3900, 3300]
        };
      default: // monthly
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          currentPeriod: '2024',
          previousPeriod: '2023',
          currentData: [20000, 25000, 30000, 40000, 45000, 35000, 50000],
          previousData: [18000, 22000, 27000, 35000, 40000, 32000, 45000]
        };
    }
  };

  const timeData = getTimeData();

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
      data: timeData.labels,
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
      axisLine: {
      }
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
        name: timeData.currentPeriod,
        type: 'line',
        data: timeData.currentData,
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
        name: timeData.previousPeriod,
        type: 'line',
        data: timeData.previousData,
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
        if (params[0].dataIndex === 2) { // Third data point
          return `
            <div style="font-size: 12px; color: #6b7280;">15 Aug 2024</div>
            <div style="font-size: 14px; font-weight: 600; color: #111827;">$${params[0].value.toLocaleString()}</div>
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
      {/* Highlight overlay for third data point */}
      <div className="absolute top-12 left-1/3 w-16 bg-gray-200 bg-opacity-30 h-48 pointer-events-none"></div>
      <div className="absolute top-8 left-1/3 ml-4">
        <div className="text-xs text-gray-600">15 Aug 2024</div>
        <div className="text-sm font-bold text-gray-900">${timeData.currentData[2]?.toLocaleString()}</div>
      </div>
    </div>
  );
};
