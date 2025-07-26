import React, { useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

// World map GeoJSON data with proper structure for ECharts
const worldGeoJson = {
  type: "FeatureCollection",
  UTF8Encoding: true,
  features: [
    {
      type: "Feature",
      properties: { 
        name: "United States",
        NAME: "United States",
        NAME_LONG: "United States of America"
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [[[-158.0, 22.0], [-158.0, 50.0], [-68.0, 50.0], [-68.0, 22.0], [-158.0, 22.0]]],
          [[[-179.0, 51.0], [-130.0, 51.0], [-130.0, 72.0], [-179.0, 72.0], [-179.0, 51.0]]]
        ]
      }
    },
    {
      type: "Feature",
      properties: { 
        name: "China",
        NAME: "China",
        NAME_LONG: "People's Republic of China"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[73.0, 18.0], [135.0, 18.0], [135.0, 54.0], [73.0, 54.0], [73.0, 18.0]]]
      }
    },
    {
      type: "Feature",
      properties: { 
        name: "India",
        NAME: "India",
        NAME_LONG: "Republic of India"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[68.0, 6.0], [97.0, 6.0], [97.0, 37.0], [68.0, 37.0], [68.0, 6.0]]]
      }
    },
    {
      type: "Feature",
      properties: { 
        name: "Germany",
        NAME: "Germany",
        NAME_LONG: "Federal Republic of Germany"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[5.0, 47.0], [15.0, 47.0], [15.0, 55.0], [5.0, 55.0], [5.0, 47.0]]]
      }
    },
    {
      type: "Feature",
      properties: { 
        name: "United Kingdom",
        NAME: "United Kingdom",
        NAME_LONG: "United Kingdom of Great Britain and Northern Ireland"
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [[[-8.0, 49.0], [2.0, 49.0], [2.0, 61.0], [-8.0, 61.0], [-8.0, 49.0]]],
          [[[-6.0, 54.0], [-4.0, 54.0], [-4.0, 56.0], [-6.0, 56.0], [-6.0, 54.0]]]
        ]
      }
    },
    {
      type: "Feature",
      properties: { 
        name: "France",
        NAME: "France",
        NAME_LONG: "French Republic"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[-5.0, 42.0], [8.0, 42.0], [8.0, 51.0], [-5.0, 51.0], [-5.0, 42.0]]]
      }
    },
    {
      type: "Feature",
      properties: { 
        name: "Japan",
        NAME: "Japan",
        NAME_LONG: "Japan"
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [[[129.0, 31.0], [146.0, 31.0], [146.0, 46.0], [129.0, 46.0], [129.0, 31.0]]],
          [[[142.0, 43.0], [146.0, 43.0], [146.0, 46.0], [142.0, 46.0], [142.0, 43.0]]]
        ]
      }
    },
    {
      type: "Feature",
      properties: { 
        name: "Canada",
        NAME: "Canada",
        NAME_LONG: "Canada"
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [[[-141.0, 42.0], [-52.0, 42.0], [-52.0, 84.0], [-141.0, 84.0], [-141.0, 42.0]]],
          [[[-95.0, 49.0], [-74.0, 49.0], [-74.0, 62.0], [-95.0, 62.0], [-95.0, 49.0]]]
        ]
      }
    },
    {
      type: "Feature",
      properties: { 
        name: "Australia",
        NAME: "Australia",
        NAME_LONG: "Commonwealth of Australia"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[113.0, -44.0], [154.0, -44.0], [154.0, -10.0], [113.0, -10.0], [113.0, -44.0]]]
      }
    },
    {
      type: "Feature",
      properties: { 
        name: "Brazil",
        NAME: "Brazil",
        NAME_LONG: "Federative Republic of Brazil"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[-74.0, -34.0], [-34.0, -34.0], [-34.0, 5.0], [-74.0, 5.0], [-74.0, -34.0]]]
      }
    },
    {
      type: "Feature",
      properties: { 
        name: "Russia",
        NAME: "Russia",
        NAME_LONG: "Russian Federation"
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [[[19.0, 41.0], [180.0, 41.0], [180.0, 82.0], [19.0, 82.0], [19.0, 41.0]]],
          [[[-180.0, 65.0], [-168.0, 65.0], [-168.0, 72.0], [-180.0, 72.0], [-180.0, 65.0]]]
        ]
      }
    },
    {
      type: "Feature",
      properties: { 
        name: "Mexico",
        NAME: "Mexico",
        NAME_LONG: "United Mexican States"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[-118.0, 14.0], [-86.0, 14.0], [-86.0, 33.0], [-118.0, 33.0], [-118.0, 14.0]]]
      }
    }
  ],
  regions: []
};

const UsersByCountryMap: React.FC = () => {
  useEffect(() => {
    // Register the world map with ECharts
    echarts.registerMap('world', worldGeoJson);
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

  const option = {
    geo: {
      map: 'world',
      roam: true,
      zoom: 1.2,
      center: [0, 20],
      itemStyle: {
        areaColor: '#f8fafc',
        borderColor: '#e2e8f0',
        borderWidth: 0.5
      },
      emphasis: {
        itemStyle: {
          areaColor: '#e2e8f0',
          borderColor: '#94a3b8',
          borderWidth: 1
        }
      },
      regions: [
        {
          name: 'Antarctica',
          itemStyle: {
            areaColor: '#f1f5f9',
            borderColor: '#e2e8f0'
          }
        }
      ]
    },
    visualMap: {
      min: minValue,
      max: maxValue,
      left: 'left',
      top: 'bottom',
      text: ['High', 'Low'],
      calculable: true,
      inRange: {
        color: ['#e0f2fe', '#0ea5e9', '#0284c7', '#0369a1', '#1e40af', '#1e3a8a']
      },
      textStyle: {
        color: '#6b7280',
        fontSize: 12
      },
      formatter: function(value: number) {
        return Math.round(value).toLocaleString();
      }
    },
    series: [
      {
        name: 'Users',
        type: 'map',
        geoIndex: 0,
        data: countryData,
        emphasis: {
          itemStyle: {
            borderColor: '#374151',
            borderWidth: 2
          }
        }
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
        if (params.data) {
          return `
            <div style="font-weight: 600; margin-bottom: 4px;">${params.data.name}</div>
            <div>${params.data.value.toLocaleString()} users</div>
          `;
        }
        return `${params.name}<br/>No data`;
      }
    }
  };

  // Top countries table data
  const topCountries = countryData.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* World Map */}
      <div className="h-80">
        <ReactECharts 
          option={option} 
          style={{ height: '320px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
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