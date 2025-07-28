import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

const UsersByCountryMap: React.FC = () => {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Load world map GeoJSON data
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(response => response.json())
      .then(worldGeoJson => {
        echarts.registerMap('world', worldGeoJson);
        setMapReady(true);
      })
      .catch(() => {
        console.warn('Could not load world map data, using fallback');
        setMapReady(false);
      });
  }, []);

  // Sample data for users by country (country code, user count)
  const countryData = [
    { name: 'United States', value: 15420, code: 'US' },
    { name: 'China', value: 12850, code: 'CN' },
    { name: 'India', value: 9680, code: 'IN' },
    { name: 'Germany', value: 7320, code: 'DE' },
    { name: 'United Kingdom', value: 6890, code: 'GB' },
    { name: 'France', value: 5640, code: 'FR' },
    { name: 'Japan', value: 5280, code: 'JP' },
    { name: 'Canada', value: 4750, code: 'CA' },
    { name: 'Australia', value: 3920, code: 'AU' },
    { name: 'Brazil', value: 3680, code: 'BR' },
    { name: 'Netherlands', value: 2840, code: 'NL' },
    { name: 'Sweden', value: 2560, code: 'SE' },
    { name: 'South Korea', value: 2340, code: 'KR' },
    { name: 'Italy', value: 2180, code: 'IT' },
    { name: 'Spain', value: 1950, code: 'ES' },
    { name: 'Mexico', value: 1720, code: 'MX' },
    { name: 'Russia', value: 1680, code: 'RU' },
    { name: 'Singapore', value: 1420, code: 'SG' },
    { name: 'Norway', value: 1280, code: 'NO' },
    { name: 'Switzerland', value: 1150, code: 'CH' },
    { name: 'Belgium', value: 980, code: 'BE' },
    { name: 'Denmark', value: 850, code: 'DK' },
    { name: 'Finland', value: 720, code: 'FI' },
    { name: 'Austria', value: 680, code: 'AT' },
    { name: 'New Zealand', value: 540, code: 'NZ' }
  ];

  // Find min and max values for color scaling
  const values = countryData.map(item => item.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  // Function to calculate color based on user count
  const getCountryColor = (value: number, min: number, max: number) => {
    const ratio = (value - min) / (max - min);
    const blues = [
      '#e6f3ff', // Lightest blue
      '#bfdbfe',
      '#93c5fd',
      '#60a5fa',
      '#3b82f6',
      '#2563eb',
      '#1d4ed8',
      '#1e40af' // Darkest blue
    ];
    const index = Math.floor(ratio * (blues.length - 1));
    return blues[index];
  };

  const option = {
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
      regions: countryData.map(country => ({
        name: country.name,
        itemStyle: {
          areaColor: getCountryColor(country.value, minValue, maxValue)
        }
      }))
    },
    series: [
      {
        type: 'map',
        geoIndex: 0,
        data: countryData.map(country => ({
          name: country.name,
          value: country.value
        }))
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
        const countryInfo = countryData.find(item => item.name === params.name);
        if (countryInfo) {
          return `
            <div style="font-weight: 600; margin-bottom: 4px;">${params.name}</div>
            <div>${countryInfo.value.toLocaleString()} users</div>
          `;
        }
        return params.name;
      },
    }
  };

  // Top countries table data
  const topCountries = countryData.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* World Map */}
      <div className="h-80">
        {mapReady ? (
          <ReactECharts 
            option={option} 
            style={{ height: '320px', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        ) : (
          <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500 text-sm">Loading world map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Top Countries Table */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">Top Countries</h4>
        <div className="grid grid-cols-2 gap-4">
          {topCountries.map((country, index) => (
            <div key={country.code} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-4 bg-gradient-to-r from-blue-200 to-blue-600 rounded-sm flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{index + 1}</span>
                </div>
                <span className="text-sm text-gray-900">{country.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {country.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersByCountryMap;