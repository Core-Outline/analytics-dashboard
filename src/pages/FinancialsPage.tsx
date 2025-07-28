import React, { useState, useEffect } from 'react';
import { MoreHorizontal, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import TotalSalesChart from '../components/OrdersAnalyticsChart';
import RevenueGrowthCard from '../components/RevenueGrowthCard';
import TopProductsChart from '../components/TopProductsChart';
import GrossRevenueCard from '../components/GrossRevenueCard';
import AdCampaignsCard from '../components/AdCampaignsCard';
import ProductRevenueSharesCard from '../components/ProductRevenueSharesCard';

const FinancialsPage: React.FC = () => {
  const [salesTimeUnit, setSalesTimeUnit] = useState('Monthly');
  const [recurringRevenueData, setRecurringRevenueData] = useState({
    value: 89935,
    growth: 10.2,
    percentage: '+1.01%',
    isLoading: true
  });
  const [timeUnits, setTimeUnits] = useState('M');
  const [company, setCompany] = useState('301');
  const [apiConfig, setApiConfig] = useState({
    brevoApiKey: '',
    apiBaseUrl: '',
    dataBaseUrl: ''
  });

  // Load configuration and localStorage data
  useEffect(() => {
    // Fetch configuration
    fetch('/config.json')
      .then(response => response.json())
      .then(data => {
        console.log("Default page details", data);
        setApiConfig({
          brevoApiKey: data.brevoApiKey,
          apiBaseUrl: data.api_base_url,
          dataBaseUrl: data.data_base_url
        });
      })
      .catch(error => console.error('Error fetching config:', error));

    // Load from localStorage
    try {
      const userToken = JSON.parse(localStorage.getItem('userToken') || '{}');
      console.log("userToken ", userToken);
      
      if (userToken.ORGANIZATION_ID) {
        setCompany(userToken.ORGANIZATION_ID.toString());
        console.log("company ", userToken.ORGANIZATION_ID);
      }
      
      console.log("user ", localStorage.getItem('userToken'));
    } catch (error) {
      console.error('Error parsing userToken from localStorage:', error);
    }
  }, []);

  // Fetch recurring revenue data
  const fetchRecurringRevenue = async () => {
    if (!apiConfig.dataBaseUrl || !company) return;

    setRecurringRevenueData(prev => ({ ...prev, isLoading: true }));

    // Fallback data in case API fails
    const fallbackData = {
      "date": [
        "2020-01-31T00:00:00",
        "2020-02-29T00:00:00",
        "2020-03-31T00:00:00",
        "2020-04-30T00:00:00",
        "2020-05-31T00:00:00",
        "2020-06-30T00:00:00",
        "2020-07-31T00:00:00",
        "2020-08-31T00:00:00",
        "2020-09-30T00:00:00",
        "2020-10-31T00:00:00",
        "2020-11-30T00:00:00",
        "2020-12-31T00:00:00",
        "2021-01-31T00:00:00",
        "2021-02-28T00:00:00",
        "2021-03-31T00:00:00",
        "2021-04-30T00:00:00",
        "2021-05-31T00:00:00",
        "2021-06-30T00:00:00",
        "2021-07-31T00:00:00",
        "2021-08-31T00:00:00",
        "2021-09-30T00:00:00",
        "2021-10-31T00:00:00",
        "2021-11-30T00:00:00",
        "2021-12-31T00:00:00",
        "2022-01-31T00:00:00",
        "2022-02-28T00:00:00",
        "2022-03-31T00:00:00",
        "2022-04-30T00:00:00",
        "2022-05-31T00:00:00",
        "2022-06-30T00:00:00",
        "2022-07-31T00:00:00",
        "2022-08-31T00:00:00",
        "2022-09-30T00:00:00",
        "2022-10-31T00:00:00",
        "2022-11-30T00:00:00",
        "2022-12-31T00:00:00",
        "2023-01-31T00:00:00",
        "2023-02-28T00:00:00",
        "2023-03-31T00:00:00",
        "2023-04-30T00:00:00",
        "2023-05-31T00:00:00",
        "2023-06-30T00:00:00",
        "2023-07-31T00:00:00",
        "2023-08-31T00:00:00",
        "2023-09-30T00:00:00",
        "2023-10-31T00:00:00",
        "2023-11-30T00:00:00",
        "2023-12-31T00:00:00",
        "2024-01-31T00:00:00",
        "2024-02-29T00:00:00",
        "2024-03-31T00:00:00"
      ],
      "amount": [
        10545661,
        9154978,
        10530595,
        10291536,
        9803401,
        9856902,
        9617743,
        10298001,
        10398835,
        10727015,
        9905078,
        9561566,
        9732927,
        8479556,
        10244877,
        9207403,
        9562019,
        9134435,
        10127573,
        10308071,
        9392138,
        10451256,
        8418298,
        11113354,
        9112977,
        8885818,
        9829745,
        9400203,
        10157218,
        9224387,
        10929334,
        9894772,
        8243563,
        10315483,
        8894553,
        10869669,
        10755027,
        8688970,
        9629101,
        10544496,
        11314421,
        9803333,
        10046860,
        9956408,
        9360382,
        10327446,
        10088666,
        11061717,
        9719569,
        9734582,
        10274403
      ],
      "growth": [
        0.0,
        -0.13187253032313484,
        0.1502589083228818,
        -0.022701376322990297,
        -0.04743072365485579,
        0.005457391776588549,
        -0.02426310010995336,
        0.07072948403799106,
        0.009791609070537,
        0.031559304479780614,
        -0.07662308666483642,
        -0.03468039322860461,
        0.017921855060143876,
        -0.12877636912308088,
        0.20818554650738785,
        -0.1012675896450489,
        0.038514225998362406,
        -0.04471691595676608,
        0.10872462281465678,
        0.017822433864460807,
        -0.08885590718185776,
        0.11276644359356736,
        -0.19451805601164107,
        0.3201426226536528,
        -0.1799975956853349,
        -0.024926980502639307,
        0.10622848678647245,
        -0.043698183421848724,
        0.08053177149472202,
        -0.09183922211770978,
        0.18483038493506387,
        -0.0946591988130292,
        -0.1668769123735241,
        0.25133792269192345,
        -0.13774730664574797,
        0.22205905119683922,
        -0.010546963297594414,
        -0.19210151680697785,
        0.10819820991440876,
        0.09506546872859678,
        0.073016766282618,
        -0.13355416065921533,
        0.024841245319321414,
        -0.009003011886300816,
        -0.05986355721862746,
        0.10331458694741302,
        -0.023120914890283673,
        0.09644991716446949,
        -0.12133270088178894,
        0.0015446158157836898,
        0.055453947586039165
      ]
    };

    // Helper function to format numbers
    const formatAmount = (amount: number) => {
      if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + 'M';
      } else if (amount >= 1000) {
        return (amount / 1000).toFixed(0) + 'k';
      }
      return amount.toLocaleString();
    };

    const formatGrowth = (growth: number) => {
      return (growth >= 0 ? '+' : '') + (growth * 100).toFixed(1) + '%';
    };

    try {
      const url = `${apiConfig.dataBaseUrl}/recurring-revenue?time_units=${timeUnits}&company=${company}`;
      console.log('Fetching recurring revenue from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Recurring revenue data:', data);
      
      // Update the state with API data
      setRecurringRevenueData({
        value: data.value || fallbackData.amount[fallbackData.amount.length - 1],
        growth: data.growth || fallbackData.growth[fallbackData.growth.length - 1] * 100,
        percentage: data.percentage || formatGrowth(fallbackData.growth[fallbackData.growth.length - 1]),
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching recurring revenue:', error);
      
      // Use fallback data on error
      const latestAmount = fallbackData.amount[fallbackData.amount.length - 1];
      const latestGrowth = fallbackData.growth[fallbackData.growth.length - 1];
      
      setRecurringRevenueData({
        value: latestAmount,
        growth: latestGrowth * 100,
        percentage: formatGrowth(latestGrowth),
        isLoading: false
      });
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
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 font-normal">
              {recurringRevenueData.isLoading ? (
                <div className="animate-pulse bg-gray-200 h-4 w-8 rounded"></div>
              ) : (
                recurringRevenueData.growth
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