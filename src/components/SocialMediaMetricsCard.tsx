import React, { useEffect, useState } from 'react';
import { Users, Camera, Zap, MoreHorizontal } from 'lucide-react';
import { fetchFollowersTrend, fetchPostsTrend, fetchConversionsTrend, fetchCommentsTrend, fetchLikesTrend, fetchMentionsTrend } from '../api/socialMedia';

const SocialMediaMetricsCard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllMetrics() {
      setLoading(true);
      try {
        const followersRes = await fetchFollowersTrend({
          search_type: 'account',
          data_source_ids: 301,
          company_id: 101,
          time_units: 'H'
        });
        const postsRes = await fetchPostsTrend({
          search_type: 'account',
          data_source_ids: 301,
          company_id: 101,
          time_units: 'H'
        });
        const conversionsRes = await fetchConversionsTrend({
          company_id: 101,
          time_units: 'H'
        });
        // const commentsRes = await fetchCommentsTrend({
        //   search_type: 'account',
        //   data_source_ids: 301,
        //   company_id: 101,
        //   time_units: 'H'
        // });
        const likesRes = await fetchLikesTrend({
          search_type: 'account',
          data_source_ids: 301,
          company_id: 101,
          time_units: 'H',
          // indices: ['twitter', 'tiktok']
        });
        const mentionsRes = await fetchMentionsTrend({
          search_type: 'keywords',
          data_source_ids: 201,
          company_id: 101,
          time_units: 'H',
          indices: ['twitter', 'tiktok']
        });
        setMetrics({
          followers: followersRes,
          posts: postsRes,
          conversions: conversionsRes,
          // comments: commentsRes.data[0],
          // likes: likesRes.data[0],
          // mentions: mentionsRes.data[0]
        });
        setError(null);
      } catch (err) {
        console.error('Failed to load metrics', err);
        setError('Failed to load metrics');
      }
      setLoading(false);
    }
    fetchAllMetrics();
  }, []);

  // Helper to extract latest and previous metric values from API arrays
  interface MetricItem {
    [key: string]: any;
    created_at?: string;
  }
  interface LatestPreviousResult {
    current: string | number;
    previous: string | number;
    pct: string;
  }
  function getLatestAndPrevious(
    arr: MetricItem[] | undefined,
    valueKey: string,
    pctKey: string
  ): LatestPreviousResult {
    if (!Array.isArray(arr) || arr.length === 0) {
      return { current: '-', previous: '-', pct: '-' };
    }
    // Sort descending by created_at
    const sorted = [...arr].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
    const current = sorted[0][valueKey] ?? '-';
    const previous = sorted[1] ? sorted[1][valueKey] : '-';
    let pct = sorted[0][pctKey];
    if (typeof pct === 'number') {
      pct = Math.abs(pct) < 1 ? `${(pct * 100).toFixed(2)}%` : `${pct.toFixed(2)}%`;
    } else {
      pct = '-';
    }
    return { current, previous, pct };
  }

  // Extract latest and previous values for top metrics
  const followersMetric = getLatestAndPrevious(metrics.followers, 'followers_count', 'followers_pct_change');
  const postsMetric = getLatestAndPrevious(metrics.posts, 'posts', 'posts_pct_change');
  const conversionsMetric = getLatestAndPrevious(metrics.conversions, 'conversions', 'conversions_pct_change');

  // Top metrics (Followers, Posts, Conversions)
  const topMetrics = [
    {
      title: 'Followers',
      icon: Users,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      currentValue: followersMetric.current,
      lastMonthValue: followersMetric.previous,
      growth: followersMetric.pct
    },
    {
      title: 'Posts',
      icon: Camera,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      currentValue: postsMetric.current,
      lastMonthValue: postsMetric.previous,
      growth: postsMetric.pct
    },
    {
      title: 'Conversions',
      icon: Zap,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      currentValue: conversionsMetric.current,
      lastMonthValue: conversionsMetric.previous,
      growth: conversionsMetric.pct
    }
  ];

  // if (loading) return <div className="p-6">Loading metrics...</div>;
  // if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Top Section - Main Metrics */}
      <div className="grid grid-cols-3 divide-x divide-gray-100">
        {topMetrics.map((metric, index) => {
          const Icon = metric.icon;
          
          return (
            <div key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${metric.iconBg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${metric.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{metric.title}</h3>
                </div>
                <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
              </div>
              
              {/* Metric Values */}
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900">
                  {metric.currentValue.toLocaleString()}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">
                    Last month: {metric.lastMonthValue.toLocaleString()}
                  </p>
                  <p className="text-sm font-medium text-green-600">
                    {metric.growth}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100"></div>

      {/* Bottom Section - Engagement Metrics Grid */}
      <div className="p-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Engagement metrics can be added here if needed */}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaMetricsCard;