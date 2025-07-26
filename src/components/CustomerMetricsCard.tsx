import React from 'react';
import { Users, MapPin, CreditCard, MoreHorizontal } from 'lucide-react';

const CustomerMetricsCard: React.FC = () => {
  const metrics = [
    {
      title: 'Users',
      icon: Users,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      label: 'users',
      target: 5000
    },
    {
      title: 'Location data',
      icon: MapPin,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      label: 'countries',
      target: 40
    },
    {
      title: 'Transaction data',
      icon: CreditCard,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      label: 'transactions',
      target: 5000
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-3 divide-x divide-gray-200">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          
          return (
            <div key={index} className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${metric.iconBg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${metric.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{metric.title}</h3>
                </div>
                <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div className="text-sm text-gray-600">{metric.label}</div>
                <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  Target: {metric.target.toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerMetricsCard;