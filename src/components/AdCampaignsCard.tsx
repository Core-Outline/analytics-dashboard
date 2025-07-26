import React from 'react';
import ReactECharts from 'echarts-for-react';

const AdCampaignsCard: React.FC = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Sample data for clicks and cost
  const clicksData = [1200, 1800, 1500, 2200, 2800, 3200, 2900];
  const costData = [450, 680, 520, 780, 920, 1100, 980];

  // Table data
  const campaignData = [
    { name: 'Summer Sale 2024', source: 'Google Ads', cost: '$1,250', clicks: '3,420' },
    { name: 'Black Friday Promo', source: 'Facebook', cost: '$890', clicks: '2,180' },
    { name: 'New Product Launch', source: 'Instagram', cost: '$1,450', clicks: '4,200' },
    { name: 'Holiday Special', source: 'Google Ads', cost: '$720', clicks: '1,890' },
    { name: 'Brand Awareness', source: 'LinkedIn', cost: '$980', clicks: '1,560' },
    { name: 'Retargeting Campaign', source: 'Facebook', cost: '$650', clicks: '2,340' },
    { name: 'Mobile App Install', source: 'TikTok', cost: '$1,120', clicks: '3,780' },
    { name: 'Local Business Ads', source: 'Google Ads', cost: '$540', clicks: '1,230' }
  ];

  const createChartOption = (title: string, data: number[], color: string, gradientColor: string) => ({
    title: {
      text: title,
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#374151',
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      left: 0,
      top: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '25%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: days,
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
                color: gradientColor
              },
              {
                offset: 1,
                color: 'rgba(255, 255, 255, 0.1)'
              }
            ]
          }
        }
      }
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151',
        fontSize: 12
      }
    }
  });

  const clicksOption = createChartOption('Clicks', clicksData, '#3b82f6', 'rgba(59, 130, 246, 0.3)');
  const costOption = createChartOption('Cost', costData, '#10b981', 'rgba(16, 185, 129, 0.3)');

  return (
    <div className="space-y-6">
      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <ReactECharts 
            option={clicksOption} 
            style={{ height: '200px', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <ReactECharts 
            option={costOption} 
            style={{ height: '200px', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-sm font-medium text-gray-600 pb-3">Campaign Name</th>
              <th className="text-left text-sm font-medium text-gray-600 pb-3">Source</th>
              <th className="text-left text-sm font-medium text-gray-600 pb-3">Cost</th>
              <th className="text-left text-sm font-medium text-gray-600 pb-3">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {campaignData.map((campaign, index) => (
              <tr key={index}>
                <td className="text-sm text-gray-900 py-2 font-medium">{campaign.name}</td>
                <td className="text-sm text-gray-600 py-2">{campaign.source}</td>
                <td className="text-sm text-gray-900 py-2 font-medium">{campaign.cost}</td>
                <td className="text-sm text-gray-900 py-2 font-medium">{campaign.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdCampaignsCard;