import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import { useLocation} from 'react-router-dom';
const UserSentimentsCard: React.FC = () => {
  const [sentimentData, setSentimentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [visibleSentiments, setVisibleSentiments] = useState({
    'positive': true,
    'negative': true,
    'neutral': true,
    'mixed': true
  });
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const organization_id = searchParams.get('organization_id');

  // Fetch data from API
  useEffect(() => {
    setLoading(true);
    fetch(`https://data.coreoutline.com/get-feedback-sentiments-trend?company_id=${organization_id}`)
      .then(res => res.json())
      .then(data => {
        setSentimentData(data);
        // Set latest month as default
        const uniqueMonths = Array.from(new Set(data.map((d: any) => d.created_at))).sort();
        setSelectedMonth(uniqueMonths[uniqueMonths.length - 1] || null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Extract unique months and sentiments from data
  const months = Array.from(new Set(sentimentData.map((d: any) => d.created_at))).sort();
  const sentiments = Array.from(new Set(sentimentData.map((d: any) => d.sentiment)));

  // Custom palette for bars and legend
  const palette = ["#03045e","#023e8a","#0077b6","#0096c7","#00b4d8","#48cae4","#90e0ef","#ade8f4","#caf0f8"];
  // Map each sentiment to a palette color in order
  const sentimentColors: Record<string, string> = {};
  sentiments.forEach((sentiment, idx) => {
    sentimentColors[sentiment] = palette[idx % palette.length];
  });

  // Aggregate counts for selected month
  const sentimentCounts = sentiments.map(sentiment => {
    const found = sentimentData.find((d: any) => d.sentiment === sentiment && d.created_at === selectedMonth);
    return {
      sentiment,
      count: found ? found.sentiment_count : 0,
      color: sentimentColors[sentiment] || '#ccc'
    };
  });

  // Prepare trend chart series
  const chartSeries = sentiments
    .filter(sentiment => visibleSentiments[sentiment])
    .map(sentiment => ({
      name: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
      type: 'bar',
      barWidth: '5%', // extra thin bars
      itemStyle: {
        color: sentimentColors[sentiment] || '#ccc',
        borderRadius: [12, 12, 12, 12] // more round at top and bottom
      },
      data: months.map(month => {
        const found = sentimentData.find((d: any) => d.sentiment === sentiment && d.created_at === month);
        return found ? found.sentiment_count : 0;
      })
    }));

  const chartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151', fontSize: 12 }
    },
    legend: {
      data: sentiments.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
      top: 10
    },
    grid: { left: '2%', right: '2%', bottom: '8%', top: 40, containLabel: true },
    xAxis: {
      type: 'category',
      data: months.map(date => {
        const d = new Date(date);
        return d.toLocaleString('default', { month: 'short', year: 'numeric' });
      }),
      axisLabel: { color: '#9ca3af', fontSize: 12 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#9ca3af', fontSize: 12 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false }
    },
    series: chartSeries
  };

  const toggleSentiment = (sentimentName: string) => {
    setVisibleSentiments(prev => ({
      ...prev,
      [sentimentName]: !prev[sentimentName]
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">User Sentiments</h3>
        <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
      </div>

      {/* Interactive Legend */}
      <div className="flex items-center space-x-6 mb-6">
        {sentiments.map((sentiment) => (
          <button
            key={sentiment}
            onClick={() => toggleSentiment(sentiment)}
            className={`flex items-center space-x-2 transition-opacity duration-200 ${
              visibleSentiments[sentiment] ? 'opacity-100' : 'opacity-50'
            }`}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: sentimentColors[sentiment] || '#ccc' }}
            ></div>
            <span className="text-sm text-gray-600">{sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}</span>
          </button>
        ))}
      </div>

      {/* Month Selector */}
      <div className="flex items-center mb-4">
        <label className="mr-2 text-sm text-gray-600">Month:</label>
        <select
          className="border border-gray-300 rounded px-2 py-1 text-sm"
          value={selectedMonth || ''}
          onChange={e => setSelectedMonth(e.target.value)}
        >
          {months.map(month => {
            const d = new Date(month);
            return (
              <option key={month} value={month}>
                {d.toLocaleString('default', { month: 'short', year: 'numeric' })}
              </option>
            );
          })}
        </select>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {sentimentCounts.map(({ sentiment, count, color }) => (
          <div key={sentiment} className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <span className="text-2xl font-bold text-gray-900">{count}</span>
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center">
              <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }}></span>
              {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mb-6">
        {loading ? (
          <div>Loading sentiment trends...</div>
        ) : (
          <ReactECharts 
            option={chartOption} 
            style={{ height: '300px', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        )}
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-end">
        <div className="text-sm text-blue-600 cursor-pointer hover:text-blue-700">
          View all reports →
        </div>
      </div>
    </div>
  );
};

export default UserSentimentsCard;