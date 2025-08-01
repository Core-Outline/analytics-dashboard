import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import 'echarts-wordcloud'; // Import the wordcloud extension
import { fetchTrendingKeywords } from '../api/socialMedia';

const TrendingKeywordsCard: React.FC = () => {
  const [keywords, setKeywords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchKeywords() {
      setLoading(true);
      try {
        const res = await fetchTrendingKeywords({
          search_type: 'keywords',
          data_source_ids: [201],
          company_id: 101,
          influencers: 'SafaricomPLC',
          time_units: 'H',
          indices: ['twitter', 'tiktok']
        });
        setKeywords(res);
        setError(null);
      } catch (err: any) {
        setError('Failed to load trending keywords');
      }
      setLoading(false);
    }
    fetchKeywords();
  }, []);

  // Prepare data for ECharts WordCloud
  const wordCloudData = keywords.map((keyword: any) => ({
    name: keyword.text,
    value: keyword.frequency || keyword.size || 1,
    textStyle: {
      color: keyword.color || undefined,
      fontWeight: keyword.weight || undefined,
    }
  }));

  const option = {
    tooltip: {},
    series: [
      {
        type: 'wordCloud',
        gridSize: 8,
        sizeRange: [16, 48],
        rotationRange: [-45, 45],
        shape: 'circle',
        textStyle: {
          fontFamily: 'inherit',
          fontWeight: 'bold',
        },
        data: wordCloudData,
      }
    ]
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Trending Keywords</h3>
        <div className="text-sm text-gray-500">Last 30 days</div>
      </div>

      <div className="flex items-center justify-center bg-gray-50 rounded-lg min-h-[300px] p-4">
        {loading ? (
          <div>Loading keywords...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <ReactECharts
            option={option}
            style={{ height: 320, width: '100%' }}
            notMerge={true}
            lazyUpdate={true}
            echarts={echarts} // Pass the echarts instance
          />
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6 text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          <span>High frequency</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
          <span>Medium frequency</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <span>Low frequency</span>
        </div>
      </div>
    </div>
  );
};

export default TrendingKeywordsCard;
