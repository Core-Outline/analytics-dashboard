import React from 'react';
import CustomerMetricsCard from '../components/CustomerMetricsCard';
import CustomerSegmentationCard from '../components/CustomerSegmentationCard';
import CustomerMetricCards from '../components/CustomerMetricCards';
import OrderLocationsCard from '../components/OrderLocationsCard';

const CustomerPage: React.FC = () => {
  return (
    <div className="bg-gray-50" style={{ marginTop:"2vw", marginLeft:"4vw", borderTopLeftRadius: '2rem', width: "95vw", paddingTop: "8vh", padding: "2rem" }}>
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