import React from 'react';
import ReactECharts from 'echarts-for-react';

import { scaleOrdinal } from 'd3-scale';
import { schemeTableau10 } from 'd3-scale-chromatic';
import { useLocation } from 'react-router-dom'


const ConversionsDistributionCard: React.FC = () => {
  const [platformData, setPlatformData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const colorScale = scaleOrdinal(schemeTableau10);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const organization_id = searchParams.get('organization_id');

  React.useEffect(() => {
    setLoading(true);
    fetch(`https://data.coreoutline.com/conversions-splits?company_id=${organization_id}`)
      .then(res => res.json())
      .then(data => {
        // Assign a color and readable name for each platform
        const mapped = data.map((item: any, i: number) => ({
          name: item.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          value: item.percent,
          color: colorScale(i),
          conversions: item.count,
        }));
        setPlatformData(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalConversions = platformData.reduce((sum, platform) => sum + platform.conversions, 0);

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
      data: ['Conversions'],
      show: false
    },
    series: platformData.map((platform, index) => ({
      name: platform.name,
      type: 'bar',
      stack: 'total',
      data: [platform.value],
      itemStyle: {
        color: platform.color,
        borderRadius: index === 0 ? [8, 0, 0, 8] : index === platformData.length - 1 ? [0, 8, 8, 0] : [0, 0, 0, 0]
      },
      barWidth: '40px'
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
        let result = '<div style="font-weight: 600; margin-bottom: 4px;">Conversion Distribution</div>';
        params.forEach((param: any) => {
          const platform = platformData.find(p => p.name === param.seriesName);
          result += `<div>${param.marker} ${param.seriesName}: ${platform?.conversions} conversions (${param.value}%)</div>`;
        });
        return result;
      }
    },
    legend: {
      show: false
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Conversions by Platform</h3>
        <div className="text-sm text-gray-500">Last 30 days</div>
      </div>

      {/* Total Conversions */}
      <div className="mb-6">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {totalConversions.toLocaleString()}
        </div>
        <div className="text-sm text-gray-600">Total Conversions</div>
      </div>

      {/* Horizontal Stacked Bar Chart */}
      <div className="mb-6">
        <ReactECharts 
          option={chartOption}
          style={{ height: '40px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>

      {/* Platform Breakdown */}
      <div className="space-y-3">
        {platformData.map((platform, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: platform.color }}
              ></div>
              <span className="text-sm font-medium text-gray-900">{platform.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{platform.conversions} conversions</span>
              <span className="text-sm font-medium text-gray-900 w-12 text-right">{platform.value}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversionsDistributionCard;