import React, { useState, useEffect } from 'react';
import { Search, FileText, MoreHorizontal, Sparkles, BarChart3, PieChart, MapPin, Send, Paperclip, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const CustomDashboardPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuery, setSelectedQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('Queries');
  const [queries, setQueries] = useState<any[]>([]);
  const [queriesLoading, setQueriesLoading] = useState(false);
  const [queriesError, setQueriesError] = useState<string | null>(null);

  // Fetch queries from API
  useEffect(() => {
    async function fetchQueries() {
      setQueriesLoading(true);
      try {
        const res = await fetch('http://localhost:5000/queries?company=101&query_type');
        if (!res.ok) throw new Error('Failed to fetch queries');
        const data = await res.json();
        setQueries(data);
        setQueriesError(null);
      } catch (err) {
        setQueriesError('Failed to load queries');
      }
      setQueriesLoading(false);
    }
    fetchQueries();
  }, []);

  // Sample dashboards data
  const dashboards = [
    {
      id: 'sales_overview_2024',
      name: 'Sales Overview 2024',
      type: 'dashboard',
      icon: BarChart3,
      color: 'text-green-600',
      lastModified: '2 hours ago',
      charts: 5
    },
    {
      id: 'customer_analytics',
      name: 'Customer Analytics',
      type: 'dashboard',
      icon: PieChart,
      color: 'text-blue-600',
      lastModified: '1 day ago',
      charts: 8
    },
    {
      id: 'financial_report_q4',
      name: 'Financial Report Q4',
      type: 'dashboard',
      icon: BarChart3,
      color: 'text-purple-600',
      lastModified: '3 days ago',
      charts: 6
    },
    {
      id: 'marketing_performance',
      name: 'Marketing Performance',
      type: 'dashboard',
      icon: MapPin,
      color: 'text-orange-600',
      lastModified: '1 week ago',
      charts: 4
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
    query.name && query.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDashboards = dashboards.filter(dashboard =>
    dashboard.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sample API call for chart code
  const [chartCode, setChartCode] = useState<string | null>(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChartCode() {
      setChartLoading(true);
      try {
        // The API returns a string of code for the chart
        // const res = await fetch('http://localhost:5000/sample-chart-code');
        // Sample output for demonstration (replace with actual API call in production)
        const data = { code: "return <ReactECharts option={{ xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] }, yAxis: { type: 'value' }, series: [{ data: [120, 200, 150, 80, 70], type: 'bar' }] }} />;" };
        setChartCode(data.code);
        setChartError(null);
      } catch (err) {
        setChartError('Failed to load chart code');
      }
      setChartLoading(false);
    }
    fetchChartCode();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Left Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-0' : 'w-80'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold"></span>
            </div>
            <span className="font-medium text-gray-900">Custom Dashboard</span>
          </div>
          
          {/* Tab */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button 
                onClick={() => setActiveTab('Queries')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'Queries'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Queries
              </button>
              <button 
                onClick={() => setActiveTab('Dashboard')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'Dashboard'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
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
              placeholder={activeTab === 'Queries' ? 'Search queries...' : 'Search dashboards...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {activeTab === 'Queries' ? (
              queriesLoading ? (
                <div className="p-4 text-gray-500">Loading queries...</div>
              ) : queriesError ? (
                <div className="p-4 text-red-500">{queriesError}</div>
              ) : filteredQueries.length === 0 ? (
                <div className="p-4 text-gray-500">No queries found.</div>
              ) : (
                filteredQueries.map((query) => {
                  // Choose icon based on data_source_type
                  let Icon = FileText;
                  let color = 'text-blue-600';
                  if (query.data_source_type === 'mongodb') {
                    color = 'text-green-600';
                  } else if (query.data_source_type === 'twitter') {
                    color = 'text-blue-400';
                  } else if (query.data_source_type === 'social_media') {
                    color = 'text-pink-600';
                  } else if (query.data_source_type === 'postgresql') {
                    color = 'text-purple-600';
                  } else if (query.data_source_type === 'saas') {
                    color = 'text-orange-600';
                  }
                  return (
                    <div
                      key={query.query_id}
                      onClick={() => setSelectedQuery(query.query_id || query.data_source_id)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedQuery === (query.query_id || query.data_source_id)
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-4 h-4 ${color}`} />
                        <span className="text-sm text-gray-900">{query.name}</span>
                        {query.data_source_type && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 ml-1">
                            {query.data_source_type}
                          </span>
                        )}
                        {query.query_type && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-600 ml-1">
                            {query.query_type}
                          </span>
                        )}
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </div>
                  );
                })
              )
            ) : (
              filteredDashboards.map((dashboard) => {
                const Icon = dashboard.icon;
                return (
                  <div
                    key={dashboard.id}
                    onClick={() => setSelectedQuery(dashboard.id)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedQuery === dashboard.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${dashboard.color}`} />
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">{dashboard.name}</span>
                        <span className="text-xs text-gray-500">{dashboard.charts} charts • {dashboard.lastModified}</span>
                      </div>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </div>
                );
              })
            )}
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
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-medium text-gray-900">transaction_data.csv</div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {/* Sample Chart using code from API */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sample Chart (from API code)</h3>
            {chartLoading ? (
              <div className="text-gray-500">Loading chart...</div>
            ) : chartError ? (
              <div className="text-red-500">{chartError}</div>
            ) : chartCode ? (
              (() => {
                // Remove 'return' if present and wrap in parentheses for JSX
                let code = chartCode.trim();
                if (code.startsWith('return')) {
                  code = code.replace(/^return\s+/, '');
                }
                if (!code.startsWith('(')) {
                  code = '(' + code;
                }
                if (!code.endsWith(')')) {
                  code = code + ')';
                }
                // eslint-disable-next-line no-eval
                return eval(code);
              })()
            ) : (
              <div className="text-gray-500">No chart code available.</div>
            )}
          </div>

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

          {/* Query Input */}
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