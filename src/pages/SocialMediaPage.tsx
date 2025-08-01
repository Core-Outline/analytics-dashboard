import React from 'react';
import SocialMediaMetricsCard from '../components/SocialMediaMetricsCard';
import TrendingKeywordsCard from '../components/TrendingKeywordsCard';
import ConversionsDistributionCard from '../components/ConversionsDistributionCard';
import SentimentAnalysisCard from '../components/SentimentAnalysisCard';
import InfluencersCard from '../components/InfluencersCard';

/*
Reference: API calls and functions from social-media.html
- getFollowersTrend(dataSource)
- getMentionsTrend(dataSource)
- getLikesTrend(dataSource)
- getPostsTrend(dataSource)
- getConversionsTrend(dataSource)
- getCommentsTrend(dataSource)
- getKeywords(dataSource)
- getConversionsSplits(dataSource)
- getSentimentSplits(dataSource)
- getAccountInfluencers()
- getDataSources()
These are used for metrics, trending keywords, conversions, sentiment, influencers, and data source selection.
You can use these as reference for wiring up API calls in React components.
*/

const SocialMediaPage: React.FC = () => {
  const handleInfluencerSelect = (influencer: any) => {
    console.log('Selected influencer:', influencer);
  };

  return (
    <div className="p-8">
      <SocialMediaMetricsCard />
      
      {/* Trending Keywords - Full Width */}
      <div className="mt-8">
        <TrendingKeywordsCard />
      </div>
      
      {/* Conversions Distribution - Full Width */}
      <div className="mt-8">
        <ConversionsDistributionCard />
      </div>

      <div className="mt-8">
        <SentimentAnalysisCard />
      </div>

      <div className="mt-8">
        <InfluencersCard onInfluencerSelect={handleInfluencerSelect} />
      </div>
    </div>
  );
};

export default SocialMediaPage;