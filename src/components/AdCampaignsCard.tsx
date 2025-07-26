import React from 'react';
import ReactECharts from 'echarts-for-react';
import { ChevronDown } from 'lucide-react';

const AdCampaignsCard: React.FC = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Sample data for clicks and cost
  const clicksData = [3600, 3700, 3900, 3800, 3500, 3700, 3800];
  const costData = [10200, 10500, 10900, 10800, 10600, 10700, 10870];

  // Table data matching the image
  const campaignData = [
    { name: 'Black Friday Sale', source: 'Google', cost: '$1304.28', clicks: '543217' },
    { name: 'Christmas Bundle', source: 'Facebook', cost: '$9876.56', clicks: '3904' },
    { name: 'Halloween Party Started 🎃👻', source: 'Facebook', cost: '$3267.84', clicks: '7654' },
    { name: 'Grab your reward', source: 'Instagram', cost: '$87545.28', clicks: '68654' },
    { name: 'Black Friday Sale', source: 'Google', cost: '$1304.28', clicks: '3904' },
    { name: 'Boxing Day offer', source: 'Instagram', cost: '$1200.5', clicks: '5004' }
  ];

  const createChartOption = (data: number[], color: string, gradientColor: string) => ({
    grid: {
      left: '0%',
      right: '0%',
      bottom: '0%',
      top: '0%',
      containLabel: false
    },
    xAxis: {
      type: 'category',
      data: days,
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
                color: gradientColor
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
      show: false
    }
  });

  const clicksOption = createChartOption(clicksData, '#3b82f6', 'rgba(59, 130, 246, 0.2)');
  const costOption = createChartOption(costData, '#f97316', 'rgba(249, 115, 22, 0.2)');

  return (
    <div className="space-y-6">
      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-8">
        {/* Cost Chart */}
        <div>
          <div className="mb-2">
            <div className="text-sm text-gray-600 mb-1">Cost</div>
            <div className="text-2xl font-bold text-gray-900">$10.87k</div>
          </div>
          <div className="h-16">
            <ReactECharts 
              option={costOption} 
              style={{ height: '64px', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          </div>
        </div>

        {/* Clicks Chart */}
        <div>
          <div className="mb-2">
            <div className="text-sm text-gray-600 mb-1">Clicks</div>
            <div className="text-2xl font-bold text-gray-900">3.8k</div>
          </div>
          <div className="h-16">
            <ReactECharts 
              option={clicksOption} 
              style={{ height: '64px', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-sm font-medium text-gray-600 pb-3">Top Campaigns</th>
              <th className="text-left text-sm font-medium text-gray-600 pb-3">Source</th>
              <th className="text-right text-sm font-medium text-gray-600 pb-3">Cost</th>
              <th className="text-right text-sm font-medium text-gray-600 pb-3">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {campaignData.map((campaign, index) => (
              <tr key={index} className="border-b border-gray-100 last:border-b-0">
                <td className="text-sm text-gray-900 py-4">{campaign.name}</td>
                <td className="text-sm text-gray-600 py-4">{campaign.source}</td>
                <td className="text-sm text-gray-900 py-4 text-right font-medium">{campaign.cost}</td>
                <td className="text-sm text-gray-900 py-4 text-right">{campaign.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-2 cursor-pointer">
          <span>Last 7 days</span>
          <ChevronDown className="w-4 h-4" />
        </div>
        <div className="text-sm text-blue-600 cursor-pointer hover:text-blue-700">
          Ad campaigns →
        </div>
      </div>
    </div>
  );
};

export default AdCampaignsCard;