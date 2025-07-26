import React from 'react';
import ReactECharts from 'echarts-for-react';

const SentimentAnalysisCard: React.FC = () => {
  // Sample sentiment data
  const sentimentData = [
    { name: 'Positive', value: 65, color: '#10b981', count: 4550 },
    { name: 'Neutral', value: 25, color: '#f59e0b', count: 1750 },
    { name: 'Negative', value: 10, color: '#ef4444', count: 700 }
  ];

  const totalComments = sentimentData.reduce((sum, item) => sum + item.count, 0);

  const chartOption = {
    grid: {
      left: '0%',
      right: '0%',
      bottom: '0%',
      top: '0%',
      containLabel: false
    },
    xAxis: {
      type: 'value',
      show: false,
      max: 100
    },
    yAxis: {
      type: 'category',
      data: ['Sentiment'],
      show: false
    },
    series: sentimentData.map((sentiment, index) => ({
      name: sentiment.name,
      type: 'bar',
      stack: 'total',
      data: [sentiment.value],
      itemStyle: {
        color: sentiment.color,
        borderRadius: index === 0 ? [8, 0, 0, 8] : index === sentimentData.length - 1 ? [0, 8, 8, 0] : [0, 0, 0, 0]
      },
      barWidth: '60px'
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
        let result = '<div style="font-weight: 600; margin-bottom: 4px;">Sentiment Distribution</div>';
        params.forEach((param: any) => {
          const sentiment = sentimentData.find(s => s.name === param.seriesName);
          result += `<div>${param.marker} ${param.seriesName}: ${sentiment?.count.toLocaleString()} comments (${param.value}%)</div>`;
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
              style={{ height: '60px', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          </div>

          {/* Sentiment Labels */}
          <div className="flex justify-between text-sm">
            {sentimentData.map((sentiment, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: sentiment.color }}
                ></div>
                <span className="text-gray-700 font-medium">{sentiment.name}</span>
              </div>
            ))}
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