import React from 'react';
import FeedbackMetricsCard from '../components/FeedbackMetricsCard';
import FeedbackTopicsCard from '../components/FeedbackTopicsCard';

const CustomerFeedbackPage: React.FC = () => {
  return (
    <div className="p-8">
      <div className="grid grid-cols-3 gap-6">
        {/* Feedback Metrics - spans 2 columns */}
        <div className="col-span-2">
          <FeedbackMetricsCard />
        </div>
        
        {/* Topics Card - spans 1 column */}
        <div className="col-span-1">
          <FeedbackTopicsCard />
        </div>
      </div>
    </div>
  );
};

export default CustomerFeedbackPage;