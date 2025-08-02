import React, { useEffect, useState } from 'react';
import { Users, MapPin, CreditCard, MoreHorizontal } from 'lucide-react';
import { count } from 'echarts/types/src/component/dataZoom/history.js';

function abbreviateNumber(value: number): string {
  if (value >= 1e9) return (value / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  if (value >= 1e6) return (value / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (value >= 1e3) return (value / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return value.toString();
}

const CustomerMetricsCard: React.FC = () => {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(false);

  useEffect(() => {
    setUserLoading(true);
    fetch('http://localhost:5000/unique-users?company=101')
      .then(res => res.json())
      .then(data => {
        console.log('User data:', data);
        setUserCount(data.users);
        setUserLoading(false);
      })
      .catch((e) => {
        console.error('Error fetching user data:', e);
        setUserError(true);
        setUserLoading(false);
      });
  }, []);

  const metrics = [
    {
      title: 'Users',
      icon: Users,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      label: 'users',
      count: userCount,
      target: null,
      loading: userLoading,
      error: userError
    },
    {
      title: 'Location data',
      icon: MapPin,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      label: 'countries',
      count: 0,
      target: null
    },
    {
      title: 'Transaction data',
      icon: CreditCard,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      label: 'transactions',
      count: 0,
      target: null
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-3 divide-x divide-gray-100">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${metric.iconBg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${metric.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{metric.title}</h3>
                </div>
                <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
              </div>

              {/* Content */}
              <div className="space-y-3">
                {
                  metric.loading ? (
                    <div className="animate-pulse bg-gray-200 h-6 w-3/4 rounded"></div>
                  ) : metric.error ? (
                    <div className="text-red-600">Error loading data</div>
                  ) : (
                    <div className="text-2xl font-bold text-gray-900">{abbreviateNumber(metric.count)}</div>
                  )
                }
                {/* <div className="text-sm text-gray-600">{abbreviateNumber(metric.count)} {metric.label}</div> */}
                {index === 0 ? (
                  metric.loading ? (
                    <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium animate-pulse">Loading...</div>
                  ) : metric.error ? (
                    <div className="inline-block bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-medium">Error</div>
                  ) : (
                    <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      {metric.target !== null && metric.target !== undefined ? `Target: ${abbreviateNumber(metric.target)}` : '—'}
                    </div>
                  )
                ) : (
                  <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    Target: {metric.count.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerMetricsCard;