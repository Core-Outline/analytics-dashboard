import React, { useState } from 'react';
import { Search, Settings, Database, Share2, CreditCard, FileText, Smartphone, MessageSquare, BarChart3, Cloud } from 'lucide-react';
import IntegrationModal from '../components/IntegrationModal';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  isConnected: boolean;
  connectionType: 'oauth' | 'api-key' | 'database' | 'file-upload';
}

const IntegrationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All integrations');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [connectedIntegrations, setConnectedIntegrations] = useState<Set<string>>(new Set());

  const integrations: Integration[] = [
    // Databases
    { id: 'mongodb', name: 'MongoDB', description: 'NoSQL document database for modern applications. Store and query data with flexible schemas.', icon: '🍃', color: 'bg-green-500', category: 'Database', isConnected: false, connectionType: 'database' },
    { id: 'mysql', name: 'MySQL', description: 'Popular open-source relational database. Perfect for web applications and data analytics.', icon: '🐬', color: 'bg-blue-500', category: 'Database', isConnected: false, connectionType: 'database' },
    { id: 'postgresql', name: 'PostgreSQL', description: 'Advanced open-source relational database with powerful features and SQL compliance.', icon: '🐘', color: 'bg-blue-600', category: 'Database', isConnected: false, connectionType: 'database' },
    { id: 'snowflake', name: 'Snowflake', description: 'Cloud data warehouse built for performance, concurrency, and simplicity.', icon: '❄️', color: 'bg-cyan-500', category: 'Database', isConnected: false, connectionType: 'database' },

    // Advertising
    { id: 'facebook-ads', name: 'Facebook Ads', description: 'Connect your Facebook advertising account to track campaign performance and ROI metrics.', icon: '📘', color: 'bg-blue-600', category: 'Ads', isConnected: false, connectionType: 'oauth' },
    { id: 'google-ads', name: 'Google Ads', description: 'Integrate with Google Ads to monitor campaigns, keywords, and conversion data.', icon: '🎯', color: 'bg-red-500', category: 'Ads', isConnected: false, connectionType: 'oauth' },
    { id: 'twitter-ads', name: 'Twitter Ads', description: 'Analyze Twitter advertising performance, engagement metrics, and audience insights.', icon: '🐦', color: 'bg-sky-500', category: 'Ads', isConnected: false, connectionType: 'oauth' },
    { id: 'instagram-ads', name: 'Instagram Ads', description: 'Track Instagram ad campaigns, story promotions, and influencer partnerships.', icon: '📷', color: 'bg-pink-500', category: 'Ads', isConnected: false, connectionType: 'oauth' },

    // Social Media
    { id: 'social-media', name: 'Social Media', description: 'Comprehensive social media analytics across multiple platforms and channels.', icon: '📱', color: 'bg-purple-500', category: 'Social Media', isConnected: false, connectionType: 'oauth' },

    // Payments
    { id: 'stripe', name: 'Stripe', description: 'Payment processing analytics, transaction insights, and revenue tracking.', icon: '💳', color: 'bg-indigo-600', category: 'Payments', isConnected: false, connectionType: 'api-key' },
    { id: 'paypal', name: 'PayPal', description: 'PayPal transaction data, payment analytics, and customer payment behavior.', icon: '💰', color: 'bg-blue-500', category: 'Payments', isConnected: false, connectionType: 'oauth' },
    { id: 'chargebee', name: 'Chargebee', description: 'Subscription billing analytics, recurring revenue insights, and churn analysis.', icon: '🔄', color: 'bg-orange-500', category: 'Payments', isConnected: false, connectionType: 'api-key' },

    // File Sources
    { id: 'csv', name: 'CSV', description: 'Upload and analyze data from CSV files with automatic schema detection.', icon: '📊', color: 'bg-green-600', category: 'File Sources', isConnected: false, connectionType: 'file-upload' },
    { id: 'pdf', name: 'PDF', description: 'Extract and analyze structured data from PDF documents and reports.', icon: '📄', color: 'bg-red-600', category: 'File Sources', isConnected: false, connectionType: 'file-upload' },
    { id: 'google-sheets', name: 'Google Sheets', description: 'Real-time data synchronization with Google Sheets for collaborative analytics.', icon: '📈', color: 'bg-green-500', category: 'File Sources', isConnected: false, connectionType: 'oauth' },

    // App Stores
    { id: 'play-store', name: 'Play Store', description: 'Android app analytics, download metrics, and Google Play Console data.', icon: '🤖', color: 'bg-green-600', category: 'App Stores', isConnected: false, connectionType: 'api-key' },
    { id: 'app-store', name: 'App Store', description: 'iOS app analytics, App Store Connect data, and Apple ecosystem insights.', icon: '🍎', color: 'bg-gray-800', category: 'App Stores', isConnected: false, connectionType: 'api-key' },

    // Communication
    { id: 'slack', name: 'Slack', description: 'Team communication analytics, workspace insights, and productivity metrics.', icon: '💬', color: 'bg-purple-600', category: 'Communication', isConnected: false, connectionType: 'oauth' },
    { id: 'intercom', name: 'Intercom', description: 'Customer support analytics, conversation insights, and user engagement data.', icon: '🎧', color: 'bg-blue-500', category: 'Communication', isConnected: false, connectionType: 'oauth' },

    // Analytics
    { id: 'segment', name: 'Segment', description: 'Customer data platform integration for unified analytics and user tracking.', icon: '📊', color: 'bg-green-500', category: 'Analytics', isConnected: false, connectionType: 'api-key' }
  ];

  const tabs = [
    'All integrations',
    'Database', 
    'Ads',
    'Social Media',
    'Payments',
    'File Sources',
    'App Stores',
    'Communication',
    'Analytics'
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All integrations' || integration.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
  };

  const handleConnectionComplete = (integrationId: string) => {
    setConnectedIntegrations(prev => new Set([...prev, integrationId]));
    setSelectedIntegration(null);
  };

  const handleDisconnect = (integrationId: string) => {
    setConnectedIntegrations(prev => {
      const newSet = new Set(prev);
      newSet.delete(integrationId);
      return newSet;
    });
  };

  const toggleConnection = (integrationId: string) => {
    const isConnected = connectedIntegrations.has(integrationId);
    if (isConnected) {
      handleDisconnect(integrationId);
    } else {
      setConnectedIntegrations(prev => new Set([...prev, integrationId]));
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Integrations</h1>
        <p className="text-gray-600">Supercharge your workflow - connect tools you use.</p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex space-x-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-1 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => {
          const isConnected = connectedIntegrations.has(integration.id);
          
          return (
            <div
              key={integration.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
            >
              {/* Integration Icon and Name */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg ${integration.color} flex items-center justify-center text-white text-xl`}>
                    {integration.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{integration.name}</h3>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {integration.description}
              </p>

              {/* Configure Button and Toggle */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleConnect(integration)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Configure</span>
                </button>
                
                <div 
                  onClick={() => toggleConnection(integration.id)}
                  className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                    isConnected ? 'bg-blue-600' : 'bg-gray-300'
                  } relative`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    isConnected ? 'translate-x-6' : 'translate-x-0.5'
                  }`}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Database className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Integration Modal */}
      {selectedIntegration && (
        <IntegrationModal
          integration={selectedIntegration}
          onClose={() => setSelectedIntegration(null)}
          onConnect={handleConnectionComplete}
        />
      )}
    </div>
  );
};

export default IntegrationsPage;