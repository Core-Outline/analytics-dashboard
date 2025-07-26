import React from 'react';
import CustomerMetricsCard from '../components/CustomerMetricsCard';
import CustomerSegmentationCard from '../components/CustomerSegmentationCard';

const CustomerPage: React.FC = () => {
  return (
    <div className="p-8">
      <CustomerMetricsCard />
      
      {/* Customer Segmentation */}
      <div className="mt-8">
        <CustomerSegmentationCard />
      </div>
    </div>
  );
};

export default CustomerPage;