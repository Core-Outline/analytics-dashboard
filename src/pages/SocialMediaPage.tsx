import React from 'react';
import SocialMediaMetricsCard from '../components/SocialMediaMetricsCard';
import TrendingKeywordsCard from '../components/TrendingKeywordsCard';
import ConversionsDistributionCard from '../components/ConversionsDistributionCard';
import SentimentAnalysisCard from '../components/SentimentAnalysisCard';
import InfluencersCard from '../components/InfluencersCard';

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