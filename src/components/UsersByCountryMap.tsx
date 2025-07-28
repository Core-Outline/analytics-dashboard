import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

interface CountryYearData {
  country: string;
  country_code: string;
  year: number;
  users: number;
}

interface ApiResponse {
  data: CountryYearData[];
}

const USERS_COUNTRY_API = 'http://localhost:5000/users-country?time_units=M';

const UsersByCountryMap: React.FC = () => {
  const [mapReady, setMapReady] = useState(false);
  const [countryData, setCountryData] = useState<CountryYearData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch world map geojson
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

  // Helper: map country names to ISO codes (expand as needed)
  const COUNTRY_CODE_MAP: Record<string, string> = {
    'USA': 'US',
    'UK': 'GB',
    'India': 'IN',
    'Ireland': 'IE',
    'Kenya': 'KE',
    'South Africa': 'ZA',
  };

  function formatApiData(raw: any[]): CountryYearData[] {
    return raw.map(item => {
      const year = new Date(item.start_date).getFullYear();
      const country = item.country;
      // Try to get ISO code, fallback to empty string
      const country_code = COUNTRY_CODE_MAP[country] || '';
      return {
        country,
        country_code,
        year,
        users: item.amount
      };
    });
  }

  // Fetch users by country API
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(USERS_COUNTRY_API)
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then((data: any) => {
        // If data is an array, format it; if it's {data: [...]}, use data.data
        const arr = Array.isArray(data) ? data : data.data;
        setCountryData(formatApiData(arr));
        setLoading(false);
      })
      .catch((e) => {
        setError('Could not load country data');
        setLoading(false);
      });
  }, []);

  // Fallback sample data if API fails
  const fallbackData: CountryYearData[] = [
    { country: 'United States', country_code: 'US', year: 2024, users: 15420 },
    { country: 'China', country_code: 'CN', year: 2024, users: 12850 },
    { country: 'India', country_code: 'IN', year: 2024, users: 9680 },
    { country: 'Germany', country_code: 'DE', year: 2024, users: 7320 },
    { country: 'United Kingdom', country_code: 'GB', year: 2024, users: 6890 },
    { country: 'France', country_code: 'FR', year: 2024, users: 5640 },
    { country: 'Japan', country_code: 'JP', year: 2024, users: 5280 },
    { country: 'Canada', country_code: 'CA', year: 2024, users: 4750 },
    { country: 'Australia', country_code: 'AU', year: 2024, users: 3920 },
    { country: 'Brazil', country_code: 'BR', year: 2024, users: 3680 },
    { country: 'Netherlands', country_code: 'NL', year: 2024, users: 2840 },
    { country: 'Sweden', country_code: 'SE', year: 2024, users: 2560 },
    { country: 'South Korea', country_code: 'KR', year: 2024, users: 2340 },
    { country: 'Italy', country_code: 'IT', year: 2024, users: 2180 },
    { country: 'Spain', country_code: 'ES', year: 2024, users: 1950 },
    { country: 'Mexico', country_code: 'MX', year: 2024, users: 1720 },
    { country: 'Russia', country_code: 'RU', year: 2024, users: 1680 },
    { country: 'Singapore', country_code: 'SG', year: 2024, users: 1420 },
    { country: 'Norway', country_code: 'NO', year: 2024, users: 1280 },
    { country: 'Switzerland', country_code: 'CH', year: 2024, users: 1150 },
    { country: 'Belgium', country_code: 'BE', year: 2024, users: 980 },
    { country: 'Denmark', country_code: 'DK', year: 2024, users: 850 },
    { country: 'Finland', country_code: 'FI', year: 2024, users: 720 },
    { country: 'Austria', country_code: 'AT', year: 2024, users: 680 },
    { country: 'New Zealand', country_code: 'NZ', year: 2024, users: 540 }
  ];

  // Use API data or fallback
  const allData = (!loading && !error && countryData && countryData.length > 0) ? countryData : fallbackData;

  // Group by country, get latest year for each country
  const latestYearByCountry: Record<string, CountryYearData> = {};
  allData.forEach(row => {
    if (!latestYearByCountry[row.country] || row.year > latestYearByCountry[row.country].year) {
      latestYearByCountry[row.country] = row;
    }
  });
  const mapData = Object.values(latestYearByCountry);

  // For color scaling
  const values = mapData.map(item => item.users);
  const minValue = values.length > 0 ? Math.min(...values) : 0;
  const maxValue = values.length > 0 ? Math.max(...values) : 1;

  // Top 4 countries by latest year user count
  const topCountries = mapData.length > 0 ? [...mapData].sort((a, b) => b.users - a.users).slice(0, 4) : [];

  // Get all years (sorted)
  const allYears = allData.length > 0 ? Array.from(new Set(allData.map(d => d.year))).sort() : [];

  // Prepare series for multi-line chart
  const lineSeries = topCountries.map(country => {
    const countrySeries = allYears.map(year => {
      const found = allData.find(d => d.country === country.country && d.year === year);
      return found ? found.users : 0;
    });
    return {
      name: country.country,
      type: 'line',
      data: countrySeries,
      smooth: true,
      symbol: 'circle',
      lineStyle: { width: 3 },
      emphasis: { focus: 'series' }
    };
  });

  // Map chart option
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
      regions: mapData.map(country => ({
        name: country.country,
        itemStyle: {
          areaColor: getCountryColor(country.users, minValue, maxValue)
        }
      }))
    },
    series: [
      {
        type: 'map',
        geoIndex: 0,
        data: mapData.map(country => ({
          name: country.country,
          value: country.users
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
        const countryInfo = mapData.find(item => item.country === params.name);
        if (countryInfo) {
          return `
            <div style="font-weight: 600; margin-bottom: 4px;">${params.name}</div>
            <div>${countryInfo.users.toLocaleString()} users (${countryInfo.year})</div>
          `;
        }
        return params.name;
      },
    },
    visualMap: {
      min: minValue,
      max: maxValue,
      left: 'left',
      bottom: 20,
      text: ['High','Low'],
      inRange: {
        color: ['#e6f3ff', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af']
      },
      calculable: true,
      orient: 'horizontal',
      itemWidth: 16,
      itemHeight: 120,
      textStyle: { color: '#374151' }
    }
  };

  // Multi-line chart option
  const lineOption = {
    color: ['#2563eb', '#f59e42', '#10b981', '#ef4444'],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151', fontSize: 12 },
      axisPointer: { type: 'line' }
    },
    legend: {
      data: topCountries.map(c => c.country),
      top: 0,
      right: 10,
      textStyle: { color: '#374151', fontWeight: 500 }
    },
    grid: { left: 40, right: 20, top: 40, bottom: 40 },
    xAxis: {
      type: 'category',
      data: allYears,
      axisLabel: { color: '#6b7280', fontWeight: 500 },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#6b7280' },
      splitLine: { show: false }
    },
    series: lineSeries
  };

  // Color scale helper
  function getCountryColor(value: number, min: number, max: number) {
    if (max === min) return '#2563eb';
    const ratio = (value - min) / (max - min);
    const blues = [
      '#e6f3ff', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af'
    ];
    const index = Math.floor(ratio * (blues.length - 1));
    return blues[index];
  }

  return (
    <div className="space-y-8">
      {/* World Map */}
      <div className="h-80">
        {mapReady ? (
          loading ? (
            <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg">
              <div className="animate-pulse w-32 h-6 bg-gray-200 rounded mb-2 mx-auto" />
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500 text-sm">Loading country data...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-80 bg-red-50 rounded-lg">
              <div className="text-center">
                <div className="text-red-500 font-bold mb-2">Error</div>
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            </div>
          ) : mapData.length === 0 ? (
            <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-gray-500 font-bold mb-2">No country data available</div>
                <p className="text-gray-500 text-sm">No data to display on the map.</p>
              </div>
            </div>
          ) : (
            <ReactECharts 
              option={mapOption} 
              style={{ height: '320px', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          )
        ) : (
          <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500 text-sm">Loading world map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Multi-line chart for top 4 countries */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">Top 4 Countries: User Growth Over Time</h4>
        {loading ? (
          <div className="h-48 bg-gray-100 rounded animate-pulse" />
        ) : allYears.length === 0 || topCountries.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-500">No data to display.</div>
        ) : (
          <ReactECharts 
            option={lineOption} 
            style={{ height: '220px', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        )}
      </div>
    </div>
  );
};

export default UsersByCountryMap;