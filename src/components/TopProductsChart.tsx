import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';

const TopProductsChart: React.FC = () => {
  const [visibleProducts, setVisibleProducts] = useState({
    'Wireless Headphones': true,
    'Smart Watch': true,
    'Laptop Stand': true
  });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  const productData = {
    'Wireless Headphones': {
      data: [120, 132, 101, 134, 90, 230],
      color: '#3b82f6'
    },
    'Smart Watch': {
      data: [220, 182, 191, 234, 290, 330],
      color: '#ef4444'
    },
    'Laptop Stand': {
      data: [150, 232, 201, 154, 190, 330],
      color: '#10b981'
    }
  };

  const toggleProduct = (productName: string) => {
    setVisibleProducts(prev => ({
      ...prev,
      [productName]: !prev[productName]
    }));
  };

  const series = Object.entries(productData)
    .filter(([name]) => visibleProducts[name])
    .map(([name, config]) => ({
      name,
      type: 'bar',
      data: config.data,
      itemStyle: {
        color: config.color,
        borderRadius: [12, 12, 0, 0]
      },
      barWidth: '15%'
    }));

  const option = {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: months,
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
          result += `<div>${param.marker} ${param.seriesName}: ${param.value} units</div>`;
        });
        return result;
      }
    },
    legend: {
      show: false
    }
  };

  return (
    <div className="space-y-6">
      {/* Interactive Legend */}
      <div className="flex flex-wrap gap-4">
        {Object.entries(productData).map(([name, config]) => (
          <button
            key={name}
            onClick={() => toggleProduct(name)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
              visibleProducts[name] 
                ? 'bg-gray-100 shadow-sm' 
                : 'bg-gray-50 opacity-50'
            }`}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: config.color }}
            ></div>
            <span className={`text-xs font-medium ${
              visibleProducts[name] ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {name}
            </span>
          </button>
        ))}
      </div>

      {/* Chart */}
      <ReactECharts 
        option={option} 
        style={{ height: '300px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default TopProductsChart;