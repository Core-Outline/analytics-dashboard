import React from 'react';
import ReactECharts from 'echarts-for-react';

const ProductRevenueSharesCard: React.FC = () => {
  const productData = [
    { name: 'Wireless Headphones', value: 28, color: '#3b82f6' },
    { name: 'Smart Watch', value: 22, color: '#10b981' },
    { name: 'Laptop Stand', value: 18, color: '#f59e0b' },
    { name: 'Bluetooth Speaker', value: 12, color: '#ef4444' },
    { name: 'Phone Case', value: 8, color: '#8b5cf6' },
    { name: 'Tablet Holder', value: 6, color: '#ec4899' },
    { name: 'USB Cable', value: 4, color: '#06b6d4' },
    { name: 'Screen Protector', value: 2, color: '#84cc16' }
  ];

  const chartOption = {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      show: false
    },
    yAxis: {
      type: 'category',
      data: ['Revenue Share'],
      show: false
    },
    series: productData.map((product, index) => ({
      name: product.name,
      type: 'bar',
      stack: 'total',
      data: [product.value],
      itemStyle: {
        color: product.color,
        borderRadius: index === 0 ? [8, 0, 0, 8] : index === productData.length - 1 ? [0, 8, 8, 0] : [0, 0, 0, 0]
      },
      barWidth: '20%'
    })),
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
        let result = '<div style="font-weight: 600; margin-bottom: 4px;">Product Revenue Share</div>';
        params.forEach((param: any) => {
          result += `<div>${param.marker} ${param.seriesName}: ${param.value}%</div>`;
        });
        return result;
      }
    },
    legend: {
      show: true,
      bottom: 0,
      left: 'center',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: {
        color: '#6b7280',
        fontSize: 12,
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      data: productData.map(product => ({
        name: product.name,
        icon: 'circle'
      }))
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Product Revenue Shares</h3>
      </div>
      <ReactECharts 
        option={chartOption} 
        style={{ height: '200px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default ProductRevenueSharesCard;