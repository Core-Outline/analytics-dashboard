import React, { useState } from 'react';
import { Search, Settings, Database, Share2, CreditCard, FileText, Smartphone, MessageCircle, BarChart3, Cloud } from 'lucide-react';
import IntegrationModal from '../components/IntegrationModal';

interface Integration {
  type: string;
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
    { type: 'mongodb', name: 'MongoDB', description: 'NoSQL document database for modern applications. Store and query data with flexible schemas.', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', color: 'bg-green-500', category: 'Database', isConnected: false, connectionType: 'database' },
    { type: 'mysql', name: 'MySQL', description: 'Popular open-source relational database. Perfect for web applications and data analytics.', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', color: 'bg-blue-500', category: 'Database', isConnected: false, connectionType: 'database' },
    { type: 'postgresql', name: 'PostgreSQL', description: 'Advanced open-source relational database with powerful features and SQL compliance.', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', color: 'bg-blue-600', category: 'Database', isConnected: false, connectionType: 'database' },
    { type: 'snowflake', name: 'Snowflake', description: 'Cloud data warehouse built for performance, concurrency, and simplicity.', icon: 'https://logos-world.net/wp-content/uploads/2022/11/Snowflake-Symbol.png', color: 'bg-cyan-500', category: 'Database', isConnected: false, connectionType: 'database' },

    // Advertising
    { type: 'facebook-ads', name: 'Facebook Ads', description: 'Connect your Facebook advertising account to track campaign performance and ROI metrics.', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png', color: 'bg-blue-600', category: 'Ads', isConnected: false, connectionType: 'oauth' },
    { type: 'google-ads', name: 'Google Ads', description: 'Integrate with Google Ads to monitor campaigns, keywords, and conversion data.', icon: 'https://developers.google.com/static/ads/images/ads-logo.svg', color: 'bg-red-500', category: 'Ads', isConnected: false, connectionType: 'oauth' },
    { type: 'twitter-ads', name: 'Twitter Ads', description: 'Analyze Twitter advertising performance, engagement metrics, and audience insights.', icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg', color: 'bg-sky-500', category: 'Ads', isConnected: false, connectionType: 'oauth' },
    { type: 'instagram-ads', name: 'Instagram Ads', description: 'Track Instagram ad campaigns, story promotions, and influencer partnerships.', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png', color: 'bg-pink-500', category: 'Ads', isConnected: false, connectionType: 'oauth' },

    // Social Media
    { type: 'social-media', name: 'Social Media', description: 'Comprehensive social media analytics across multiple platforms and channels.', icon: 'https://thumbs.dreamstime.com/b/set-popular-social-media-mobile-apps-round-icons-facebook-tiktok-linkedin-twitter-instagram-others-vector-set-288852969.jpg', color: 'bg-purple-500', category: 'Social Media', isConnected: false, connectionType: 'oauth' },

    // Payments
    { type: 'stripe', name: 'Stripe', description: 'Payment processing analytics, transaction insights, and revenue tracking.', icon: 'https://images.ctfassets.net/fzn2n1nzq965/3AGidihOJl4nH9D1vDjM84/9540155d584be52fc54c443b6efa4ae6/stripe.svg', color: 'bg-indigo-600', category: 'Payments', isConnected: false, connectionType: 'api-key' },
    { type: 'paypal', name: 'PayPal', description: 'PayPal transaction data, payment analytics, and customer payment behavior.', icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg', color: 'bg-blue-500', category: 'Payments', isConnected: false, connectionType: 'oauth' },
    { type: 'chargebee', name: 'Chargebee', description: 'Subscription billing analytics, recurring revenue insights, and churn analysis.', icon: 'https://www.chargebee.com/static/resources/brand/chargebee-logo-black.svg', color: 'bg-orange-500', category: 'Payments', isConnected: false, connectionType: 'api-key' },

    // File Sources
    { type: 'csv', name: 'CSV', description: 'Upload and analyze data from CSV files with automatic schema detection.', icon: 'https://cdn-icons-png.flaticon.com/512/6133/6133884.png', color: 'bg-green-600', category: 'File Sources', isConnected: false, connectionType: 'file-upload' },
    { type: 'pdf', name: 'PDF', description: 'Extract and analyze structured data from PDF documents and reports.', icon: 'https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg', color: 'bg-red-600', category: 'File Sources', isConnected: false, connectionType: 'file-upload' },
    { type: 'google-sheets', name: 'Google Sheets', description: 'Real-time data synchronization with Google Sheets for collaborative analytics.', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg', color: 'bg-green-500', category: 'File Sources', isConnected: false, connectionType: 'oauth' },

    // App Stores
    { type: 'play-store', name: 'Play Store', description: 'Android app analytics, download metrics, and Google Play Console data.', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg', color: 'bg-green-600', category: 'App Stores', isConnected: false, connectionType: 'api-key' },
    { type: 'app-store', name: 'App Store', description: 'iOS app analytics, App Store Connect data, and Apple ecosystem insights.', icon: 'https://developer.apple.com/assets/elements/icons/app-store/app-store-128x128_2x.png', color: 'bg-gray-800', category: 'App Stores', isConnected: false, connectionType: 'api-key' },

    // Communication
    { type: 'slack', name: 'Slack', description: 'Team communication analytics, workspace insights, and productivity metrics.', icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg', color: 'bg-purple-600', category: 'Communication', isConnected: false, connectionType: 'oauth' },
    { type: 'intercom', name: 'Intercom', description: 'Customer support analytics, conversation insights, and user engagement data.', icon: 'https://static.intercomassets.com/assets/default-avatars/fin-99a8de0b0c8c2c5e2c5b8de0e0e0e0e0.svg', color: 'bg-blue-500', category: 'Communication', isConnected: false, connectionType: 'oauth' },

    // Analytics
    { type: 'segment', name: 'Segment', description: 'Customer data platform integration for unified analytics and user tracking.', icon: 'https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/quickstart/images/segment-logo.svg', color: 'bg-green-500', category: 'Analytics', isConnected: false, connectionType: 'api-key' }
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

  const handleConnectionComplete = (integrationtype: string) => {
    setConnectedIntegrations(prev => new Set([...prev, integrationtype]));
    setSelectedIntegration(null);
  };

  const handleDisconnect = (integrationtype: string) => {
    setConnectedIntegrations(prev => {
      const newSet = new Set(prev);
      newSet.delete(integrationtype);
      return newSet;
    });
  };

  const toggleConnection = (integrationtype: string) => {
    const isConnected = connectedIntegrations.has(integrationtype);
    if (isConnected) {
      handleDisconnect(integrationtype);
    } else {
      setConnectedIntegrations(prev => new Set([...prev, integrationtype]));
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
                  <div className={`w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center p-2`}>
                    <img 
                      src={integration.icon} 
                      alt={`${integration.name} logo`}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        // Fallback to a generic icon if the image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `<div class="w-8 h-8 bg-gray-300 rounded flex items-center justify-center text-gray-600 text-xs font-bold">${integration.name.charAt(0)}</div>`;
                      }}
                    />
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