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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [connectedIntegrations, setConnectedIntegrations] = useState<Set<string>>(new Set());

  const integrations: Integration[] = [
    // Databases
    { id: 'mongodb', name: 'MongoDB', description: 'Connect to your MongoDB database for real-time data sync', icon: '🍃', color: 'bg-green-500', category: 'Databases', isConnected: false, connectionType: 'database' },
    { id: 'mysql', name: 'MySQL', description: 'Integrate with MySQL database for structured data analysis', icon: '🐬', color: 'bg-blue-500', category: 'Databases', isConnected: false, connectionType: 'database' },
    { id: 'postgresql', name: 'PostgreSQL', description: 'Connect to PostgreSQL for advanced analytics and reporting', icon: '🐘', color: 'bg-blue-600', category: 'Databases', isConnected: false, connectionType: 'database' },
    { id: 'snowflake', name: 'Snowflake', description: 'Cloud data warehouse integration for enterprise analytics', icon: '❄️', color: 'bg-cyan-500', category: 'Databases', isConnected: false, connectionType: 'database' },

    // Advertising
    { id: 'facebook-ads', name: 'Facebook Ads', description: 'Track ad performance and ROI from Facebook campaigns', icon: '📘', color: 'bg-blue-600', category: 'Advertising', isConnected: false, connectionType: 'oauth' },
    { id: 'google-ads', name: 'Google Ads', description: 'Monitor Google Ads campaigns and conversion metrics', icon: '🎯', color: 'bg-red-500', category: 'Advertising', isConnected: false, connectionType: 'oauth' },
    { id: 'twitter-ads', name: 'Twitter Ads', description: 'Analyze Twitter advertising performance and engagement', icon: '🐦', color: 'bg-sky-500', category: 'Advertising', isConnected: false, connectionType: 'oauth' },
    { id: 'instagram-ads', name: 'Instagram Ads', description: 'Track Instagram ad campaigns and audience insights', icon: '📷', color: 'bg-pink-500', category: 'Advertising', isConnected: false, connectionType: 'oauth' },

    // Social Media
    { id: 'social-media', name: 'Social Media', description: 'Comprehensive social media analytics and monitoring', icon: '📱', color: 'bg-purple-500', category: 'Social Media', isConnected: false, connectionType: 'oauth' },

    // Payments
    { id: 'stripe', name: 'Stripe', description: 'Payment processing analytics and transaction insights', icon: '💳', color: 'bg-indigo-600', category: 'Payments', isConnected: false, connectionType: 'api-key' },
    { id: 'paypal', name: 'PayPal', description: 'PayPal transaction data and payment analytics', icon: '💰', color: 'bg-blue-500', category: 'Payments', isConnected: false, connectionType: 'oauth' },
    { id: 'chargebee', name: 'Chargebee', description: 'Subscription billing and revenue analytics', icon: '🔄', color: 'bg-orange-500', category: 'Payments', isConnected: false, connectionType: 'api-key' },

    // File Sources
    { id: 'csv', name: 'CSV', description: 'Upload and analyze data from CSV files', icon: '📊', color: 'bg-green-600', category: 'File Sources', isConnected: false, connectionType: 'file-upload' },
    { id: 'pdf', name: 'PDF', description: 'Extract and analyze data from PDF documents', icon: '📄', color: 'bg-red-600', category: 'File Sources', isConnected: false, connectionType: 'file-upload' },
    { id: 'google-sheets', name: 'Google Sheets', description: 'Real-time data sync with Google Sheets', icon: '📈', color: 'bg-green-500', category: 'File Sources', isConnected: false, connectionType: 'oauth' },

    // App Stores
    { id: 'play-store', name: 'Play Store', description: 'Android app analytics and performance metrics', icon: '🤖', color: 'bg-green-600', category: 'App Stores', isConnected: false, connectionType: 'api-key' },
    { id: 'app-store', name: 'App Store', description: 'iOS app analytics and App Store Connect data', icon: '🍎', color: 'bg-gray-800', category: 'App Stores', isConnected: false, connectionType: 'api-key' },

    // Communication
    { id: 'slack', name: 'Slack', description: 'Team communication analytics and workspace insights', icon: '💬', color: 'bg-purple-600', category: 'Communication', isConnected: false, connectionType: 'oauth' },
    { id: 'intercom', name: 'Intercom', description: 'Customer support and messaging analytics', icon: '🎧', color: 'bg-blue-500', category: 'Communication', isConnected: false, connectionType: 'oauth' },

    // Analytics
    { id: 'segment', name: 'Segment', description: 'Customer data platform and analytics integration', icon: '📊', color: 'bg-green-500', category: 'Analytics', isConnected: false, connectionType: 'api-key' }
  ];

  const categories = [
    { name: 'Databases', icon: Database, color: 'text-blue-600' },
    { name: 'Advertising', icon: BarChart3, color: 'text-red-600' },
    { name: 'Social Media', icon: Share2, color: 'text-purple-600' },
    { name: 'Payments', icon: CreditCard, color: 'text-green-600' },
    { name: 'File Sources', icon: FileText, color: 'text-orange-600' },
    { name: 'App Stores', icon: Smartphone, color: 'text-gray-600' },
    { name: 'Communication', icon: MessageSquare, color: 'text-indigo-600' },
    { name: 'Analytics', icon: BarChart3, color: 'text-cyan-600' }
  ];

  const filteredIntegrations = integrations.filter(integration =>
    integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    integration.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedIntegrations = categories.reduce((acc, category) => {
    acc[category.name] = filteredIntegrations.filter(integration => integration.category === category.name);
    return acc;
  }, {} as Record<string, Integration[]>);

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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Integrations</h1>
        <p className="text-gray-600">Supercharge your workflow - connect tools you use.</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search integrations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Integration Categories */}
      <div className="space-y-8">
        {categories.map((category) => {
          const categoryIntegrations = groupedIntegrations[category.name];
          if (categoryIntegrations.length === 0) return null;

          const CategoryIcon = category.icon;

          return (
            <div key={category.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className={`w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center`}>
                  <CategoryIcon className={`w-5 h-5 ${category.color}`} />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{category.name}</h2>
                <span className="text-sm text-gray-500">({categoryIntegrations.length})</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryIntegrations.map((integration) => {
                  const isConnected = connectedIntegrations.has(integration.id);
                  
                  return (
                    <div
                      key={integration.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg ${integration.color} flex items-center justify-center text-white text-lg`}>
                            {integration.icon}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{integration.name}</h3>
                            {isConnected && (
                              <span className="text-xs text-green-600 font-medium">Connected</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => isConnected ? handleDisconnect(integration.id) : handleConnect(integration)}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                              isConnected
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            {isConnected ? 'Disconnect' : 'Configure'}
                          </button>
                          <div className={`w-10 h-6 rounded-full transition-colors ${
                            isConnected ? 'bg-blue-600' : 'bg-gray-300'
                          } relative cursor-pointer`}>
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                              isConnected ? 'translate-x-5' : 'translate-x-1'
                            }`}></div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{integration.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

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