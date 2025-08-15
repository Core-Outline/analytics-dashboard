import React from 'react';
import { Users, Camera, Zap, MessageCircle, Heart, RotateCcw, Megaphone, MoreHorizontal } from 'lucide-react';
import { useParams } from 'react-router-dom';

const SocialMediaMetricsCard: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const { organization_id } = useParams();
  const [topMetrics, setTopMetrics] = React.useState([
    { title: 'Followers', icon: Users, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', currentValue: 0, lastMonthValue: 0, growth: '0%' },
    { title: 'Posts', icon: Camera, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', currentValue: 0, lastMonthValue: 0, growth: '0%' },
    { title: 'Conversions', icon: Zap, iconBg: 'bg-green-100', iconColor: 'text-green-600', currentValue: 0, lastMonthValue: 0, growth: '0%' },
  ]);

  const [engagementMetrics, setEngagementMetrics] = React.useState([
    { title: 'Comments', icon: MessageCircle, iconColor: 'text-blue-500', borderColor: 'border-blue-500', currentValue: 0, lastMonthValue: 0, growth: '0%' },
    { title: 'Likes', icon: Heart, iconColor: 'text-cyan-500', borderColor: 'border-cyan-500', currentValue: 0, lastMonthValue: 0, growth: '0%' },
    { title: 'Mentions', icon: Megaphone, iconColor: 'text-orange-500', borderColor: 'border-orange-500', currentValue: 0, lastMonthValue: 0, growth: '0%' },
  ]);

  React.useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(false);

      let dataSourceIds = await fetch(`http://localhost:4000/data-source?type=social_media,twitter,instagram,tiktok&organization_id=${organization_id}`)
      const dataSourceIdsData = await dataSourceIds.json();
      dataSourceIds = dataSourceIdsData.map((ds: any) => ds.DATA_SOURCE_ID);

      try {
        let followersRes;
        try {
          followersRes = await fetch(`http://localhost:5000/followers-trend?search_type=account&data_source_ids=${dataSourceIds}&company_id=${organization_id}&time_units=H`);
        } catch (err) {
          console.error(err);
          followersRes = {
            json() {
              return [];
            },
          };
        }

        let postsRes;
        try {
          postsRes = await fetch(`http://localhost:5000/post-trend?search_type=account&data_source_ids=${dataSourceIds}&company_id=${organization_id}&time_units=H`);
        } catch (err) {
          console.error(err);
          postsRes = {
            json() {
              return [];
            },
          };
        }

        let likesRes;
        try {
          likesRes = await fetch(`http://localhost:5000/likes-trend?search_type=account&data_source_ids=${dataSourceIds}&company_id=${organization_id}&time_units=H`);
        } catch (err) {
          console.error(err);
          likesRes = {
            json() {
              return [];
            },
          };
        }

        let conversionsRes;
        try {
          conversionsRes = await fetch(`http://localhost:5000/conversions-trend?company_id=${organization_id}&time_units=H`);
        } catch (err) {
          console.error(err);
          conversionsRes = {
            json() {
              return [];
            },
          };
        }

        let mentionsRes;
        try {
          mentionsRes = await fetch(`http://localhost:5000/mentions-trend?search_type=keywords&data_source_ids=${dataSourceIds}&company_id=${organization_id}&time_units=H&indices=tiktok,twitter`);
        } catch (err) {
          console.error(err);
          mentionsRes = {
            json() {
              return [];
            },
          };
        }

        let commentsRes;
        try {
          commentsRes = await fetch(`http://localhost:5000/comments-trend?search_type=all&data_source_ids=${dataSourceIds}&company_id=${organization_id}&time_units=H&indices=tiktok,twitter`);
        } catch (err) {
          console.error(err);
          commentsRes = {
            json() {
              return [];
            },
          };
        }

        const [followers, posts, likes, conversions, mentions, comments] = await Promise.all([
          followersRes.json(),
          postsRes.json(),
          likesRes.json(),
          conversionsRes.json(),
          mentionsRes.json(),
          commentsRes.json(),
        ]);

        // Utility to get latest and previous values
        const getLatestAndPrev = (arr: any[], key: string) => {
          if (!arr || arr.length === 0) return [0, 0];
          const sorted = [...arr].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          return [sorted[0][key] || 0, sorted[1]?.[key] || 0];
        };
        // Followers
        const [followersNow, followersPrev] = getLatestAndPrev(followers, 'followers_count');
        // Posts
        const [postsNow, postsPrev] = getLatestAndPrev(posts, 'posts');
        // Likes
        const [likesNow, likesPrev] = getLatestAndPrev(likes, 'likes_count');
        // Conversions
        const [conversionsNow, conversionsPrev] = getLatestAndPrev(conversions, 'conversions');
        // Mentions
        const [mentionsNow, mentionsPrev] = getLatestAndPrev(mentions, 'mentions');
        // Comments
        const [commentsNow, commentsPrev] = getLatestAndPrev(comments, 'comment_count');

        // Growth calculation
        const growth = (now, prev) => {
          if (prev === 0) return now === 0 ? '0%' : '+100%';
          const pct = ((now - prev) / Math.abs(prev)) * 100;
          return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
        };

        setTopMetrics([
          {
            title: 'Followers',
            icon: Users,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            currentValue: followersNow,
            lastMonthValue: followersPrev,
            growth: growth(followersNow, followersPrev)
          },
          {
            title: 'Posts',
            icon: Camera,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            currentValue: postsNow,
            lastMonthValue: postsPrev,
            growth: growth(postsNow, postsPrev)
          },
          {
            title: 'Conversions',
            icon: Zap,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            currentValue: conversionsNow,
            lastMonthValue: conversionsPrev,
            growth: growth(conversionsNow, conversionsPrev)
          },
        ]);
        setEngagementMetrics([
          {
            title: 'Comments',
            icon: MessageCircle,
            iconColor: 'text-blue-500',
            borderColor: 'border-blue-500',
            currentValue: commentsNow,
            lastMonthValue: commentsPrev,
            growth: growth(commentsNow, commentsPrev)
          },
          {
            title: 'Likes',
            icon: Heart,
            iconColor: 'text-cyan-500',
            borderColor: 'border-cyan-500',
            currentValue: likesNow,
            lastMonthValue: likesPrev,
            growth: growth(likesNow, likesPrev)
          },
          {
            title: 'Mentions',
            icon: Megaphone,
            iconColor: 'text-orange-500',
            borderColor: 'border-orange-500',
            currentValue: mentionsNow,
            lastMonthValue: mentionsPrev,
            growth: growth(mentionsNow, mentionsPrev)
          },
        ]);
        setLoading(false);
      } catch (e) {
        setError(true);
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);
      

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Top Section - Main Metrics */}
      <div className="grid grid-cols-3 divide-x divide-gray-100">
        {loading
          ? Array(3).fill(0).map((_, index) => (
              <div key={index} className="p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                    <div className="h-6 w-20 bg-gray-200 rounded" />
                  </div>
                  <div className="w-5 h-5 bg-gray-200 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-8 w-24 bg-gray-200 rounded" />
                  <div className="space-y-1">
                    <div className="h-4 w-28 bg-gray-200 rounded" />
                    <div className="h-4 w-14 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))
          : topMetrics.map((metric, index) => {
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
          {loading
            ? Array(3).fill(0).map((_, index) => (
                <div key={index} className="text-center animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
                  <div className="h-5 w-20 bg-gray-200 rounded mx-auto mb-2" />
                  <div className="h-8 w-24 bg-gray-200 rounded mx-auto mb-1" />
                  <div className="space-y-1">
                    <div className="h-4 w-28 bg-gray-200 rounded mx-auto" />
                    <div className="h-4 w-14 bg-gray-200 rounded mx-auto" />
                  </div>
                </div>
              ))
            : engagementMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div key={index} className="text-center">
                    <div className={`w-16 h-16 bg-white border-2 ${metric.borderColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-6 h-6 ${metric.iconColor}`} />
                    </div>
                    <h4 className="text-xl font-medium text-gray-700 mb-2">{metric.title}</h4>
                    {/* Current Value */}
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {metric.currentValue.toLocaleString()}
                    </div>
                    {/* Last Month Comparison */}
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">
                        Last month: {metric.lastMonthValue.toLocaleString()}
                      </p>
                      <p className="text-sm font-medium text-green-600">
                        {metric.growth}
                      </p>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaMetricsCard;