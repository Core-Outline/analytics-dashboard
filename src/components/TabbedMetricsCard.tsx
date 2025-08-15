import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';

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
  DATA_SOURCE_ID: string | null;
  DATA_SOURCE_SECRET: string | null;
  NAME: string;
  ORGANIZATION_ID: string | null;
  PASSWORD: string;
  PORT: string | null;
  S3_PATH: string | null;
  SAAS_ID: string;
  SCHEMA: string | null;
  TYPE: string;
  URL: string;
  USERNAME: string;
}

interface TabbedMetricsCardProps {
  dataSourceList?: DataSource[];
  setDataSource?: (dataSource: DataSource) => void;
  children?: React.ReactNode;
  data_source_id: string;
}

const TabbedMetricsCard: React.FC<TabbedMetricsCardProps> = ({ dataSourceList: propDataSourceList = [], setDataSource, children, data_source_id }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Users');
  const [usersData, setUsersData] = useState<{ dates: string[]; values: number[] } | null>(null);
  const [usersLoading, setUsersLoading] = useState(false);
  const [sessionsData, setSessionsData] = useState<{ dates: string[]; values: number[] } | null>(null);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [ctrData, setCtrData] = useState<{ dates: string[]; values: number[] } | null>(null);
  const [ctrLoading, setCtrLoading] = useState(false);
  const [bounceData, setBounceData] = useState<{ dates: string[]; values: number[] } | null>(null);
  const [bounceLoading, setBounceLoading] = useState(false);
  const [durationData, setDurationData] = useState<{ dates: string[]; values: number[] } | null>(null);
  const [durationLoading, setDurationLoading] = useState(false);
  const [currentDataSource, setCurrentDataSource] = useState<DataSource | null>(null);
  const { organization_id } = useParams<{ organization_id: string }>();



  // Default data source template
  const defaultDataSource: DataSource = {
    "ACCESS_TOKEN": null,
    "ACCOUNT_ID": null,
    "API_KEY": null,
    "API_SECRET_KEY": null,
    "APP_ID": null,
    "APP_SECRET": null,
    "BEARER_TOKEN": null,
    "CLUSTER": null,
    "DATABASE": null,
    "DATA_SOURCE_ID": null,
    "DATA_SOURCE_SECRET": null,
    "NAME": "RobodineWeb",
    "ORGANIZATION_ID": organization_id,
    "PASSWORD": "",
    "PORT": null,
    "S3_PATH": null,
    "SAAS_ID": "",
    "SCHEMA": null,
    "TYPE": "",
    "URL": "",
    "USERNAME": ""
  };


 

  useEffect(() => {
    console.log("Checking for current data <source:------------------></source:------------------> ")
    const fetchData = async () => {
      if (!organization_id) return;
  
      const dataSourceId = data_source_id;
      console.log("Checking for current data <source:------------------></source:------------------> ",dataSourceId)
      const USERS_API_URL = `http://localhost:5000/users?time_units=M&company=${organization_id}&data_source_id=${data_source_id}`;
      const SESSIONS_API_URL = `http://localhost:5000/sessions?time_units=M&company=${organization_id}&data_source_id=${data_source_id}`;
      const CTR_API_URL = `http://localhost:5000/click-through-rate?time_units=M&company=${organization_id}&data_source_id=${data_source_id}`;
      const BOUNCE_API_URL = `http://localhost:5000/bounce-rate?time_units=M&company=${organization_id}&data_source_id=${data_source_id}`;
      const DURATION_API_URL = `http://localhost:5000/session-duration?company=${organization_id}&time_units=M&data_source_id=${data_source_id}`;
  
      if (activeTab === 'Users' && !usersData && !usersLoading) {
        setUsersLoading(true);
        fetch(USERS_API_URL)
          .then(res => res.json())
          .then(data => {
            setUsersData({ dates: data.start_date, values: data.user_id });
          })
          .catch(() => setUsersData(null))
          .finally(() => setUsersLoading(false));
      }
      if (activeTab === 'Sessions' && !sessionsData && !sessionsLoading) {
        setSessionsLoading(true);
        fetch(SESSIONS_API_URL)
          .then(res => res.json())
          .then(data => {
            setSessionsData({ dates: data.start_date, values: data.session_id });
          })
          .catch(() => setSessionsData(null))
          .finally(() => setSessionsLoading(false));
      }
      if (activeTab === 'Click Through Rate' && !ctrData && !ctrLoading) {
        setCtrLoading(true);
        fetch(CTR_API_URL)
          .then(res => res.json())
          .then(data => {
            setCtrData({ dates: data.end_date, values: data.click_through });
          })
          .catch(() => setCtrData(null))
          .finally(() => setCtrLoading(false));
      }
      if (activeTab === 'Bounce Rate' && !bounceData && !bounceLoading) {
        setBounceLoading(true);
        fetch(BOUNCE_API_URL)
          .then(res => res.json())
          .then(data => {
            setBounceData({ dates: data.end_date, values: data.bounce_rate });
          })
          .catch(() => setBounceData(null))
          .finally(() => setBounceLoading(false));
      }
      if (activeTab === 'Session Duration' && !durationData && !durationLoading) {
        setDurationLoading(true);
        fetch(DURATION_API_URL)
          .then(res => res.json())
          .then(data => {
            setDurationData({ dates: data.end_date, values: data.duration });
          })
          .catch(() => setDurationData(null))
          .finally(() => setDurationLoading(false));
      }
    }
    fetchData();
  }, [activeTab,data_source_id]);


  const tabs = ['Users', 'Sessions', 'Click Through Rate', 'Bounce Rate', 'Session Duration'] as const;
  type Tab = typeof tabs[number];

  // Per-tab display properties (color, gradient, value, change, etc.)
  const tabMeta: Record<Tab, {
    color: string;
    gradientColor: string;
    value?: string;
    change?: string;
    valueSuffix?: string;
    changeSuffix?: string;
  }> = {
    'Users': {
      color: '#3b82f6',
      gradientColor: 'rgba(59, 130, 246, 0.3)',
      valueSuffix: '',
      changeSuffix: '%',
    },
    'Sessions': {
      color: '#10b981',
      gradientColor: 'rgba(16, 185, 129, 0.3)',
      valueSuffix: '',
      changeSuffix: '%',
    },
    'Click Through Rate': {
      color: '#f59e0b',
      gradientColor: 'rgba(245, 158, 11, 0.3)',
      value: '3.3%',
      change: '+0.8%',
    },
    'Bounce Rate': {
      color: '#ef4444',
      gradientColor: 'rgba(239, 68, 68, 0.3)',
      value: '30%',
      change: '-5.2%',
    },
    'Session Duration': {
      color: '#8b5cf6',
      gradientColor: 'rgba(139, 92, 246, 0.3)',
      value: '4:35',
      change: '+15.3%',
    },
  };

  // Determine loading state
  let isLoading = (() => {
    switch (activeTab) {
      case 'Users': return !usersData && usersLoading;
      case 'Sessions': return !sessionsData && sessionsLoading;
      case 'Click Through Rate': return !ctrData && ctrLoading;
      case 'Bounce Rate': return !bounceData && bounceLoading;
      case 'Session Duration': return !durationData && durationLoading;
      default: return false;
    }
  })();

  // Determine chart data and labels
  const chartData = (() => {
    if (isLoading) return Array(12).fill(0);

    switch (activeTab) {
      case 'Users': return usersData?.values.map(d => d.toFixed(1)) || [];
      case 'Sessions': return sessionsData?.values.map(d => d.toFixed(1)) || [];
      case 'Click Through Rate': return ctrData?.values.map(d => d.toFixed(1)) || [];
      case 'Bounce Rate': return bounceData?.values.map(d => d.toFixed(2)) || [];
      case 'Session Duration': return durationData?.values.map(d => d.toFixed(1)) || [];
      default: return [];
    }
  })();

  const chartLabels = (() => {
    if (isLoading) return Array(12).fill('');

    switch (activeTab) {
      case 'Users':
        return usersData?.dates?.map(d => new Date(d).toLocaleDateString()) || [];
      case 'Sessions':
        return sessionsData?.dates?.map(d => new Date(d).toLocaleDateString()) || [];
      case 'Click Through Rate':
        return ctrData?.dates || [];
      case 'Bounce Rate':
        return bounceData?.dates || [];
      case 'Session Duration':
        return durationData?.dates || [];
      default:
        return [];
    }
  })();

  const meta = tabMeta[activeTab];

  // Helper to format minutes as mm:ss
  function formatMinutes(val: number) {
    const min = Math.floor(val);
    const sec = Math.round((val - min) * 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  // Calculate value and change for the current tab
  const calculateMetrics = () => {
    let value: string | undefined = meta.value;
    let change: string | undefined = meta.change;

    const calculateChange = (current: number, previous: number): string => {
      const diff = previous === 0 ? 0 : ((current - previous) / previous) * 100;
      return `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
    };

    switch (activeTab) {
      case 'Users':
        if (usersData?.values?.length) {
          const vals = usersData.values;
          value = vals[vals.length - 1].toLocaleString();
          if (vals.length > 1) {
            change = calculateChange(vals[vals.length - 1], vals[vals.length - 2]);
          }
        }
        break;

      case 'Sessions':
        if (sessionsData?.values?.length) {
          const vals = sessionsData.values;
          value = vals[vals.length - 1].toLocaleString();
          if (vals.length > 1) {
            change = calculateChange(vals[vals.length - 1], vals[vals.length - 2]);
          }
        }
        break;

      case 'Click Through Rate':
      case 'Bounce Rate':
        const rateData = activeTab === 'Click Through Rate' ? ctrData : bounceData;
        if (rateData?.values?.length) {
          const vals = rateData.values;
          value = `${vals[vals.length - 1].toFixed(1)}%`;
          if (vals.length > 1) {
            change = calculateChange(vals[vals.length - 1], vals[vals.length - 2]);
          }
        }
        break;

      case 'Session Duration':
        if (durationData?.values?.length) {
          const vals = durationData.values;
          value = formatMinutes(vals[vals.length - 1]);
          if (vals.length > 1) {
            change = calculateChange(vals[vals.length - 1], vals[vals.length - 2]);
          }
        }
        break;
    }

    return { value, change };
  };

  const { value, change } = calculateMetrics();

  // Show skeleton/loader for API tabs
  isLoading = (
    (activeTab === 'Users' && usersLoading) ||
    (activeTab === 'Sessions' && sessionsLoading) ||
    (activeTab === 'Click Through Rate' && ctrLoading) ||
    (activeTab === 'Bounce Rate' && bounceLoading) ||
    (activeTab === 'Session Duration' && durationLoading)
  );

  const chartOption = {
    grid: {
      left: '0',
      right: '0',
      top: '10',
      bottom: '0',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartLabels,
      show: false,
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      show: false,
      min: (value: any) => Math.max(0, value.min - (value.max - value.min) * 0.2) // Add some padding at the bottom
    },
    series: [{
      data: chartData,
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#0077b6',
        width: 2
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: 'rgba(0, 119, 182, 0.2)'
          }, {
            offset: 1,
            color: 'rgba(0, 119, 182, 0)'
          }]
        }
      },
      showSymbol: !isLoading,
      animation: !isLoading,
      emphasis: {
        scale: true
      }
    }],
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        if (isLoading) return 'Loading...';
        const data = params[0];
        return `${data.name}<br/>${data.value}`;
      },
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.1)',
          width: 1
        }
      }
    },
    animation: !isLoading
  };

  // Show loading skeleton if data is being fetched
  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="relative h-32 w-full overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-3/4">
            <div className="relative h-full w-full">
              {/* Chart line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
              {/* Animated wave line */}
              <div className="absolute bottom-0 left-0 right-0 h-full">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                  <path 
                    d="M0,80 C20,60 40,70 50,50 C60,30 80,40 100,20" 
                    fill="none" 
                    stroke="#e5e7eb" 
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (chartData.length === 0) {
      return (
        <div className="h-32 flex items-center justify-center text-gray-500">
          No data available
        </div>
      );
    }

    return (
      <ReactECharts
        option={chartOption}
        style={{ height: '128px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    );
  };


  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
      {children}

      {/* Tabs */}
      <div className="flex space-x-6 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-1 text-sm font-medium transition-colors duration-200 ${activeTab === tab
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Metric Value and Change */}
      <div className="mb-4">
        <div className="mt-6">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {isLoading ? (
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            ) : value}
          </div>
          {change && (
            <div className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
              {isLoading ? (
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mt-1"></div>
              ) : `${change} vs last month`}
            </div>
          )}
          <div className="h-32 mt-4">
            {renderChart()}
          </div>
        </div>
      </div>
    </div>
  );
};


export default TabbedMetricsCard;