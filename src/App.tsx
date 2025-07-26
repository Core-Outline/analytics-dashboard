import React from 'react';
import { Search, Bell, ChevronDown, Users, Package, RefreshCw, TrendingUp, TrendingDown, MoreVertical, ChevronRight, Settings, HelpCircle, MessageCircle, LogOut } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-lg">
            M
          </div>
          <span className="text-xl font-semibold">Mboard</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-3 px-4 py-3 text-orange-500 bg-slate-700 rounded-lg">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-4 h-3 border-l-2 border-b-2 border-orange-500"></div>
              </div>
              <span className="font-medium">Overview</span>
            </div>
            
            <div className="flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white cursor-pointer">
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5" />
                <span>Product</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </div>

            <div className="flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded border border-gray-400"></div>
                <span>Orders</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </div>

            <div className="flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-gray-400 rounded"></div>
                <span>Checkout</span>
              </div>
              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
            </div>

            <div className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white cursor-pointer">
              <Settings className="w-5 h-5" />
              <span>Setting</span>
            </div>
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 space-y-1">
          <div className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white cursor-pointer">
            <HelpCircle className="w-5 h-5" />
            <span>Help Centre</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white cursor-pointer">
            <MessageCircle className="w-5 h-5" />
            <span>Contact us</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 text-orange-500 hover:text-orange-400 cursor-pointer">
            <LogOut className="w-5 h-5" />
            <span>Log out</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome Back, Anthony</h1>
          <div className="flex items-center space-x-4">
            <Search className="w-6 h-6 text-gray-400 cursor-pointer" />
            <Bell className="w-6 h-6 text-gray-400 cursor-pointer" />
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <span className="text-gray-700 font-medium">Anthony</span>
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
                <span className="text-green-500 font-medium">10.2</span>
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
                <span className="text-green-500 font-medium">3.1</span>
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
                <span className="text-red-500 font-medium">2.56</span>
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
                <span className="text-green-500 font-medium">7.2</span>
                <span className="text-gray-500">+1.51% this week</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Orders Analytics */}
            <div className="col-span-2 bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Orders Analytics</h3>
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
              <div className="relative h-64">
                {/* Chart placeholder with SVG */}
                <svg className="w-full h-full" viewBox="0 0 600 200">
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="100" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 100 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Y-axis labels */}
                  <text x="20" y="20" className="text-xs fill-gray-400">100</text>
                  <text x="20" y="60" className="text-xs fill-gray-400">80</text>
                  <text x="20" y="100" className="text-xs fill-gray-400">60</text>
                  <text x="20" y="140" className="text-xs fill-gray-400">40</text>
                  <text x="20" y="180" className="text-xs fill-gray-400">20</text>
                  <text x="20" y="200" className="text-xs fill-gray-400">0</text>
                  
                  {/* X-axis labels */}
                  <text x="80" y="195" className="text-xs fill-gray-400">Jan</text>
                  <text x="150" y="195" className="text-xs fill-gray-400">Feb</text>
                  <text x="220" y="195" className="text-xs fill-gray-400">Mar</text>
                  <text x="290" y="195" className="text-xs fill-gray-400">Apr</text>
                  <text x="360" y="195" className="text-xs fill-gray-400">May</text>
                  <text x="430" y="195" className="text-xs fill-gray-400">Jun</text>
                  <text x="500" y="195" className="text-xs fill-gray-400">Jul</text>
                  
                  {/* Orange line (Online orders) */}
                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    points="50,160 100,140 150,120 200,100 250,90 300,110 350,100 400,90 450,80 500,85 550,75"
                  />
                  
                  {/* Dark line (Offline orders) */}
                  <polyline
                    fill="none"
                    stroke="#1f2937"
                    strokeWidth="2"
                    points="50,180 100,170 150,150 200,140 250,120 300,130 350,120 400,110 450,100 500,105 550,95"
                  />
                  
                  {/* Highlighted area for Mar */}
                  <rect x="200" y="40" width="50" height="140" fill="#e5e7eb" opacity="0.3" />
                  <text x="225" y="30" className="text-xs fill-gray-600 font-medium">15 Aug 2022</text>
                  <text x="225" y="45" className="text-sm fill-gray-900 font-bold">$59,492.10</text>
                </svg>
              </div>
            </div>

            {/* Earnings Donut Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Earnings</h3>
                <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
              </div>
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                    
                    {/* Blue segment (largest) */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="none" 
                      stroke="#3b82f6" 
                      strokeWidth="8"
                      strokeDasharray="75.4 251.2"
                      strokeDashoffset="0"
                    />
                    
                    {/* Pink segment */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="none" 
                      stroke="#ec4899" 
                      strokeWidth="8"
                      strokeDasharray="50.3 251.2"
                      strokeDashoffset="-75.4"
                    />
                    
                    {/* Orange segment */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="none" 
                      stroke="#f59e0b" 
                      strokeWidth="8"
                      strokeDasharray="37.7 251.2"
                      strokeDashoffset="-125.7"
                    />
                    
                    {/* Light blue segment */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="none" 
                      stroke="#8b5cf6" 
                      strokeWidth="8"
                      strokeDasharray="62.8 251.2"
                      strokeDashoffset="-163.4"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">$452</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                    <span className="text-sm text-gray-600">Offline</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Trade</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order List */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Order List</h3>
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