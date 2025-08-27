import React, { useEffect, useState } from 'react';
import { churnPalette } from './ui/churnPalette';

interface ChurnRevenueImpactCardProps {
  organization_id: string | null;
}

const segmentColors: Record<string, string> = {
  'Prime Customer': '#a78bfa',
  'Elite Customer': '#38bdf8',
  'Standard Customer': '#4ade80',
  'Basic Customer': '#9ca3af',
  'Unknown': '#a3a3a3'
};

const ChurnRevenueImpactCard: React.FC<ChurnRevenueImpactCardProps> = ({ organization_id }) => {
  const [impactData, setImpactData] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalChurnedRevenue, setTotalChurnedRevenue] = useState(0);

  useEffect(() => {
    if (!organization_id) return;
    fetch(`https://data.coreoutline.com/churn-revenue-impact?company=${organization_id}`)
      .then(res => res.json())
      .then(data => {
        setImpactData(data);
        setTotalRevenue(data.reduce((sum: number, s: any) => sum + s.Total_Revenue, 0));
        setTotalChurnedRevenue(data.reduce((sum: number, s: any) => sum + s.Churned_Revenue, 0));
      })
      .catch(() => {});
  }, [organization_id]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Churn Revenue Impact by Segment</h2>
        <div className="text-sm text-gray-500">Current period</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Progress Bars for Churn Revenue Impact */}
        <div className="flex-1 space-y-4">
          {impactData.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ background: segmentColors[item.Segment_Label] || '#a3a3a3' }}></div>
                  <span className="font-medium text-gray-900">{item.Segment_Label}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">${item.Total_Revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })} total</span>
                  <span className="font-bold text-gray-900">{(item.Churn_Revenue_Impact * 100).toFixed(1)}% churn impact</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${item.Churn_Revenue_Impact * 100}%`, background: churnPalette[idx % churnPalette.length] }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        {/* Summary */}
        <div className="flex flex-col items-center justify-center w-full md:w-1/2">
          <div className="w-full h-35 rounded-2xl bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="text-lg text-gray-700 mb-2">Total Revenue</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            <div className="text-lg text-gray-700 mb-2">Churned Revenue</div>
            <div className="text-2xl font-bold text-red-600">${totalChurnedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="py-2 font-medium">Segment</th>
              <th className="py-2 font-medium">Active Revenue</th>
              <th className="py-2 font-medium">Churned Revenue</th>
              <th className="py-2 font-medium">Total Revenue</th>
              <th className="py-2 font-medium">Churn Revenue Impact</th>
            </tr>
          </thead>
          <tbody>
            {impactData.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-2 font-medium flex items-center space-x-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: churnPalette[idx % churnPalette.length] }}></span>
                  <span>{item.Segment_Label}</span>
                </td>
                <td className="py-2">${item.Active_Revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                <td className="py-2 text-red-600 font-bold">${item.Churned_Revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                <td className="py-2">${item.Total_Revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                <td className="py-2 font-bold">{(item.Churn_Revenue_Impact * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChurnRevenueImpactCard;
