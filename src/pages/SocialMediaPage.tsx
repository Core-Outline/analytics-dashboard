import React from 'react';
import SocialMediaMetricsCard from '../components/SocialMediaMetricsCard';
import TrendingKeywordsCard from '../components/TrendingKeywordsCard';
import ConversionsDistributionCard from '../components/ConversionsDistributionCard';

const SocialMediaPage: React.FC = () => {
  return (
    <div className="p-8">
      <SocialMediaMetricsCard />
      
      {/* Second Row - Trending Keywords and Conversions */}
      <div className="grid grid-cols-2 gap-6 mt-8">
        <TrendingKeywordsCard />
        <ConversionsDistributionCard />
      </div>
    </div>
  );
};

export default SocialMediaPage;