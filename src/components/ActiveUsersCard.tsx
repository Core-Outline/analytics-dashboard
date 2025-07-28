import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

const ACTIVE_USERS_API_URL = 'http://localhost:5000/active-users?company=101';
const PAGE_VISITS_API_URL = 'http://localhost:5000/page-visits?company=101';

const ActiveUsersCard: React.FC = () => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [chartData, setChartData] = useState<number[]>([]);
  const [mostVisitedPages, setMostVisitedPages] = useState<{ page: string; users: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [pageVisits, setPageVisits] = useState<{ page_name: string; count: number; duration: string }[]>([]);

  // Generate time labels for the last 24 hours
  const timeLabels = Array.from({ length: 24 }, (_, i) => {
    const hour = (new Date().getHours() - 23 + i + 24) % 24;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // Chart option (must be inside component)
  const chartOption = {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: timeLabels,
      show: false
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [
      {
        type: 'bar',
        data: chartData,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#ffffff'
              },
              {
                offset: 1,
                color: 'rgba(255, 255, 255, 0.6)'
              }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: '60%'
      }
    ],
    tooltip: {
      show: true,
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151', fontSize: 12 },
      formatter: function (params: any) {
        const p = params[0];
        return `<div style=\"font-weight:600; margin-bottom:4px;\">${p.axisValue}</div><div>${p.marker} Active Users: <b>${p.data}</b></div>`;
      }
    },
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut'
  };

  // Fetch function
  const fetchActiveUsers = () => {
    fetch(ACTIVE_USERS_API_URL)
      .then(res => res.json())
      .then((data) => {
        console.log("Active users: ", data);
        // Unique active users
        const uniqueUsers = new Set(data.map((row: any) => row.user_id));
        setActiveUsers(uniqueUsers.size);

        // Chart: count of active users per hour (last 24 hours)
        const now = new Date();
        const hours = Array.from({ length: 24 }, (_, i) => (now.getHours() - 23 + i + 24) % 24);
        const hourCounts: Record<number, Set<number>> = {};
        hours.forEach(h => { hourCounts[h] = new Set(); });
        data.forEach((row: any) => {
          const d = new Date(row.start_date.replace(/\s+/, 'T'));
          const h = d.getHours();
          if (hourCounts[h]) hourCounts[h].add(row.user_id);
        });
        setChartData(hours.map(h => hourCounts[h].size));
      })
      .catch(() => {
        setActiveUsers(0);
        setChartData(Array(24).fill(0));
        setMostVisitedPages([]);
      })
      .finally(() => {
        setLoading(false);
        setFirstLoad(false);
      });
  };

  // Fetch page visits for most visited pages table
  const fetchPageVisits = () => {
    fetch(PAGE_VISITS_API_URL)
      .then(res => res.json())
      .then((data) => {
        setPageVisits(data.sort((a: any, b: any) => b.count - a.count).slice(0, 5));
      })
      .catch(() => setPageVisits([]));
  };

  useEffect(() => {
    setLoading(true);
    fetchActiveUsers();
    fetchPageVisits();
    const interval = setInterval(() => {
      fetchActiveUsers();
      fetchPageVisits();
    }, 60000); // 1 minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-blue-500/90 backdrop-blur-sm border border-blue-400/50 p-6 rounded-lg shadow-sm">
      {/* Active Users Count */}
      <div className="mb-6">
        <div className="text-sm text-white/80 mb-2">Currently Active Users</div>
        <div className="text-4xl font-bold text-white transition-all duration-1000">
          {firstLoad && loading ? <span className="animate-pulse">...</span> : activeUsers.toLocaleString()}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mb-8">
        {firstLoad && loading ? (
          <div className="h-[200px] w-full bg-white/10 animate-pulse rounded" />
        ) : (
          <ReactECharts
            option={chartOption}
            style={{ height: '200px', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        )}
      </div>

      {/* Most Visited Pages Table */}
      <div>
        <h4 className="text-lg font-medium text-white mb-4">Most Visited Pages</h4>
        <div className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left text-sm font-medium text-white/80 pb-3">Page</th>
                <th className="text-right text-sm font-medium text-white/80 pb-3">Visits</th>
              </tr>
            </thead>
            <tbody>
              {firstLoad && loading ? (
                <tr><td colSpan={2}><div className="h-6 w-full bg-white/10 animate-pulse rounded" /></td></tr>
              ) : pageVisits.map((page, index) => (
                <tr key={index} className="border-b border-white/10 last:border-b-0">
                  <td className="text-sm text-white py-3 font-mono">{page.page_name}</td>
                  <td className="text-sm text-white py-3 text-right font-medium">
                    {page.count.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActiveUsersCard;