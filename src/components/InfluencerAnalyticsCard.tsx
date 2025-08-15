import React from 'react';
import { useParams } from 'react-router-dom';
interface InfluencerAnalyticsCardProps {
  influencer: any;
  influencerId: string;
}

const Skeleton = ({ width = 'w-24', height = 'h-6', className = '' }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${width} ${height} ${className}`}></div>
);

const InfluencerAnalyticsCard: React.FC<InfluencerAnalyticsCardProps> = ({ influencer, influencerId }) => {
  const [brandMentions, setBrandMentions] = React.useState<number | null>(null);
  const [brandMentionsLoading, setBrandMentionsLoading] = React.useState(true);

  const [competitorMentions, setCompetitorMentions] = React.useState<number | null>(null);
  const [competitorMentionsLoading, setCompetitorMentionsLoading] = React.useState(true);

  const [categories, setCategories] = React.useState<any>(null);
  const [categoriesLoading, setCategoriesLoading] = React.useState(true);

  const [captionRelevance, setCaptionRelevance] = React.useState<any>(null);
  const [captionRelevanceLoading, setCaptionRelevanceLoading] = React.useState(true);

  const [mediaRelevance, setMediaRelevance] = React.useState<any>(null);
  const [mediaRelevanceLoading, setMediaRelevanceLoading] = React.useState(true);

  const [reachTrend, setReachTrend] = React.useState<any[]>([]);
  const [reachTrendLoading, setReachTrendLoading] = React.useState(true);

  const { organization_id } = useParams();

  React.useEffect(() => {
    if (!influencerId) return;
    // 1. Brand Mentions
    setBrandMentionsLoading(true);
    fetch(`http://localhost:5000/get-brand-mentions?search_type=influencer&influencers=${influencerId}&company_id=${organization_id}`)
      .then(res => res.json())
      .then(data => setBrandMentions(data.brand_mentions))
      .catch(() => setBrandMentions(null))
      .finally(() => setBrandMentionsLoading(false));

    // 2. Competitor Mentions
    setCompetitorMentionsLoading(true);
    fetch(`http://localhost:5000/get-competitor-mentions?search_type=influencer&influencers=${influencerId}&company_id=${organization_id}`)
      .then(res => res.json())
      .then(data => setCompetitorMentions(data.competitor_mentions))
      .catch(() => setCompetitorMentions(null))
      .finally(() => setCompetitorMentionsLoading(false));

    // 3. Post Categories
    setCategoriesLoading(true);
    fetch(`http://localhost:5000/get-post-categories?search_type=influencer&influencers=${influencerId}&company_id=${organization_id}`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories(null))
      .finally(() => setCategoriesLoading(false));

    // 4. Caption Relevance
    setCaptionRelevanceLoading(true);
    fetch(`http://localhost:5000/get-caption-relevance?search_type=influencer&influencers=${influencerId}&company_id=${organization_id}`)
      .then(res => res.json())
      .then(data => setCaptionRelevance(data))
      .catch(() => setCaptionRelevance(null))
      .finally(() => setCaptionRelevanceLoading(false));

    // 5. Media Relevance
    setMediaRelevanceLoading(true);
    fetch(`http://localhost:5000/get-media-relevance?search_type=influencer&influencers=${influencerId}&company_id=${organization_id}`)
      .then(res => res.json())
      .then(data => setMediaRelevance(data))
      .catch(() => setMediaRelevance(null))
      .finally(() => setMediaRelevanceLoading(false));

    // 6. Reach Trend
    setReachTrendLoading(true);
    fetch(`http://localhost:5000/get-reach-trend?search_type=influencer&influencers=${influencerId}&company_id=${organization_id}`)
      .then(res => res.json())
      .then(data => setReachTrend(Array.isArray(data) ? data : []))
      .catch(() => setReachTrend([]))
      .finally(() => setReachTrendLoading(false));
  }, [influencerId]);

  // Category formatting helper
  const getTopCategories = () => {
    if (!categories) return [];
    return Object.entries(categories)
      .filter(([k, v]) => typeof v === 'object' && v.count)
      .sort((a: any, b: any) => b[1].count - a[1].count)
      .slice(0, 3);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-medium text-gray-900 mb-8">Influencer Analytics</h3>
      <div className="grid grid-cols-3 gap-8">
        {/* Brand Mentions */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-blue-300 rounded-full"></div>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Brand Mentions</h4>
          {brandMentionsLoading ? (
            <Skeleton width="w-16" height="h-8" className="mx-auto mb-2" />
          ) : (
            <div className="text-2xl font-bold text-blue-600 mb-2">{brandMentions ?? '-'}</div>
          )}
          <p className="text-sm text-gray-600 mb-3">
            {brandMentionsLoading ? <Skeleton width="w-32" height="h-4" className="mx-auto" /> : `Mentioned your brand in ${brandMentions} posts`}
          </p>
        </div>

        {/* Competitor Mentions */}
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-red-300 rounded-full"></div>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Competitor Mentions</h4>
          {competitorMentionsLoading ? (
            <Skeleton width="w-16" height="h-8" className="mx-auto mb-2" />
          ) : (
            <div className="text-2xl font-bold text-red-600 mb-2">{competitorMentions ?? '-'}</div>
          )}
          <p className="text-sm text-gray-600 mb-3">
            {competitorMentionsLoading ? <Skeleton width="w-32" height="h-4" className="mx-auto" /> : `Mentioned competitors in ${competitorMentions} posts`}
          </p>
        </div>

        {/* Top Categories */}
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-green-300 rounded-full"></div>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Top Content Categories</h4>
          {categoriesLoading ? (
            <>
              <Skeleton width="w-32" height="h-4" className="mx-auto mb-1" />
              <Skeleton width="w-24" height="h-4" className="mx-auto mb-1" />
              <Skeleton width="w-20" height="h-4" className="mx-auto mb-1" />
            </>
          ) : (
            <div className="text-sm text-gray-600 space-y-1">
              {getTopCategories().map(([cat, v]: any, idx) => (
                <div key={cat} className="flex items-center justify-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                  <span>{Math.round(v.proportion * 100)}% {cat.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Caption/Media Relevance & Reach Trend */}
      <div className="grid grid-cols-2 gap-8 mt-12">
        {/* Caption Relevance */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-2">Caption Relevance</h4>
          {captionRelevanceLoading ? (
            <Skeleton width="w-full" height="h-8" />
          ) : captionRelevance ? (
            <>
              <div className="text-gray-800 mb-2">{captionRelevance.general_description}</div>
              <div className="text-xs text-gray-600 mb-2">{captionRelevance.general?.recommendation}</div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr>
                      <th className="text-left font-semibold">Keyword</th>
                      <th className="text-left font-semibold">Relevance %</th>
                      <th className="text-left font-semibold">Strength</th>
                      <th className="text-left font-semibold">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {captionRelevance.per_keyword && Object.entries(captionRelevance.per_keyword).map(([kw, v]: any) => (
                      <tr key={kw}>
                        <td className="pr-2">{kw.trim()}</td>
                        <td className="pr-2">{v.average_analysis?.relevance_percentage?.toFixed(1) ?? '-'}</td>
                        <td className="pr-2">{v.average_analysis?.strength ?? '-'}</td>
                        <td>{v.recommendation ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : <span className="text-gray-400">No data</span>}
        </div>

        {/* Media Relevance */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-2">Media Relevance</h4>
          {mediaRelevanceLoading ? (
            <Skeleton width="w-full" height="h-8" />
          ) : mediaRelevance ? (
            <>
              <div className="text-gray-800 mb-2">{mediaRelevance.general_description}</div>
              <div className="text-xs text-gray-600 mb-2">{mediaRelevance.general?.recommendation}</div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr>
                      <th className="text-left font-semibold">Keyword</th>
                      <th className="text-left font-semibold">Relevance %</th>
                      <th className="text-left font-semibold">Strength</th>
                      <th className="text-left font-semibold">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mediaRelevance.per_keyword && Object.entries(mediaRelevance.per_keyword).map(([kw, v]: any) => (
                      <tr key={kw}>
                        <td className="pr-2">{kw.trim()}</td>
                        <td className="pr-2">{v.average_analysis?.relevance_percentage?.toFixed(1) ?? '-'}</td>
                        <td className="pr-2">{v.average_analysis?.strength ?? '-'}</td>
                        <td>{v.recommendation ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : <span className="text-gray-400">No data</span>}
        </div>
      </div>

      {/* Reach Trend */}
      <div className="mt-12">
        <h4 className="text-lg font-medium text-gray-900 mb-2">Reach Trend</h4>
        {reachTrendLoading ? (
          <Skeleton width="w-full" height="h-8" />
        ) : reachTrend && reachTrend.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left font-semibold">Date</th>
                  <th className="text-left font-semibold">Views</th>
                  <th className="text-left font-semibold">Followers</th>
                </tr>
              </thead>
              <tbody>
                {reachTrend.map((row, idx) => (
                  <tr key={idx}>
                    <td className="pr-2">{row.time_bucket?.split('T')[0]}</td>
                    <td className="pr-2">{row.view_count ? Math.round(row.view_count).toLocaleString() : '-'}</td>
                    <td>{row.followers_count ? Math.round(row.followers_count).toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <span className="text-gray-400">No data</span>}
      </div>
    </div>
  );
};

export default InfluencerAnalyticsCard;