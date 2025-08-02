import React, { useState } from 'react';
import { Mail, Phone, MoreHorizontal } from 'lucide-react';

const CustomerSegmentationCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Best Customers');

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

  // Sample customer data for different segments
  const customerData = {
    'Best Customers': [
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        arpu: '$2,450',
        ltv: '$12,250',
        recencyScore: 5,
        frequencyScore: 5,
        rfmScore: 'AAA',
        action: 'Retain'
      },
      {
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+1 (555) 234-5678',
        arpu: '$2,180',
        ltv: '$10,900',
        recencyScore: 5,
        frequencyScore: 4,
        rfmScore: 'AAB',
        action: 'Upsell'
      },
      {
        name: 'Emily Davis',
        email: 'emily.davis@email.com',
        phone: '+1 (555) 345-6789',
        arpu: '$1,980',
        ltv: '$9,900',
        recencyScore: 4,
        frequencyScore: 5,
        rfmScore: 'ABA',
        action: 'Retain'
      }
    ],
    'High ARPU': [
      {
        name: 'David Wilson',
        email: 'david.wilson@email.com',
        phone: '+1 (555) 456-7890',
        arpu: '$3,200',
        ltv: '$8,500',
        recencyScore: 3,
        frequencyScore: 4,
        rfmScore: 'BAB',
        action: 'Engage'
      },
      {
        name: 'Lisa Anderson',
        email: 'lisa.anderson@email.com',
        phone: '+1 (555) 567-8901',
        arpu: '$2,850',
        ltv: '$7,200',
        recencyScore: 4,
        frequencyScore: 3,
        rfmScore: 'ABB',
        action: 'Retain'
      }
    ],
    'Low ARPU': [
      {
        name: 'James Brown',
        email: 'james.brown@email.com',
        phone: '+1 (555) 678-9012',
        arpu: '$180',
        ltv: '$900',
        recencyScore: 3,
        frequencyScore: 2,
        rfmScore: 'BBC',
        action: 'Nurture'
      },
      {
        name: 'Maria Garcia',
        email: 'maria.garcia@email.com',
        phone: '+1 (555) 789-0123',
        arpu: '$220',
        ltv: '$1,100',
        recencyScore: 4,
        frequencyScore: 2,
        rfmScore: 'ABC',
        action: 'Upsell'
      }
    ],
    'High Repeat': [
      {
        name: 'Robert Taylor',
        email: 'robert.taylor@email.com',
        phone: '+1 (555) 890-1234',
        arpu: '$1,450',
        ltv: '$14,500',
        recencyScore: 5,
        frequencyScore: 5,
        rfmScore: 'AAA',
        action: 'Retain'
      },
      {
        name: 'Jennifer White',
        email: 'jennifer.white@email.com',
        phone: '+1 (555) 901-2345',
        arpu: '$1,280',
        ltv: '$12,800',
        recencyScore: 4,
        frequencyScore: 5,
        rfmScore: 'ABA',
        action: 'Reward'
      }
    ],
    'Low Repeat': [
      {
        name: 'Thomas Miller',
        email: 'thomas.miller@email.com',
        phone: '+1 (555) 012-3456',
        arpu: '$850',
        ltv: '$1,700',
        recencyScore: 2,
        frequencyScore: 1,
        rfmScore: 'CCC',
        action: 'Win Back'
      },
      {
        name: 'Amanda Jones',
        email: 'amanda.jones@email.com',
        phone: '+1 (555) 123-4567',
        arpu: '$920',
        ltv: '$1,840',
        recencyScore: 3,
        frequencyScore: 1,
        rfmScore: 'BCC',
        action: 'Engage'
      }
    ],
    'Churned': [
      {
        name: 'Christopher Lee',
        email: 'christopher.lee@email.com',
        phone: '+1 (555) 234-5678',
        arpu: '$0',
        ltv: '$2,400',
        recencyScore: 1,
        frequencyScore: 1,
        rfmScore: 'CCC',
        action: 'Win Back'
      },
      {
        name: 'Michelle Clark',
        email: 'michelle.clark@email.com',
        phone: '+1 (555) 345-6789',
        arpu: '$0',
        ltv: '$1,800',
        recencyScore: 1,
        frequencyScore: 2,
        rfmScore: 'CBC',
        action: 'Reactivate'
      }
    ],
    'Recent': [
      {
        name: 'Daniel Rodriguez',
        email: 'daniel.rodriguez@email.com',
        phone: '+1 (555) 456-7890',
        arpu: '$450',
        ltv: '$450',
        recencyScore: 5,
        frequencyScore: 1,
        rfmScore: 'ACC',
        action: 'Onboard'
      },
      {
        name: 'Ashley Martinez',
        email: 'ashley.martinez@email.com',
        phone: '+1 (555) 567-8901',
        arpu: '$380',
        ltv: '$380',
        recencyScore: 5,
        frequencyScore: 1,
        rfmScore: 'ACC',
        action: 'Welcome'
      }
    ],
    'High LTV': [
      {
        name: 'Kevin Thompson',
        email: 'kevin.thompson@email.com',
        phone: '+1 (555) 678-9012',
        arpu: '$1,850',
        ltv: '$18,500',
        recencyScore: 4,
        frequencyScore: 5,
        rfmScore: 'ABA',
        action: 'VIP'
      },
      {
        name: 'Rachel Green',
        email: 'rachel.green@email.com',
        phone: '+1 (555) 789-0123',
        arpu: '$1,650',
        ltv: '$16,500',
        recencyScore: 5,
        frequencyScore: 4,
        rfmScore: 'AAB',
        action: 'Retain'
      }
    ],
    'Low LTV': [
      {
        name: 'Brian Wilson',
        email: 'brian.wilson@email.com',
        phone: '+1 (555) 890-1234',
        arpu: '$120',
        ltv: '$240',
        recencyScore: 2,
        frequencyScore: 1,
        rfmScore: 'CCC',
        action: 'Nurture'
      },
      {
        name: 'Nicole Adams',
        email: 'nicole.adams@email.com',
        phone: '+1 (555) 901-2345',
        arpu: '$150',
        ltv: '$300',
        recencyScore: 3,
        frequencyScore: 1,
        rfmScore: 'BCC',
        action: 'Develop'
      }
    ]
  };

  const currentData = customerData[activeTab] || [];

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
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-sm font-medium text-gray-600 pb-3">Name</th>
              <th className="text-left text-sm font-medium text-gray-600 pb-3">Email and Phone</th>
              <th className="text-left text-sm font-medium text-gray-600 pb-3">ARPU</th>
              <th className="text-left text-sm font-medium text-gray-600 pb-3">LTV</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Recency Score</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Frequency Score</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">RFM Score</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((customer, index) => (
              <tr key={index} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                <td className="text-sm text-gray-900 py-4 font-medium">{customer.name}</td>
                <td className="text-sm text-gray-600 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-3 h-3" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="text-sm text-gray-900 py-4 font-medium">{customer.arpu}</td>
                <td className="text-sm text-gray-900 py-4 font-medium">{customer.ltv}</td>
                <td className="text-sm text-gray-900 py-4 text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-blue-800 font-bold text-xs">{customer.recencyScore}</span>
                  </div>
                </td>
                <td className="text-sm text-gray-900 py-4 text-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-green-800 font-bold text-xs">{customer.frequencyScore}</span>
                  </div>
                </td>
                <td className="text-sm py-4 text-center">
                  <span className={`font-mono text-sm ${getRFMScoreColor(customer.rfmScore)}`}>
                    {customer.rfmScore}
                  </span>
                </td>
                <td className="text-sm py-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(customer.action)}`}>
                    {customer.action}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {currentData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No customers found in this segment
        </div>
      )}
    </div>
  );
};

export default CustomerSegmentationCard;