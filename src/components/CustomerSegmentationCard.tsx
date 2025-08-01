import React, { useState, useEffect } from 'react';
import { Mail, Phone, MoreHorizontal } from 'lucide-react';

const CustomerSegmentationCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Best Customers');
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('http://127.0.0.1:5000/customer-segmentation?company=101')
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const tabs = [
    'Best Customers',
    'High ARPU',
    'Low ARPU',
    'High Repeat',
    'Low Repeat',
    'Churned',
    'Recent',
    'High LTV',
    'Low LTV'
  ];

  // Segment logic (example: Best Customers = highest RFMScore)
  const getSegmentedCustomers = () => {
    if (loading || error) return [];
    switch (activeTab) {
      case 'Best Customers':
        return customers.sort((a, b) => b.RFMScore - a.RFMScore).slice(0, 10);
      case 'High ARPU':
        return customers.sort((a, b) => b.arpu - a.arpu).slice(0, 10);
      case 'Low ARPU':
        return customers.sort((a, b) => a.arpu - b.arpu).slice(0, 10);
      case 'High Repeat':
        return customers.sort((a, b) => b.frequency - a.frequency).slice(0, 10);
      case 'Low Repeat':
        return customers.sort((a, b) => a.frequency - b.frequency).slice(0, 10);
      case 'Churned':
        return customers.filter(c => c.frequency === 0 || c.ltv < 1000).slice(0, 10);
      case 'Recent':
        return customers.sort((a, b) => b.recency - a.recency).slice(0, 10);
      case 'High LTV':
        return customers.sort((a, b) => b.ltv - a.ltv).slice(0, 10);
      case 'Low LTV':
        return customers.sort((a, b) => a.ltv - b.ltv).slice(0, 10);
      default:
        return customers.slice(0, 10);
    }
  };

  const currentData = getSegmentedCustomers();

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'retain':
      case 'vip':
        return 'bg-green-100 text-green-800';
      case 'upsell':
      case 'reward':
        return 'bg-blue-100 text-blue-800';
      case 'engage':
      case 'onboard':
        return 'bg-yellow-100 text-yellow-800';
      case 'win back':
      case 'reactivate':
        return 'bg-red-100 text-red-800';
      case 'nurture':
      case 'develop':
      case 'welcome':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRFMScoreColor = (score: string) => {
    if (score.startsWith('A')) return 'text-green-600 font-bold';
    if (score.startsWith('B')) return 'text-yellow-600 font-bold';
    return 'text-red-600 font-bold';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Customer Segmentation</h3>
      
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-3 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">Error loading data</div>
        ) : (
        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left text-xs font-semibold text-gray-700 py-2 px-3 rounded-tl-lg">Name</th>
              <th className="text-left text-xs font-semibold text-gray-700 py-2 px-3">Contact</th>
              <th className="text-left text-xs font-semibold text-gray-700 py-2 px-3">ARPU</th>
              <th className="text-left text-xs font-semibold text-gray-700 py-2 px-3">LTV</th>
              <th className="text-center text-xs font-semibold text-gray-700 py-2 px-3">Recency</th>
              <th className="text-center text-xs font-semibold text-gray-700 py-2 px-3">Frequency</th>
              <th className="text-center text-xs font-semibold text-gray-700 py-2 px-3">RFM Class</th>
              <th className="text-center text-xs font-semibold text-gray-700 py-2 px-3 rounded-tr-lg">RFM Score</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((customer, index) => (
              <tr key={index} className="bg-white shadow-sm rounded-lg transition hover:bg-blue-50">
                <td className="py-3 px-3 text-sm font-medium text-gray-900 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                  {customer.name}
                </td>
                <td className="py-3 px-3 text-sm text-gray-600">
                  <span className="inline-block bg-gray-100 rounded px-2 py-1 text-xs font-mono text-gray-700">{customer.contact}</span>
                </td>
                <td className="py-3 px-3 text-sm font-semibold text-blue-700">{customer.arpu.toLocaleString()}</td>
                <td className="py-3 px-3 text-sm font-semibold text-green-700">{customer.ltv.toLocaleString()}</td>
                <td className="py-3 px-3 text-sm text-center">
                  <span className="inline-block w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">{customer.recency}</span>
                </td>
                <td className="py-3 px-3 text-sm text-center">
                  <span className="inline-block w-8 h-8 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700">{customer.frequency}</span>
                </td>
                <td className="py-3 px-3 text-sm text-center">
                  <span className="inline-block px-2 py-1 rounded font-mono text-xs bg-yellow-100 text-yellow-800">{customer.RFMClass}</span>
                </td>
                <td className="py-3 px-3 text-sm text-center font-mono font-bold">
                  <span className="inline-block px-2 py-1 rounded bg-purple-100 text-purple-800">{customer.RFMScore}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {/* Empty state */}
      {!loading && !error && currentData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No customers found in this segment
        </div>
      )}
    </div>
  );
};

export default CustomerSegmentationCard;