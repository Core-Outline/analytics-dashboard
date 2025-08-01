import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { RotateCcw, MoreHorizontal, ChevronRight } from 'lucide-react';

const OrderLocationsCard: React.FC = () => {
  const [mapReady, setMapReady] = useState(false);
  const [sessionData, setSessionData] = useState<any[]>([]);
  const [userData, setUserData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(response => response.json())
      .then(worldGeoJson => {
        echarts.registerMap('world', worldGeoJson);
        setMapReady(true);
      })
      .catch(() => {
        setMapReady(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/user-sessions-country?company=101')
      .then(res => res.json())
      .then(data => {
        setSessionData(data.sessions);
        setUserData(data.users);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  // Map data for visualization
  const mapData = sessionData.map(item => ({
    name: item.country,
    value: item.count
  }));

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
      },
      regions: sessionData.map((item, idx) => ({
        name: item.country,
        itemStyle: { areaColor: ['#1e40af','#2563eb','#3b82f6','#60a5fa','#93c5fd','#bfdbfe','#dbeafe','#eff6ff'][idx % 8] }
      }))
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
        const locationInfo = sessionData.find(item => item.country === params.name);
        if (locationInfo) {
          return `
            <div style="font-weight: 600; margin-bottom: 4px;">${params.name}</div>
            <div>Sessions: ${locationInfo.count.toLocaleString()}</div>
            <div>Percentage: ${locationInfo.percentage.toFixed(2)}%</div>
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
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">Error loading data</div>
        ) : (
        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left text-xs font-semibold text-gray-700 py-2 px-3 rounded-tl-lg">Country</th>
              <th className="text-right text-xs font-semibold text-gray-700 py-2 px-3">Sessions</th>
              <th className="text-right text-xs font-semibold text-gray-700 py-2 px-3">Users</th>
              <th className="text-right text-xs font-semibold text-gray-700 py-2 px-3 rounded-tr-lg">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {sessionData.map((session, idx) => {
              const user = userData.find(u => u.country === session.country);
              return (
                <tr key={idx} className="bg-white shadow-sm rounded-lg transition hover:bg-blue-50">
                  <td className="py-3 px-3 text-sm font-medium text-gray-900">{session.country}</td>
                  <td className="py-3 px-3 text-sm text-right font-semibold text-blue-700">{session.count.toLocaleString()}</td>
                  <td className="py-3 px-3 text-sm text-right font-semibold text-green-700">{user ? user.count.toLocaleString() : '-'}</td>
                  <td className="py-3 px-3 text-sm text-right font-semibold text-purple-700">{session.percentage.toFixed(2)}%</td>
                </tr>
              );
            })}
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