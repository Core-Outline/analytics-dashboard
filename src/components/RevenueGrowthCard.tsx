import React from 'react';
import { formatAmount, formatGrowth } from '../helpers/financials';

interface RevenueGrowthCardProps {
  value: number | string;
  growth: number;
  percentage: string;
  isLoading: boolean;
  dateList: string[];
  amountList: number[];
  growthList: number[];
}

const RevenueGrowthCard: React.FC<RevenueGrowthCardProps> = ({ value, growth, percentage, isLoading, dateList, amountList, growthList }) => {
  // Prepare table data (show last 3 periods)
  console.log(dateList, amountList, growthList)
  const tableRows = dateList.slice(-3).map((date, idx) => {
    const i = dateList.length - 3 + idx;
    return {
      date: new Date(date).toLocaleString('default', { month: 'short', year: 'numeric' }),
      revenue: formatAmount(amountList[i] ?? 0),
      growth: formatGrowth((growthList[i] ?? 0) / 100)
    };
  });

  // Use the latest growth value for the progress bar
  const latestGrowth = growthList.length > 0 ? growthList[growthList.length - 1] : 0;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (Math.abs(latestGrowth) / 100) * circumference;

  return (
    <div className="flex flex-col h-full">
      {/* Table */}
      <div className="flex-1 mb-6">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-sm font-medium text-gray-600 pb-3">Date</th>
              <th className="text-left text-sm font-medium text-gray-600 pb-3">Revenue</th>
              <th className="text-left text-sm font-medium text-gray-600 pb-3">Growth</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index}>
                <td className="text-sm text-gray-900 py-2">{row.date}</td>
                <td className="text-sm text-gray-900 py-2 font-medium">{row.revenue}</td>
                <td className={`text-sm py-2 font-medium ${row.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{row.growth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Circular Progress Bar */}
      <div className="flex justify-center items-center px-4 pb-4">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#f3f4f6"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={latestGrowth >= 0 ? '#10b981' : '#ef4444'}
              strokeWidth="8"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-in-out"
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-gray-900">{formatGrowth(latestGrowth / 100)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueGrowthCard;