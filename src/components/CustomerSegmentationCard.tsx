import React, { useState, useEffect } from 'react';
import { Mail, Phone, MoreHorizontal } from 'lucide-react';

const CustomerSegmentationCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Best Customers');
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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

  // Map tab names to API segment params
  const segmentMap: Record<string, string> = {
    'Best Customers': 'best_customers',
    'High ARPU': 'high_arpu',
    'Low ARPU': 'low_arpu',
    'High Repeat': 'high_repeat',
    'Low Repeat': 'low_repeat',
    'Churned': 'churned',
    'Recent': 'recent',
    'High LTV': 'high_ltv',
    'Low LTV': 'low_ltv',
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        const segment = segmentMap[activeTab] || 'best_customers';
        const res = await fetch(`http://127.0.0.1:5000/customer-segmentation?company=101&segment=${segment}`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setCustomers(data);
      } catch (err) {
        setError(true);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  // Search and Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const rowsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when data, tab, or search changes
  }, [customers, activeTab, search]);

  // Filter customers by search
  const filteredCustomers = customers.filter((customer) => {
    const searchTerm = search.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(searchTerm) ||
      customer.contact?.toLowerCase().includes(searchTerm) ||
      String(customer.arpu).toLowerCase().includes(searchTerm) ||
      String(customer.ltv).toLowerCase().includes(searchTerm) ||
      customer.segment?.toLowerCase().includes(searchTerm) ||
      customer.primary_action?.toLowerCase().includes(searchTerm) ||
      customer.secondary_action?.toLowerCase().includes(searchTerm) ||
      customer.priority?.toLowerCase().includes(searchTerm)
    );
  });

  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
  const paginatedData = filteredCustomers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const currentData = paginatedData;

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

      {/* Search */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="border border-gray-300 rounded px-3 py-1 text-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-8 text-center text-gray-400">Loading...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">Failed to load customer segmentation data.</div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-sm font-medium text-gray-600 pb-3">Name</th>
                  <th className="text-left text-sm font-medium text-gray-600 pb-3">Contact</th>
                  <th className="text-left text-sm font-medium text-gray-600 pb-3">ARPU</th>
                  <th className="text-left text-sm font-medium text-gray-600 pb-3">LTV</th>
                  <th className="text-center text-sm font-medium text-gray-600 pb-3">Recency</th>
                  <th className="text-center text-sm font-medium text-gray-600 pb-3">Frequency</th>
                  <th className="text-center text-sm font-medium text-gray-600 pb-3">RFM Class</th>
                  <th className="text-center text-sm font-medium text-gray-600 pb-3">Primary Action</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((customer, index) => (
                  <tr key={index} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                    <td className="text-sm text-gray-900 py-4 font-medium">{customer.name}</td>
                    <td className="text-sm text-gray-600 py-4">{customer.contact}</td>
                    <td className="text-sm text-gray-900 py-4 font-medium">{customer.arpu}</td>
                    <td className="text-sm text-gray-900 py-4 font-medium">{customer.ltv}</td>
                    <td className="text-sm text-gray-900 py-4 text-center">{customer.recency}</td>
                    <td className="text-sm text-gray-900 py-4 text-center">{customer.frequency}</td>
                    <td className="text-sm py-4 text-center">
                      <span className="font-mono text-sm text-blue-700 font-bold">{customer.RFMClass}</span>
                    </td>
                    <td className="text-sm py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(customer.primary_action)}`}>
                        {customer.primary_action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Empty state */}
            {currentData.length === 0 && !loading && !error && (
              <div className="text-center py-8 text-gray-500">
                No customers found in this segment
              </div>
            )}
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  className="px-2 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <button
                  className="px-2 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </button>
                <button
                  className="px-2 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerSegmentationCard;