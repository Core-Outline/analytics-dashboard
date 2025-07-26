import React from 'react';
import { Users, DollarSign, TrendingUp, Activity, UserPlus, CreditCard, Calendar, Target } from 'lucide-react';
import TabbedMetricsCard from '../components/TabbedMetricsCard';
import ActiveUsersCard from '../components/ActiveUsersCard';
import UsersByDeviceCard from '../components/UsersByDeviceCard';

const SaasPage: React.FC = () => {
  return (
    <div className="p-8">
      {/* Tabbed Metrics Card */}
      <div className="mb-8">
        <TabbedMetricsCard />
      </div>

      {/* Active Users Card */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <ActiveUsersCard />
        <UsersByDeviceCard />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Subscriptions */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Recent Subscriptions</h3>
          <div className="space-y-4">
            {[
              { name: 'Sarah Johnson', plan: 'Pro Plan', date: '2 hours ago', amount: '$29' },
              { name: 'Michael Chen', plan: 'Basic Plan', date: '4 hours ago', amount: '$9' },
              { name: 'Emily Davis', plan: 'Enterprise', date: '6 hours ago', amount: '$99' },
              { name: 'David Wilson', plan: 'Pro Plan', date: '8 hours ago', amount: '$29' },
              { name: 'Lisa Anderson', plan: 'Basic Plan', date: '1 day ago', amount: '$9' }
            ].map((subscription, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {subscription.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{subscription.name}</div>
                    <div className="text-xs text-gray-500">{subscription.plan}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{subscription.amount}</div>
                  <div className="text-xs text-gray-500">{subscription.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Renewals */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Upcoming Renewals</h3>
          <div className="space-y-4">
            {[
              { name: 'TechCorp Inc.', plan: 'Enterprise', date: 'Tomorrow', amount: '$99' },
              { name: 'StartupXYZ', plan: 'Pro Plan', date: 'In 2 days', amount: '$29' },
              { name: 'Design Studio', plan: 'Pro Plan', date: 'In 3 days', amount: '$29' },
              { name: 'Marketing Agency', plan: 'Enterprise', date: 'In 5 days', amount: '$99' },
              { name: 'Freelancer Pro', plan: 'Basic Plan', date: 'In 1 week', amount: '$9' }
            ].map((renewal, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{renewal.name}</div>
                    <div className="text-xs text-gray-500">{renewal.plan}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{renewal.amount}</div>
                  <div className="text-xs text-gray-500">{renewal.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaasPage;