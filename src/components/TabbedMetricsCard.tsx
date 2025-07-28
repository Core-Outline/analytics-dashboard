import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

const USERS_API_URL = 'http://127.0.0.1:5000/users?time_units=M&company=101&data_source_id=101';
const SESSIONS_API_URL = 'http://127.0.0.1:5000/sessions?time_units=M&company=101';
const CTR_API_URL = 'http://127.0.0.1:5000/click-through-rate?time_units=M&company=101';
const BOUNCE_API_URL = 'http://localhost:5000/bounce-rate?time_units=M&company=101';
const DURATION_API_URL = 'http://localhost:5000/session-duration?company=101&time_units=M';

const TabbedMetricsCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Users');
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

  useEffect(() => {
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
  }, [activeTab, usersData, usersLoading, sessionsData, sessionsLoading, ctrData, ctrLoading, bounceData, bounceLoading, durationData, durationLoading]);

  const tabs = ['Users', 'Sessions', 'Click Through Rate', 'Bounce Rate', 'Session Duration'];

  // Per-tab display properties (color, gradient, value, change, etc.)
  const tabMeta: Record<string, {
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

  // Fallback/sample data for non-API tabs
  const fallbackData: Record<string, number[]> = {
    'Users': [1200, 1350, 1180, 1420, 1650, 1580, 1720, 1890, 1750, 1920, 2100, 2050],
    'Sessions': [2800, 3100, 2950, 3200, 3450, 3300, 3600, 3850, 3700, 3950, 4200, 4100],
    'Click Through Rate': [2.1, 2.3, 2.0, 2.5, 2.8, 2.6, 2.9, 3.1, 2.8, 3.2, 3.5, 3.3],
    'Bounce Rate': [45, 42, 48, 40, 38, 41, 35, 33, 36, 31, 28, 30],
    'Session Duration': [180, 195, 175, 210, 225, 205, 240, 255, 235, 270, 285, 275],
  };

  // Determine chart data and labels
  const chartData = activeTab === 'Users' && usersData
    ? usersData.values
    : activeTab === 'Sessions' && sessionsData
      ? sessionsData.values
      : activeTab === 'Click Through Rate' && ctrData
        ? ctrData.values
        : activeTab === 'Bounce Rate' && bounceData
          ? bounceData.values
          : activeTab === 'Session Duration' && durationData
            ? durationData.values
            : fallbackData[activeTab];
  const chartLabels = activeTab === 'Users' && usersData
    ? usersData.dates.map(d => new Date(d).getFullYear().toString())
    : activeTab === 'Sessions' && sessionsData
      ? sessionsData.dates.map(d => new Date(d).getFullYear().toString())
      : activeTab === 'Click Through Rate' && ctrData
        ? ctrData.dates
        : activeTab === 'Bounce Rate' && bounceData
          ? bounceData.dates
          : activeTab === 'Session Duration' && durationData
            ? durationData.dates
            : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const meta = tabMeta[activeTab];

  // Helper to format minutes as mm:ss
  function formatMinutes(val: number) {
    const min = Math.floor(val);
    const sec = Math.round((val - min) * 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  // Calculate value and change for Users/Sessions/CTR/Bounce/Duration from API data
  let value = meta.value;
  let change = meta.change;
  if (activeTab === 'Users' && usersData) {
    const vals = usersData.values;
    if (vals.length > 0) {
      value = vals[vals.length - 1].toLocaleString();
      if (vals.length > 1) {
        const prev = vals[vals.length - 2];
        const diff = prev === 0 ? 0 : ((vals[vals.length - 1] - prev) / prev) * 100;
        change = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
      }
    }
  }
  if (activeTab === 'Sessions' && sessionsData) {
    const vals = sessionsData.values;
    if (vals.length > 0) {
      value = vals[vals.length - 1].toLocaleString();
      if (vals.length > 1) {
        const prev = vals[vals.length - 2];
        const diff = prev === 0 ? 0 : ((vals[vals.length - 1] - prev) / prev) * 100;
        change = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
      }
    }
  }
  if (activeTab === 'Click Through Rate' && ctrData) {
    const vals = ctrData.values;
    if (vals.length > 0) {
      value = `${vals[vals.length - 1].toFixed(1)}%`;
      if (vals.length > 1) {
        const prev = vals[vals.length - 2];
        const diff = prev === 0 ? 0 : ((vals[vals.length - 1] - prev) / prev) * 100;
        change = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
      }
    }
  }
  if (activeTab === 'Bounce Rate' && bounceData) {
    const vals = bounceData.values;
    if (vals.length > 0) {
      value = `${vals[vals.length - 1].toFixed(1)}%`;
      if (vals.length > 1) {
        const prev = vals[vals.length - 2];
        const diff = prev === 0 ? 0 : ((vals[vals.length - 1] - prev) / prev) * 100;
        change = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
      }
    }
  }
  if (activeTab === 'Session Duration' && durationData) {
    const vals = durationData.values;
    if (vals.length > 0) {
      value = formatMinutes(vals[vals.length - 1]);
      if (vals.length > 1) {
        const prev = vals[vals.length - 2];
        const diff = prev === 0 ? 0 : ((vals[vals.length - 1] - prev) / prev) * 100;
        change = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
      }
    }
  }

  // Show skeleton/loader for API tabs
  const isLoading = (activeTab === 'Users' && usersLoading) ||
    (activeTab === 'Sessions' && sessionsLoading) ||
    (activeTab === 'Click Through Rate' && ctrLoading) ||
    (activeTab === 'Bounce Rate' && bounceLoading) ||
    (activeTab === 'Session Duration' && durationLoading);

  const chartOption = {
    grid: {
      left: '0%',
      right: '0%',
      bottom: '0%',
      top: '0%',
      containLabel: false
    },
    xAxis: {
      type: 'category',
      data: chartLabels,
      show: false
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [
      {
        type: 'line',
        data: chartData,
        smooth: true,
        lineStyle: {
          color: meta.color,
          width: 2
        },
        symbol: 'none',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: meta.gradientColor
              },
              {
                offset: 1,
                color: 'rgba(255, 255, 255, 0)'
              }
            ]
          }
        }
      }
    ],
    tooltip: activeTab === 'Users' ? {
      show: true,
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151', fontSize: 12 },
      formatter: function(params: any) {
        const p = params[0];
        return `<div style="font-weight:600; margin-bottom:4px;">${p.axisValue}</div><div>${p.marker} Users: <b>${p.data}</b></div>`;
      }
    } : activeTab === 'Sessions' ? {
      show: true,
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151', fontSize: 12 },
      formatter: function(params: any) {
        const p = params[0];
        return `<div style=\"font-weight:600; margin-bottom:4px;\">${p.axisValue}</div><div>${p.marker} Sessions: <b>${p.data}</b></div>`;
      }
    } : activeTab === 'Click Through Rate' ? {
      show: true,
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151', fontSize: 12 },
      formatter: function(params: any) {
        const p = params[0];
        return `<div style=\"font-weight:600; margin-bottom:4px;\">${p.axisValue}</div><div>${p.marker} Click Through Rate: <b>${p.data.toFixed(1)}%</b></div>`;
      }
    } : activeTab === 'Bounce Rate' ? {
      show: true,
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151', fontSize: 12 },
      formatter: function(params: any) {
        const p = params[0];
        return `<div style=\"font-weight:600; margin-bottom:4px;\">${p.axisValue}</div><div>${p.marker} Bounce Rate: <b>${p.data.toFixed(1)}%</b></div>`;
      }
    } : activeTab === 'Session Duration' ? {
      show: true,
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151', fontSize: 12 },
      formatter: function(params: any) {
        const p = params[0];
        const min = Math.floor(p.data);
        const sec = Math.round((p.data - min) * 60);
        return `<div style=\"font-weight:600; margin-bottom:4px;\">${p.axisValue}</div><div>${p.marker} Session Duration: <b>${min}:${sec.toString().padStart(2, '0')}</b></div>`;
      }
    } : { show: false }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Tabs */}
      <div className="flex space-x-6 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-1 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab
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
        {isLoading ? (
          <div className="h-10 w-32 bg-gray-100 animate-pulse rounded mb-1" />
        ) : (
          <>
            <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
            {change && (
              <div className={`text-sm font-medium ${
                change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {change} vs last month
              </div>
            )}
          </>
        )}
      </div>

      {/* Chart */}
      <div className="h-32">
        {isLoading ? (
          <div className="h-full w-full bg-gray-100 animate-pulse rounded" />
        ) : (
          <ReactECharts 
            option={chartOption} 
            style={{ height: '128px', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        )}
      </div>
    </div>
  );
};

export default TabbedMetricsCard;