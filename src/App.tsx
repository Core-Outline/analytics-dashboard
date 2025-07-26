import React from 'react';
import { useState } from 'react';
import { Search, Bell, ChevronDown, Users, Package, RefreshCw, TrendingUp, TrendingDown, MoreVertical, ChevronRight, Settings, HelpCircle, MessageCircle, LogOut, DollarSign, Zap, User, Share2, Star, BarChart3 } from 'lucide-react';
import TotalSalesChart from './components/OrdersAnalyticsChart';
import RevenueGrowthCard from './components/RevenueGrowthCard';
import TopProductsChart from './components/TopProductsChart';
import GrossRevenueCard from './components/GrossRevenueCard';
import AdCampaignsCard from './components/AdCampaignsCard';

function App() {
  const [salesTimeUnit, setSalesTimeUnit] = useState('Monthly');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white flex flex-col rounded-r-2xl">
        {/* Logo */}
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-lg">
            M
          </div>
          <span className="text-xl font-medium">Core&Outline</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-3 px-4 py-3 text-orange-500 bg-slate-700 rounded-lg font-medium">
              <div className="w-5 h-5 flex items-center justify-center">
                <BarChart3 className="w-5 h-2" />
              </div>
              <span className="text-sm">Financials</span>
            </div>
            
            <div className="flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white cursor-pointer font-medium">
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5" />
                <span className="text-sm">Saas</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </div>

            <div className="flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white cursor-pointer font-medium">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5" />
                <span className="text-sm">Customer</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </div>

            <div className="flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white cursor-pointer font-medium">
              <div className="flex items-center space-x-3">
                <Share2 className="w-5 h-5" />
                <span className="text-sm">Social Media</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </div>

            <div className="flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white cursor-pointer font-medium">
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5" />
                <span className="text-sm">Customer Feedback</span>
              </div>
              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
            </div>

            <div className="flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white cursor-pointer font-medium">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5" />
                <span className="text-sm">Customer Dashboard</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 space-y-1">
          <div className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white cursor-pointer font-medium">
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm">Help Centre</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white cursor-pointer font-medium">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">Contact us</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 text-orange-500 hover:text-orange-400 cursor-pointer font-medium">
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Log out</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-medium text-gray-900">Welcome Back, Anthony</h1>
          <div className="flex items-center space-x-4">
            <Search className="w-6 h-6 text-gray-400 cursor-pointer" />
            <Bell className="w-6 h-6 text-gray-400 cursor-pointer" />
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <span className="text-gray-700 font-normal">Anthony</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="p-8">
          <div className="grid grid-cols-4 gap-6 mb-8">
            {/* Recurring Revenue */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">89,935</div>
              <div className="text-gray-600 text-sm mb-2">Recurring Revenue</div>
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-green-500 font-normal">10.2</span>
                <span className="text-gray-500">+1.01% this week</span>
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
                <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
              </div>
              <RevenueGrowthCard />
            </div>
          </div>

          {/* Gross Revenue */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Gross Revenue</h3>
            </div>
            <GrossRevenueCard />
          </div>

          {/* Top Products Sold */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Top Products Sold</h3>
            </div>
            <TopProductsChart />
          </div>

          {/* Ad Campaigns Performance */}
          <div className="bg-white p-6 rounded-lg shadow-sm mt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Ad Campaigns Performance</h3>
            </div>
            <AdCampaignsCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;