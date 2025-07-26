import React from 'react';
import ReactECharts from 'echarts-for-react';

const UsersByCountryMap: React.FC = () => {
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