import React from 'react';
import { Search, Bell, ChevronDown, Users, Package, RefreshCw, TrendingUp, TrendingDown, MoreVertical, ChevronRight, Settings, HelpCircle, MessageCircle, LogOut, DollarSign, Zap, User, Share2, Star, BarChart3 } from 'lucide-react';
import OrdersAnalyticsChart from './components/OrdersAnalyticsChart';
import EarningsChart from './components/EarningsChart';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white flex flex-col rounded-r-2xl">
        {/* Logo */}
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-lg">
            M
          </div>
          <span className="text-xl font-medium">Mboard</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-3 px-4 py-3 text-orange-500 bg-slate-700 rounded-lg font-medium">
              <div className="w-5 h-5 flex items-center justify-center">
                <BarChart3 className="w-5 h-2" />
              </div>
              <span>Financials</span>
            </div>
            
            <div className="flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white cursor-pointer font-medium">
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5" />
                <span>Saas</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </div>

            <div className="flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white cursor-pointer font-medium">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5" />
                <span>Customer</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </div>

            <div className="flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white cursor-pointer font-medium">
              <div className="flex items-center space-x-3">
                <Share2 className="w-5 h-5" />
                <span>Social Media</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </div>

            <div className="flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white cursor-pointer font-medium">
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5" />
                <span>Customer Feedback</span>
              </div>
              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
            </div>

            <div className="flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white cursor-pointer font-medium">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5" />
                <span>Customer Dashboard</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 space-y-1">
          <div className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white cursor-pointer font-medium">
            <HelpCircle className="w-5 h-5" />
            <span>Help Centre</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white cursor-pointer font-medium">
            <MessageCircle className="w-5 h-5" />
            <span>Contact us</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 text-orange-500 hover:text-orange-400 cursor-pointer font-medium">
            <LogOut className="w-5 h-5" />
            <span>Log out</span>
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
            {/* Total Users */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">89,935</div>
              <div className="text-gray-600 text-sm mb-2">Total users</div>
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-green-500 font-normal">10.2</span>
                <span className="text-gray-500">+1.01% this week</span>
              </div>
            </div>

            {/* Total Products */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-pink-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">23,283.5</div>
              <div className="text-gray-600 text-sm mb-2">Total products</div>
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-green-500 font-normal">3.1</span>
                <span className="text-gray-500">+0.49% this week</span>
              </div>
            </div>

            {/* Total Users */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">46,827</div>
              <div className="text-gray-600 text-sm mb-2">Total users</div>
              <div className="flex items-center space-x-2 text-sm">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="text-red-500 font-normal">2.56</span>
                <span className="text-gray-500">-0.91% this week</span>
              </div>
            </div>

            {/* Refunded */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">124,854</div>
              <div className="text-gray-600 text-sm mb-2">Refunded</div>
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-green-500 font-normal">7.2</span>
                <span className="text-gray-500">+1.51% this week</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Orders Analytics */}
            <div className="col-span-2 bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Orders Analytics</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                    <span className="text-sm text-gray-600">Offline orders</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Online orders</span>
                  </div>
                  <select className="text-sm text-gray-600 border border-gray-200 rounded px-2 py-1">
                    <option>Monthly</option>
                  </select>
                </div>
              </div>
              <OrdersAnalyticsChart />
            </div>

            {/* Earnings Donut Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Earnings</h3>
                <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
              </div>
              <EarningsChart />
            </div>
          </div>

          {/* Order List */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Order List</h3>
                <select className="text-sm text-gray-600 border border-gray-200 rounded px-2 py-1">
                  <option>Monthly</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID <ChevronDown className="w-3 h-3 inline ml-1" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Name <ChevronDown className="w-3 h-3 inline ml-1" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount <ChevronDown className="w-3 h-3 inline ml-1" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status Order <ChevronDown className="w-3 h-3 inline ml-1" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#12594</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Oct 15, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Frank Murlo</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">312 S Wilmette Ave</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$847.69</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                        New Order
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      <MoreVertical className="w-4 h-4" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;