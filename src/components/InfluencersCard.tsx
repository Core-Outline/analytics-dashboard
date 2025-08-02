import React, { useState } from 'react';
import { useRef } from 'react';
import { Users, Heart, MessageCircle, Share2, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import InfluencerAnalyticsCard from './InfluencerAnalyticsCard';

interface InfluencersCardProps {
  onInfluencerSelect?: (influencer: any) => void;
}

const InfluencersCard: React.FC<InfluencersCardProps> = ({ onInfluencerSelect }) => {
  const [selectedInfluencer, setSelectedInfluencer] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const analyticsRef = useRef<HTMLDivElement>(null);
  const influencersPerPage = 5;

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
    },
    {
      id: 'gaming_alex',
      name: 'Alex Rodriguez',
      handle: '@gaming_alex',
      platform: 'Twitch',
      followers: '1.5M',
      engagement: '8.2%',
      posts: 145,
      avgLikes: '78K',
      avgComments: '3.7K',
      category: 'Gaming',
      avatar: 'AR'
    },
    {
      id: 'beauty_sophia',
      name: 'Sophia Martinez',
      handle: '@beauty_sophia',
      platform: 'Instagram',
      followers: '2.1M',
      engagement: '5.9%',
      posts: 312,
      avgLikes: '124K',
      avgComments: '2.8K',
      category: 'Beauty',
      avatar: 'SM'
    },
    {
      id: 'business_james',
      name: 'James Thompson',
      handle: '@business_james',
      platform: 'LinkedIn',
      followers: '890K',
      engagement: '4.3%',
      posts: 78,
      avgLikes: '38K',
      avgComments: '1.2K',
      category: 'Business',
      avatar: 'JT'
    },
    {
      id: 'music_taylor',
      name: 'Taylor Swift Fan',
      handle: '@music_taylor',
      platform: 'TikTok',
      followers: '4.2M',
      engagement: '9.1%',
      posts: 567,
      avgLikes: '312K',
      avgComments: '8.9K',
      category: 'Music',
      avatar: 'TS'
    },
    {
      id: 'fashion_olivia',
      name: 'Olivia Brown',
      handle: '@fashion_olivia',
      platform: 'Instagram',
      followers: '1.9M',
      engagement: '6.7%',
      posts: 289,
      avgLikes: '127K',
      avgComments: '3.4K',
      category: 'Fashion',
      avatar: 'OB'
    },
    {
      id: 'sports_marcus',
      name: 'Marcus Johnson',
      handle: '@sports_marcus',
      platform: 'YouTube',
      followers: '2.3M',
      engagement: '5.8%',
      posts: 134,
      avgLikes: '156K',
      avgComments: '4.2K',
      category: 'Sports',
      avatar: 'MJ'
    },
    {
      id: 'art_emma',
      name: 'Emma Wilson',
      handle: '@art_emma',
      platform: 'Instagram',
      followers: '756K',
      engagement: '7.4%',
      posts: 198,
      avgLikes: '56K',
      avgComments: '1.8K',
      category: 'Art',
      avatar: 'EW'
    },
    {
      id: 'comedy_ryan',
      name: 'Ryan Davis',
      handle: '@comedy_ryan',
      platform: 'TikTok',
      followers: '3.8M',
      engagement: '11.2%',
      posts: 423,
      avgLikes: '425K',
      avgComments: '12.1K',
      category: 'Comedy',
      avatar: 'RD'
    },
    {
      id: 'pets_anna',
      name: 'Anna Garcia',
      handle: '@pets_anna',
      platform: 'Instagram',
      followers: '1.4M',
      engagement: '8.9%',
      posts: 345,
      avgLikes: '124K',
      avgComments: '5.6K',
      category: 'Pets',
      avatar: 'AG'
    },
    {
      id: 'diy_kevin',
      name: 'Kevin Lee',
      handle: '@diy_kevin',
      platform: 'YouTube',
      followers: '1.1M',
      engagement: '6.5%',
      posts: 87,
      avgLikes: '71K',
      avgComments: '2.9K',
      category: 'DIY',
      avatar: 'KL'
    }
  ];

  // Calculate pagination
  const totalPages = Math.ceil(influencers.length / influencersPerPage);
  const startIndex = (currentPage - 1) * influencersPerPage;
  const endIndex = startIndex + influencersPerPage;
  const currentInfluencers = influencers.slice(startIndex, endIndex);

  const handleInfluencerSelect = (influencerId: string) => {
    setSelectedInfluencer(influencerId);
    const selectedInfluencerData = influencers.find(inf => inf.id === influencerId);
    if (selectedInfluencerData && onInfluencerSelect) {
      onInfluencerSelect(selectedInfluencerData);
    }
    
    // Scroll to analytics card after a short delay to ensure it's rendered
    setTimeout(() => {
      if (analyticsRef.current) {
        analyticsRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedInfluencer(''); // Clear selection when changing pages
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return 'bg-pink-100 text-pink-800';
      case 'YouTube':
        return 'bg-red-100 text-red-800';
      case 'TikTok':
        return 'bg-gray-100 text-gray-800';
      case 'Twitch':
        return 'bg-purple-100 text-purple-800';
      case 'LinkedIn':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Top Influencers</h3>
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(endIndex, influencers.length)} of {influencers.length} influencers
          </div>
        </div>
        <div className="text-sm text-gray-500">Last 30 days</div>
      </div>

      <div className="space-y-4">
        {currentInfluencers.map((influencer) => (
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

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Influencer Analytics Card */}
      {selectedInfluencer && (
        <div ref={analyticsRef} className="mt-8">
          <InfluencerAnalyticsCard 
            influencer={influencers.find(i => i.id === selectedInfluencer)!}
          />
        </div>
      )}
    </div>
  );
};

export default InfluencersCard;