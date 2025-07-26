import React from 'react';

const TrendingKeywordsCard: React.FC = () => {
  // Sample trending keywords with different sizes based on frequency/importance
  const keywords = [
    { text: 'social media', size: 'text-4xl', color: 'text-blue-600', weight: 'font-bold' },
    { text: 'marketing', size: 'text-3xl', color: 'text-green-600', weight: 'font-semibold' },
    { text: 'engagement', size: 'text-2xl', color: 'text-purple-600', weight: 'font-medium' },
    { text: 'analytics', size: 'text-3xl', color: 'text-orange-600', weight: 'font-semibold' },
    { text: 'content', size: 'text-2xl', color: 'text-pink-600', weight: 'font-medium' },
    { text: 'brand', size: 'text-xl', color: 'text-indigo-600', weight: 'font-normal' },
    { text: 'influencer', size: 'text-2xl', color: 'text-red-600', weight: 'font-medium' },
    { text: 'viral', size: 'text-lg', color: 'text-yellow-600', weight: 'font-normal' },
    { text: 'trending', size: 'text-xl', color: 'text-cyan-600', weight: 'font-normal' },
    { text: 'hashtag', size: 'text-lg', color: 'text-teal-600', weight: 'font-normal' },
    { text: 'followers', size: 'text-2xl', color: 'text-blue-500', weight: 'font-medium' },
    { text: 'likes', size: 'text-xl', color: 'text-green-500', weight: 'font-normal' },
    { text: 'shares', size: 'text-lg', color: 'text-purple-500', weight: 'font-normal' },
    { text: 'comments', size: 'text-xl', color: 'text-orange-500', weight: 'font-normal' },
    { text: 'reach', size: 'text-lg', color: 'text-pink-500', weight: 'font-normal' },
    { text: 'impressions', size: 'text-lg', color: 'text-indigo-500', weight: 'font-normal' },
    { text: 'campaign', size: 'text-xl', color: 'text-red-500', weight: 'font-normal' },
    { text: 'audience', size: 'text-lg', color: 'text-yellow-500', weight: 'font-normal' },
    { text: 'growth', size: 'text-2xl', color: 'text-cyan-500', weight: 'font-medium' },
    { text: 'strategy', size: 'text-lg', color: 'text-teal-500', weight: 'font-normal' }
  ];

  // Shuffle keywords for more natural word cloud appearance
  const shuffledKeywords = [...keywords].sort(() => Math.random() - 0.5);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Trending Keywords</h3>
        <div className="text-sm text-gray-500">Last 30 days</div>
      </div>
      
      {/* Word Cloud */}
      <div className="flex flex-wrap items-center justify-center gap-4 p-8 bg-gray-50 rounded-lg min-h-[300px]">
        {shuffledKeywords.map((keyword, index) => (
          <span
            key={index}
            className={`${keyword.size} ${keyword.color} ${keyword.weight} cursor-pointer hover:opacity-75 transition-opacity duration-200 select-none`}
            style={{
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
              margin: `${Math.random() * 8}px ${Math.random() * 12}px`
            }}
          >
            {keyword.text}
          </span>
        ))}
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