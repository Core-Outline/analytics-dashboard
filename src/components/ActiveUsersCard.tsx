import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

const ActiveUsersCard: React.FC = () => {
  const [activeUsers, setActiveUsers] = useState(2847);
  const [chartData, setChartData] = useState([
    120, 135, 118, 142, 165, 158, 172, 189, 175, 192, 210, 205,
    198, 215, 232, 225, 240, 255, 248, 265, 280, 275, 290, 285
  ]);

  // Simulate real-time updates every minute
  useEffect(() => {
    const interval = setInterval(() => {
      // Update active users count (±50 users randomly)
      setActiveUsers(prev => {
        const change = Math.floor(Math.random() * 100) - 50;
        return Math.max(2500, Math.min(3200, prev + change));
      });

      // Update chart data - shift array and add new value
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        const lastValue = prev[prev.length - 1];
        const change = Math.floor(Math.random() * 60) - 30;
        const newValue = Math.max(80, Math.min(320, lastValue + change));
        newData.push(newValue);
        return newData;
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Generate time labels for the last 24 hours
  const timeLabels = Array.from({ length: 24 }, (_, i) => {
    const hour = (new Date().getHours() - 23 + i + 24) % 24;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

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
                color: '#3b82f6'
              },
              {
                offset: 1,
                color: '#93c5fd'
              }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: '60%'
      }
    ],
    tooltip: {
      show: false
    },
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut'
  };

  // Most visited pages data
  const mostVisitedPages = [
    { page: '/dashboard', users: 1245 },
    { page: '/analytics', users: 987 },
    { page: '/settings', users: 756 }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Active Users Count */}
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">Currently Active Users</div>
        <div className="text-4xl font-bold text-gray-900 transition-all duration-1000">
          {activeUsers.toLocaleString()}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mb-8">
        <ReactECharts 
          option={chartOption} 
          style={{ height: '200px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>

      {/* Most Visited Pages Table */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Most Visited Pages</h4>
        <div className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-sm font-medium text-gray-600 pb-3">Page</th>
                <th className="text-right text-sm font-medium text-gray-600 pb-3">Users</th>
              </tr>
            </thead>
            <tbody>
              {mostVisitedPages.map((page, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-b-0">
                  <td className="text-sm text-gray-900 py-3 font-mono">{page.page}</td>
                  <td className="text-sm text-gray-900 py-3 text-right font-medium">
                    {page.users.toLocaleString()}
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