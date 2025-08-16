import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useLocation } from 'react-router-dom'

const EarningsChart: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const organization_id = searchParams.get('organization_id');
  const option = {
    series: [
      {
        type: 'pie',
        radius: ['60%', '80%'],
        center: ['50%', '50%'],
        data: [
          { 
            value: 30, 
            name: 'Offline',
            itemStyle: { color: '#1f2937' }
          },
          { 
            value: 25, 
            name: 'Online',
            itemStyle: { color: '#f59e0b' }
          },
          { 
            value: 20, 
            name: 'Trade',
            itemStyle: { color: '#ec4899' }
          },
          { 
            value: 25, 
            name: 'Other',
            itemStyle: { color: '#8b5cf6' }
          }
        ],
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        emphasis: {
          scale: false,
          scaleSize: 0
        }
      }
    ],
    graphic: {
      type: 'text',
      left: 'center',
      top: 'center',
      style: {
        text: '$452',
        fontSize: 24,
        fontWeight: 'bold',
        fill: '#111827',
        fontFamily: 'Inter, system-ui, sans-serif'
      }
    },
    tooltip: {
      show: false
    },
    legend: {
      show: false
    }
  };

  return (
    <div className="flex flex-col items-center">
      <ReactECharts 
        option={option} 
        style={{ height: '160px', width: '160px' }}
        opts={{ renderer: 'canvas' }}
      />
      <div className="mt-4 space-y-2 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
            <span className="text-sm text-gray-600">Offline</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Online</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Trade</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsChart;