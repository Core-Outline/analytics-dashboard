import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useLocation} from 'react-router-dom';
const COLORS = [
  '#03045e', '#023e8a', '#0077b6', '#0096c7', '#00b4d8', '#48cae4', '#90e0ef', '#ade8f4', '#caf0f8'
];

interface ProductRevenueSharesData {
  product_id: string[];
  amount: number[];
  pct_amount: number[];
}

const ProductRevenueSharesCard: React.FC = () => {
  const [data, setData] = useState<ProductRevenueSharesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const organization_id = searchParams.get('organization_id');

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`https://data.coreoutline.com/product-revenue-shares?company=${organization_id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  // Only visualize the first 5 products
  let productData: { name: string; value: number; color: string }[] = [];
  let tableRows: { product_id: string; amount: number; pct_amount: number }[] = [];
  if (data && data.product_id && data.pct_amount && data.amount) {
    productData = data.product_id.slice(0, 5).map((id, i) => ({
      name: `${id}`,
      value: Number(data.pct_amount[i]),
      color: COLORS[i % COLORS.length]
    }));
    tableRows = data.product_id.slice(0, 5).map((id, i) => ({
      product_id: id,
      amount: data.amount[i],
      pct_amount: data.pct_amount[i]
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
          result += `<div>${param.marker} ${param.seriesName}: ${param.value.toFixed(2)}%</div>`;
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
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <>
          <ReactECharts 
            option={chartOption} 
            style={{ height: '200px', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
          <div className="mt-6">
            <table className="w-full text-sm text-gray-700" style={{borderCollapse: 'collapse'}}>
              <thead>
                <tr>
                  <th className="text-left pb-2">Product ID</th>
                  <th className="text-left pb-2">Amount</th>
                  <th className="text-left pb-2">% Share</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={row.product_id} className="border-none">
                    <td className="py-1 pr-4 font-medium">{row.product_id}</td>
                    <td className="py-1 pr-4">{row.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td className="py-1">{row.pct_amount.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductRevenueSharesCard;