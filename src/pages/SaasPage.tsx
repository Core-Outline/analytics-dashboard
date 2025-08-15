import React, { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, Activity, UserPlus, CreditCard, Calendar, Target } from 'lucide-react';
import TabbedMetricsCard from '../components/TabbedMetricsCard';
import ActiveUsersCard from '../components/ActiveUsersCard';
import UsersByDeviceCard from '../components/UsersByDeviceCard';
import ActiveUsersHeatmap from '../components/ActiveUsersHeatmap';
import UsersByCountryMap from '../components/UsersByCountryMap';
import { ChevronDown } from 'lucide-react';
import { useParams } from 'react-router-dom';


interface DataSource {
  ACCESS_TOKEN: string | null;
  ACCOUNT_ID: string | null;
  API_KEY: string | null;
  API_SECRET_KEY: string | null;
  APP_ID: string | null;
  APP_SECRET: string | null;
  BEARER_TOKEN: string | null;
  CLUSTER: string | null;
  DATABASE: string | null;
  DATA_SOURCE_ID: string;
  DATA_SOURCE_SECRET: string | null;
  NAME: string;
  ORGANIZATION_ID: string;
  PASSWORD: string;
  PORT: string | null;
  S3_PATH: string | null;
  SAAS_ID: string;
  SCHEMA: string | null;
  TYPE: string;
  URL: string;
  USERNAME: string;
}

const SaasPage: React.FC = () => {
  const { organization_id } = useParams<{ organization_id: string }>();
  const USERS_API_URL = `http://localhost:5000/active-users?company=${organization_id}`;

  // Users Online state
  const [usersOnline, setUsersOnline] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersFirstLoad, setUsersFirstLoad] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null);
  const [selectedOption, setSelectedOption] = useState('Last 30 days'); // Default selected option
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataSources = async () => {
      console.log("This is the org id for DS>>>>>>>>>>>>", organization_id)
      try {
        const response = await fetch(
          `http://localhost:4000/data-source?type=saas&organization_id=${organization_id}`
        );
        const data = await response.json();
        setDataSources(data);
        if (data.length > 0) {
          setSelectedDataSource(data[0]); // Select first data source by default
        }
      } catch (error) {
        console.error('Error fetching data sources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataSources();
  }, [organization_id]);


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

  const timeRanges = [
    'Last 7 days',
    'Last 30 days',
    'Last 90 days',
    'This year',
    'Custom range...'
  ];
  return (
    <div className="p-8">
       <div className="flex justify-end mb-6">
        <div className="relative inline-block text-left">
          <button
            type="button"
            className="inline-flex items-center justify-between w-64 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={loading}
          >
            {loading ? 'Loading...' : selectedDataSource?.NAME || 'Select Data Source'}
            <ChevronDown className="w-4 h-4 ml-2 -mr-1" />
          </button>

          {isDropdownOpen && !loading && (
            <div className="absolute right-0 z-10 w-64 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu" aria-orientation="vertical">
                {dataSources.map((source) => (
                  <button
                    key={source.DATA_SOURCE_ID}
                    className={`block w-full px-4 py-2 text-sm text-left ${
                      selectedDataSource?.DATA_SOURCE_ID === source.DATA_SOURCE_ID
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setSelectedDataSource(source);
                      setIsDropdownOpen(false);
                      // You can add any additional logic when a data source is selected
                    }}
                    role="menuitem"
                  >
                    {source.NAME}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabbed Metrics Card */}
      <div className="mb-8">
        <TabbedMetricsCard data_source_id={selectedDataSource?.DATA_SOURCE_ID}/>
      </div>

      {/* Active Users Card */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <ActiveUsersCard data_source_id={selectedDataSource?.DATA_SOURCE_ID}/>
        <UsersByDeviceCard data_source_id={selectedDataSource?.DATA_SOURCE_ID}/>
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
          <ActiveUsersHeatmap data_source_id={selectedDataSource?.DATA_SOURCE_ID}/>
        </div>
      </div>

      {/* Users by Country */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Users by Country</h3>
        <UsersByCountryMap data_source_id={selectedDataSource?.DATA_SOURCE_ID}/>
      </div>
    </div>
  );
};

export default SaasPage;