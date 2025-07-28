import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { fetchSalesData, getSalesChartData } from '../helpers/financials';

interface TotalSalesChartProps {
  timeUnit: string;
}

const TotalSalesChart: React.FC<TotalSalesChartProps> = ({ timeUnit }) => {
  const [salesData, setSalesData] = useState<{ date: string[]; amount: number[] }>({ date: [], amount: [] });
  const [loading, setLoading] = useState(true);
  const [apiConfig, setApiConfig] = useState<any>(null);
  const company = '301';

  useEffect(() => {
    fetch('/config.json')
      .then(res => res.json())
      .then(config => setApiConfig(config));
  }, []);

  useEffect(() => {
    if (!apiConfig) return;
    setLoading(true);
    fetchSalesData(
      {
        brevoApiKey: apiConfig.brevoApiKey,
        apiBaseUrl: apiConfig.api_base_url || apiConfig.apiBaseUrl,
        dataBaseUrl: apiConfig.data_base_url || apiConfig.dataBaseUrl
      },
      timeUnit[0].toUpperCase(),
      company
    ).then((data) => {
      setSalesData(data);
      setLoading(false);
    });
  }, [timeUnit, company, apiConfig]);

  const { chartLabels, currentData, previousData } = getSalesChartData(salesData, timeUnit);

  const getTimeUnitLabel = (unit: string) => {
    switch (unit.toLowerCase()) {
      case 'year': return 'Year';
      case 'month': return 'Month';
      case 'quarter': return 'Quarter';
      case 'week': return 'Week';
      case 'day': return 'Day';
      default: return unit.charAt(0).toUpperCase() + unit.slice(1);
    }
  };

  const currentLabel = `Current ${getTimeUnitLabel(timeUnit)}`;
  const previousLabel = `Previous ${getTimeUnitLabel(timeUnit)}`;

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
      data: chartLabels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#9ca3af',
        fontSize: 12,
        fontFamily: 'Inter, system-ui, sans-serif'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#9ca3af',
        fontSize: 12,
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      splitLine: { lineStyle: { color: '#f1f5f9', width: 1 } }
    },
    series: [
      {
        name: currentLabel,
        type: 'line',
        data: currentData,
        smooth: true,
        lineStyle: { color: '#f59e0b', width: 2 },
        symbol: 'none',
        areaStyle: { opacity: 0 }
      },
      {
        name: previousLabel,
        type: 'line',
        data: previousData,
        smooth: true,
        lineStyle: { color: '#1f2937', width: 2 },
        symbol: 'none',
        areaStyle: { opacity: 0 }
      }
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      textStyle: { color: '#111827', fontSize: 13 },
      formatter: function(params: any) {
        let html = `<div><strong>${params[0].axisValueLabel}</strong></div>`;
        params.forEach((item: any) => {
          html += `<div style=\"margin:2px 0;\"><span style=\"display:inline-block;margin-right:6px;width:10px;height:10px;border-radius:50%;background:${item.color}\"></span>${item.seriesName}: <b>${item.data.toLocaleString()}</b></div>`;
        });
        return html;
      },
      axisPointer: {
        type: 'line',
        lineStyle: { color: 'rgba(128, 128, 128, 0.15)', width: 60, type: 'solid' },
        label: { show: false }
      },
      position: function (point: any) { return [point[0] - 30, 0]; },
      extraCssText: `box-shadow:0 2px 8px rgba(0,0,0,0.08); border-radius:8px;`
    },
    legend: {
      show: true,
      top: 0,
      left: 'center',
      icon: 'line',
      itemWidth: 18,
      itemHeight: 4,
      textStyle: {
        color: '#374151',
        fontWeight: 500,
        fontSize: 13,
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      data: [currentLabel, previousLabel],
    }
  };

  if (loading) {
    return <div className="h-[280px] w-full flex items-center justify-center"><div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div></div>;
  }

  return (
    <div className="relative group">
      <div className="absolute left-0 top-0 w-full flex justify-center z-10 pointer-events-none">
        <span className="text-xs text-gray-500 mt-2 mb-1 bg-white bg-opacity-80 px-2 rounded">Comparison of current vs previous {getTimeUnitLabel(timeUnit).toLowerCase()} sales</span>
      </div>
      <ReactECharts 
        option={option} 
        style={{ height: '280px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default TotalSalesChart;