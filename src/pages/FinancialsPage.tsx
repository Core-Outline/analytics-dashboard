import React, { useState, useEffect } from 'react';
import { MoreHorizontal, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { 
  loadApiConfig, 
  loadUserData, 
  fetchRecurringRevenueData,
  fetchRevenueGrowthData,
  fetchRevenueGrowthRaw,
  fetchGrowthPeriodData,
  fetchAnnualRunRateData,
  fetchProductRevenueSharesData,
  fetchTopProductsSold,
  RecurringRevenueData,
  RevenueGrowthData,
  GrowthPeriodData,
  AnnualRunRateData,
  ProductRevenueSharesData,
  TopProductSold
} from '../helpers/financials';
import TotalSalesChart from '../components/OrdersAnalyticsChart';
import RevenueGrowthCard from '../components/RevenueGrowthCard';
import TopProductsChart from '../components/TopProductsChart';
import GrossRevenueCard from '../components/GrossRevenueCard';
import AdCampaignsCard from '../components/AdCampaignsCard';
import ProductRevenueSharesCard from '../components/ProductRevenueSharesCard';
import { useLocation} from 'react-router-dom';
const FinancialsPage: React.FC = () => {
  const [salesTimeUnit, setSalesTimeUnit] = useState('Monthly');
  const [recurringRevenueData, setRecurringRevenueData] = useState<RecurringRevenueData>({
    value: "_",
    growth: 0,
    percentage: "_",
    isLoading: true
  });
  const [revenueGrowthData, setRevenueGrowthData] = useState<RevenueGrowthData>({
    value: '_',
    growth: 0,
    percentage: '_',
    isLoading: true
  });
  const [revenueGrowthRaw, setRevenueGrowthRaw] = useState<{date: string[]; amount: number[]; growth: number[]}>({ date: [], amount: [], growth: [] });
  const [growthPeriodData, setGrowthPeriodData] = useState<GrowthPeriodData>({
    value: "_",
    isLoading: true
  });
  const [annualRunRateData, setAnnualRunRateData] = useState<AnnualRunRateData>({
    value: 0,
    growth: 0,
    isLoading: true
  });
  const searchParams = new URLSearchParams(location.search);
  const organization_id = searchParams.get('organization_id');
  const user_id = searchParams.get('user_id');

  const [timeUnits, setTimeUnits] = useState('M');
  const [company, setCompany] = useState(organization_id);
  const [apiConfig, setApiConfig] = useState({
    brevoApiKey: '',
    apiBaseUrl: 'https://api.coreoutline.com',
    dataBaseUrl: '/data'
  });
  const [productRevenueShares, setProductRevenueShares] = useState<ProductRevenueSharesData | null>(null);
  const [productRevenueSharesLoading, setProductRevenueSharesLoading] = useState(true);
  const [grossRevenueData, setGrossRevenueData] = useState<TopProductSold[]>([]);
  const [grossRevenueLoading, setGrossRevenueLoading] = useState(true);


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

  // Fetch revenue growth data
  const fetchRevenueGrowth = async (): Promise<void> => {
    if (!apiConfig.dataBaseUrl || !company) return;
    setRevenueGrowthData(prev => ({ ...prev, isLoading: true }));
    try {
      const [summary, raw] = await Promise.all([
        fetchRevenueGrowthData(apiConfig, timeUnits, company),
        fetchRevenueGrowthRaw(apiConfig, timeUnits, company)
      ]);
      setRevenueGrowthData(summary);
      setRevenueGrowthRaw(raw);
    } catch (error) {
      setRevenueGrowthData({ value: '_', growth: 0, percentage: '_', isLoading: false });
      setRevenueGrowthRaw({ date: [], amount: [], growth: [] });
      console.error('Error in fetchRevenueGrowth:', error);
    }
  };

  // Fetch growth period data
  const fetchGrowthPeriod = async (): Promise<void> => {
    if (!company) return;
    setGrowthPeriodData(prev => ({ ...prev, isLoading: true }));
    try {
      const data = await fetchGrowthPeriodData(timeUnits, company);
      setGrowthPeriodData(data);
    } catch (error) {
      setGrowthPeriodData({ value: 0, isLoading: false });
      console.error('Error in fetchGrowthPeriod:', error);
    }
  };

  // Fetch annual run rate data
  const fetchAnnualRunRate = async (): Promise<void> => {
    if (!apiConfig.dataBaseUrl || !company) return;

    setAnnualRunRateData(prev => ({ ...prev, isLoading: true }));

    try {
      const data = await fetchRecurringRevenueData(apiConfig, "A", company);
      setAnnualRunRateData(data);
    } catch (error) {
      console.error('Error in fetch aNNUAL RUN RATE:', error);
    }
  };

  // Fetch product revenue shares data
  const fetchProductRevenueShares = async (): Promise<void> => {
    if (!apiConfig.dataBaseUrl || !company) return;
    setProductRevenueSharesLoading(true);
    try {
      const data = await fetchProductRevenueSharesData(apiConfig, company);
      setProductRevenueShares(data);
    } catch (error) {
      setProductRevenueShares(null);
      console.error('Error in fetchProductRevenueShares:', error);
    } finally {
      setProductRevenueSharesLoading(false);
    }
  };

  // Fetch gross revenue data
  const fetchGrossRevenueData = async (): Promise<void> => {
    if (!apiConfig.dataBaseUrl || !company) return;
    setGrossRevenueLoading(true);
    try {
      const data = await fetchTopProductsSold(apiConfig, timeUnits, company);
      setGrossRevenueData(data);
    } catch (error) {
      setGrossRevenueData([]);
      console.error('Error in fetchGrossRevenueData:', error);
    } finally {
      setGrossRevenueLoading(false);
    }
  };

  // Fetch data when dependencies change
  useEffect(() => {
    if (apiConfig.dataBaseUrl && company) {
      fetchRecurringRevenue();
      fetchRevenueGrowth();
      fetchGrowthPeriod();
      fetchAnnualRunRate();
      fetchProductRevenueShares();
      fetchGrossRevenueData();
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
              recurringRevenueData.value[recurringRevenueData.value.length - 1]?.toLocaleString()
            )}
          </div>
          <div className="text-gray-600 text-sm mb-2">Recurring Revenue</div>
          <div className="flex items-center space-x-2 text-sm">
            {recurringRevenueData.growth[recurringRevenueData.growth.length - 1] >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
           
            <span className="text-green-500 font-normal">
              {recurringRevenueData.isLoading ? (
                <div className="animate-pulse bg-gray-200 h-4 w-8 rounded"></div>
              ) : (
                recurringRevenueData.growth[recurringRevenueData.growth.length - 1]?.toFixed(1) + '%'
              )}
            </span>
            {/* <span className="text-gray-500">
              {recurringRevenueData.isLoading ? (
                <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
              ) : (
                `${recurringRevenueData.percentage} this week`
              )}
            </span> */}
          </div>
        </div>

        {/* Revenue Growth */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">

              <TrendingUp className="w-5 h-5 text-pink-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {revenueGrowthData.isLoading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : (
              revenueGrowthData.value[revenueGrowthData.value.length - 1]?.toLocaleString()
            )}
          </div>
          <div className="text-gray-600 text-sm mb-2">Revenue Growth</div>
          <div className="flex items-center space-x-2 text-sm">
            {revenueGrowthData.growth[revenueGrowthData.growth.length - 1] >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`font-normal ${revenueGrowthData.growth[revenueGrowthData.growth.length - 1] >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {revenueGrowthData.isLoading ? (
                <div className="animate-pulse bg-gray-200 h-4 w-8 rounded"></div>
              ) : (
                revenueGrowthData.growth[revenueGrowthData.growth.length - 1]?.toFixed(1) + '%'
              )}
            </span>
            {/* <span className="text-gray-500">
              {revenueGrowthData.isLoading ? (
                <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
              ) : (
                `${revenueGrowthData.percentage} this week`
              )}
            </span> */}
          </div>
        </div>

        {/* Growth Period */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {growthPeriodData.isLoading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : (
              growthPeriodData.value
            )}
          </div>
          <div className="text-gray-600 text-sm mb-2">Growth Period</div>
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            {/* Placeholder for growth/percentage if needed */}
            <span className="text-green-500 font-normal"></span>
            <span className="text-gray-500"></span>
          </div>
        </div>

        {/* Annual Run Rate */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {annualRunRateData.isLoading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : (
              annualRunRateData.value[annualRunRateData.value.length - 1]?.toLocaleString()           )}
          </div>
          <div className="text-gray-600 text-sm mb-2">Annual Run Rate</div>
          <div className="flex items-center space-x-2 text-sm">
            {annualRunRateData.growth[annualRunRateData.growth.length - 1] >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`font-normal ${annualRunRateData.growth[annualRunRateData.growth.length - 1] >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {annualRunRateData.isLoading ? (
                <div className="animate-pulse bg-gray-200 h-4 w-8 rounded"></div>
              ) : (
                (annualRunRateData.growth[annualRunRateData.growth.length - 1] * 100)?.toFixed(1) + '%'
              )}
            </span>
            <span className="text-gray-500"></span>
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
              {/* <div className="flex items-center space-x-2">
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
              </div> */}
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
          {/* Show skeleton while loading, else show chart */}
          {/* You may want to add a loading state for TotalSalesChart if not already present */}
          <TotalSalesChart timeUnit={salesTimeUnit} />
        </div>

        {/* Revenue Growth Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Revenue Growth</h3>
            <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
          </div>
          {revenueGrowthData.isLoading ? (
            <div className="animate-pulse flex flex-col gap-4">
              <div className="h-8 w-full bg-gray-200 rounded" />
              <div className="h-8 w-full bg-gray-200 rounded" />
              <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto" />
            </div>
          ) : (
            <RevenueGrowthCard
              value={revenueGrowthData.value}
              growth={revenueGrowthData.growth}
              percentage={revenueGrowthData.percentage}
              isLoading={revenueGrowthData.isLoading}
              dateList={revenueGrowthRaw.date}
              amountList={revenueGrowthRaw.amount}
              growthList={revenueGrowthRaw.growth}
            />
          )}
        </div>
      </div>

      {/* Product Revenue Shares */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <ProductRevenueSharesCard data={productRevenueShares} loading={productRevenueSharesLoading} />
      </div>

      {/* Gross Revenue */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Gross Revenue</h3>
        </div>
        <GrossRevenueCard data={grossRevenueData} loading={grossRevenueLoading} />
      </div>

      {/* Top Products Sold */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Top Products Sold</h3>
        </div>
        <TopProductsChart data={grossRevenueData} loading={grossRevenueLoading} />
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