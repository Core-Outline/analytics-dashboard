import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { ChevronDown } from 'lucide-react';

// Type for ad campaign data from API
interface AdCampaign {
  ad_id: string;
  source: string;
  datetime: string;
  campaign_id: string;
  campaign_name: string;
  cost: number;
  ad_group_id: string;
  ad_group_name: string;
  impressions: number;
  clicks: number;
  click_through_rate: number;
  cost_per_click: number;
  conversions: number;
  cost_micros: number;
  reach: number;
  organization_id: number;
}

const AdCampaignsCard: React.FC = () => {
  const [adData, setAdData] = useState<AdCampaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:5000/get-ads-data?company_id=301');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        console.log("This is the ads data: ",data)
        setAdData(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Extract days for the last 7 days (if needed for chart)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; // Placeholder, ideally map from data

  // Aggregate clicks and cost per day (simple example, can be improved)
  const getChartData = (key: keyof AdCampaign) => {
    // Group by day, sum values
    const today = new Date();
    const chartArr = Array(7).fill(0);
    adData.forEach(item => {
      const date = new Date(item.datetime);
      // Calculate day index (0 = today, 6 = 6 days ago)
      const diff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (diff >= 0 && diff < 7) {
        chartArr[6 - diff] += Number(item[key]);
      }
    });
    return chartArr;
  };

  const clicksData = getChartData('clicks');
  const costData = getChartData('cost');

  // Table data: show latest campaigns (sort by datetime desc)
  const campaignData = adData
    .slice()
    .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
    .slice(0, 6)
    .map(item => ({
      name: item.campaign_name,
      source: item.source,
      cost: `$${item.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      clicks: item.clicks.toLocaleString(),
    }));


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
      show: true
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
            <div className="text-2xl font-bold text-gray-900">
              {`$${costData.reduce((a, b) => a + b, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
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
            <div className="text-2xl font-bold text-gray-900">
              {(() => {
                const total = clicksData.reduce((a, b) => a + b, 0);
                return total >= 1000 ? `${(total / 1000).toFixed(1)}k` : total.toLocaleString();
              })()}
            </div>
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