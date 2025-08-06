import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { TrendingUp, TrendingDown, MessageCircle, DollarSign, AlertCircle, Users } from 'lucide-react';

const FeedbackMetricsCard: React.FC = () => {
  // State for metrics
  const [nps, setNps] = useState<any>(null);
  const [csat, setCsat] = useState<any>(null);
  const [ces, setCes] = useState<any>(null);
  const [issuesTrend, setIssuesTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:5000/get-nps-analysis?company_id=301').then(r => r.json()),
      fetch('http://localhost:5000/get-csat-analysis?company_id=301').then(r => r.json()),
      fetch('http://localhost:5000/get-ces-analysis?company_id=301').then(r => r.json()),
      fetch('http://localhost:5000/get-feedback-issues-trend?company_id=301').then(r => r.json()),
    ]).then(([npsData, csatData, cesData, issuesTrendData]) => {
      setNps(npsData);
      setCsat(csatData);
      setCes(cesData);
      setIssuesTrend(issuesTrendData);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading metrics...</div>;

  // Metrics config for rendering
  const metrics = [
    {
      id: 'nps',
      title: 'Net Promoter Score',
      value: nps?.nps_score ?? '-',
      icon: MessageCircle,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      trend: nps?.nps_score > 0 ? 'up' : nps?.nps_score < 0 ? 'down' : 'neutral',
      details: nps ? `Promoters: ${nps.promoters?.toFixed(1)}%, Passives: ${nps.passives?.toFixed(1)}%, Detractors: ${nps.detractors?.toFixed(1)}%` : '',
      color: '#3b82f6'
    },
    {
      id: 'csat',
      title: 'CSAT Score',
      value: csat?.csat_score ?? '-',
      icon: Users,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      trend: csat?.csat_score > 80 ? 'up' : csat?.csat_score < 60 ? 'down' : 'neutral',
      details: csat ? `Very Satisfied: ${csat.very_satisfied}%, Satisfied: ${csat.satisfied}%, Neutral: ${csat.neutral}%, Dissatisfied: ${csat.dissatisfied}%, Very Dissatisfied: ${csat.very_dissatisfied}%` : '',
      color: '#22c55e',
      data: [2.8, 3.1, 2.9, 3.4, 3.6, 3.2, 3.5, 3.2]
    },
    {
      id: 'ces',
      title: 'CES Score',
      value: '02',
      percentage: '2.3%',
      icon: Users,
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      trend: 'up',
      data: [1.8, 2.1, 1.9, 2.4, 2.6, 2.2, 2.5, 2.3],
      color: '#06b6d4'
    },
    {
      id: 'issues',
      title: 'Issues Raised',
      value: '03',
      percentage: '3.12%',
      icon: AlertCircle,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      trend: 'down',
      data: [4.2, 3.8, 4.1, 3.5, 3.2, 3.8, 3.4, 3.12],
      color: '#f97316'
    }
  ];

  const createChartOption = (data: number[] = [], color: string) => ({
    grid: {
      left: '0%',
      right: '0%',
      bottom: '0%',
      top: '0%',
      containLabel: false
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: data.length }, (_, i) => i),
      show: false
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [
      {
        type: 'line',
        data: data,
        smooth: true,
        lineStyle: {
          color: color,
          width: 2
        },
        symbol: 'none',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: color + '40'
              },
              {
                offset: 1,
                color: 'rgba(255, 255, 255, 0)'
              }
            ]
          }
        }
      }
    ],
    tooltip: {
      show: false
    }
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg text-gray-600">Welcome to</h2>
            <h1 className="text-2xl font-bold">
              <span className="text-gray-900">Core&Outline</span>
              <span className="text-blue-500 ml-2">Feedback Analysis</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <div key={metric.id} className="relative">
              {/* Icon */}
              <div className="absolute top-4 left-4">
                <div className={`w-10 h-10 ${metric.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${metric.iconColor}`} />
                </div>
              </div>

              {/* Content */}
              <div className="pl-16 pt-4 pb-4">
                {/* Value and Trend */}
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                  <TrendIcon className={`w-5 h-5 ${
                    metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`} />
                </div>
                
                {/* Percentage */}
                <div className={`text-lg font-semibold mb-2 ${
                  metric.id === 'nps' ? 'text-blue-600' :
                  metric.id === 'csat' ? 'text-green-600' :
                  metric.id === 'ces' ? 'text-cyan-600' :
                  'text-orange-600'
                }`}>
                  {metric.percentage}
                </div>
                
                {/* Title */}
                <div className="text-sm font-medium text-gray-700 mb-3">
                  {metric.title}
                </div>

                {/* Chart */}
                <div className="h-16">
                  <ReactECharts 
                    option={createChartOption(metric.data, metric.color)} 
                    style={{ height: '64px', width: '100%' }}
                    opts={{ renderer: 'canvas' }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeedbackMetricsCard;