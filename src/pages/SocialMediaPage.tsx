import React from 'react';
import SocialMediaMetricsCard from '../components/SocialMediaMetricsCard';
import TrendingKeywordsCard from '../components/TrendingKeywordsCard';

const SocialMediaPage: React.FC = () => {
  return (
    <div className="p-8">
      <SocialMediaMetricsCard />
      
      {/* Trending Keywords */}
      <div className="mt-8">
        <TrendingKeywordsCard />
      </div>
    </div>
  );
};

export default SocialMediaPage;