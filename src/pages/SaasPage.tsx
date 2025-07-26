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

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Monthly Recurring Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">$45,230</div>
          <div className="text-gray-600 text-sm mb-2">Monthly Recurring Revenue</div>
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 font-normal">12.5%</span>
            <span className="text-gray-500">vs last month</span>
          </div>
        </div>

        {/* Active Subscribers */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">2,847</div>
          <div className="text-gray-600 text-sm mb-2">Active Subscribers</div>
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 font-normal">8.2%</span>
            <span className="text-gray-500">vs last month</span>
          </div>
        </div>

        {/* Churn Rate */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">3.2%</div>
          <div className="text-gray-600 text-sm mb-2">Churn Rate</div>
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="w-4 h-4 text-red-500" />
            <span className="text-red-500 font-normal">0.5%</span>
            <span className="text-gray-500">vs last month</span>
          </div>
        </div>

        {/* New Signups */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">324</div>
          <div className="text-gray-600 text-sm mb-2">New Signups</div>
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 font-normal">15.3%</span>
            <span className="text-gray-500">vs last month</span>
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Subscription Plans Performance</h3>
        <div className="grid grid-cols-3 gap-6">
          {/* Basic Plan */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Basic Plan</h4>
              <span className="text-2xl font-bold text-gray-900">$9</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subscribers</span>
                <span className="font-medium">1,245</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue</span>
                <span className="font-medium">$11,205</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Growth</span>
                <span className="text-green-600 font-medium">+5.2%</span>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="border border-blue-200 bg-blue-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Pro Plan</h4>
              <span className="text-2xl font-bold text-gray-900">$29</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subscribers</span>
                <span className="font-medium">1,089</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue</span>
                <span className="font-medium">$31,581</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Growth</span>
                <span className="text-green-600 font-medium">+12.8%</span>
              </div>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Enterprise</h4>
              <span className="text-2xl font-bold text-gray-900">$99</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subscribers</span>
                <span className="font-medium">513</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue</span>
                <span className="font-medium">$50,787</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Growth</span>
                <span className="text-green-600 font-medium">+18.4%</span>
              </div>
            </div>
          </div>
        </div>
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