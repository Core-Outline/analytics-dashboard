import React from 'react';
import { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { RotateCcw, MoreHorizontal, ChevronRight } from 'lucide-react';

const OrderLocationsCard: React.FC = () => {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Register a simplified world map using ECharts built-in world map
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(response => response.json())
      .then(worldGeoJson => {
        echarts.registerMap('world', worldGeoJson);
        setMapReady(true);
      })
      .catch(() => {
        // Fallback: use a simple world map configuration
        console.warn('Could not load world map data, using fallback');
        setMapReady(false);
      });
  }, []);

  // --- API State ---
  interface CountryStat {
    country: string;
    count: number;
    percentage: number;
  }
  interface MergedCountry {
    country: string;
    sessions: number;
    users: number;
    percentage: number;
  }
  const [sessionsData, setSessionsData] = useState<CountryStat[]>([]);
  const [usersData, setUsersData] = useState<CountryStat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch('http://localhost:5000/user-sessions-country?company=101')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setSessionsData(data.sessions || []);
        setUsersData(data.users || []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  // Merge sessions and users by country
  const mergedData: MergedCountry[] = sessionsData.map(session => {
    const user = usersData.find(u => u.country === session.country);
    return {
      country: session.country,
      sessions: session.count,
      users: user ? user.count : 0,
      percentage: session.percentage
    };
  });

  // For the map
  const mapData = mergedData.map(item => ({
    name: item.country,
    value: item.sessions
  }));

  // For the table (top 6 by sessions)
  const tableData = [...mergedData].sort((a, b) => b.sessions - a.sessions).slice(0, 6);

  const mapOption = {
    geo: {
      map: 'world',
      roam: false,
      zoom: 1.2,
      center: [0, 20],
      itemStyle: {
        areaColor: '#e6f3ff',
        borderColor: '#ffffff',
        borderWidth: 1
      },
      emphasis: {
        itemStyle: {
          areaColor: '#4a90e2'
        }
      }
    },
    series: [
      {
        type: 'map',
        geoIndex: 0,
        data: mapData
      }
    ],
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151',
        fontSize: 12
      },
      formatter: function(params: any) {
        const locationInfo = mergedData.find(item => item.country === params.name);
        if (locationInfo) {
          return `
            <div style="font-weight: 600; margin-bottom: 4px;">${params.name}</div>
            <div>Sessions: ${locationInfo.sessions.toLocaleString()}</div>
            <div>Users: ${locationInfo.users.toLocaleString()}</div>
            <div>Percentage: ${locationInfo.percentage?.toFixed(2)}%</div>
          `;
        }
        return params.name;
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Order Locations</h3>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* World Map */}
      <div className="mb-8">
        {mapReady ? (
          <ReactECharts 
            option={mapOption}
            style={{ height: '400px', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        ) : (
          <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500 text-sm">Loading world map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-8 text-center text-gray-400">Loading data...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">Failed to load location data.</div>
        ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-sm font-medium text-gray-500 pb-3 flex items-center">
                Country
                <svg className="w-3 h-3 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </th>
              <th className="text-left text-sm font-medium text-gray-500 pb-3">
  <span className="flex items-center">
    Sessions
    <svg className="w-3 h-3 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  </span>
</th>
              <th className="text-left text-sm font-medium text-gray-500 pb-3">
  <span className="flex items-center">
    Users
    <svg className="w-3 h-3 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  </span>
</th>
              <th className="text-right text-sm font-medium text-gray-500 pb-3">
                Percentage
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((location, index) => (
              <tr key={index} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                <td className="text-sm text-gray-900 py-4 font-medium">
                  {location.country}
                </td>
                <td className="text-sm text-gray-900 py-4 font-medium">
                  {location.sessions.toLocaleString()}
                </td>
                <td className="text-sm text-gray-900 py-4 font-medium">
                  {location.users.toLocaleString()}
                </td>
                <td className="text-sm text-gray-900 py-4 text-right font-medium">
                  {location.percentage?.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {/* View All Link */}
      <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
          <span>View all</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default OrderLocationsCard;