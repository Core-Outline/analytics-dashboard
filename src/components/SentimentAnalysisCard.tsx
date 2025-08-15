import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useParams } from 'react-router-dom'

const SENTIMENT_COLORS: Record<string, string> = {
  positive: '#10b981', // emerald
  neutral: '#f59e0b',  // amber
  negative: '#ef4444', // red
};

const SentimentAnalysisCard: React.FC = () => {
  const [sentimentData, setSentimentData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { organization_id } = useParams();

  React.useEffect(() => {
    setLoading(true);
    const fetchSentimentData = async () => {
      let dataSourceIds = await fetch(`http://localhost:4000/data-source?type=social_media,twitter,instagram,tiktok&organization_id=${organization_id}`)
      const dataSourceIdsData = await dataSourceIds.json();
      dataSourceIds = dataSourceIdsData.map((ds: any) => ds.DATA_SOURCE_ID);

      fetch(`http://localhost:5000/sentiment?search_type=all&data_source_ids=${dataSourceIds}&company_id=${organization_id}&indices=tiktok,twitter`)
        .then(res => res.json())
        .then(data => {
          // Map API data to chart data
          const mapped = data.map((item: any) => ({
            name: item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1),
            value: item.proportion,
            color: SENTIMENT_COLORS[item.sentiment] || '#6b7280',
            count: item.count,
          }));
          setSentimentData(mapped);
          setLoading(false);
        })
        .catch(() => setLoading(false));

    }

    fetchSentimentData();

  }, []);

  const totalComments = sentimentData.reduce((sum, item) => sum + item.count, 0);

  const chartOption = {
    grid: {
      left: '15%',
      right: '5%',
      bottom: '10%',
      top: '5%',
      containLabel: false
    },
    xAxis: {
      type: 'value',
      show: true,
      max: sentimentData.length > 0 ? Math.max(...sentimentData.map(s => s.count)) : 100,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#9ca3af',
        fontSize: 12,
        fontFamily: 'Inter, system-ui, sans-serif',
        formatter: function (value: number) {
          return value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value.toString();
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f1f5f9',
          width: 1
        }
      }
    },
    yAxis: {
      type: 'category',
      data: sentimentData.map(s => s.name).reverse(),
      show: true,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#374151',
        fontSize: 12,
        fontFamily: 'Inter, system-ui, sans-serif',
        fontWeight: 'medium'
      }
    },
    series: [{
      name: 'Comments',
      type: 'bar',
      data: sentimentData.map(s => s.count).reverse(),
      itemStyle: {
        color: function (params: any) {
          const reversedData = [...sentimentData].reverse();
          return reversedData[params.dataIndex]?.color || '#6b7280';
        },
        borderRadius: [12, 12, 12, 12]
      },
      barWidth: '30%'
    }],
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151',
        fontSize: 12
      },
      formatter: function (params: any) {
        const reversedData = [...sentimentData].reverse();
        const sentiment = reversedData[params.dataIndex];
        return `
          <div style="font-weight: 600; margin-bottom: 4px;">${sentiment.name} Sentiment</div>
          <div>${sentiment.count.toLocaleString()} comments (${sentiment.value}%)</div>
        `;
      }
    },
    legend: {
      show: false
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Sentiment Analysis</h3>
        <div className="text-sm text-gray-500">Last 30 days</div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Left Column - Horizontal Bar Chart (spans 2 columns) */}
        <div className="col-span-2">
          <div className="mb-4">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {totalComments.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Comments Analyzed</div>
          </div>

          {/* Horizontal Bar Chart */}
          <div className="mb-6">
            <ReactECharts
              option={chartOption}
              style={{ height: '180px', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          </div>
        </div>

        {/* Right Column - Percentage Breakdown */}
        <div className="col-span-1 space-y-6">
          {sentimentData.map((sentiment, index) => (
            <div key={index} className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg"
                style={{ backgroundColor: sentiment.color }}
              >
                {sentiment.value}%
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-900">{sentiment.name}</h4>
                <p className="text-xs text-gray-500">
                  {sentiment.count.toLocaleString()} comments
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysisCard;