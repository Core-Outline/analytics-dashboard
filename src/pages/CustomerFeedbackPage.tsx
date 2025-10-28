import React from 'react';
import FeedbackMetricsCard from '../components/FeedbackMetricsCard';
import FeedbackTopicsCard from '../components/FeedbackTopicsCard';
import UserSentimentsCard from '../components/UserSentimentsCard';
import CustomerSatisfactionCard from '../components/CustomerSatisfactionCard';
import IssuesListCard from '../components/IssuesListCard';
import UnsolvedTicketsCard from '../components/UnsolvedTicketsCard';

const CustomerFeedbackPage: React.FC = () => {
  return (
    <div className="bg-gray-50" style={{ marginTop:"2vw", marginLeft:"4vw", borderTopLeftRadius: '2rem', width: "95vw", paddingTop: "8vh", padding: "2rem" }}>
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

      {/* Second Row - Sentiment Analysis Cards */}
      <div className="grid grid-cols-3 gap-6 mt-8">
        {/* User Sentiments - spans 2 columns */}
        <div className="col-span-2">
          <UserSentimentsCard />
        </div>
        
        {/* Customer Satisfaction - spans 1 column */}
        <div className="col-span-1">
          <CustomerSatisfactionCard />
        </div>
      </div>

      {/* Third Row - Issues and Tickets */}
      <div className="grid grid-cols-3 gap-6 mt-8">
        {/* Issues List - spans 1 column */}
        <div className="col-span-1">
          <IssuesListCard />
        </div>
        
        {/* Unsolved Tickets - spans 2 columns */}
        <div className="col-span-2">
          <UnsolvedTicketsCard />
        </div>
      </div>
    </div>
  );
};

export default CustomerFeedbackPage;