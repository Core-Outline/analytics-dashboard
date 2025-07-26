import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';

const GrossRevenueCard: React.FC = () => {
  const [visibleProducts, setVisibleProducts] = useState({
    'Wireless Headphones': true,
    'Smart Watch': true,
    'Laptop Stand': true
  });

  // Table data
  const tableData = [
    { date: 'Jan 2024', product: 'Wireless Headphones', revenue: '$12,450', growth: '+8.2%' },
    { date: 'Jan 2024', product: 'Smart Watch', revenue: '$18,320', growth: '+12.5%' },
    { date: 'Feb 2024', product: 'Laptop Stand', revenue: '$9,180', growth: '+5.4%' },
    { date: 'Feb 2024', product: 'Wireless Headphones', revenue: '$14,200', growth: '+14.1%' },
    { date: 'Mar 2024', product: 'Smart Watch', revenue: '$21,500', growth: '+17.3%' }
  ];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  const productData = {
    'Wireless Headphones': {
      data: [12450, 14200, 13800, 15600, 16200, 18400],
      color: '#3b82f6'
    },
    'Smart Watch': {
      data: [18320, 19800, 21500, 23200, 24800, 26500],
      color: '#ef4444'
    },
    'Laptop Stand': {
      data: [9180, 10200, 11400, 12100, 13500, 14200],
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
      type: 'line',
      data: config.data,
      smooth: true,
      lineStyle: {
        color: config.color,
        width: 2
      },
      symbol: 'circle',
      symbolSize: 4,
      itemStyle: {
        color: config.color
      }
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
        fontFamily: 'Inter, system-ui, sans-serif',
        formatter: function(value: number) {
          return '$' + (value / 1000).toFixed(0) + 'k';
        }
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
          result += `<div>${param.marker} ${param.seriesName}: $${param.value.toLocaleString()}</div>`;
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
      {/* Table */}
      <div className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-600 pb-3">Date</th>
              <th className="text-left text-xs font-medium text-gray-600 pb-3">Product</th>
              <th className="text-left text-xs font-medium text-gray-600 pb-3">Revenue</th>
              <th className="text-left text-xs font-medium text-gray-600 pb-3">Growth</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td className="text-xs text-gray-900 py-2">{row.date}</td>
                <td className="text-xs text-gray-900 py-2">{row.product}</td>
                <td className="text-xs text-gray-900 py-2 font-medium">{row.revenue}</td>
                <td className="text-xs text-green-600 py-2 font-medium">{row.growth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interactive Legend */}
      <div className="flex flex-wrap gap-3">
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
        style={{ height: '250px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default GrossRevenueCard;