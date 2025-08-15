import React, { useState } from 'react';
import { X, Key, Database, Upload, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
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
  // Social Media tag input state (must be at component root, not inside renderConnectionForm)
  const [tagInput, setTagInput] = useState('');
  const { organization_id } = useParams();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Generic API function for creating a data source
  const createDataSource = async (data: any) => {
    data['organization_id'] = organization_id
    const res = await fetch('http://localhost:4000/data-source/create-data-source', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create data source');
    return res.json();
  };

  // Handler for all integration types
  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionStatus('testing');
    try {
      let payload = {};
      switch (integration.id) {
        case 'mysql':
          payload = {
            name: formData.name,
            username: formData.username,
            password: formData.password,
            url: formData.url,
            database: formData.database,
            schema: formData.schema,
            type: 'mysql',
            organization_id: organization_id
          };
          break;
        case 'postgresql':
          payload = {
            name: formData.name,
            username: formData.username,
            password: formData.password,
            url: formData.url,
            database: formData.database,
            schema: formData.schema,
            port: formData.port,
            type: 'postgres',
            organization_id: organization_id
          };
          break;
        case 'mongodb':
          payload = {
            name: formData.name,
            username: formData.username,
            password: formData.password,
            cluster: formData.cluster,
            database: formData.database,
            url: formData.url,
            type: 'mongodb',
            organization_id: organization_id
          };
          break;
        case 'facebook-ads':
          payload = {
            name: formData.name,
            access_token: formData.access_token,
            app_id: formData.app_id,
            app_secret: formData.app_secret,
            type: 'facebook_ads',
            organization_id: organization_id
          };
          break;
        case 'csv':
          payload = {
            name: formData.name,
            type: 'csv',
            file_name: formData.file_name,
            organization_id: organization_id
          };
          break;
        case 'stripe':
          payload = {
            name: formData.name,
            secret_key: formData.secret_key,
            type: 'stripe',
            organization_id: organization_id
          };
          break;
        case 'social-media':
          payload = {
            platform: formData.platform,
            username: formData.username,
            tags: formData.tags || [],
            influencers: formData.influencers || [],
            type: 'social_media',
            organization_id: organization_id
          };
          break;
        default:
          payload = formData;
      }
      // CSV file upload flow
      if (integration.id === 'csv' && formData.file) {
        const createResp = await createDataSource(payload);
        // Upload file to signed URL
        const uploadResp = await fetch(createResp.signed_url, {
          method: 'PUT',
          body: formData.file
        });
        if (!uploadResp.ok) throw new Error('CSV upload failed');
      } else {
        await createDataSource(payload);
      }
      setConnectionStatus('success');
      setTimeout(() => {
        onConnect(integration.id);
      }, 1500);
    } catch (e) {
      console.error(e)
      setConnectionStatus('error');
    } finally {
      setIsConnecting(false);
    }
  };

  const renderConnectionForm = () => {
    switch (integration.connectionType) {
      case 'oauth':
        // Facebook Ads, Social Media, etc.
        if (integration.id === 'facebook-ads') {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <div className={`w-16 h-16 ${integration.color} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                  {integration.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect to Facebook Ads</h3>
                <p className="text-gray-600 mb-6">{integration.description}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Source Name <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Facebook Ads Source Name" value={formData.name || ''} onChange={e => handleInputChange('name', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Access Token <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Facebook Access Token" value={formData.access_token || ''} onChange={e => handleInputChange('access_token', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">App ID <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Facebook App ID" value={formData.app_id || ''} onChange={e => handleInputChange('app_id', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">App Secret <span className="text-red-500">*</span></label>
                  <input type="password" placeholder="Facebook App Secret" value={formData.app_secret || ''} onChange={e => handleInputChange('app_secret', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
            </div>
          );
        }
         if (integration.id === 'social-media') {
          // Social Media: platform dropdown, username, tag chips, influencer usernames (up to 4)
          const platforms = [
            { value: 'twitter', label: 'Twitter' },
            { value: 'tiktok', label: 'Tiktok' },
            { value: 'instagram', label: 'Instagram' },
            { value: 'linkedin', label: 'LinkedIn' },
            { value: 'facebook', label: 'Facebook' }
          ];
          const tags = formData.tags ? (Array.isArray(formData.tags) ? formData.tags : formData.tags.split(',')) : [];
          const influencers = formData.influencers ? (Array.isArray(formData.influencers) ? formData.influencers : formData.influencers.split(',')) : [];
          return (
            <div className="space-y-6">
              <div className="text-center">
                <div className={`w-16 h-16 ${integration.color} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                  {integration.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Social Media</h3>
                <p className="text-gray-600 mb-6">{integration.description}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform <span className="text-red-500">*</span></label>
                  <select value={formData.platform || ''} onChange={e => handleInputChange('platform', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select Platform</option>
                    {platforms.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="@handle" value={formData.username || ''} onChange={e => handleInputChange('username', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Keywords/Tags</label>
                  <input
                    type="text"
                    placeholder="Enter tag and press Enter"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && tagInput.trim()) {
                        handleInputChange('tags', [...tags, tagInput.trim()].join(','));
                        setTagInput('');
                        e.preventDefault();
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex flex-wrap mt-2 gap-2">
                    {tags.map((tag: string, idx: number) => (
                      <span key={idx} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {tag}
                        <button type="button" className="ml-1 text-blue-500 hover:text-blue-700" onClick={() => {
                          const newTags = tags.filter((_: string, i: number) => i !== idx);
                          handleInputChange('tags', newTags.join(','));
                        }}>×</button>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Influencers (up to 4)</label>
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Influencer ${idx + 1}`}
                      value={influencers[idx] || ''}
                      onChange={e => {
                        const newInfluencers = [...influencers];
                        newInfluencers[idx] = e.target.value;
                        handleInputChange('influencers', newInfluencers.join(','));
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        }
        // Default OAuth form
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
                  <p className="text-sm text-blue-700 mt-1">You'll be redirected to {integration.name} to authorize the connection. Make sure you have admin access to your {integration.name} account.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'api-key':
        // Stripe (and similar) integration form
        if (integration.id === 'stripe') {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <div className={`w-16 h-16 ${integration.color} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                  {integration.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect to Stripe</h3>
                <p className="text-gray-600 mb-6">{integration.description}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Source Name <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Stripe Source Name" value={formData.name || ''} onChange={e => handleInputChange('name', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key <span className="text-red-500">*</span></label>
                  <input type="password" placeholder="sk_live_..." value={formData.secret_key || ''} onChange={e => handleInputChange('secret_key', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
            </div>
          );
        }
        // Default API key integration
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
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="password" placeholder="Enter your API key" value={formData.apiKey || ''} onChange={e => handleInputChange('apiKey', e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'database':
        // Show all DB fields for MySQL, PostgreSQL, MongoDB
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Host <span className="text-red-500">*</span></label>
                <input type="text" placeholder="localhost or cluster url" value={formData.url || ''} onChange={e => handleInputChange('url', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Port <span className="text-red-500">*</span></label>
                <input type="text" placeholder={integration.id === 'mongodb' ? '27017' : integration.id === 'mysql' ? '3306' : '5432'} value={formData.port || ''} onChange={e => handleInputChange('port', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username <span className="text-red-500">*</span></label>
                <input type="text" placeholder="username" value={formData.username || ''} onChange={e => handleInputChange('username', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password <span className="text-red-500">*</span></label>
                <input type="password" placeholder="password" value={formData.password || ''} onChange={e => handleInputChange('password', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Database Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="my_database" value={formData.database || ''} onChange={e => handleInputChange('database', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schema {integration.id === 'postgresql' || integration.id === 'mysql' ? <span className="text-gray-400">(optional)</span> : null}</label>
                <input type="text" placeholder="public" value={formData.schema || ''} onChange={e => handleInputChange('schema', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            {integration.id === 'postgresql' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Port <span className="text-red-500">*</span></label>
                <input type="text" placeholder="5432" value={formData.port || ''} onChange={e => handleInputChange('port', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            )}
            {integration.id === 'mongodb' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cluster (optional)</label>
                <input type="text" placeholder="Cluster name or url" value={formData.cluster || ''} onChange={e => handleInputChange('cluster', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            )}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Database className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Connection Security</h4>
                  <p className="text-sm text-blue-700 mt-1">All database connections are encrypted and secure. We recommend using read-only credentials when possible.</p>
                </div>
              </div>
            </div>
            </div>
          );
      case 'file-upload':
        // CSV/PDF upload
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-16 h-16 ${integration.color} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                {integration.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload {integration.name} File</h3>
              <p className="text-gray-600 mb-6">{integration.description}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Source Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder={`${integration.name} Source Name`} value={formData.name || ''} onChange={e => handleInputChange('name', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select File <span className="text-red-500">*</span></label>
                <input
                  type="file"
                  accept={integration.id === 'csv' ? '.csv' : integration.id === 'pdf' ? '.pdf' : '*'}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    handleInputChange('file', file);
                    handleInputChange('file_name', file?.name || '');
                  }}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.file_name && (
                  <div className="text-xs text-gray-500 mt-1">Selected: {formData.file_name}</div>
                )}
              </div>
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
// ...

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