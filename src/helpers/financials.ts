// Helper functions for API calls and data formatting

export interface RecurringRevenueData {
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