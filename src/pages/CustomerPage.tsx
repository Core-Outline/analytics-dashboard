import React from 'react';
import CustomerMetricsCard from '../components/CustomerMetricsCard';
import CustomerSegmentationCard from '../components/CustomerSegmentationCard';
import CustomerMetricCards from '../components/CustomerMetricCards';
import OrderLocationsCard from '../components/OrderLocationsCard';

const CustomerPage: React.FC = () => {
  return (
    <div className="p-8">
      <CustomerMetricsCard />
      
      {/* Customer Metric Cards */}
      <div className="mt-8">
        <CustomerMetricCards />
      </div>
      
      {/* Customer Segmentation */}
      <div className="mt-8">
        <CustomerSegmentationCard />
      </div>
      
      {/* Order Locations */}
      <div className="mt-8">
        <OrderLocationsCard />
      </div>
    </div>
  );
};

export default CustomerPage;