import React from 'react';

interface InfluencerAnalyticsCardProps {
  influencer: {
    id: string;
    name: string;
    handle: string;
    platform: string;
    followers: string;
    engagement: string;
    posts: number;
    avgLikes: string;
    avgComments: string;
    category: string;
    avatar: string;
  };
}

const InfluencerAnalyticsCard: React.FC<InfluencerAnalyticsCardProps> = ({ influencer }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-medium text-gray-900 mb-8">Influencer Analytics</h3>
      
      {/* Grid Layout - 2 rows, 3 columns */}
      <div className="grid grid-cols-3 gap-8">
        {/* Row 1 */}
        {/* Mentions */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-blue-300 rounded-full"></div>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Mentions</h4>
          <p className="text-sm text-gray-600 mb-3">
            The influencers mentioned you in 32 of their posts
          </p>
        </div>

        {/* Content Categories */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-blue-300 rounded-full"></div>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Content Categories</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>56% Business & Entrepreneurship</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>32% Other hobbies</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>12% Travel & Adventure</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-orange-300 rounded-full"></div>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Stats</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>5.6k plays</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>12k views</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>1.6k downloads</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>1k likes</span>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        {/* Media Relevance */}
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-green-300 rounded-full"></div>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Media Relevance</h4>
          <p className="text-sm text-gray-600">
            On average the images and videos had a 62% match with your brand keywords.
          </p>
        </div>

        {/* Competitor Mentions */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-blue-300 rounded-full"></div>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Competitor Mentions</h4>
          <p className="text-sm text-gray-600">
            Influencers mentioned your competitors 3 times.
          </p>
        </div>

        {/* Post Relevance */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-blue-300 rounded-full"></div>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Post Relevance</h4>
          <p className="text-sm text-gray-600">
            Their post captions had a 70% relevance.
          </p>
        </div>
      </div>

      {/* Selected Influencer Info */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {influencer.avatar}
          </div>
          <div>
            <h5 className="text-lg font-medium text-gray-900">{influencer.name}</h5>
            <p className="text-sm text-gray-600">{influencer.handle} • {influencer.platform} • {influencer.category}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerAnalyticsCard;