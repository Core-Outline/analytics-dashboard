import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { MoreHorizontal, ChevronRight } from 'lucide-react';

const FeedbackTopicsCard: React.FC = () => {
  const [topicsData, setTopicsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/get-feedback-system-topics?company_id=301')
      .then(res => res.json())
      .then(data => setTopicsData(data))
      .finally(() => setLoading(false));
  }, []);

  // Get unique categories (excluding empty) and all dates
  const categories = Array.from(new Set(topicsData.map((item: any) => item.system_categories).filter(Boolean)));
  const dates = Array.from(new Set(topicsData.map((item: any) => item.created_at))).sort();

  // Aggregate topic counts per category
  const categoryTotals = categories.map(category => {
    return {
      name: category,
      count: topicsData.filter((item: any) => item.system_categories === category).reduce((sum: number, item: any) => sum + item.topic_count, 0)
    };
  });

  // Color palette
  const palette = ["#cdb4db","#ffc8dd","#ffafcc","#bde0fe","#a2d2ff"];

  // Prepare ECharts series with color, thinner width, all bars rounded
  const series = categories.map((category, i) => ({
    name: category,
    type: 'bar',
    // No stack for grouped bars
    barGap: 0.2,
    barWidth: '8%',
    itemStyle: {
      color: palette[i % palette.length],
      borderRadius: [6, 6, 6, 6]
    },
    data: dates.map(date => {
      const found = topicsData.find((item: any) => item.system_categories === category && item.created_at === date);
      return found ? found.topic_count : 0;
    })
  }));

  const chartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151',
        fontSize: 12
      },
      formatter: function (params: any) {
        return `
          <div style="font-weight: 600; margin-bottom: 4px;">${params[0].axisValue}</div>
          <div>${params[0].value} feedback items</div>
        `;
      }
    },
    legend: {
      data: categories
    },
    grid: {
      left: '8%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates.map(date => {
        const d = new Date(date);
        return d.toLocaleString('default', { month: 'short', year: 'numeric' });
      }),
      axisLabel: {
        rotate: 45,
        color: '#9ca3af',
        fontSize: 12,
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        color: '#9ca3af',
        fontSize: 12,
        fontFamily: 'Inter, system-ui, sans-serif'
      }
    },
    series
  };

return (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-medium text-gray-900">Topics</h3>
      <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
    </div>



    {/* Topics List */}
    <div className="space-y-4 mb-8">
      {categoryTotals.map((topic, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: palette[index % palette.length] }}
            ></div>
            <span className="text-sm text-gray-700">{topic.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">{topic.count}</span>
          </div>
        </div>
      ))}
    </div>

    {/* Topics Trend Chart */}
    <div className="mb-6">
      {loading ? (
        <div>Loading topics trend...</div>
      ) : (
        <ReactECharts
          option={chartOption}
          style={{ height: '50vh', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      )}
    </div>

    {/* View All Link */}
    <div className="flex justify-end">
      <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
        <span>View all</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);
};

export default FeedbackTopicsCard;