import React, { useState } from 'react';
import { useRef } from 'react';
import { Users, Heart, MessageCircle, Share2, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import InfluencerAnalyticsCard from './InfluencerAnalyticsCard';
import { useParams } from 'react-router-dom';

interface InfluencersCardProps {
  onInfluencerSelect?: (influencer: any) => void;
}

const InfluencersCard: React.FC<InfluencersCardProps> = ({ onInfluencerSelect }) => {
  const [selectedInfluencer, setSelectedInfluencer] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const analyticsRef = useRef<HTMLDivElement>(null);
  const { organization_id } = useParams();
  const influencersPerPage = 5;

  // Helper to get unique influencer ID (screen_name)
  const getInfluencerId = (inf: any) => inf.screen_name || inf.id || inf.handle || inf.name;


  // Influencer data fetched from API
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchInfluencers = async () => {
      setLoading(true);
      setError(null);
      try {
        let dataSourceIds = await fetch(`http://localhost:4000/data-source?type=social_media,twitter,instagram,tiktok&organization_id=${organization_id}`)
        const dataSourceIdsData = await dataSourceIds.json();
        dataSourceIds = dataSourceIdsData.map((ds: any) => ds.DATA_SOURCE_ID);
        
        // Step 1: Fetch influencer queries
        const queriesRes = await fetch(
          `http://localhost:4000/query?data_source_id=${dataSourceIds.join(",")}&type=twitter_account,instagram_account,tiktok_account,facebook_account`
        );
        const queriesData = await queriesRes.json();
        const queries = Array.from(
          new Set(
            (queriesData || [])
              .map((q: any) => q.QUERIES)
              .filter(Boolean)
          )
        );
        console.log("These are the influencers: ",queries);
        if (queries.length === 0) {
          setInfluencers([]);
          setLoading(false);
          return;
        }
        // Step 2: Fetch influencer metrics
        const metricsRes = await fetch(
          `http://localhost:5000/get-influencer-metrics?search_type=influencer&influencers=${queries.join(",")}&company_id=${organization_id}`
        );
        const metricsData = await metricsRes.json();
        console.log("These are the metrics: ",metricsData);
        setInfluencers(metricsData || []);
      } catch (err: any) {
        console.error("This is the issue with the influencers: ",err);
        setError('Failed to load influencer data.');
      } finally {
        setLoading(false);
      }
    };
    fetchInfluencers();
  }, [organization_id]);

  // Calculate pagination
  const totalPages = Math.ceil(influencers.length / influencersPerPage);
  const startIndex = (currentPage - 1) * influencersPerPage;
  const endIndex = startIndex + influencersPerPage;
  const currentInfluencers = influencers.slice(startIndex, endIndex);

  const handleInfluencerSelect = (influencerId: string) => {
    setSelectedInfluencer(influencerId);
    const selectedInfluencerData = influencers.find(inf => getInfluencerId(inf) === influencerId);
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

  // Skeleton Loader for Influencer List
  const InfluencerSkeleton = () => (
    <div className="space-y-4">
      {[...Array(influencersPerPage)].map((_, idx) => (
        <div key={idx} className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 animate-pulse flex items-center space-x-4">
          <div className="w-4 h-4 rounded-full bg-gray-200" />
          <div className="w-12 h-12 rounded-full bg-gray-200" />
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/4 mb-1" />
            <div className="h-3 bg-gray-200 rounded w-1/5" />
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return <InfluencerSkeleton />;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (!influencers.length) {
    return <div>No influencers found.</div>;
  }

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
        {
         currentInfluencers.map((influencer) => {
          const influencerId = getInfluencerId(influencer);
          return (
            <div
              key={influencerId}
              className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                selectedInfluencer === influencerId
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleInfluencerSelect(influencerId)}
            >
              <div className="flex items-center space-x-4">
                {/* Radio Button */}
                <div className="flex-shrink-0">
                  <input
                    type="radio"
                    id={influencerId}
                    name="influencer"
                    value={influencerId}
                    checked={selectedInfluencer === influencerId}
                    onChange={() => handleInfluencerSelect(influencerId)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                </div>

              {/* Avatar */}
              <div className="flex-shrink-0">
                {influencer.profile_picture && typeof influencer.profile_picture === 'string' && influencer.profile_picture.startsWith('http') ? (
                  <img
                    src={influencer.profile_picture}
                    alt={influencer.screen_name || influencer.full_name || 'Avatar'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-400"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {(
                      influencer.screen_name?.[0] ||
                      influencer.full_name?.[0] ||
                      '?'
                    ).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Influencer Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-medium text-gray-900 truncate">
                    {influencer.full_name && influencer.full_name !== 0 ? influencer.full_name : influencer.screen_name}
                  </h4>
                  <span className="text-sm text-gray-500">
                    @{influencer.screen_name && influencer.screen_name !== 0 ? influencer.screen_name : ''}
                  </span>
                  {influencer.topic && influencer.topic !== 0 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {influencer.topic.toString().replace(/_/g, ' ')}
                    </span>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="font-medium text-gray-900">{influencer.followers_count != null ? influencer.followers_count.toLocaleString() : '-'}</div>
                      <div className="text-gray-500 text-xs">Followers</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <div>
                      <div className="font-medium text-gray-900">{influencer.engagement != null ? influencer.engagement.toFixed(2) : '-'}</div>
                      <div className="text-gray-500 text-xs">Engagement</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Share2 className="w-4 h-4 text-purple-500" />
                    <div>
                      <div className="font-medium text-gray-900">{influencer.posts != null ? influencer.posts : '-'}</div>
                      <div className="text-gray-500 text-xs">Posts</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <div>
                      <div className="font-medium text-gray-900">{influencer.reach != null ? influencer.reach.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '-'}</div>
                      <div className="text-gray-500 text-xs">Reach</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )
        })
      }
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
            influencer={influencers.find(i => getInfluencerId(i) === selectedInfluencer)!}
            influencerId={selectedInfluencer}
          />
        </div>
      )}
    </div>
  );
};

export default InfluencersCard;