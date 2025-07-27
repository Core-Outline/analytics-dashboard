import React from 'react';
import { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { RefreshCw, MoreHorizontal, ChevronRight } from 'lucide-react';

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

  // Sample data for order locations
  const locationData = [
    { city: 'New York', country: 'United States', sessions: 12450, users: 8920, percentage: 23.5 },
    { city: 'London', country: 'United Kingdom', sessions: 9680, users: 7240, percentage: 18.2 },
    { city: 'Tokyo', country: 'Japan', sessions: 8320, users: 6180, percentage: 15.6 },
    { city: 'Berlin', country: 'Germany', sessions: 7150, users: 5340, percentage: 13.4 },
    { city: 'Sydney', country: 'Australia', sessions: 5890, users: 4420, percentage: 11.1 },
    { city: 'Toronto', country: 'Canada', sessions: 4720, users: 3580, percentage: 8.9 },
    { city: 'Paris', country: 'France', sessions: 3960, users: 2980, percentage: 7.4 },
    { city: 'Mumbai', country: 'India', sessions: 2840, users: 2150, percentage: 5.3 }
  ];

  // World map data for visualization
  const mapData = locationData.map(item => ({
    name: item.country,
    value: item.sessions
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
      regions: [
        {
          name: 'United States',
          itemStyle: { areaColor: '#1e40af' }
        },
        {
          name: 'United Kingdom', 
          itemStyle: { areaColor: '#2563eb' }
        },
        {
          name: 'Japan',
          itemStyle: { areaColor: '#3b82f6' }
        },
        {
          name: 'Germany',
          itemStyle: { areaColor: '#60a5fa' }
        },
        {
          name: 'Australia',
          itemStyle: { areaColor: '#93c5fd' }
        },
        {
          name: 'Canada',
          itemStyle: { areaColor: '#bfdbfe' }
        },
        {
          name: 'France',
          itemStyle: { areaColor: '#dbeafe' }
        },
        {
          name: 'India',
          itemStyle: { areaColor: '#eff6ff' }
        }
      ]
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
        const locationInfo = locationData.find(item => item.country === params.name);
        if (locationInfo) {
          return `
            <div style="font-weight: 600; margin-bottom: 4px;">${params.name}</div>
            <div>Sessions: ${locationInfo.sessions.toLocaleString()}</div>
            <div>Users: ${locationInfo.users.toLocaleString()}</div>
            <div>Percentage: ${locationInfo.percentage}%</div>
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
            <RefreshCw className="w-5 h-5" />
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
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-sm font-medium text-gray-500 pb-3 flex items-center">
                City
                <svg className="w-3 h-3 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </th>
              <th className="text-left text-sm font-medium text-gray-500 pb-3 flex items-center">
                Sessions
                <svg className="w-3 h-3 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </th>
              <th className="text-left text-sm font-medium text-gray-500 pb-3 flex items-center">
                Users
                <svg className="w-3 h-3 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </th>
              <th className="text-right text-sm font-medium text-gray-500 pb-3">
                Percentage
              </th>
            </tr>
          </thead>
          <tbody>
            {locationData.slice(0, 6).map((location, index) => (
              <tr key={index} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                <td className="text-sm text-gray-900 py-4">
                  <div>
                    <div className="font-medium">{location.city}</div>
                    <div className="text-gray-500 text-xs">{location.country}</div>
                  </div>
                </td>
                <td className="text-sm text-gray-900 py-4 font-medium">
                  {location.sessions.toLocaleString()}
                </td>
                <td className="text-sm text-gray-900 py-4 font-medium">
                  {location.users.toLocaleString()}
                </td>
                <td className="text-sm text-gray-900 py-4 text-right font-medium">
                  {location.percentage}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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