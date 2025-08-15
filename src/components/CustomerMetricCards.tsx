import React from 'react';
import ReactECharts from 'echarts-for-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useParams } from 'react-router-dom'

const CustomerMetricCards: React.FC = () => {
  const [growthData, setGrowthData] = React.useState<number[]>([]);
  const [growthLabels, setGrowthLabels] = React.useState<string[]>([]);
  const [growthLoading, setGrowthLoading] = React.useState(true);
  const [growthError, setGrowthError] = React.useState(false);
  const { organization_id } = useParams();

  // Fetch Customer Growth Rate data
  React.useEffect(() => {
    setGrowthLoading(true);
    setGrowthError(false);
    fetch(`http://127.0.0.1:5000/customer-growth-rate?time_units=M&company_id=${organization_id}`)
      .then(res => res.json())
      .then((data) => {
        // data is an array: [{ period, customer_growth, customer_growth_pct }]
        const labels = data.map((d: any) => d.period.slice(0, 7)); // 'YYYY-MM'
        const values = data.map((d: any) => d.customer_growth_pct);
        setGrowthLabels(labels);
        setGrowthData(values);
        setGrowthLoading(false);
      })
      .catch(() => {
        setGrowthError(true);
        setGrowthLoading(false);
      });
  }, []);

  // Calculate latest value, previous value, growth, positivity
  const lastIdx = growthData.length - 1;
  const latest = growthData[lastIdx] ?? 0;
  const prev = growthData[lastIdx - 1] ?? 0;
  const growth = prev === 0 ? 0 : latest - prev;
  const growthLabel = (growth >= 0 ? '+' : '') + growth.toFixed(1) + '%';
  const isPositive = growth >= 0;
  const target = '15%'; // Static for now, can be dynamic if needed

  const metrics = [
    {
      title: 'Customer Growth Rate',
      value: growthLoading ? '...' : latest.toFixed(1) + '%',
      target: target,
      growth: growthLoading ? '...' : growthLabel,
      isPositive: isPositive,
      data: growthData,
      color: '#3b82f6',
      loading: growthLoading,
      error: growthError,
      labels: growthLabels,
    },
    {
      title: 'Churn Rate',
      value: '3.2%',
      target: '2.5%',
      growth: '-0.8%',
      isPositive: true,
      data: [4.5, 4.2, 3.8, 3.5, 3.9, 3.6, 3.4, 3.2, 3.1, 3.2],
      color: '#ef4444'
    },
    {
      title: 'Average Time to Payback CAC',
      value: '8.3 months',
      target: '6 months',
      growth: '-1.2 months',
      isPositive: true,
      data: [12.5, 11.8, 10.9, 10.2, 9.8, 9.1, 8.7, 8.5, 8.1, 8.3],
      color: '#10b981'
    },
    {
      title: 'LTV:CAC Ratio',
      value: '4.2:1',
      target: '5:1',
      growth: '+0.3',
      isPositive: true,
      data: [3.2, 3.4, 3.6, 3.8, 3.9, 4.0, 4.1, 4.2, 4.1, 4.2],
      color: '#f59e0b'
    },
    {
      title: 'Active Customers',
      value: '12,847',
      target: '15,000',
      growth: '+847',
      isPositive: true,
      data: [10200, 10800, 11200, 11600, 11900, 12100, 12300, 12500, 12700, 12847],
      color: '#8b5cf6'
    }
  ];

  const createChartOption = (data: number[], color: string, labels?: string[]) => ({
    grid: {
      left: '0%',
      right: '0%',
      bottom: '0%',
      top: '0%',
      containLabel: false
    },
    xAxis: {
      type: 'category',
      data: labels || Array.from({ length: data.length }, (_, i) => i),
      show: false
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [
      {
        type: 'line',
        data: data,
        smooth: true,
        lineStyle: {
          color: color,
          width: 2
        },
        symbol: 'none',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: color + '40'
              },
              {
                offset: 1,
                color: 'rgba(255, 255, 255, 0)'
              }
            ]
          }
        }
      }
    ],
    tooltip: {
      show: true
    }
  });

  return (
    <div className="grid grid-cols-2 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">{metric.title}</h3>
            {metric.loading ? (
              <div className="h-7 w-1/3 bg-gray-200 rounded animate-pulse mb-1" />
            ) : metric.error ? (
              <div className="text-red-500 mb-1">Error loading data</div>
            ) : (
              <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
            )}
            {/* Target and Growth */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Target: {metric.target}</span>
              <div className="flex items-center space-x-1">
                {metric.isPositive ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span className={`font-medium ${
                  metric.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.growth}
                </span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-16">
            {metric.loading ? (
              <div className="h-full w-full bg-gray-100 animate-pulse rounded" />
            ) : metric.error ? (
              <div className="text-red-400 text-sm">Chart unavailable</div>
            ) : (
              <ReactECharts 
                option={createChartOption(metric.data, metric.color, metric.labels)} 
                style={{ height: '64px', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerMetricCards;