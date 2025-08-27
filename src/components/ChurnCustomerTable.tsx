import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, AlertTriangle, CheckCircle, Clock, ChevronDown } from 'lucide-react';
import { churnPalette } from './ui/churnPalette';

const segmentMap: Record<string, string> = {
  'Prime Customer': 'Prime',
  'Elite Customer': 'Elite',
  'Standard Customer': 'Standard',
  'Basic Customer': 'Basic'
};

const ChurnCustomerTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [sortBy, setSortBy] = useState('risk_score');
  const [showWillChurn, setShowWillChurn] = useState(true);
  const [willChurnOnly, setWillChurnOnly] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const organization_id = searchParams.get('organization_id');
    if (!organization_id) return;
    fetch(`https://data.coreoutline.com/predict-churn?company=${organization_id}`)
      .then(res => res.json())
      .then(data => {
        // Transform API data to table format
        const transformed = data.map((d: any, idx: number) => {
          let risk_score = d.RFM_Score || 0;
          let risk_level =
            risk_score >= 8 ? 'High' :
            risk_score >= 5 ? 'Medium' :
            'Low';
          return {
            id: `CUST-${d.index ?? idx}`,
            name: `Customer ${d.index ?? idx}`,
            email: '',
            segment: segmentMap[d.Segment_Label] || d.Segment_Label || 'Unknown',
            risk_score,
            risk_level,
            will_churn: d.Will_Churn_in_Two_Months === 1.0,
            monthly_value: d.MONETARY_VALUE || 0,
            // last_login: `${Math.floor(Math.random() * 30)} days ago`,
            // support_tickets: Math.floor(Math.random() * 6),
            // feature_usage: Math.floor(Math.random() * 100)
          };
        });
        setCustomers(transformed);
      })
      .catch(() => {});
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-700 bg-red-100';
      case 'Medium': return 'text-amber-700 bg-amber-100';
      case 'Low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'Prime': return 'text-purple-700 bg-purple-100';
      case 'Elite': return 'text-blue-700 bg-blue-100';
      case 'Standard': return 'text-green-700 bg-green-100';
      case 'Basic': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = selectedSegment === 'all' || customer.segment === selectedSegment;
    const matchesRisk = selectedRisk === 'all' || customer.risk_level === selectedRisk;
    const matchesWillChurn = !willChurnOnly || customer.will_churn;
    return matchesSearch && matchesSegment && matchesRisk && matchesWillChurn;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Customer Risk Analysis</h1>
        <p className="text-gray-600">Monitor and manage customers at risk of churning</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
            </div>

            {/* Segment Filter */}
            <div className="relative">
              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Segments</option>
                <option value="Prime">Prime</option>
                <option value="Elite">Elite</option>
                <option value="Standard">Standard</option>
                <option value="Basic">Basic</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
            </div>

            {/* Risk Filter */}
            <div className="relative">
              <select
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Risk Levels</option>
                <option value="High">High Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="Low">Low Risk</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
            </div>

            {/* Will Churn Filter */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={willChurnOnly}
                onChange={e => setWillChurnOnly(e.target.checked)}
                id="will-churn-filter"
                className="accent-blue-600 h-4 w-4"
              />
              <label htmlFor="will-churn-filter" className="text-sm text-gray-700 select-none">
                Show only customers who will churn
              </label>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">{filteredCustomers.length} customers</span>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Segment</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Risk Level</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Will Churn</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Monthly Value</th>
                {/* <th className="text-left py-3 px-4 font-medium text-gray-700">Last Activity</th> */}
                {/* <th className="text-left py-3 px-4 font-medium text-gray-700">Health Score</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className={`border-t border-gray-100 hover:bg-[${churnPalette[3]}] transition-colors`}>
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                      <div className="text-xs text-gray-400">{customer.id}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSegmentColor(customer.segment)}`}>{customer.segment}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(customer.risk_level)}`}>{customer.risk_level === 'High' && <AlertTriangle className="h-3 w-3 mr-1" />}{customer.risk_level === 'Medium' && <Clock className="h-3 w-3 mr-1" />}{customer.risk_level === 'Low' && <CheckCircle className="h-3 w-3 mr-1" />}{customer.risk_level}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-medium ${customer.will_churn ? 'text-red-600' : 'text-green-600'}`}>{customer.will_churn ? 'Yes' : 'No'}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">${customer.monthly_value}</span>
                  </td>
                  {/* <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">{customer.last_login}</span>
                  </td> */}
                  {/* <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${customer.feature_usage > 70 ? 'bg-green-500' : customer.feature_usage > 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${customer.feature_usage}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-600">{customer.feature_usage}%</span>
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChurnCustomerTable;