import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

const DEVICE_SESSIONS_API_URL = 'http://localhost:5000/device-sessions?company=101';

const UsersByDeviceCard: React.FC = () => {
  const [deviceData, setDeviceData] = useState<{ browser: string[]; count: number[]; percentage: number[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);

  const fetchDeviceData = () => {
    fetch(DEVICE_SESSIONS_API_URL)
      .then(res => res.json())
      .then(data => {
        setDeviceData(data);
      })
      .catch(() => setDeviceData(null))
      .finally(() => {
        setLoading(false);
        setFirstLoad(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    fetchDeviceData();
    const interval = setInterval(() => {
      fetchDeviceData();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const chartOption = deviceData ? {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151', fontSize: 12 },
    },
    legend: {
      orient: 'vertical',
      left: 0,
      top: 'middle',
      textStyle: { color: '#374151', fontSize: 12 },
      data: deviceData.browser
    },
    series: [
      {
        name: 'Sessions',
        type: 'pie',
        radius: ['30%', '80%'],
        center: ['60%', '50%'],
        roseType: 'area', // Nightingale chart
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontWeight: 'bold',
            formatter: '{b}: {d}%'
          }
        },
        data: deviceData.browser.map((b, i) => ({
          value: deviceData.count[i],
          name: b
        })).sort((a, b) => b.value - a.value) // Order items top-to-bottom
      }
    ]
  } : {};

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Users by Device/Browser</h3>
      <div className="flex flex-col items-center">
        <div className="w-full mb-6">
          {firstLoad && loading ? (
            <div className="h-48 w-full bg-gray-100 animate-pulse rounded" />
          ) : (
            <ReactECharts
              option={chartOption}
              style={{ height: '240px', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          )}
        </div>
        <div className="w-full">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-sm font-medium text-gray-500 pb-2">Browser</th>
                <th className="text-right text-sm font-medium text-gray-500 pb-2">Sessions</th>
                <th className="text-right text-sm font-medium text-gray-500 pb-2">% Share</th>
              </tr>
            </thead>
            <tbody>
              {firstLoad && loading ? (
                <tr><td colSpan={3}><div className="h-6 w-full bg-gray-100 animate-pulse rounded" /></td></tr>
              ) : deviceData && deviceData.browser.map((b, i) => (
                <tr key={b} className="border-b border-gray-100 last:border-b-0">
                  <td className="text-sm text-gray-900 py-2 font-mono">{b}</td>
                  <td className="text-sm text-gray-900 py-2 text-right font-medium">{deviceData.count[i].toLocaleString()}</td>
                  <td className="text-sm text-gray-900 py-2 text-right font-medium">{deviceData.percentage[i].toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersByDeviceCard;