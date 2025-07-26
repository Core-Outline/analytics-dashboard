import React, { useState } from 'react';
import { X, Key, Database, Upload, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

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

interface IntegrationModalProps {
  integration: Integration;
  onClose: () => void;
  onConnect: (integrationId: string) => void;
}

const IntegrationModal: React.FC<IntegrationModalProps> = ({ integration, onClose, onConnect }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionStatus('testing');
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setConnectionStatus('success');
    setTimeout(() => {
      onConnect(integration.id);
    }, 1500);
  };

  const renderConnectionForm = () => {
    switch (integration.connectionType) {
      case 'oauth':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-16 h-16 ${integration.color} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                {integration.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect to {integration.name}</h3>
              <p className="text-gray-600 mb-6">{integration.description}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <ExternalLink className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">OAuth Authentication</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    You'll be redirected to {integration.name} to authorize the connection. 
                    Make sure you have admin access to your {integration.name} account.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">What we'll access:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Read campaign performance data</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Access analytics and insights</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>View account information</span>
                </li>
              </ul>
            </div>
          </div>
        );

      case 'api-key':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-16 h-16 ${integration.color} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                {integration.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect to {integration.name}</h3>
              <p className="text-gray-600 mb-6">{integration.description}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Enter your API key"
                    value={formData.apiKey || ''}
                    onChange={(e) => handleInputChange('apiKey', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {integration.id === 'stripe' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook Secret (Optional)
                  </label>
                  <input
                    type="password"
                    placeholder="whsec_..."
                    value={formData.webhookSecret || ''}
                    onChange={(e) => handleInputChange('webhookSecret', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">How to find your API key</h4>
                  <ol className="text-sm text-yellow-700 mt-1 space-y-1 list-decimal list-inside">
                    <li>Log in to your {integration.name} dashboard</li>
                    <li>Navigate to API settings or Developer section</li>
                    <li>Generate or copy your API key</li>
                    <li>Paste it in the field above</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        );

      case 'database':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-16 h-16 ${integration.color} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                {integration.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect to {integration.name}</h3>
              <p className="text-gray-600 mb-6">{integration.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Host <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="localhost"
                  value={formData.host || ''}
                  onChange={(e) => handleInputChange('host', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Port <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={integration.id === 'mongodb' ? '27017' : integration.id === 'mysql' ? '3306' : '5432'}
                  value={formData.port || ''}
                  onChange={(e) => handleInputChange('port', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Database Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="my_database"
                value={formData.database || ''}
                onChange={(e) => handleInputChange('database', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="username"
                  value={formData.username || ''}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="password"
                  value={formData.password || ''}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Database className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Connection Security</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    All database connections are encrypted and secure. We recommend using read-only credentials when possible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'file-upload':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-16 h-16 ${integration.color} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                {integration.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload {integration.name} File</h3>
              <p className="text-gray-600 mb-6">{integration.description}</p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Drop your file here</h4>
              <p className="text-gray-600 mb-4">or click to browse</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Choose File
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Supported formats:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {integration.id === 'csv' && (
                  <>
                    <li>• CSV files (.csv)</li>
                    <li>• Maximum file size: 100MB</li>
                    <li>• UTF-8 encoding recommended</li>
                  </>
                )}
                {integration.id === 'pdf' && (
                  <>
                    <li>• PDF files (.pdf)</li>
                    <li>• Maximum file size: 50MB</li>
                    <li>• Text-based PDFs only</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderConnectionStatus = () => {
    switch (connectionStatus) {
      case 'testing':
        return (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Testing Connection...</h3>
            <p className="text-gray-600">Please wait while we verify your credentials.</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connection Successful!</h3>
            <p className="text-gray-600">Your {integration.name} integration is now active.</p>
          </div>
        );
      case 'error':
        return (
          <div className="text-center py-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connection Failed</h3>
            <p className="text-gray-600">Please check your credentials and try again.</p>
          </div>
        );
      default:
        return renderConnectionForm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {connectionStatus === 'idle' ? `Connect ${integration.name}` : 'Connection Status'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderConnectionStatus()}
        </div>

        {/* Footer */}
        {connectionStatus === 'idle' && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {integration.connectionType === 'oauth' ? 'Authorize' : 'Connect'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationModal;