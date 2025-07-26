import React from 'react';
import ReactECharts from 'echarts-for-react';

const ActiveUsersHeatmap: React.FC = () => {
  // Days of the week
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Hours of the day (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
  
  // Generate sample data for active users (day, hour, user_count)
  const generateHeatmapData = () => {
    const data = [];
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        // Simulate realistic user activity patterns
        let userCount;
        
        // Weekend vs weekday patterns
        const isWeekend = day === 5 || day === 6; // Saturday, Sunday
        
        // Peak hours: 9-11 AM and 2-4 PM on weekdays, 10 AM-2 PM on weekends
        if (isWeekend) {
          if (hour >= 10 && hour <= 14) {
            userCount = Math.floor(Math.random() * 200) + 150; // 150-350 users
          } else if (hour >= 8 && hour <= 18) {
            userCount = Math.floor(Math.random() * 150) + 80; // 80-230 users
          } else if (hour >= 20 && hour <= 23) {
            userCount = Math.floor(Math.random() * 120) + 60; // 60-180 users
          } else {
            userCount = Math.floor(Math.random() * 50) + 10; // 10-60 users
          }
        } else {
          if ((hour >= 9 && hour <= 11) || (hour >= 14 && hour <= 16)) {
            userCount = Math.floor(Math.random() * 250) + 200; // 200-450 users
          } else if (hour >= 8 && hour <= 18) {
            userCount = Math.floor(Math.random() * 180) + 100; // 100-280 users
          } else if (hour >= 19 && hour <= 22) {
            userCount = Math.floor(Math.random() * 150) + 80; // 80-230 users
          } else {
            userCount = Math.floor(Math.random() * 60) + 20; // 20-80 users
          }
        }
        
        data.push([day, hour, userCount]);
      }
    }
    return data;
  };

  const heatmapData = generateHeatmapData();
  
  // Find min and max values for color scaling
  const values = heatmapData.map(item => item[2]);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const option = {
    grid: {
      left: '10%',
      right: '5%',
      bottom: '15%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: days,
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
        }
      },
      axisLabel: {
        color: '#6b7280',
        fontSize: 12,
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'category',
      data: hours,
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
        }
      },
      axisLabel: {
        color: '#6b7280',
        fontSize: 10,
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    visualMap: {
      min: minValue,
      max: maxValue,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '5%',
      inRange: {
        color: ['#f3f4f6', '#ddd6fe', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9']
      },
      textStyle: {
        color: '#6b7280',
        fontSize: 10
      },
      formatter: function(value: number) {
        return Math.round(value).toString();
      }
    },
    series: [
      {
        name: 'Active Users',
        type: 'heatmap',
        data: heatmapData,
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        itemStyle: {
          borderRadius: 2,
          borderWidth: 1,
          borderColor: '#fff'
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
      formatter: function(params: any) {
        const day = days[params.data[0]];
        const hour = hours[params.data[1]];
        const users = params.data[2];
        return `
          <div style="font-weight: 600; margin-bottom: 4px;">${day} ${hour}</div>
          <div>${users} active users</div>
        `;
      }
    }
  };

  return (
    <div>
      <ReactECharts 
        option={option} 
        style={{ height: '400px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default ActiveUsersHeatmap;