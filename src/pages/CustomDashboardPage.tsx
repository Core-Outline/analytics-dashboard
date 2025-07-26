import React, { useState } from 'react';
import { Search, FileText, MoreHorizontal, Sparkles, BarChart3, PieChart, MapPin, Send, Paperclip, ChevronLeft, ChevronRight } from 'lucide-react';

const CustomDashboardPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuery, setSelectedQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Sample queries data
  const queries = [
    {
      id: 'transaction_data_csv_1',
      name: 'transaction_data.csv',
      type: 'file',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      id: 'transaction_data_csv_2',
      name: 'transaction_data.csv',
      type: 'file',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      id: 'sample_sales_file_1',
      name: 'Sample Sales File',
      type: 'file',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      id: 'sample_sales_file_2',
      name: 'Sample Sales File',
      type: 'file',
      icon: FileText,
      color: 'text-blue-600'
    }
  ];

  // Sample suggested queries
  const suggestedQueries = [
    {
      id: 'trend_line_chart',
      text: 'What is the trend of transaction amounts over time, visualized by a line chart?',
      icon: BarChart3
    },
    {
      id: 'products_bar_chart',
      text: 'Which products have the highest total sales, visualized by a bar chart?',
      icon: BarChart3
    },
    {
      id: 'geographical_pie_chart',
      text: 'What is the geographical distribution of transactions, visualized by a pie chart based on latitude and longitude?',
      icon: PieChart
    }
  ];

  const filteredQueries = queries.filter(query =>
    query.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Left Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-0' : 'w-80'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold">📊</span>
            </div>
            <span className="font-medium text-gray-900">Custom Dashboard</span>
          </div>
          
          {/* Tab */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                Queries
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search queries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Queries List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {filteredQueries.map((query) => {
              const Icon = query.icon;
              return (
                <div
                  key={query.id}
                  onClick={() => setSelectedQuery(query.id)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedQuery === query.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${query.color}`} />
                    <span className="text-sm text-gray-900">{query.name}</span>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-r-lg p-2 shadow-md hover:bg-gray-50 transition-colors"
        style={{ left: isSidebarCollapsed ? '0px' : '320px' }}
      >
        {isSidebarCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-medium text-gray-900">transaction_data.csv</div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 pb-24 overflow-y-auto">
          {/* Suggested Queries */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-medium text-gray-900">Suggested</h3>
            </div>
            
            <div className="space-y-4">
              {suggestedQueries.map((query) => {
                const Icon = query.icon;
                return (
                  <div
                    key={query.id}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <span className="text-sm text-gray-700 leading-relaxed">
                      {query.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Query Input - Fixed to Bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6" style={{ left: isSidebarCollapsed ? '0px' : '320px' }}>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <Paperclip className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="What were my top 5 products last month from @SalesData ?"
                  className="w-full text-sm text-gray-700 placeholder-gray-400 border-none outline-none"
                  defaultValue="What were my top 5 products last month from @SalesData ?"
                />
              </div>
              <div className="flex items-center space-x-2">
                <button className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDashboardPage;