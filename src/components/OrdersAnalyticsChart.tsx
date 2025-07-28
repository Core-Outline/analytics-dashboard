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
      backgroundColor: 'rgba(128, 128, 128, 0.05)',
      borderWidth: 0,
      padding: 0,
      textStyle: {
        color: 'transparent'
      },
      formatter: function() {
        return '';
      },
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: 'rgba(128, 128, 128, 0.15)',
          width: 60,
          type: 'solid'
        },
        label: {
          show: false
        }
      },
      position: function(point: any, params: any, dom: any, rect: any, size: any) {
        return [point[0] - 30, 0];
      },
      extraCssText: `
        background: rgba(128, 128, 128, 0.05) !important;
        border: none !important;
        box-shadow: none !important;
        height: 100%;
        width: 60px;
        pointer-events: none;
      `
    },
    legend: {
      show: false
    }
  };

  return (
    <div className="relative group">
      <ReactECharts 
        option={option} 
        style={{ height: '280px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
        onEvents={{
          mousemove: (params: any) => {
            if (params.componentType === 'series') {
              const dataIndex = params.dataIndex;
              const label = timeData.labels[dataIndex];
              const currentValue = timeData.currentData[dataIndex];
              const previousValue = timeData.previousData[dataIndex];
              
              // Create or update hover info
              let hoverInfo = document.getElementById('chart-hover-info');
              if (!hoverInfo) {
                hoverInfo = document.createElement('div');
                hoverInfo.id = 'chart-hover-info';
                hoverInfo.className = 'absolute bg-white border border-gray-200 rounded-lg p-3 shadow-lg z-10 pointer-events-none';
                document.body.appendChild(hoverInfo);
              }
              
              hoverInfo.innerHTML = `
                <div class="text-xs text-gray-600 mb-1">${label}</div>
                <div class="text-xs text-gray-500 mb-2">X: ${label} | Y: $${currentValue.toLocaleString()}</div>
                <div class="space-y-1">
                  <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span class="text-sm font-medium">${timeData.currentPeriod}: $${currentValue.toLocaleString()}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-gray-800 rounded-full"></div>
                    <span class="text-sm font-medium">${timeData.previousPeriod}: $${previousValue.toLocaleString()}</span>
                  </div>
                </div>
              `;
              
              // Position the hover info
              const rect = params.event.target.getBoundingClientRect();
              hoverInfo.style.left = `${params.event.pageX + 10}px`;
              hoverInfo.style.top = `${params.event.pageY - 60}px`;
              hoverInfo.style.display = 'block';
            }
          },
          mouseleave: () => {
            const hoverInfo = document.getElementById('chart-hover-info');
            if (hoverInfo) {
              hoverInfo.style.display = 'none';
            }
          }
        }}
      />
    </div>
  );
};

export default TotalSalesChart;