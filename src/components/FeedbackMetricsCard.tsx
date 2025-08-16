import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { MessageCircle, AlertCircle, Users } from 'lucide-react';
import { useLocation} from 'react-router-dom';
// Header Card Component
const HeaderCard = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
    <div className="flex items-center space-x-3">
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
);

// Metrics Grid Component
const MetricsGrid = ({ metrics, createChartOption }: { metrics: any[], createChartOption: (data: number[], color: string) => any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
    {metrics.map((metric) => (
      <div key={metric.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{metric.title}</p>
            <div className="flex items-end mt-2">
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              {metric.percentage && (
                <span className={`ml-2 text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.percentage}
                </span>
              )}
            </div>
          </div>
          <div className={`p-2 rounded-lg ${metric.iconBg}`}>
            <metric.icon className={`w-5 h-5 ${metric.iconColor}`} />
          </div>
        </div>
        <div className="mt-4 h-16">
          <ReactECharts
            option={createChartOption(metric.data, metric.color)}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        </div>
        {/* {metric.details && (
          <p className="text-xs text-gray-500 mt-2">{metric.details}</p>
        )} */}
      </div>
    ))}
  </div>
);

const FeedbackMetricsCard: React.FC = () => {
  // State for metrics
  const [nps, setNps] = useState<any>(null);
  const [csat, setCsat] = useState<any>(null);
  const [ces, setCes] = useState<any>(null);
  const [issuesTrend, setIssuesTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const organization_id = searchParams.get('organization_id');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`https://data.coreoutline.com/get-nps-analysis?company_id=${organization_id}`).then(r => r.json()),
      fetch(`https://data.coreoutline.com/get-csat-analysis?company_id=${organization_id}`).then(r => r.json()),
      fetch(`https://data.coreoutline.com/get-ces-analysis?company_id=${organization_id}`).then(r => r.json()),
      fetch(`https://data.coreoutline.com/get-feedback-issues-trend?company_id=${organization_id}`).then(r => r.json()),
    ]).then(([npsData, csatData, cesData, issuesTrendData]) => {
      setNps(npsData);
      setCsat(csatData);
      setCes(cesData);
      console.log("These are the issues: ", issuesTrendData)
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
      color: '#3b82f6',
      percentage: '2.3%',
      data: [2.8, 3.1, 2.9, 3.4, 3.6, 3.2, 3.5, 3.2]
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
      percentage: '2.3%',
      data: [2.8, 3.1, 2.9, 3.4, 3.6, 3.2, 3.5, 3.2]
    },
    {
      id: 'ces',
      title: 'CES Score',
      value: ces?.ces_score ?? '-',
      icon: Users,
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      trend: 'up',
      details: ces ? `Very Satisfied: ${ces.very_satisfied}%, Satisfied: ${ces.satisfied}%, Neutral: ${ces.neutral}%, Dissatisfied: ${ces.dissatisfied}%, Very Dissatisfied: ${ces.very_dissatisfied}%` : '',
      color: '#06b6d4',
      percentage: '2.3%',
      data: [1.8, 2.1, 1.9, 2.4, 2.6, 2.2, 2.5, 2.3]
    },
    {
      id: 'issues',
      title: 'Issues Raised',
      value: issuesTrend?.map((item: any) => item.issue_count)[issuesTrend.length - 1],
      icon: AlertCircle,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      trend: issuesTrend?.map((item: any) => item.issue_count)[issuesTrend.length - 1] > issuesTrend?.map((item: any) => item.issue_count)[issuesTrend.length - 2] ? 'up' : 'down',
      details: issuesTrend ? `Issues: ${issuesTrend.map((item: any) => item.issue_count)}` : '',
      color: '#f97316',
      percentage: '-',
      data: [4.2, 3.8, 4.1, 3.5, 3.2, 3.8, 3.4, 3.12]
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
    <div className="space-y-6">
      {/* Header Card */}
      <HeaderCard />
      
      {/* Metrics Grid */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <MetricsGrid metrics={metrics} createChartOption={createChartOption} />
      </div>
    </div>
  );
};

export default FeedbackMetricsCard;