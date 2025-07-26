import React from 'react';
import ReactECharts from 'echarts-for-react';

const UsersByDeviceCard: React.FC = () => {
  const deviceData = [
    { name: 'Desktop', value: 1245, color: '#3b82f6' },
    { name: 'Mobile', value: 987, color: '#10b981' },
    { name: 'Tablet', value: 456, color: '#f59e0b' },
    { name: 'Other', value: 159, color: '#8b5cf6' }
  ];

  const chartOption = {
    series: [
      {
        type: 'pie',
        radius: ['30%', '70%'],
        center: ['50%', '45%'],
        roseType: 'area',
        data: deviceData.map(item => ({
          value: item.value,
          name: item.name,
          itemStyle: { 
            color: item.color,
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          }
        })),
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        emphasis: {
          scale: true,
          scaleSize: 5
        }
      }
    ],
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151',
        fontSize: 12
      },
      formatter: '{b}: {c} sessions ({d}%)'
    },
    legend: {
      show: false
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Users by Device</h3>
      
      {/* Nightingale Pie Chart */}
      <div className="mb-6">
        <ReactECharts 
          option={chartOption} 
          style={{ height: '200px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>

      {/* Device Sessions Table */}
      <div className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-sm font-medium text-gray-600 pb-3">Device</th>
              <th className="text-right text-sm font-medium text-gray-600 pb-3">Sessions</th>
            </tr>
          </thead>
          <tbody>
            {deviceData.map((device, index) => (
              <tr key={index} className="border-b border-gray-100 last:border-b-0">
                <td className="text-sm text-gray-900 py-3 flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: device.color }}
                  ></div>
                  {device.name}
                </td>
                <td className="text-sm text-gray-900 py-3 text-right font-medium">
                  {device.value.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersByDeviceCard;