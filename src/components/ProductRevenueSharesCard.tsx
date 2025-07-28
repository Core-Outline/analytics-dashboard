import React from 'react';
import ReactECharts from 'echarts-for-react';
import { ProductRevenueSharesData } from '../helpers/financials';

interface ProductRevenueSharesCardProps {
  data: ProductRevenueSharesData | null;
  loading: boolean;
}

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f472b6', '#facc15'
];

const ProductRevenueSharesCard: React.FC<ProductRevenueSharesCardProps> = ({ data, loading }) => {
  let productData: { name: string; value: number; color: string }[] = [];
  if (data && data.product_id && data.pct_amount) {
    productData = data.product_id.map((id, i) => ({
      name: `${id}`,
      value: Number(data.pct_amount[i]),
      color: COLORS[i % COLORS.length]
    }));
  }

  const chartOption = {
    grid: {
      left: '0%',
      right: '0%',
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
      {loading ? (
        <div className="h-[200px] w-full flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
        </div>
      ) : (
        <ReactECharts 
          option={chartOption} 
          style={{ height: '200px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      )}
    </div>
  );
};

export default ProductRevenueSharesCard;