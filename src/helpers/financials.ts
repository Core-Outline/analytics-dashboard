// Helper functions for API calls and data formatting

export interface RecurringRevenueData {
  value: number | string;
  growth: number;
  percentage: string;
  isLoading: boolean;
}

export interface RevenueGrowthData {
  value: number | string;
  growth: number;
  percentage: string;
  isLoading: boolean;
}

export interface ApiConfig {
  brevoApiKey: string;
  apiBaseUrl: string;
  dataBaseUrl: string;
}

// Helper function to format numbers
export const formatAmount = (amount: number): string => {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + 'M';
  } else if (amount >= 1000) {
    return (amount / 1000).toFixed(0) + 'k';
  }
  return amount.toLocaleString();
};

// Helper function to format growth percentages
export const formatGrowth = (growth: number): string => {
  return (growth >= 0 ? '+' : '') + (growth * 100).toFixed(1) + '%';
};

// Load configuration from config.json
export const loadApiConfig = async (): Promise<ApiConfig> => {
  const response = await fetch('/config.json');
  const data = await response.json();
  console.log("Default page details", data);
  
  return {
    brevoApiKey: data.brevoApiKey,
    apiBaseUrl: data.api_base_url,
    dataBaseUrl: data.data_base_url
  };
};

// Load user data from localStorage
export const loadUserData = (): { company: string; timeUnits: string } => {
  try {
    const userToken = JSON.parse(localStorage.getItem('userToken') || '{}');
    console.log("userToken ", userToken);
    
    const company = userToken.ORGANIZATION_ID ? userToken.ORGANIZATION_ID.toString() : '301';
    console.log("company ", company);
    console.log("user ", localStorage.getItem('userToken'));
    
    return {
      company,
      timeUnits: 'M'
    };
  } catch (error) {
    console.error('Error parsing userToken from localStorage:', error);
    return {
      company: '301',
      timeUnits: 'M'
    };
  }
};

// Fetch recurring revenue data from API
export const fetchRecurringRevenueData = async (
  apiConfig: ApiConfig,
  timeUnits: string,
  company: string
): Promise<RecurringRevenueData> => {
  try {
    const url = `https://data.coreoutline.com/recurring-revenue?time_units=${timeUnits}&company=${company}`;
    console.log('Fetching recurring revenue from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Recurring revenue data:', data);
    
    if (!data.amount) {
      throw new Error('Invalid data received from API: missing value');
    }
    
    if (!data.growth) {
      throw new Error('Invalid data received from API: missing or invalid growth');
    }

    if (data.amount.length === 0 || data.growth.length === 0) {
      return {
        value: [],
        growth: [],
        isLoading: false
      }
    }
    
    return {
      value: data.amount,
      growth: data.growth,
      // percentage: data.percentage || formatGrowth(data.growth),
      isLoading: false
    };
  } catch (error) {
    console.error('Error fetching recurring revenue:', error);
    throw error;
  }
};

export const fetchAnnualRunRateData = async (
  apiConfig: ApiConfig,
  timeUnits: string,
  company: string
): Promise<RecurringRevenueData> => {
  try {
    const url = `https://data.coreoutline.com/recurring-revenue?time_units=A&company=${company}`;
    console.log('Fetching recurring revenue from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Recurring revenue data:', data);
    
    if (!data.amount) {
      throw new Error('Invalid data received from API: missing value');
    }
    
    if (!data.growth) {
      throw new Error('Invalid data received from API: missing or invalid growth');
    }

    if (data.amount.length === 0 || data.growth.length === 0) {
      return {
        value: [],
        growth: [],
        isLoading: false
      }
    }
    
    return {
      value: data.amount,
      growth: parseFloat((data.growth[-1] || 0 * 100).toFixed(1)),
      // percentage: data.percentage || formatGrowth(data.growth),
      isLoading: false
    };
  } catch (error) {
    console.error('Error fetching recurring revenue:', error);
    throw error;
  }
};

// Fetch revenue growth data from API
export const fetchRevenueGrowthData = async (
  apiConfig: ApiConfig,
  timeUnits: string,
  company: string
): Promise<RevenueGrowthData> => {
  try {
    const url = `https://data.coreoutline.com/revenue-growth-rate?time_units=${timeUnits}&company=${company}`;
    console.log('Fetching revenue growth from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Revenue growth data:', data);
    
    if (!data.amount) {
      throw new Error('Invalid data received from API: missing value');
    }
    
    if (!data.growth) {
      throw new Error('Invalid data received from API: missing or invalid growth');
    }

    if (data.amount.length === 0 || data.growth.length === 0) {
      return {
        value: [],
        growth: [],
        isLoading: false
      }
    }
    
    return {
      value: data.amount,
      growth: data.growth,
      // percentage: data.percentage || formatGrowth(data.growth),
      isLoading: false
    };
  } catch (error) {
    console.error('Error fetching revenue growth:', error);
    throw error;
  }
};

// Add a helper to get the raw arrays for RevenueGrowthCard
export const fetchRevenueGrowthRaw = async (
  apiConfig: ApiConfig,
  timeUnits: string,
  company: string
): Promise<{ date: string[]; amount: number[]; growth: number[] }> => {
  try {
    const url = `https://data.coreoutline.com/revenue-growth-rate?time_units=${timeUnits}&company=${company}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data.date) || !Array.isArray(data.amount) || !Array.isArray(data.growth)) {
      throw new Error('Invalid data format received from API: expected arrays for date, amount, and growth');
    }
    
    if (data.date.length === 0 || data.amount.length === 0 || data.growth.length === 0) {
      return {
        date: [],
        amount: [],
        growth: []
      }
    }
    
    return {
      date: data.date,
      amount: data.amount,
      growth: data.growth
    };
  } catch (error) {
    console.error('Error fetching revenue growth raw data:', error);
    throw error;
  }
};

// Fetch growth period data from API
export const fetchGrowthPeriodData = async (
  timeUnits: string, // not used in API, but kept for interface consistency
  company: string
): Promise<{ value: number | string; isLoading: boolean }> => {
  try {
    const response = await fetch(`https://data.coreoutline.com/growth-period?company=${company}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.growth_period === undefined) {
      throw new Error('Invalid data received from API: missing growth_period');
    }
    
    return {
      value: data.growth_period,
      isLoading: false
    };
  } catch (error) {
    console.error('Error fetching growth period data:', error);
    throw error;
  }
};

export const fetchSalesData = async (
  apiConfig: ApiConfig,
  timeUnits: string,
  company: string
): Promise<{ date: string[]; amount: number[] }> => {

  try {
    const url = `https://data.coreoutline.com/sales?time_units=${timeUnits}&company=${company}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return {
      date: data.date,
      amount: data.amount
    };
  } catch (error) {
    return {
      date: [],
      amount: []
    };
  }
};

// Helper to transform sales data for the chart based on timeUnit
export const getSalesChartData = (
  salesData: { date: string[]; amount: number[] },
  timeUnit: string
): { chartLabels: string[]; currentData: number[]; previousData: number[]; currentPeriod: string; previousPeriod: string } => {
  let chartLabels: string[] = [];
  let currentData: number[] = [];
  let previousData: number[] = [];
  let currentPeriod = '';
  let previousPeriod = '';
  const { date, amount } = salesData;
  if (date.length > 0) {
    if (timeUnit.toLowerCase() === 'yearly') {
      // Group by year, compare months for latest and previous year
      const yearMonthMap: Record<string, Record<string, number>> = {};
      date.forEach((d, i) => {
        const [year, month] = d.split('-');
        if (!yearMonthMap[year]) yearMonthMap[year] = {};
        yearMonthMap[year][month] = amount[i];
      });
      const years = Object.keys(yearMonthMap).sort((a, b) => b.localeCompare(a));
      if (years.length >= 2) {
        currentPeriod = years[0];
        previousPeriod = years[1];
        const months = [
          '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'
        ];
        chartLabels = months.map(m => new Date(2000, parseInt(m, 10) - 1).toLocaleString('default', { month: 'short' }));
        currentData = months.map(m => yearMonthMap[currentPeriod][m] ?? 0);
        previousData = months.map(m => yearMonthMap[previousPeriod][m] ?? 0);
      }
    } else if (timeUnit.toLowerCase() === 'monthly') {
      // Group by month, compare weeks for latest and previous month
      const monthWeekMap: Record<string, Record<string, number>> = {};
      date.forEach((d, i) => {
        const [year, month, day] = d.split('-');
        const ym = `${year}-${month}`;
        const week = 'WK' + (Math.floor((parseInt(day, 10) - 1) / 7) + 1);
        if (!monthWeekMap[ym]) monthWeekMap[ym] = {};
        monthWeekMap[ym][week] = (monthWeekMap[ym][week] ?? 0) + amount[i];
      });
      const months = Object.keys(monthWeekMap).sort((a, b) => b.localeCompare(a));
      if (months.length >= 2) {
        currentPeriod = months[0];
        previousPeriod = months[1];
        const weeks = ['WK1', 'WK2', 'WK3', 'WK4', 'WK5'];
        chartLabels = weeks;
        currentData = weeks.map(w => monthWeekMap[currentPeriod][w] ?? 0);
        previousData = weeks.map(w => monthWeekMap[previousPeriod][w] ?? 0);
      }
    } else if (timeUnit.toLowerCase() === 'quarterly') {
      // Group by quarter, compare months in latest and previous quarter
      const yearMonthMap: Record<string, Record<string, number>> = {};
      date.forEach((d, i) => {
        const [year, month] = d.split('-');
        if (!yearMonthMap[year]) yearMonthMap[year] = {};
        yearMonthMap[year][month] = amount[i];
      });
      const allQuarters: { year: string, quarter: number, months: string[] }[] = [];
      Object.keys(yearMonthMap).forEach(year => {
        for (let q = 1; q <= 4; q++) {
          const months = [1,2,3].map(m => String((q-1)*3 + m).padStart(2, '0'));
          if (months.some(m => yearMonthMap[year][m] !== undefined)) {
            allQuarters.push({ year, quarter: q, months });
          }
        }
      });
      allQuarters.sort((a, b) => (b.year + b.quarter).localeCompare(a.year + a.quarter));
      if (allQuarters.length >= 2) {
        const currQ = allQuarters[0];
        const prevQ = allQuarters[1];
        currentPeriod = `${currQ.year}-Q${currQ.quarter}`;
        previousPeriod = `${prevQ.year}-Q${prevQ.quarter}`;
        chartLabels = currQ.months.map(m => new Date(2000, parseInt(m, 10) - 1).toLocaleString('default', { month: 'short' }));
        currentData = currQ.months.map(m => yearMonthMap[currQ.year][m] ?? 0);
        previousData = prevQ.months.map(m => yearMonthMap[prevQ.year][m] ?? 0);
      }
    } else if (timeUnit.toLowerCase() === 'weekly') {
      // Group by week, compare days of latest and previous week
      const weekDayMap: Record<string, Record<number, number>> = {};
      date.forEach((d, i) => {
        const dateObj = new Date(d);
        const year = dateObj.getFullYear();
        const firstDay = new Date(dateObj.getFullYear(), 0, 1);
        const week = Math.ceil((((dateObj.getTime() - firstDay.getTime()) / 86400000) + firstDay.getDay() + 1) / 7);
        const yw = `${year}-W${String(week).padStart(2, '0')}`;
        const day = dateObj.getDay();
        if (!weekDayMap[yw]) weekDayMap[yw] = {};
        weekDayMap[yw][day] = amount[i];
      });
      const weeks = Object.keys(weekDayMap).sort((a, b) => b.localeCompare(a));
      if (weeks.length >= 2) {
        currentPeriod = weeks[0];
        previousPeriod = weeks[1];
        const days = [0,1,2,3,4,5,6];
        chartLabels = days.map(d => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]);
        currentData = days.map(d => weekDayMap[currentPeriod][d] ?? 0);
        previousData = days.map(d => weekDayMap[previousPeriod][d] ?? 0);
      }
    } else if (timeUnit.toLowerCase() === 'daily') {
      // Group by day, compare hours in current and previous day
      const dayHourMap: Record<string, Record<number, number>> = {};
      date.forEach((d, i) => {
        const dateObj = new Date(d);
        const day = d.slice(0, 10);
        const hour = dateObj.getHours();
        if (!dayHourMap[day]) dayHourMap[day] = {};
        dayHourMap[day][hour] = amount[i];
      });
      const days = Object.keys(dayHourMap).sort((a, b) => b.localeCompare(a));
      if (days.length >= 2) {
        currentPeriod = days[0];
        previousPeriod = days[1];
        const hours = Array.from({length: 24}, (_, i) => i);
        chartLabels = hours.map(h => `${h}:00`);
        currentData = hours.map(h => dayHourMap[currentPeriod][h] ?? 0);
        previousData = hours.map(h => dayHourMap[previousPeriod][h] ?? 0);
      }
    }
  }
  return { chartLabels, currentData, previousData, currentPeriod, previousPeriod };
};

export interface ProductRevenueSharesData {
  product_id: string[];
  amount: number[];
  pct_amount: number[];
}

export const fetchProductRevenueSharesData = async (
  apiConfig: ApiConfig,
  company: string
): Promise<ProductRevenueSharesData> => {
  
  try {
    const url = `https://data.coreoutline.com/product-revenue-shares?company=${company}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product revenue shares:', error);
    return {
      product_id:[],
      amount:[],
      pct_amount:[]
    };
  }
};

export interface TopProductSold {
  index: number;
  product_id: string;
  date: string;
  amount: number;
  percentage_growth: number;
}

export const fetchTopProductsSold = async (
  apiConfig: ApiConfig,
  timeUnits: string,
  company: string
): Promise<TopProductSold[]> => {
  try {
    const url = `https://data.coreoutline.com/top-products-sold?time_units=${timeUnits}&company=${company}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log("out",data)
    return data;
  } catch (error) {
    console.error('Error fetching top products sold:', error);
    return [];
  }
};