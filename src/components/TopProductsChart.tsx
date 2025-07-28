import React, { useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { TopProductSold } from '../helpers/financials';

interface TopProductsChartProps {
  data: TopProductSold[];
  loading: boolean;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

const TopProductsChart: React.FC<TopProductsChartProps> = ({ data, loading }) => {
  // Extract unique products and dates
  const productIds = useMemo(() => Array.from(new Set(data.map(d => d.product_id))), [data]);
  const dateLabels = useMemo(() => Array.from(new Set(data.map(d => d.date))).sort(), [data]);

  // Build product name map (for now, just Product X)
  const productNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    productIds.forEach((id) => { map[id] = `Product ${id}`; });
    return map;
  }, [productIds]);

  // Only use data from the last three months
  const lastThreeDates = useMemo(() => {
    if (dateLabels.length <= 3) return dateLabels;
    return dateLabels.slice(-3);
  }, [dateLabels]);

  // Build chart data: for each product, get amount for every date (0 if missing)
  const productData = useMemo(() => {
    const obj: Record<string, { data: number[], color: string }> = {};
    productIds.forEach((id, i) => {
      obj[productNameMap[id]] = {
        data: lastThreeDates.map(date => {
          const found = data.find(d => d.product_id === id && d.date === date);
          return found ? found.amount : 0;
        }),
        color: COLORS[i % COLORS.length]
      };
    });
    return obj;
  }, [data, productIds, lastThreeDates, productNameMap]);

  const [visibleProducts, setVisibleProducts] = useState<Record<string, boolean>>(() => {
    const obj: Record<string, boolean> = {};
    Object.keys(productData).forEach(name => { obj[name] = true; });
    return obj;
  });

  const toggleProduct = (productName: string) => {
    setVisibleProducts(prev => ({ ...prev, [productName]: !prev[productName] }));
  };

  const series = Object.entries(productData)
    .filter(([name]) => visibleProducts[name])
    .map(([name, config]) => ({
      name,
      type: 'bar',
      data: config.data,
      itemStyle: {
        color: config.color,
        borderRadius: [12, 12, 12, 12]
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
      data: lastThreeDates.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#9ca3af', fontSize: 12, fontFamily: 'Inter, system-ui, sans-serif' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#9ca3af', fontSize: 12, fontFamily: 'Inter, system-ui, sans-serif' }
    },
    series,
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151', fontSize: 12 },
      formatter: function(params: any) {
        let result = `<div style="font-weight: 600; margin-bottom: 4px;">${params[0].axisValue}</div>`;
        params.forEach((param: any) => {
          result += `<div>${param.marker} ${param.seriesName}: ${param.value} units</div>`;
        });
        return result;
      }
    },
    legend: {
      show: true,
      bottom: 0,
      left: 'center',
      itemWidth: 14,
      itemHeight: 14,
      textStyle: {
        color: '#6b7280',
        fontSize: 12,
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      data: Object.keys(productData).map(name => ({ name, icon: 'circle' }))
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
      {loading ? (
        <div className="h-[300px] w-full flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
        </div>
      ) : (
        <ReactECharts 
          option={option} 
          style={{ height: '300px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      )}
    </div>
  );
};

export default TopProductsChart;