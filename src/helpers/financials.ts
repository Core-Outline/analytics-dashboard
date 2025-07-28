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
  // Fallback data in case API fails
  const fallbackData = {
    "date": [
      "2020-01-31T00:00:00",
      "2020-02-29T00:00:00",
      "2020-03-31T00:00:00",
      "2020-04-30T00:00:00",
      "2020-05-31T00:00:00",
      "2020-06-30T00:00:00",
      "2020-07-31T00:00:00",
      "2020-08-31T00:00:00",
      "2020-09-30T00:00:00",
      "2020-10-31T00:00:00",
      "2020-11-30T00:00:00",
      "2020-12-31T00:00:00",
      "2021-01-31T00:00:00",
      "2021-02-28T00:00:00",
      "2021-03-31T00:00:00",
      "2021-04-30T00:00:00",
      "2021-05-31T00:00:00",
      "2021-06-30T00:00:00",
      "2021-07-31T00:00:00",
      "2021-08-31T00:00:00",
      "2021-09-30T00:00:00",
      "2021-10-31T00:00:00",
      "2021-11-30T00:00:00",
      "2021-12-31T00:00:00",
      "2022-01-31T00:00:00",
      "2022-02-28T00:00:00",
      "2022-03-31T00:00:00",
      "2022-04-30T00:00:00",
      "2022-05-31T00:00:00",
      "2022-06-30T00:00:00",
      "2022-07-31T00:00:00",
      "2022-08-31T00:00:00",
      "2022-09-30T00:00:00",
      "2022-10-31T00:00:00",
      "2022-11-30T00:00:00",
      "2022-12-31T00:00:00",
      "2023-01-31T00:00:00",
      "2023-02-28T00:00:00",
      "2023-03-31T00:00:00",
      "2023-04-30T00:00:00",
      "2023-05-31T00:00:00",
      "2023-06-30T00:00:00",
      "2023-07-31T00:00:00",
      "2023-08-31T00:00:00",
      "2023-09-30T00:00:00",
      "2023-10-31T00:00:00",
      "2023-11-30T00:00:00",
      "2023-12-31T00:00:00",
      "2024-01-31T00:00:00",
      "2024-02-29T00:00:00",
      "2024-03-31T00:00:00"
    ],
    "amount": [
      10545661,
      9154978,
      10530595,
      10291536,
      9803401,
      9856902,
      9617743,
      10298001,
      10398835,
      10727015,
      9905078,
      9561566,
      9732927,
      8479556,
      10244877,
      9207403,
      9562019,
      9134435,
      10127573,
      10308071,
      9392138,
      10451256,
      8418298,
      11113354,
      9112977,
      8885818,
      9829745,
      9400203,
      10157218,
      9224387,
      10929334,
      9894772,
      8243563,
      10315483,
      8894553,
      10869669,
      10755027,
      8688970,
      9629101,
      10544496,
      11314421,
      9803333,
      10046860,
      9956408,
      9360382,
      10327446,
      10088666,
      11061717,
      9719569,
      9734582,
      10274403
    ],
    "growth": [
      0.0,
      -0.13187253032313484,
      0.1502589083228818,
      -0.022701376322990297,
      -0.04743072365485579,
      0.005457391776588549,
      -0.02426310010995336,
      0.07072948403799106,
      0.009791609070537,
      0.031559304479780614,
      -0.07662308666483642,
      -0.03468039322860461,
      0.017921855060143876,
      -0.12877636912308088,
      0.20818554650738785,
      -0.1012675896450489,
      0.038514225998362406,
      -0.04471691595676608,
      0.10872462281465678,
      0.017822433864460807,
      -0.08885590718185776,
      0.11276644359356736,
      -0.19451805601164107,
      0.3201426226536528,
      -0.1799975956853349,
      -0.024926980502639307,
      0.10622848678647245,
      -0.043698183421848724,
      0.08053177149472202,
      -0.09183922211770978,
      0.18483038493506387,
      -0.0946591988130292,
      -0.1668769123735241,
      0.25133792269192345,
      -0.13774730664574797,
      0.22205905119683922,
      -0.010546963297594414,
      -0.19210151680697785,
      0.10819820991440876,
      0.09506546872859678,
      0.073016766282618,
      -0.13355416065921533,
      0.024841245319321414,
      -0.009003011886300816,
      -0.05986355721862746,
      0.10331458694741302,
      -0.023120914890283673,
      0.09644991716446949,
      -0.12133270088178894,
      0.0015446158157836898,
      0.055453947586039165
    ]
  };

  try {
    const url = `${apiConfig.dataBaseUrl}/recurring-revenue?time_units=${timeUnits}&company=${company}`;
    console.log('Fetching recurring revenue from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Recurring revenue data:', data);
    
    // Update the state with API data
    return {
      value: data.value || fallbackData.amount[fallbackData.amount.length - 1],
      growth: typeof data.growth === 'number' ? data.growth : (Array.isArray(fallbackData.growth) ? fallbackData.growth[fallbackData.growth.length - 1] : 0),
      percentage: data.percentage || formatGrowth(Array.isArray(fallbackData.growth) ? fallbackData.growth[fallbackData.growth.length - 1] : 0),
      isLoading: false
    };
  } catch (error) {
    console.error('Error fetching recurring revenue:', error);
    
    // Use fallback data on error
    const latestAmount = fallbackData.amount[fallbackData.amount.length - 1];
    const latestGrowth = Array.isArray(fallbackData.growth) ? fallbackData.growth[fallbackData.growth.length - 1] : 0;
    
    return {
      value: latestAmount,
      growth: latestGrowth,
      percentage: formatGrowth(latestGrowth),
      isLoading: false
    };
  }
};

export const fetchAnnualRunRateData = async (
  apiConfig: ApiConfig,
  timeUnits: string,
  company: string
): Promise<RecurringRevenueData> => {
  // Fallback data in case API fails
  const fallbackData = {
    "date": [
        "2020-12-31T00:00:00",
        "2021-12-31T00:00:00",
        "2022-12-31T00:00:00",
        "2023-12-31T00:00:00",
        "2024-12-31T00:00:00"
    ],
    "amount": [
        120691311,
        116171907,
        115757722,
        121576827,
        29728554
    ],
    "growth": [
        0.0,
        -0.037445976537615056,
        -0.003565276758347391,
        0.05026969172734752,
        -0.7554751613973278
    ]
};

  try {
    const url = `${apiConfig.dataBaseUrl}/recurring-revenue?time_units=${timeUnits}&company=${company}`;
    console.log('Fetching recurring revenue from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Recurring revenue data:', data);
    
    // Update the state with API data
    return {
      value: data.value || fallbackData.amount[fallbackData.amount.length - 1],
      growth: parseFloat((data.growth || fallbackData.growth[fallbackData.growth.length - 1] * 100).toFixed(1)),
      percentage: data.percentage || formatGrowth(fallbackData.growth[fallbackData.growth.length - 1]),
      isLoading: false
    };
  } catch (error) {
    console.error('Error fetching recurring revenue:', error);
    
    // Use fallback data on error
    const latestAmount = fallbackData.amount[fallbackData.amount.length - 1];
    const latestGrowth = fallbackData.growth[fallbackData.growth.length - 1];
    
    return {
      value: latestAmount,
      growth: parseFloat((latestGrowth * 100).toFixed(1)),
      percentage: formatGrowth(latestGrowth),
      isLoading: false
    };
  }
};

// Fetch revenue growth data from API
export const fetchRevenueGrowthData = async (
  apiConfig: ApiConfig,
  timeUnits: string,
  company: string
): Promise<RevenueGrowthData> => {
  // Fallback data in case API fails
  const fallbackData = {
    "date": [
      "2020-01-31T00:00:00",
      "2020-02-29T00:00:00",
      "2020-03-31T00:00:00",
      "2020-04-30T00:00:00",
      "2020-05-31T00:00:00",
      "2020-06-30T00:00:00",
      "2020-07-31T00:00:00",
      "2020-08-31T00:00:00",
      "2020-09-30T00:00:00",
      "2020-10-31T00:00:00",
      "2020-11-30T00:00:00",
      "2020-12-31T00:00:00",
      "2021-01-31T00:00:00",
      "2021-02-28T00:00:00",
      "2021-03-31T00:00:00",
      "2021-04-30T00:00:00",
      "2021-05-31T00:00:00",
      "2021-06-30T00:00:00",
      "2021-07-31T00:00:00",
      "2021-08-31T00:00:00",
      "2021-09-30T00:00:00",
      "2021-10-31T00:00:00",
      "2021-11-30T00:00:00",
      "2021-12-31T00:00:00",
      "2022-01-31T00:00:00",
      "2022-02-28T00:00:00",
      "2022-03-31T00:00:00",
      "2022-04-30T00:00:00",
      "2022-05-31T00:00:00",
      "2022-06-30T00:00:00",
      "2022-07-31T00:00:00",
      "2022-08-31T00:00:00",
      "2022-09-30T00:00:00",
      "2022-10-31T00:00:00",
      "2022-11-30T00:00:00",
      "2022-12-31T00:00:00",
      "2023-01-31T00:00:00",
      "2023-02-28T00:00:00",
      "2023-03-31T00:00:00",
      "2023-04-30T00:00:00",
      "2023-05-31T00:00:00",
      "2023-06-30T00:00:00",
      "2023-07-31T00:00:00",
      "2023-08-31T00:00:00",
      "2023-09-30T00:00:00",
      "2023-10-31T00:00:00",
      "2023-11-30T00:00:00",
      "2023-12-31T00:00:00",
      "2024-01-31T00:00:00",
      "2024-02-29T00:00:00",
      "2024-03-31T00:00:00"
    ],
    "amount": [
      100.0,
      -1390683.0,
      1375617.0,
      -239059.0,
      -488135.0,
      53501.0,
      -239159.0,
      680258.0,
      100834.0,
      328180.0,
      -821937.0,
      -343512.0,
      171361.0,
      -1253371.0,
      1765321.0,
      -1037474.0,
      354616.0,
      -427584.0,
      993138.0,
      180498.0,
      -915933.0,
      1059118.0,
      -2032958.0,
      2695056.0,
      -2000377.0,
      -227159.0,
      943927.0,
      -429542.0,
      757015.0,
      -932831.0,
      1704947.0,
      -1034562.0,
      -1651209.0,
      2071920.0,
      -1420930.0,
      1975116.0,
      -114642.0,
      -2066057.0,
      940131.0,
      915395.0,
      769925.0,
      -1511088.0,
      243527.0,
      -90452.0,
      -596026.0,
      967064.0,
      -238780.0,
      973051.0,
      -1342148.0,
      15013.0,
      539821.0
    ],
    "growth": [
      0.0,
      -13907.83,
      -1.9891664743151387,
      -1.1737831096882345,
      1.0419017899347023,
      -1.1096028762534955,
      -5.470178127511636,
      -3.8443754991449204,
      -0.8517709457294145,
      2.2546561675625285,
      -3.5045310500335183,
      -0.5820701586617952,
      -1.4988501129509304,
      -8.31421385262691,
      -2.4084584692002604,
      -1.5876970817205482,
      -1.3418071199856576,
      -2.2057662372820177,
      -3.3226734396048494,
      -0.818254864882826,
      -6.074477279526643,
      -2.156326936577239,
      -2.9194820596005355,
      -2.325682084922561,
      -1.742239493353756,
      -0.8864419057007754,
      -5.155358141213863,
      -1.455058494989549,
      -2.7623771365780296,
      -2.2322490307325484,
      -2.82771262961887,
      -1.606800094079171,
      0.5960464428424783,
      -2.254789672294664,
      -1.6858035059268697,
      -2.390016397711358,
      -1.0580431731604625,
      17.02181573943232,
      -1.4550363324922788,
      -0.026311226839663804,
      -0.1589150039054179,
      -2.962643114589083,
      -1.161160038329998,
      -1.3714249344015244,
      5.58941759165082,
      -2.6225198229607436,
      -1.2469123036324379,
      -5.075094228997403,
      -2.379319275145907,
      -1.011185800671759,
      34.95690401651902
    ]
  };

  try {
    const url = `${apiConfig.dataBaseUrl}/revenue-growth-rate?time_units=${timeUnits}&company=${company}`;
    console.log('Fetching revenue growth from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Revenue growth data:', data);
    
    // Update the state with API data
    return {
      value: data.value || fallbackData.amount[fallbackData.amount.length - 1],
      growth: typeof data.growth === 'number' ? data.growth : (Array.isArray(fallbackData.growth) ? fallbackData.growth[fallbackData.growth.length - 1] : 0),
      percentage: data.percentage || formatGrowth(Array.isArray(fallbackData.growth) ? fallbackData.growth[fallbackData.growth.length - 1] : 0),
      isLoading: false
    };
  } catch (error) {
    console.error('Error fetching revenue growth:', error);
    
    // Use fallback data on error
    const latestAmount = fallbackData.amount[fallbackData.amount.length - 1];
    const latestGrowth = Array.isArray(fallbackData.growth) ? fallbackData.growth[fallbackData.growth.length - 1] : 0;
    
    return {
      value: latestAmount,
      growth: latestGrowth,
      percentage: formatGrowth(latestGrowth),
      isLoading: false
    };
  }
};

// Add a helper to get the raw arrays for RevenueGrowthCard
export const fetchRevenueGrowthRaw = async (
  apiConfig: ApiConfig,
  timeUnits: string,
  company: string
): Promise<{ date: string[]; amount: number[]; growth: number[] }> => {
  // Use the same fallback as fetchRevenueGrowthData
  const fallbackData = {
    date: [
      "2020-01-31T00:00:00", "2020-02-29T00:00:00", "2020-03-31T00:00:00", "2020-04-30T00:00:00", "2020-05-31T00:00:00", "2020-06-30T00:00:00", "2020-07-31T00:00:00", "2020-08-31T00:00:00", "2020-09-30T00:00:00", "2020-10-31T00:00:00", "2020-11-30T00:00:00", "2020-12-31T00:00:00", "2021-01-31T00:00:00", "2021-02-28T00:00:00", "2021-03-31T00:00:00", "2021-04-30T00:00:00", "2021-05-31T00:00:00", "2021-06-30T00:00:00", "2021-07-31T00:00:00", "2021-08-31T00:00:00", "2021-09-30T00:00:00", "2021-10-31T00:00:00", "2021-11-30T00:00:00", "2021-12-31T00:00:00", "2022-01-31T00:00:00", "2022-02-28T00:00:00", "2022-03-31T00:00:00", "2022-04-30T00:00:00", "2022-05-31T00:00:00", "2022-06-30T00:00:00", "2022-07-31T00:00:00", "2022-08-31T00:00:00", "2022-09-30T00:00:00", "2022-10-31T00:00:00", "2022-11-30T00:00:00", "2022-12-31T00:00:00", "2023-01-31T00:00:00", "2023-02-28T00:00:00", "2023-03-31T00:00:00", "2023-04-30T00:00:00", "2023-05-31T00:00:00", "2023-06-30T00:00:00", "2023-07-31T00:00:00", "2023-08-31T00:00:00", "2023-09-30T00:00:00", "2023-10-31T00:00:00", "2023-11-30T00:00:00", "2023-12-31T00:00:00", "2024-01-31T00:00:00", "2024-02-29T00:00:00", "2024-03-31T00:00:00"
    ],
    amount: [
      100.0, -1390683.0, 1375617.0, -239059.0, -488135.0, 53501.0, -239159.0, 680258.0, 100834.0, 328180.0, -821937.0, -343512.0, 171361.0, -1253371.0, 1765321.0, -1037474.0, 354616.0, -427584.0, 993138.0, 180498.0, -915933.0, 1059118.0, -2032958.0, 2695056.0, -2000377.0, -227159.0, 943927.0, -429542.0, 757015.0, -932831.0, 1704947.0, -1034562.0, -1651209.0, 2071920.0, -1420930.0, 1975116.0, -114642.0, -2066057.0, 940131.0, 915395.0, 769925.0, -1511088.0, 243527.0, -90452.0, -596026.0, 967064.0, -238780.0, 973051.0, -1342148.0, 15013.0, 539821.0
    ],
    growth: [
      0.0, -13907.83, -1.9891664743151387, -1.1737831096882345, 1.0419017899347023, -1.1096028762534955, -5.470178127511636, -3.8443754991449204, -0.8517709457294145, 2.2546561675625285, -3.5045310500335183, -0.5820701586617952, -1.4988501129509304, -8.31421385262691, -2.4084584692002604, -1.5876970817205482, -1.3418071199856576, -2.2057662372820177, -3.3226734396048494, -0.818254864882826, -6.074477279526643, -2.156326936577239, -2.9194820596005355, -2.325682084922561, -1.742239493353756, -0.8864419057007754, -5.155358141213863, -1.455058494989549, -2.7623771365780296, -2.2322490307325484, -2.82771262961887, -1.606800094079171, 0.5960464428424783, -2.254789672294664, -1.6858035059268697, -2.390016397711358, -1.0580431731604625, 17.02181573943232, -1.4550363324922788, -0.026311226839663804, -0.1589150039054179, -2.962643114589083, -1.161160038329998, -1.3714249344015244, 5.58941759165082, -2.6225198229607436, -1.2469123036324379, -5.075094228997403, -2.379319275145907, -1.011185800671759, 34.95690401651902
    ]
  };
  try {
    const url = `${apiConfig.dataBaseUrl}/revenue-growth-rate?time_units=${timeUnits}&company=101`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return {
      date: data.date || fallbackData.date,
      amount: data.amount || fallbackData.amount,
      growth: data.growth || fallbackData.growth
    };
  } catch (error) {
    return fallbackData;
  }
};

// Fetch growth period data from API
export const fetchGrowthPeriodData = async (
  timeUnits: string, // not used in API, but kept for interface consistency
  company: string
): Promise<{ value: number | string; isLoading: boolean }> => {
  try {
    const response = await fetch(`http://localhost:5000/growth-period?company=${company}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return {
      value: data.growth_period ?? '_',
      isLoading: false
    };
  } catch (error) {
    // Fallback value if API fails
    return {
      value: 2,
      isLoading: false
    };
  }
};

export const fetchSalesData = async (
  apiConfig: ApiConfig,
  timeUnits: string,
  company: string
): Promise<{ date: string[]; amount: number[] }> => {
  // Fallback data in case API fails
  const fallbackData = {
    date: [
      "2024-12-31",
      "2023-12-31",
      "2022-12-31",
      "2021-12-31",
      "2020-12-31"
    ],
    amount: [
      1182,
      4824,
      4594,
      4610,
      4790
    ]
  };
  try {
    const url = `http://127.0.0.1:5000/sales?time_units=${timeUnits}&company=101`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return {
      date: data.date || fallbackData.date,
      amount: data.amount || fallbackData.amount
    };
  } catch (error) {
    return fallbackData;
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
  const fallbackData: ProductRevenueSharesData = {
    product_id: ["2", "3", "4", "5"],
    amount: [125083672.0, 124318576.0, 124412992.0, 130111080.0],
    pct_amount: [24.82, 24.67, 24.69, 25.82]
  };
  try {
    const url = `${apiConfig.dataBaseUrl}/product-revenue-shares?company=${company}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product revenue shares:', error);
    return fallbackData;
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
  const fallbackData: TopProductSold[] = [
    { index: 152, product_id: '4', date: '2024-03-31', amount: 114, percentage_growth: 0.2666666666666666 },
    { index: 101, product_id: '3', date: '2024-03-31', amount: 113, percentage_growth: 0.08653846153846145 },
    { index: 203, product_id: '5', date: '2024-03-31', amount: 93, percentage_growth: -0.07920792079207917 },
    { index: 50, product_id: '2', date: '2024-03-31', amount: 84, percentage_growth: 0.012048192771084265 }
    // ...more fallback rows as needed
  ];
  try {
    const url = `${apiConfig.dataBaseUrl}/top-products-sold?time_units=${timeUnits}&company=101`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log("out",data)
    return data;
  } catch (error) {
    console.error('Error fetching top products sold:', error);
    return fallbackData;
  }
};