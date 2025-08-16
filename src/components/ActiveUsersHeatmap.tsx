import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { useLocation} from 'react-router-dom';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const hours = Array.from({ length: 24 }, (_, h) => `${h.toString().padStart(2, '0')}:00`);

const ActiveUsersHeatmap: React.FC = () => {
  const [heatmapData, setHeatmapData] = useState<number[][]>(Array(7).fill(null).map(() => Array(24).fill(0)));
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const organization_id = searchParams.get('organization_id') || '301';

  const USERS_API_URL = `https://data.coreoutline.com/active-users?company=${organization_id}`;

  useEffect(() => {
    const fetchHeatmap = () => {
      fetch(USERS_API_URL)
        .then(res => res.json())
        .then(data => {
          // Bin unique users by [weekday][hour]
          const map: Record<number, Record<number, Set<number>>> = {};
          for (let d = 0; d < 7; d++) {
            map[d] = {};
            for (let h = 0; h < 24; h++) map[d][h] = new Set();
          }
          data.forEach((row: any) => {
            const dt = new Date(row.start_date.replace(/\s+/, 'T'));
            const weekday = dt.getDay();
            const hour = dt.getHours();
            map[weekday][hour].add(row.user_id);
          });
          const arr = Array(7).fill(null).map((_, d) => Array(24).fill(0));
          for (let d = 0; d < 7; d++) {
            for (let h = 0; h < 24; h++) {
              arr[d][h] = map[d][h].size;
            }
          }
          setHeatmapData(arr);
        })
        .catch(() => setHeatmapData(Array(7).fill(null).map(() => Array(24).fill(0))))
        .finally(() => {
          setLoading(false);
          setFirstLoad(false);
        });
    };
    setLoading(true);
    fetchHeatmap();
    const interval = setInterval(fetchHeatmap, 60000);
    return () => clearInterval(interval);
  }, []);

  // ECharts expects [day, hour, value] for each cell (x=day, y=hour)
  const echartsData = [];
  for (let h = 0; h < 24; h++) {
    for (let d = 0; d < 7; d++) {
      echartsData.push([d, h, heatmapData[d][h]]);
    }
  }

  const chartOption = {
    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151', fontSize: 12 },
      formatter: function(params: any) {
        const day = days[params.data[0]];
        const hour = hours[params.data[1]];
        return `<div style=\"font-weight:600; margin-bottom:4px;\">${day}, ${hour}</div><div>Active Users: <b>${params.data[2]}</b></div>`;
      }
    },
    grid: {
      left: 60,
      right: 20,
      bottom: 30,
      top: 30,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: days,
      splitArea: { show: true },
      axisLabel: { color: '#6b7280', fontSize: 12 },
      axisLine: { lineStyle: { color: '#e5e7eb' } }
    },
    yAxis: {
      type: 'category',
      data: hours,
      splitArea: { show: true },
      axisLabel: { color: '#6b7280', fontSize: 11 },
      axisLine: { lineStyle: { color: '#e5e7eb' } }
    },
    visualMap: {
      min: 0,
      max: Math.max(1, ...echartsData.map(d => d[2])),
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: {
        color: ['#e0e7ff', '#60a5fa', '#2563eb', '#1e40af']
      },
      textStyle: { color: '#6b7280' }
    },
    series: [
      {
        name: 'Active Users',
        type: 'heatmap',
        data: echartsData,
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)'
          }
        }
      }
    ],
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut'
  };

  return (
    <div>
      {firstLoad && loading ? (
        <div className="h-96 w-full bg-gray-100 animate-pulse rounded" />
      ) : (
        <ReactECharts
          option={chartOption}
          style={{ height: '480px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      )}
    </div>
  );
};

export default ActiveUsersHeatmap;