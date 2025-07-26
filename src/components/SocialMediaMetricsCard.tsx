import React from 'react';
import { Users, Camera, Zap, MessageCircle, ThumbsUp, RefreshCw, Megaphone, MoreHorizontal } from 'lucide-react';

const SocialMediaMetricsCard: React.FC = () => {
  // Sample data for top metrics
  const topMetrics = [
    {
      title: 'Followers',
      icon: Users,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      currentValue: 45280,
      lastMonthValue: 42150,
      growth: '+7.4%'
    },
    {
      title: 'Posts',
      icon: Camera,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      currentValue: 156,
      lastMonthValue: 142,
      growth: '+9.9%'
    },
    {
      title: 'Conversions',
      icon: Zap,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      currentValue: 1256,
      lastMonthValue: 987,
      growth: '+27.3%'
    }
  ];

  // Sample data for engagement metrics
  const engagementMetrics = [
    {
      title: 'Comments',
      icon: MessageCircle,
      iconColor: 'text-blue-500',
      borderColor: 'border-blue-500',
      currentValue: 2847,
      lastMonthValue: 2156,
      growth: '+32.0%'
    },
    {
      title: 'Likes',
      icon: ThumbsUp,
      iconColor: 'text-cyan-500',
      borderColor: 'border-cyan-500',
      currentValue: 18420,
      lastMonthValue: 15680,
      growth: '+17.5%'
    },
    {
      title: 'Conversions',
      icon: RefreshCw,
      iconColor: 'text-green-500',
      borderColor: 'border-green-500',
      currentValue: 1256,
      lastMonthValue: 987,
      growth: '+27.3%'
    },
    {
      title: 'Mentions',
      icon: Megaphone,
      iconColor: 'text-green-500',
      borderColor: 'border-cyan-500',
      currentValue: 892,
      lastMonthValue: 743,
      growth: '+20.1%'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Top Section - Main Metrics */}
      <div className="grid grid-cols-3 divide-x divide-gray-100">
        {topMetrics.map((metric, index) => {
          const Icon = metric.icon;
          
          return (
            <div key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${metric.iconBg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${metric.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{metric.title}</h3>
                </div>
                <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
              </div>
              
              {/* Metric Values */}
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900">
                  {metric.currentValue.toLocaleString()}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">
                    Last month: {metric.lastMonthValue.toLocaleString()}
                  </p>
                  <p className="text-sm font-medium text-green-600">
                    {metric.growth}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100"></div>

      {/* Bottom Section - Engagement Metrics Grid */}
      <div className="p-8">
        <div className="grid grid-cols-2 gap-8">
          {engagementMetrics.map((metric, index) => {
            const Icon = metric.icon;
            
            return (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 bg-white border-2 ${metric.borderColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-6 h-6 ${metric.iconColor}`} />
                </div>
                <h4 className="text-xl font-medium text-gray-700 mb-2">{metric.title}</h4>
                
                {/* Current Value */}
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metric.currentValue.toLocaleString()}
                </div>
                
                {/* Last Month Comparison */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">
                    Last month: {metric.lastMonthValue.toLocaleString()}
                  </p>
                  <p className="text-sm font-medium text-green-600">
                    {metric.growth}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaMetricsCard;