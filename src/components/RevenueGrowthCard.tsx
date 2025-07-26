import React from 'react';

const RevenueGrowthCard: React.FC = () => {
  const revenueData = [
    { date: 'Jan 2024', revenue: '$45,230', growth: '+12.5%' },
    { date: 'Feb 2024', revenue: '$52,180', growth: '+15.4%' },
    { date: 'Mar 2024', revenue: '$48,920', growth: '+8.2%' }
  ];

  const latestGrowth = 8.2; // Latest growth percentage for the progress bar

  // Calculate the stroke-dasharray for the progress circle
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (latestGrowth / 100) * circumference;

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
            {revenueData.map((row, index) => (
              <tr key={index}>
                <td className="text-sm text-gray-900 py-2">{row.date}</td>
                <td className="text-sm text-gray-900 py-2 font-medium">{row.revenue}</td>
                <td className="text-sm text-green-600 py-2 font-medium">{row.growth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Circular Progress Bar */}
      <div className="flex justify-center">
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
              stroke="#10b981"
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
            <span className="text-lg font-bold text-gray-900">{latestGrowth}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueGrowthCard;