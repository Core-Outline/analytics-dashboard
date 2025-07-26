import React from 'react';
import { Users, Camera, Zap, MessageCircle, ThumbsUp, RefreshCw, Megaphone, MoreHorizontal } from 'lucide-react';

const SocialMediaMetricsCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Top Section - Main Metrics */}
      <div className="grid grid-cols-3 divide-x divide-gray-100">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Followers</h3>
            </div>
            <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Posts</h3>
            </div>
            <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Conversions</h3>
            </div>
            <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100"></div>

      {/* Bottom Section - Engagement Metrics Grid */}
      <div className="p-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Comments */}
          <div className="text-center">
            <div className="w-16 h-16 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-blue-500" />
            </div>
            <h4 className="text-xl font-medium text-gray-700 mb-1">Comments</h4>
            <p className="text-sm text-gray-500">last month</p>
          </div>

          {/* Likes */}
          <div className="text-center">
            <div className="w-16 h-16 bg-white border-2 border-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="w-6 h-6 text-cyan-500" />
            </div>
            <h4 className="text-xl font-medium text-gray-700 mb-1">Likes</h4>
            <p className="text-sm text-gray-500">last month</p>
          </div>

          {/* Conversions */}
          <div className="text-center">
            <div className="w-16 h-16 bg-white border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-6 h-6 text-green-500" />
            </div>
            <h4 className="text-xl font-medium text-gray-700 mb-1">Conversions</h4>
            <p className="text-sm text-gray-500">last month</p>
          </div>

          {/* Mentions */}
          <div className="text-center">
            <div className="w-16 h-16 bg-white border-2 border-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Megaphone className="w-6 h-6 text-green-500" />
            </div>
            <h4 className="text-xl font-medium text-gray-700 mb-1">Mentions</h4>
            <p className="text-sm text-gray-500">last month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaMetricsCard;