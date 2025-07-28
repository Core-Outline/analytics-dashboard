import React, { useState, useEffect } from 'react';
import { MoreHorizontal, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { 
  loadApiConfig, 
  loadUserData, 
  fetchRecurringRevenueData,
  RecurringRevenueData,
  ApiConfig
} from '../helpers/financials';
import TotalSalesChart from '../components/OrdersAnalyticsChart';
import RevenueGrowthCard from '../components/RevenueGrowthCard';
import TopProductsChart from '../components/TopProductsChart';
import GrossRevenueCard from '../components/GrossRevenueCard';
import AdCampaignsCard from '../components/AdCampaignsCard';
import ProductRevenueSharesCard from '../components/ProductRevenueSharesCard';

const FinancialsPage: React.FC = () => {
  const [salesTimeUnit, setSalesTimeUnit] = useState('Monthly');
  const [recurringRevenueData, setRecurringRevenueData] = useState<RecurringRevenueData>({
    value: "_",
    growth: 0,
    percentage: "_",
    isLoading: true
  });
  const [timeUnits, setTimeUnits] = useState('M');
  const [company, setCompany] = useState('301');
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    brevoApiKey: '',
    apiBaseUrl: '',
    dataBaseUrl: ''
  });

  // Load configuration and localStorage data
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load API configuration
        const config = await loadApiConfig();
        setApiConfig(config);

        // Load user data from localStorage
        const userData = loadUserData();
        setCompany(userData.company);
        setTimeUnits(userData.timeUnits);
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    initializeData();
  }, []);

  // Fetch recurring revenue data
  const fetchRecurringRevenue = async (): Promise<void> => {
    if (!apiConfig.dataBaseUrl || !company) return;

    setRecurringRevenueData(prev => ({ ...prev, isLoading: true }));

    try {
      const data = await fetchRecurringRevenueData(apiConfig, timeUnits, company);
      setRecurringRevenueData(data);
    } catch (error) {
      console.error('Error in fetchRecurringRevenue:', error);
    }
  };

  // Fetch data when dependencies change
  useEffect(() => {
    if (apiConfig.dataBaseUrl && company) {
      fetchRecurringRevenue();
    }
  }, [apiConfig.dataBaseUrl, timeUnits, company]);

  return (
    <div className="p-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Recurring Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {recurringRevenueData.isLoading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : (
              recurringRevenueData.value.toLocaleString()
            )}
          </div>
          <div className="text-gray-600 text-sm mb-2">Recurring Revenue</div>
          <div className="flex items-center space-x-2 text-sm">
            {recurringRevenueData.growth >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className="text-green-500 font-normal">
              {recurringRevenueData.isLoading ? (
                <div className="animate-pulse bg-gray-200 h-4 w-8 rounded"></div>
              ) : (
                recurringRevenueData.growth.toFixed(1) + '%'
              )}
            </span>
            <span className="text-gray-500">
              {recurringRevenueData.isLoading ? (
                <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
              ) : (
                `${recurringRevenueData.percentage} this week`
              )}
            </span>
          </div>
        </div>

        {/* Revenue Growth */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-pink-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">23,283.5</div>
          <div className="text-gray-600 text-sm mb-2">Revenue Growth</div>
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 font-normal">3.1</span>
            <span className="text-gray-500">+0.49% this week</span>
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">12.5%</div>
          <div className="text-gray-600 text-sm mb-2">Growth Period</div>
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 font-normal">1.8</span>
            <span className="text-gray-500">+0.32% this week</span>
          </div>
        </div>

        {/* Annual Run Rate */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">124,854</div>
          <div className="text-gray-600 text-sm mb-2">Annual Run Rate</div>
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 font-normal">7.2</span>
            <span className="text-gray-500">+1.51% this week</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Total Sales */}
        <div className="col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Total Sales</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  {salesTimeUnit === 'Monthly' ? '2023' : 
                   salesTimeUnit === 'Yearly' ? '2023' :
                   salesTimeUnit === 'Quarterly' ? '2023' :
                   salesTimeUnit === 'Weekly' ? 'Last Month' : 'Last Week'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  {salesTimeUnit === 'Monthly' ? '2024' : 
                   salesTimeUnit === 'Yearly' ? '2024' :
                   salesTimeUnit === 'Quarterly' ? '2024' :
                   salesTimeUnit === 'Weekly' ? 'This Month' : 'This Week'}
                </span>
              </div>
              <select 
                className="text-sm text-gray-600 border border-gray-200 rounded px-2 py-1"
                value={salesTimeUnit}
                onChange={(e) => setSalesTimeUnit(e.target.value)}
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Weekly">Weekly</option>
                <option value="Daily">Daily</option>
              </select>
            </div>
          </div>
          <TotalSalesChart timeUnit={salesTimeUnit} />
        </div>

        {/* Revenue Growth Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Revenue Growth</h3>
            <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
          </div>
          <RevenueGrowthCard />
        </div>
      </div>

      {/* Product Revenue Shares */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <ProductRevenueSharesCard />
      </div>

      {/* Gross Revenue */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Gross Revenue</h3>
        </div>
        <GrossRevenueCard />
      </div>

      {/* Top Products Sold */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Top Products Sold</h3>
        </div>
        <TopProductsChart />
      </div>

      {/* Ad Campaigns Performance */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Ad Campaigns Performance</h3>
        </div>
        <AdCampaignsCard />
      </div>
    </div>
  );
};

export default FinancialsPage;