import React from 'react';
import { Users, DollarSign, TrendingUp, Activity, UserPlus, CreditCard, Calendar, Target } from 'lucide-react';
import TabbedMetricsCard from '../components/TabbedMetricsCard';
import ActiveUsersCard from '../components/ActiveUsersCard';
import UsersByDeviceCard from '../components/UsersByDeviceCard';
import ActiveUsersHeatmap from '../components/ActiveUsersHeatmap';
import UsersByCountryMap from '../components/UsersByCountryMap';

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
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Recent Subscriptions */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Users Online</h3>
          <div className="space-y-4">
            {[
              { name: 'Sarah Johnson', location: 'New York, US', status: 'Active', duration: '2h 15m' },
              { name: 'Michael Chen', location: 'Toronto, CA', status: 'Active', duration: '1h 42m' },
              { name: 'Emily Davis', location: 'London, UK', status: 'Idle', duration: '45m' },
              { name: 'David Wilson', location: 'Sydney, AU', status: 'Active', duration: '3h 8m' },
              { name: 'Lisa Anderson', location: 'Berlin, DE', status: 'Active', duration: '1h 23m' }
            ].map((user, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      user.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.location}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    user.status === 'Active' ? 'text-green-600' : 'text-yellow-600'
                  }`}>{user.status}</div>
                  <div className="text-xs text-gray-500">{user.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Renewals */}
        {/* Active Users Heatmap */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Active Users by Hour</h3>
          <ActiveUsersHeatmap />
        </div>
      </div>

      {/* Users by Country */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Users by Country</h3>
        <UsersByCountryMap />
      </div>
    </div>
  );
};

export default SaasPage;