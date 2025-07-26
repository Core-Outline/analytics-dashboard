import React, { useState } from 'react';
import { Users, Heart, MessageCircle, Share2, TrendingUp } from 'lucide-react';

const InfluencersCard: React.FC = () => {
  const [selectedInfluencer, setSelectedInfluencer] = useState<string>('');

  // Sample influencer data
  const influencers = [
    {
      id: 'sarah_lifestyle',
      name: 'Sarah Johnson',
      handle: '@sarah_lifestyle',
      platform: 'Instagram',
      followers: '2.4M',
      engagement: '4.8%',
      posts: 156,
      avgLikes: '115K',
      avgComments: '2.3K',
      category: 'Lifestyle',
      avatar: 'SJ'
    },
    {
      id: 'tech_mike',
      name: 'Michael Chen',
      handle: '@tech_mike',
      platform: 'YouTube',
      followers: '1.8M',
      engagement: '6.2%',
      posts: 89,
      avgLikes: '89K',
      avgComments: '4.1K',
      category: 'Technology',
      avatar: 'MC'
    },
    {
      id: 'fitness_emily',
      name: 'Emily Davis',
      handle: '@fitness_emily',
      platform: 'TikTok',
      followers: '3.1M',
      engagement: '7.5%',
      posts: 234,
      avgLikes: '187K',
      avgComments: '5.8K',
      category: 'Fitness',
      avatar: 'ED'
    },
    {
      id: 'food_david',
      name: 'David Wilson',
      handle: '@food_david',
      platform: 'Instagram',
      followers: '1.2M',
      engagement: '5.4%',
      posts: 298,
      avgLikes: '65K',
      avgComments: '1.9K',
      category: 'Food',
      avatar: 'DW'
    },
    {
      id: 'travel_lisa',
      name: 'Lisa Anderson',
      handle: '@travel_lisa',
      platform: 'Instagram',
      followers: '2.8M',
      engagement: '4.1%',
      posts: 187,
      avgLikes: '142K',
      avgComments: '3.2K',
      category: 'Travel',
      avatar: 'LA'
    }
  ];

  const handleInfluencerSelect = (influencerId: string) => {
    setSelectedInfluencer(influencerId);
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return 'bg-pink-100 text-pink-800';
      case 'YouTube':
        return 'bg-red-100 text-red-800';
      case 'TikTok':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Top Influencers</h3>
        <div className="text-sm text-gray-500">Last 30 days</div>
      </div>

      <div className="space-y-4">
        {influencers.map((influencer) => (
          <div
            key={influencer.id}
            className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
              selectedInfluencer === influencer.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleInfluencerSelect(influencer.id)}
          >
            <div className="flex items-center space-x-4">
              {/* Radio Button */}
              <div className="flex-shrink-0">
                <input
                  type="radio"
                  id={influencer.id}
                  name="influencer"
                  value={influencer.id}
                  checked={selectedInfluencer === influencer.id}
                  onChange={() => handleInfluencerSelect(influencer.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {influencer.avatar}
                </div>
              </div>

              {/* Influencer Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-medium text-gray-900 truncate">
                    {influencer.name}
                  </h4>
                  <span className="text-sm text-gray-500">{influencer.handle}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlatformColor(influencer.platform)}`}>
                    {influencer.platform}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {influencer.category}
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-5 gap-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="font-medium text-gray-900">{influencer.followers}</div>
                      <div className="text-gray-500 text-xs">Followers</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <div>
                      <div className="font-medium text-gray-900">{influencer.engagement}</div>
                      <div className="text-gray-500 text-xs">Engagement</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Share2 className="w-4 h-4 text-purple-500" />
                    <div>
                      <div className="font-medium text-gray-900">{influencer.posts}</div>
                      <div className="text-gray-500 text-xs">Posts</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <div>
                      <div className="font-medium text-gray-900">{influencer.avgLikes}</div>
                      <div className="text-gray-500 text-xs">Avg Likes</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4 text-orange-500" />
                    <div>
                      <div className="font-medium text-gray-900">{influencer.avgComments}</div>
                      <div className="text-gray-500 text-xs">Avg Comments</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Influencer Info */}
      {selectedInfluencer && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-800">
            <strong>Selected:</strong> {influencers.find(i => i.id === selectedInfluencer)?.name}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfluencersCard;