import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { TopProductSold } from '../helpers/financials';

interface GrossRevenueCardProps {
  data: TopProductSold[];
  loading: boolean;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

const GrossRevenueCard: React.FC<GrossRevenueCardProps> = ({ data, loading }) => {
  // Extract unique products and dates
  const productIds = useMemo(() => Array.from(new Set(data.map(d => d.product_id))), [data]);
  const dateLabels = useMemo(() => Array.from(new Set(data.map(d => d.date))).sort(), [data]);
  // Build product name map (for now, just Product X)
  const productNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    productIds.forEach((id) => { map[id] = `Product ${id}`; });
    return map;
  }, [productIds]);

  // Build chart data: for each product, get amount for every date (0 if missing)
  const productData = useMemo(() => {
    const obj: Record<string, { data: number[], color: string }> = {};
    productIds.forEach((id, i) => {
      obj[productNameMap[id]] = {
        data: dateLabels.map(date => {
          const found = data.find(d => d.product_id === id && d.date === date);
          // Use 0 if no data for this product/date (to show trend)
          return found ? found.amount : 0;
        }),
        color: COLORS[i % COLORS.length]
      };
    });
    return obj;
  }, [data, productIds, dateLabels, productNameMap]);

  // Table rows: latest date first, sorted by amount desc
  const latestDate = dateLabels[dateLabels.length - 1];
  const tableRows = useMemo(() => {
    return data.filter(d => d.date === latestDate)
      .sort((a, b) => b.amount - a.amount)
      .map(d => ({
        date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        product: productNameMap[d.product_id],
        revenue: `$${d.amount.toLocaleString()}`,
        growth: (d.percentage_growth >= 0 ? '+' : '') + (d.percentage_growth * 100).toFixed(1) + '%',
        growthClass: d.percentage_growth >= 0 ? 'text-green-600' : 'text-red-600'
      }));
  }, [data, latestDate, productNameMap]);

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
      type: 'line',
      data: config.data,
      smooth: false,
      lineStyle: { color: config.color, width: 2 },
      symbol: 'circle',
      symbolSize: 4,
      itemStyle: { color: config.color }
    }));
  const option = {
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: dateLabels.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#9ca3af', fontSize: 12, fontFamily: 'Inter, system-ui, sans-serif' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#9ca3af', fontSize: 12, fontFamily: 'Inter, system-ui, sans-serif',
        formatter: function(value: number) { return '$' + (value / 1000).toFixed(0) + 'k'; }
      },
      splitLine: { lineStyle: { color: '#f1f5f9', width: 1 } }
    },
    series,
    tooltip: {
      trigger: 'axis', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: '#e5e7eb', borderWidth: 1,
      textStyle: { color: '#374151', fontSize: 12 },
      formatter: function(params: any) {
        let result = `<div style="font-weight: 600; margin-bottom: 4px;">${params[0].axisValue}</div>`;
        params.forEach((param: any) => {
          result += `<div>${param.marker} ${param.seriesName}: $${param.value?.toLocaleString()}</div>`;
        });
        return result;
      }
    },
    legend: { show: false }
  };

  return (
    <div className="space-y-6">
      {/* Table */}
      <div className="overflow-hidden">
        {loading ? (
          <div className="h-32 w-full flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
          </div>
        ) : (
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
              {tableRows.map((row, index) => (
                <tr key={index}>
                  <td className="text-xs text-gray-900 py-2">{row.date}</td>
                  <td className="text-xs text-gray-900 py-2">{row.product}</td>
                  <td className="text-xs text-gray-900 py-2 font-medium">{row.revenue}</td>
                  <td className={`text-xs py-2 font-medium ${row.growthClass}`}>{row.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
      {loading ? (
        <div className="h-[250px] w-full flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
        </div>
      ) : (
        <ReactECharts 
          option={option} 
          style={{ height: '250px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      )}
    </div>
  );
};

export default GrossRevenueCard;