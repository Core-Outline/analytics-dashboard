import React, { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, Activity, UserPlus, CreditCard, Calendar, Target } from 'lucide-react';
import TabbedMetricsCard from '../components/TabbedMetricsCard';
import ActiveUsersCard from '../components/ActiveUsersCard';
import UsersByDeviceCard from '../components/UsersByDeviceCard';
import ActiveUsersHeatmap from '../components/ActiveUsersHeatmap';
import UsersByCountryMap from '../components/UsersByCountryMap';

const USERS_API_URL = 'http://localhost:5000/active-users?company=101';

const SaasPage: React.FC = () => {
  // Users Online state
  const [usersOnline, setUsersOnline] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersFirstLoad, setUsersFirstLoad] = useState(true);

  // Fetch users online
  useEffect(() => {
    const fetchUsers = () => {
      fetch(USERS_API_URL)
        .then(res => res.json())
        .then(data => {
          setUsersOnline(data);
        })
        .catch(() => setUsersOnline([]))
        .finally(() => {
          setUsersLoading(false);
          setUsersFirstLoad(false);
        });
    };
    setUsersLoading(true);
    fetchUsers();
    const interval = setInterval(fetchUsers, 60000);
    return () => clearInterval(interval);
  }, []);

  // Helper to format session duration
  function getDuration(start: string) {
    if (!start) return '';
    const startDate = new Date(start.replace(/\s+/, 'T'));
    const now = new Date();
    let diff = Math.floor((now.getTime() - startDate.getTime()) / 1000); // seconds
    if (diff < 60) return `${diff}s`;
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    if (m < 60) return `${m}m${s > 0 ? ` ${s}s` : ''}`;
    const h = Math.floor(m / 60);
    const min = m % 60;
    return `${h}h${min > 0 ? ` ${min}m` : ''}`;
  }

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
        {/* Users Online (dynamic) */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Users Online</h3>
          <div className="space-y-4">
            {usersFirstLoad && usersLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2 animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center" />
                    </div>
                    <div>
                      <div className="h-4 w-24 bg-gray-100 rounded mb-1" />
                      <div className="h-3 w-16 bg-gray-100 rounded" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 w-12 bg-gray-100 rounded mb-1" />
                    <div className="h-3 w-10 bg-gray-100 rounded" />
                  </div>
                </div>
              ))
            ) : usersOnline.length === 0 ? (
              <div className="text-gray-500 text-sm">No users online.</div>
            ) : usersOnline.slice(0, 8).map((user, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {user.name ? user.name.split(' ').map((n: string) => n[0]).join('') : '?'}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white bg-green-500"></div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-500">{user.city && user.country ? `${user.city}, ${user.country}` : user.country || user.city || ''}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">Active</div>
                  <div className="text-xs text-gray-500">{getDuration(user.start_date)}</div>
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