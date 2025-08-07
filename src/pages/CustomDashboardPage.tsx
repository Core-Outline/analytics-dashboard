// Helper component to parse and render ECHARTS_CODE
interface EchartsCodeRendererProps {
  code: string;
  pageData: any;
}

interface Visualization {
  visualization_id: string;
  thread_id: string;
  is_active: boolean;
  prompt: string;
  echarts_code: string;
  created_at: string;
  showDropdown?: boolean;
}

interface VisualizationState {
  active: Visualization[];
  history: { [key: string]: Visualization[] };
}

const EchartsCodeRenderer: React.FC<EchartsCodeRendererProps> = ({ code, pageData }) => {
  const [option, setOption] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      // Remove <script> blocks
      let jsCode = code.replace(/<script[^>]*>|<\/script>/gi, '');
      // Remove console.log and chartDom/myChart initializations
      jsCode = jsCode.replace(/console\.log\([^)]*\);?/g, '');
      jsCode = jsCode.replace(/var chartDom = [^;]*;?/g, '');
      jsCode = jsCode.replace(/var myChart = [^;]*;?/g, '');
      // Replace data assignment
      jsCode = jsCode.replace(/var data = page_data;/g, 'var data = __pageData;');
      jsCode = jsCode.replace(/var data = transaction_data;/g, 'var data = __pageData;');
      jsCode = jsCode.replace(/var data = data;/g, 'var data = __pageData;');
      // Replace transaction_data and page_data references
      jsCode = jsCode.replace(/transaction_data/g, '__pageData');
      jsCode = jsCode.replace(/page_data/g, '__pageData');
      // Evaluate option/chartOption, providing both pageData and __pageData
      const func = new Function(
        '__pageData',
        'pageData',
        jsCode + `;
        if (typeof option !== 'undefined') return option;
        if (typeof chartOption !== 'undefined') return chartOption;
        return null;`
      );
      const optionObj = func(pageData, pageData);
      setOption(optionObj);
      console.log(optionObj)
      setError(null);
    } catch (err: any) {
      setOption(null);
      console.error("Chart rendering error: ", err)
      setError(err && err.message ? err.message : String(err));
    }
  }, [code, pageData]);

  if (error) return <div className="text-red-500">Chart error: {error}</div>;
  if (!option) return <div className="text-gray-400">Chart could not be rendered</div>;
  return <ReactECharts option={option} style={{ height: '400px', width: '100%' }} opts={{ renderer: 'canvas' }} />;
};

import React, { useState, useEffect } from 'react';
import { Search, FileText, MoreHorizontal, Sparkles, BarChart3, Send, Paperclip, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { v4 as uuidv4 } from 'uuid';

const CustomDashboardPage: React.FC = () => {
  // State for visualization modal
  const [showVizModal, setShowVizModal] = useState(false);
  const [activeViz, setActiveViz] = useState<any>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [historyVisualizations, setHistoryVisualizations] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuery, setSelectedQuery] = useState('1101');
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [queries, setQueries] = useState<any[]>([]);
  const [queriesLoading, setQueriesLoading] = useState(false);
  const [queriesError, setQueriesError] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState(null);
  const [chartOption, setChartOption] = useState<any>(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<any>(null);

  // State for new dashboard details
  const [pageDetails, setPageDetails] = useState<{ page_id: string; page_name: string } | null>(null);

  // State for modal visibility and new dashboard name
  const [showModal, setShowModal] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');

  // Dashboard selection and creation
  type DashboardType = { page_id: string; page_name: string; query_id: string };
  const [selectedDashboard, setSelectedDashboard] = useState<DashboardType | null>(null);
  const [dashboards, setDashboards] = useState<DashboardType[]>([]);
  const [dashboardsLoading, setDashboardsLoading] = useState(false);
  const [dashboardsError, setDashboardsError] = useState<string | null>(null);

  const getQueryData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/query-data?query_id=${selectedQuery}`);
      if (!res.ok) throw new Error('Failed to fetch query data');
      const data = await res.json();
      setPageData(data);
      return data;
    } catch (err) {
      console.error('Failed to fetch query data:', err);
      return null;
    }
  };
  useEffect(() => {
    if (selectedQuery) {
      getQueryData(selectedQuery);
    } else {
      setPageData(null);
    }
  }, [selectedQuery]);

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

  // Fetch dashboards from API
  useEffect(() => {
    async function fetchDashboards() {
      setDashboardsLoading(true);
      try {
        const res = await fetch('http://localhost:5000/custom-dashboards?user_id=101');
        if (!res.ok) throw new Error('Failed to fetch dashboards');
        const dashboardsRaw = await res.json();
        // Ensure all dashboards have query_id for DashboardType compatibility
        const dashboards = dashboardsRaw.map((d: any) => ({
          page_id: d.page_id,
          page_name: d.page_name,
          query_id: d.query_id || ''
        }));
        setDashboards(dashboards);
        setDashboardsError(null);
      } catch (err) {
        setDashboardsError('Failed to load dashboards');
      }
      setDashboardsLoading(false);
    }
    fetchDashboards();
  }, []);

  // State for visualizations
  const [visualizations, setVisualizations] = useState<VisualizationState>(
    { active: [], history: {} }
  );

  const [visualizationsLoading, setVisualizationsLoading] = useState(false);
  const [visualizationsError, setVisualizationsError] = useState<string | null>(null);

  function removeImportStatements(code: string) {
    return code
      .split('\n')                          // Split code into lines
      .filter(line => !line.trim().startsWith('import')) // Remove lines starting with 'import'
      .filter(line => !line.trim().startsWith('```tsx')) // Remove lines starting with 'import'
      .filter(line => !line.trim().startsWith('```')) // Remove lines starting with 'import'
      .join('\n');                          // Join lines back into a single string
  }

  // Create a new visualization from prompt using API call
  const createVisualization = async (prompt: string) => {
    try {
      const response = await fetch('http://localhost:5000/create-visualization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          data_label: 'transaction',
          page_id: selectedDashboard?.page_id,
          page_name: selectedDashboard?.page_name,
          user_id: 101,
          query_id: selectedDashboard?.query_id
        })
      });
      if (!response.ok) throw new Error('Failed to create visualization');
      const data = await response.json();
      console.log("This is the code: ", removeImportStatements(data?.echarts_code))
      const option = executeChartCode(removeImportStatements(data?.echarts_code));

      setChartOption(option);
      // Add new visualization to the active visualizations array
      setVisualizations(prev => ({
        ...prev,
        active: [
          ...prev.active,
          {
            visualization_id: data.VISUALIZATION_ID || uuidv4(),
            thread_id: data.THREAD_ID || '',
            is_active: true,
            prompt: data.prompt || prompt,
            echarts_code: data.echarts_code || '',
            created_at: data.created_at || new Date().toISOString(),
            chartOption: option, // Attach the chartOption for rendering
            reasoning: data.reasoning || '',
            business_implications: data.business_implications || '',
          }
        ]
      }));
      console.log(data);
    } catch (err) {
      console.error(err);
    } finally {
    }



  }


  const editVisualization = async (prompt: string) => {
    try {
      const response = await fetch('http://localhost:5000/change-visualization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          data_label: 'transaction',
          page_id: selectedDashboard?.page_id,
          page_name: selectedDashboard?.page_name,
          user_id: 101,
          query_id: selectedDashboard?.query_id,
          thread_id: activeViz.thread_id
        })
      });
      if (!response.ok) throw new Error('Failed to create visualization');
      const data = await response.json();
      console.log("This is the edited output: ",data)
      const option = executeChartCode(removeImportStatements(data?.echarts_code));

      setChartOption(option);
      // Add new visualization to the active visualizations array
      setVisualizations(prev => ({
        ...prev,
        active: [
          ...prev.active,
          {
            visualization_id: data.VISUALIZATION_ID || uuidv4(),
            thread_id: data.THREAD_ID || '',
            is_active: true,
            prompt: data.prompt || prompt,
            echarts_code: data.echarts_code || '',
            created_at: data.created_at || new Date().toISOString(),
            chartOption: option, // Attach the chartOption for rendering,
            reasoning: data.reasoning || '',
            business_implications: data.business_implications || '',
          
          }
        ]
      }));
      setActiveViz(data)
      console.log(data);
    } catch (err) {
      console.error(err);
    } finally {
    }



  }

  // Modified: fetchVisualizations now accepts pageId
  const fetchVisualizations = async (pageId?: string) => {
    setVisualizationsLoading(true);
    await getQueryData();
    try {
      const page_id_param = pageId || '0c8e0d4f-12ba-4840-ac15-22756dba72ab';
      const res = await fetch(`http://localhost:5000/visualizations?user_id=101&page_id=${page_id_param}&thread_id`);
      if (!res.ok) throw new Error('Failed to fetch visualizations');
      const data: Visualization[] = await res.json();

      console.log("These are the visualizations: ",data)
      // Separate active and historical visualizations
      const activeViz = data.filter((viz: Visualization) => viz.is_active == true);
      const historicalViz = data.filter((viz: Visualization) => viz.is_active == false);

      // Group historical visualizations by thread_id
      const threadHistory = new Map<string, Visualization[]>();
      historicalViz.forEach((viz: Visualization) => {
        if (!threadHistory.has(viz.thread_id)) {
          threadHistory.set(viz.thread_id, []);
        }
        threadHistory.get(viz.thread_id)?.push(viz);
      });

      // Sort historical visualizations by creation date for each thread
      threadHistory.forEach((history, threadId) => {
        threadHistory.set(threadId, history.sort((a: Visualization, b: Visualization) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ));
      });

      // Store the processed data
      setVisualizations({
        active: activeViz,
        history: Object.fromEntries(threadHistory)
      });
      setVisualizationsError(null);
    } catch (err) {
      setVisualizationsError('Failed to load visualizations');
    }
    setVisualizationsLoading(false);
  };

  const fetchEditHistory = async (threadId: string, pageId: string) => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/visualizations?user_id=101&thread_id=${threadId}&page_id=${pageId}`);
      if (!res.ok) throw new Error('Failed to fetch edit history');
      const data = await res.json();
      setHistoryVisualizations(data.sort((a: any, b: any) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (err) {
      console.error('Failed to fetch edit history:', err);
    }
    setHistoryLoading(false);
  };

  // Function to execute code returned from backend
  const executeChartCode = (codeString: string) => {
    try {
      // Create a safe execution context with available variables and functions
      const context = {
        pageData,
        React,
        ReactECharts,
        console
      };

      // Create a function that executes the code and returns the chart option
      const executeCode = new Function(
        'pageData',
        'React',
        'ReactECharts',
        'console',
        `
        ${codeString}
        return chartOption;
        `
      );

      const option = executeCode(
        context.pageData,
        context.React,
        context.ReactECharts,
        context.console
      );

      return option;
    } catch (error) {
      console.error('Error executing chart code:', error);
      throw error;
    }
  };

  // Mock function to simulate backend API call
  const fetchChartFromPrompt = async (prompt: string) => {
    setChartLoading(true);
    setChartError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock backend response - this would come from your actual API
      let mockCode = '';

      if (prompt.toLowerCase().includes('pie chart') && prompt.toLowerCase().includes('customer')) {
        mockCode = `
// Function to get top customers by total transaction amount
function getTopCustomers(data, count = 7) {
  const customerTotals = {};
  
  // Sum up amounts for each customer
  data.forEach(transaction => {
    const customer = transaction.customer;
    customerTotals[customer] = (customerTotals[customer] || 0) + transaction.amount;
  });

  // Convert to array, sort by amount, and take top N
  return Object.entries(customerTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([name, value]) => ({ name, value }));
}

// Generate chart option
const chartOption = {
  title: {
    text: 'Top 7 Customers by Total Purchases',
    left: 'center',
    textStyle: {
      fontSize: 16,
      fontWeight: 'bold'
    }
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'middle'
  },
  series: [
    {
      name: 'Customer Sales',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['60%', '50%'],
      data: getTopCustomers(pageData, 7),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label: {
      }
    }
  ]
};`;
      } else if (prompt.toLowerCase().includes('bar chart') && prompt.toLowerCase().includes('product')) {
        mockCode = `
// Function to get product sales data
function getProductSales(data) {
  const productTotals = {};
  
  data.forEach(transaction => {
    const product = transaction.product;
    productTotals[product] = (productTotals[product] || 0) + transaction.amount;
  });

  return Object.entries(productTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));
}

const productData = getProductSales(pageData);

const chartOption = {
  title: {
    text: 'Product Sales Analysis',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  xAxis: {
    type: 'category',
    data: productData.map(item => item.name),
    axisLabel: {
      rotate: 45
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
    }
  },
  series: [
    {
      name: 'Sales',
      type: 'bar',
      data: productData.map(item => item.value),
      itemStyle: {
        color: '#3b82f6'
      }
    }
  ]
};`;
      } else {
        // Default pie chart for customers
        mockCode = `
function getTopCustomers(data, count = 7) {
  const customerTotals = {};
  
  data.forEach(transaction => {
    const customer = transaction.customer;
    customerTotals[customer] = (customerTotals[customer] || 0) + transaction.amount;
  });

  return Object.entries(customerTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([name, value]) => ({ name, value }));
}

const chartOption = {
  title: {
    text: 'Customer Analysis',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: 'Customers',
      type: 'pie',
      radius: '60%',
      data: getTopCustomers(pageData),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};`;
      }

      // Execute the code and get the chart option
      const option = executeChartCode(mockCode);
      setChartOption(option);

    } catch (error) {
      setChartError('Failed to generate chart from prompt');
      console.error('Chart generation error:', error);
    } finally {
      setChartLoading(false);
    }
  };


  // Handle prompt submission
  const handleSubmitPrompt = async (e?: any) => {
    if (e) e.preventDefault();
    if (userPrompt.trim()) {
      await createVisualization(userPrompt);
    }
  };

  const filteredQueries = queries.filter(query =>
    query.name && query.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDashboards = dashboards.filter(dashboard =>
    dashboard.page_name && dashboard.page_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Initialize with default chart on component mount
  useEffect(() => {
    fetchChartFromPrompt('Plot a pie chart of the seven best customers');
  }, []);

  // Add new dashboard to dashboards list when pageDetails changes
  useEffect(() => {
    if (pageDetails) {
      setDashboards(prev => [{ page_id: pageDetails.page_id, page_name: pageDetails.page_name }, ...prev]);
    }
  }, [pageDetails]);

  // Get selected dashboard name
  const selectedDashboardName = selectedDashboard ? selectedDashboard.page_name : '';

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Left Sidebar */}
      <div
        className={`${isSidebarCollapsed ? 'w-0' : 'w-80'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}
        style={{ height: '92vh' }}
      >

        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <BarChart3 className="text-white w-4 h-4" />
            </div>
            <span className="font-medium text-gray-900">Custom Dashboard</span>
          </div>

          {/* Tab */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('Queries')}
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'Queries'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Queries
              </button>
              <button
                onClick={() => setActiveTab('Dashboard')}
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'Dashboard'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute left-0 top-20 transform -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-r-lg p-2 shadow-md hover:bg-gray-50 transition-colors"
          style={{ left: isSidebarCollapsed ? '0px' : '320px' }}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>

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
                      onClick={() => {
                        setPageData(null);
                        setVisualizations({ active: [], history: {} });
                        setSelectedQuery(query.query_id);
                      }}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedQuery === (query.query_id || query.data_source_id)
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
              dashboardsLoading ? (
                <div className="p-4 text-gray-500">Loading dashboards...</div>
              ) : dashboardsError ? (
                <div className="p-4 text-red-500">{dashboardsError}</div>
              ) : filteredDashboards.length === 0 ? (
                <div className="p-4 text-gray-500">No dashboards found.</div>
              ) : (
                filteredDashboards.map((dashboard) => {
                  return (
                    <div
                      key={dashboard.page_id}
                      onClick={() => {
                        setPageData(null);
                        setVisualizations({ active: [], history: {} });
                        setSelectedDashboard({ page_id: dashboard.page_id, page_name: dashboard.page_name, query_id: selectedQuery });
                        fetchVisualizations(dashboard.page_id);
                      }}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedDashboard?.page_id === dashboard.page_id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <BarChart3 className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-900">{dashboard.page_name}</span>
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </div>
                  );
                })
              )
            )}
          </div>
        </div>

        {/* Suggested Queries */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <h4 className="text-sm font-medium text-gray-900">Suggested</h4>
          </div>
          {/* <div className="space-y-2">
            {suggestedQueries.slice(0, 3).map((query) => (
              <button
                key={query.id}
                onClick={() => {
                  setUserPrompt(query.text);
                  fetchChartFromPrompt(query.text);
                }}
                className="w-full text-left p-2 text-xs text-gray-600 hover:bg-gray-50 rounded transition-colors"
              >
                {query.text}
              </button>
            ))}
          </div> */}
        </div>


      </div>



      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-medium text-gray-900">{selectedDashboardName}</div>
          <div className="text-sm text-gray-500">
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {/* Chart Display - Render all visualizations from API */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {visualizationsLoading ? (
              <div className="flex items-center justify-center h-96 col-span-3">
                <div className="text-gray-500">Loading visualizations...</div>
              </div>
            ) : visualizationsError ? (
              <div className="flex items-center justify-center h-96 col-span-3">
                <div className="text-red-500">{visualizationsError}</div>
              </div>
            ) : visualizations && visualizations.active.length > 0 ? (
              visualizations?.active?.map((viz, idx) => (
                <div key={viz.visualization_id || idx} className="bg-white rounded-lg border border-gray-200 shadow p-4 flex flex-col relative">
                  {/* Dropdown menu - moved to top right */}
                  <div className="absolute right-4 top-4 z-10">
                    <div className="relative">
                      {/* Dropdown trigger button */}
                      <button className=" text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => {
                        setActiveViz(viz);
                        setShowVizModal(true);
                        setVisualizations(prev => ({
                          ...prev,
                          active: prev.active.map(v => ({
                            ...v,
                            showDropdown: false
                          }))
                        }));
                      }}>
                        <Maximize2 className=" h-4 mr-1 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  {/* Card content */}
                  <div className="mb-2 font-semibold text-gray-800 pl-2 pr-8 pt-2">{viz.prompt}</div>
                  <div className="flex-1 flex items-center justify-center">
                    <EchartsCodeRenderer code={viz.echarts_code} pageData={pageData} />
                  </div>
                  {/* Show history count if available */}
                  {visualizations?.history?.[viz.thread_id] && (
                    <div className="mt-2 text-sm text-gray-500">
                      {visualizations.history[viz.thread_id].length} previous versions
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-96 col-span-3">
                <div className="text-gray-500">No active visualizations to display</div>
              </div>
            )}

            {/* Visualization Fullscreen Modal */}
            {showVizModal && activeViz && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60">
                <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-5xl h-[90vh] flex flex-col relative">
                  {/* Close button */}
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
                    onClick={() => { setShowVizModal(false); setActiveViz(null); }}
                    title="Close"
                  >
                    &times;
                  </button>
                  {/* Visualization Title */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-lg font-semibold text-gray-900">{activeViz.prompt}</div>
                    <button
                      className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm"
                      onClick={() => {
                        setShowHistory(true);
                        fetchEditHistory(activeViz.thread_id, activeViz.page_id);
                      }}
                    >
                      View Edit History
                    </button>
                  </div>
                  {/* Visualization Chart */}
                  <div className="flex-1 flex items-center justify-center mb-6">
                    <EchartsCodeRenderer code={activeViz.echarts_code} pageData={pageData} />
                  </div>
                  {/* Edit Prompt */}
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Edit Visualization Prompt</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        placeholder="Describe how you want to edit this visualization..."
                        value={editPrompt}
                        onChange={e => setEditPrompt(e.target.value)}
                      />
                      <button
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
                        onClick={async() => {
                          await editVisualization(editPrompt)
                         }}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Visualization Edit History Modal */}
            {showHistory && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black bg-opacity-70">
                <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl h-[70vh] flex flex-col relative">
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
                    onClick={() => {
                      setShowHistory(false);
                      setHistoryVisualizations([]);
                    }}
                    title="Close"
                  >
                    &times;
                  </button>
                  <div className="mb-4 text-lg font-semibold text-gray-900">Edit History for Visualization</div>
                  {/* TODO: Render actual history data here */}
                  <div className="flex-1 overflow-y-auto">
                    {historyLoading ? (
                      <div className="text-gray-500">Loading edit history...</div>
                    ) : historyVisualizations.length === 0 ? (
                      <div className="text-gray-500">No edit history available.</div>
                    ) : (
                      historyVisualizations.map((viz, idx) => (
                        <div key={viz.visualization_id || idx} className="bg-white rounded-lg border border-gray-200 shadow p-4 flex flex-col relative mb-4">
                          <div className="mb-2 font-semibold text-gray-800 pl-2 pr-8 pt-2">{viz.prompt}</div>
                          <div className="flex-1 flex items-center justify-center">
                            <EchartsCodeRenderer code={viz.echarts_code} pageData={pageData} />
                          </div>
                        </div>
                      ))
                    )}
                    <div className="text-gray-500">No history available (demo placeholder).</div>
                  </div>
                </div>
              </div>
            )}
            : (
            <div className="flex items-center justify-center h-96 col-span-3">
              <div className="text-gray-500">No visualizations to display</div>
            </div>
            )
          </div>

          {/* Query Input */}
          <div className="fixed bottom-2 right-20 bg-white rounded-lg border border-gray-200 p-4 w-1/2">
            <div className="flex items-center space-x-3">
              <Paperclip className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Ask me to create a chart... e.g., 'Plot a pie chart of the seven best customers'"
                  className="w-full text-sm text-gray-700 placeholder-gray-400 border-none outline-none"
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitPrompt(e);
                    }
                  }}
                />
              </div>
              <div className="flex items-center space-x-2">
                {/* Tooltip logic for disabled button */}
                <div className="relative group" tabIndex={-1}>
                  <button
                    onClick={e => {
                      if (!selectedDashboard && pageData) {
                        setShowModal(true);
                      } else {
                        handleSubmitPrompt(e);
                      }
                    }}
                    disabled={chartLoading || !pageData}
                    className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 focus:outline-none"
                    aria-label="Send"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                  {(chartLoading || !pageData) && (
                    <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 z-10 hidden group-hover:block group-focus-within:block">
                      <div className="bg-gray-900 text-white text-xs rounded px-3 py-2 shadow-lg whitespace-nowrap">
                        Please select a Query or a Dashboard first.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Floating Action Button for creating a new dashboard */}
          <button
            onClick={() => setShowModal(true)}
            className="fixed top-20 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl transition-colors"
            title="Create New Dashboard"
          >
            +
          </button>

          {/* Modal for new dashboard creation */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">Create Dashboard</h2>
                <input
                  type="text"
                  value={newDashboardName}
                  onChange={e => setNewDashboardName(e.target.value)}
                  placeholder="Enter dashboard name"
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Generate a uuid
                      const uuid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
                      );
                      const newDashboard = { page_id: uuid, page_name: newDashboardName, query_id: selectedQuery };
                      setDashboards(prev => [...prev, newDashboard]);
                      setSelectedDashboard(newDashboard);
                      setShowModal(false);
                      setNewDashboardName("");
                    }}
                    disabled={!newDashboardName.trim()}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomDashboardPage;