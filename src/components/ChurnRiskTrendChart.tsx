import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const ChurnRiskTrendChart = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const churnRates = [15.2, 16.8, 14.9, 17.3, 16.1, 18.4];
  const maxRate = Math.max(...churnRates);
  const minRate = Math.min(...churnRates);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Churn Risk Trend</h2>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-600 font-medium">+2.1% from last month</span>
        </div>
      </div>

      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-sm text-gray-500 pr-2">
          <span>{maxRate.toFixed(1)}%</span>
          <span>{((maxRate + minRate) / 2).toFixed(1)}%</span>
          <span>{minRate.toFixed(1)}%</span>
        </div>

        {/* Chart area */}
        <div className="ml-8 h-full flex items-end justify-between space-x-2">
          {churnRates.map((rate, index) => {
            const height = ((rate - minRate) / (maxRate - minRate)) * 100;
            const isIncrease = index > 0 && rate > churnRates[index - 1];
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full relative">
                  <div
                    className={`w-full rounded-t transition-all duration-1000 ${
                      rate > 17 ? 'bg-red-500' : rate > 15 ? 'bg-amber-500' : 'bg-green-500'
                    }`}
                    style={{ height: `${Math.max(height, 10)}%` }}
                  ></div>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <span className="text-xs font-medium text-gray-900">{rate}%</span>
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <span className="text-sm text-gray-600">{months[index]}</span>
                  {index > 0 && (
                    <div className="mt-1">
                      {isIncrease ? (
                        <TrendingUp className="h-3 w-3 text-red-500 mx-auto" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-green-500 mx-auto" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-700">14.9%</div>
          <div className="text-sm text-green-600">Lowest (Mar)</div>
        </div>
        <div className="p-3 bg-red-50 rounded-lg">
          <div className="text-lg font-bold text-red-700">18.4%</div>
          <div className="text-sm text-red-600">Current (Jun)</div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-700">16.2%</div>
          <div className="text-sm text-blue-600">6-Month Avg</div>
        </div>
      </div>
    </div>
  );
};

export default ChurnRiskTrendChart;