import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ChurnDistributionChart from './ChurnDistributionChart';
import ChurnRiskTrendChart from './ChurnRiskTrendChart';
import ChurnRevenueImpactCard from './ChurnRevenueImpactCard';
import { churnPalette } from './ui/churnPalette';
import ReactECharts from 'echarts-for-react';

// Extend KPI type to allow chart property
interface KPI {
  title: string;
  value: string;
  change: string;
  trend: string;
  icon: any;
  color: string;
  description: string;
  chart?: boolean;
}

const icons8 = {
  TrendingUp: <img src="https://img.icons8.com/color/48/trending-up.png" alt="Trending Up" style={{ width: 20, height: 20 }} />,
  DollarSign: <img src="https://img.icons8.com/color/48/money.png" alt="Dollar Sign" style={{ width: 20, height: 20 }} />,
  Users: <img src="https://img.icons8.com/color/48/group.png" alt="Users" style={{ width: 20, height: 20 }} />,
  AlertTriangle: <img src="https://img.icons8.com/color/48/error.png" alt="Alert" style={{ width: 20, height: 20 }} />,
  CheckCircle: <img src="https://img.icons8.com/color/48/checked--v1.png" alt="Check" style={{ width: 20, height: 20 }} />,
  Clock: <img src="https://img.icons8.com/color/48/clock--v1.png" alt="Clock" style={{ width: 20, height: 20 }} />,
  Target: <img src="https://img.icons8.com/color/48/target.png" alt="Target" style={{ width: 20, height: 20 }} />,
};

const ChurnDashboard: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const organization_id = searchParams.get('organization_id');

  const [churnData, setChurnData] = useState([]);
  const [latestKPI, setLatestKPI] = useState({
    churn_rate: 0,
    churned_users: 0,
    cumulative_users: 0,
    MONTH: ''
  });

  // State for overall churn risk
  const [overallChurnRisk, setOverallChurnRisk] = useState({
    percent: '0%',
    count: 0
  });

  // State for revenue at risk
  const [revenueAtRisk, setRevenueAtRisk] = useState({
    value: '$0',
    change: '',
    count: 0
  });

  // State for recovery rate
  const [recoveryRateData, setRecoveryRateData] = useState<any[]>([]);
  const [latestRecoveryRate, setLatestRecoveryRate] = useState({
    recovery_rate: 0,
    recovered_users: 0,
    churned_users: 0,
    MONTH: ''
  });

  // State for average time to churn
  const [avgChurnTime, setAvgChurnTime] = useState('0 days');

  // State for segment metrics
  const [segmentMetrics, setSegmentMetrics] = useState<any[]>([]);

  useEffect(() => {
    if (!organization_id) return;
    fetch(`https://data.coreoutline.com/churn-rate?company=${organization_id}`)
      .then(res => res.json())
      .then(data => {
        setChurnData(data);
        if (data.length > 0) {
          setLatestKPI(data[data.length - 1]);
        }
      })
      .catch(() => {});
  }, [organization_id]);

  useEffect(() => {
    if (!organization_id) return;
    fetch(`https://data.coreoutline.com/predict-churn?company=${organization_id}`)
      .then(res => res.json())
      .then(data => {
        // Will_Churn_in_Two_Months: 1 means will churn
        const willChurn = data.filter((d: any) => d.Will_Churn_in_Two_Months === 1);
        const percent = data.length > 0 ? ((willChurn.length / data.length) * 100).toFixed(1) + '%' : '0%';
        setOverallChurnRisk({
          percent,
          count: willChurn.length
        });
        const totalRevenue = willChurn.reduce((sum: number, d: any) => sum + (d.MONETARY_VALUE || 0), 0);
        // Format as currency
        const formattedRevenue = totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
        setRevenueAtRisk({
          value: formattedRevenue,
          change: '', // Optionally calculate change
          count: willChurn.length
        });

        // Segment metrics calculation
        const segmentMap: Record<string, { total: number; atRisk: number; revenue: number }> = {};
        data.forEach((d: any) => {
          const segment = d.Segment_Label || 'Unknown';
          if (!segmentMap[segment]) {
            segmentMap[segment] = { total: 0, atRisk: 0, revenue: 0 };
          }
          segmentMap[segment].total += 1;
          if (d.Will_Churn_in_Two_Months === 1) {
            segmentMap[segment].atRisk += 1;
            segmentMap[segment].revenue += d.MONETARY_VALUE || 0;
          }
        });
        const metrics = Object.entries(segmentMap).map(([segment, values]) => ({
          segment,
          total: values.total,
          atRisk: values.atRisk,
          riskRate: values.total > 0 ? ((values.atRisk / values.total) * 100).toFixed(1) + '%' : '0%',
          revenue: values.revenue.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
          color: segment === 'Prime Customer' ? 'purple' : segment === 'Elite Customer' ? 'blue' : segment === 'Standard Customer' ? 'green' : 'gray'
        }));
        setSegmentMetrics(metrics);
      })
      .catch(() => {});
  }, [organization_id]);

  useEffect(() => {
    if (!organization_id) return;
    fetch(`https://data.coreoutline.com/recovery-rate?company=${organization_id}`)
      .then(res => res.json())
      .then(data => {
        setRecoveryRateData(data);
        if (data.length > 0) {
          setLatestRecoveryRate(data[data.length - 1]);
        }
      })
      .catch(() => {});
  }, [organization_id]);

  useEffect(() => {
    if (!organization_id) return;
    fetch(`https://data.coreoutline.com/average-churn-time?company=${organization_id}`)
      .then(res => res.json())
      .then(data => {
        setAvgChurnTime(data.average_churn_time || '0 days');
      })
      .catch(() => {});
  }, [organization_id]);

  const kpis = [
    {
      title: 'Overall Churn Risk',
      value: overallChurnRisk.percent,
      change: '', // You can calculate change if you have previous data
      trend: '',
      icon: 'AlertTriangle',
      color: 'red',
      description: `Customers likely to churn in 60 days (${overallChurnRisk.count})`
    },
    {
      title: 'Revenue at Risk',
      value: revenueAtRisk.value,
      change: revenueAtRisk.change,
      trend: 'down',
      icon: 'DollarSign',
      color: 'red',
      description: `Annual revenue from high-risk customers (${revenueAtRisk.count})`
    },
    {
      title: 'Recovery Rate',
      value: `${latestRecoveryRate.recovery_rate.toFixed(2)}`,
      change: '',
      trend: '',
      icon: 'CheckCircle',
      color: 'green',
      description: `Recovered users: ${latestRecoveryRate.recovered_users}, Churned users: ${latestRecoveryRate.churned_users}`,
      chart: true
    },
    {
      title: 'Avg. Time to Churn',
      value: avgChurnTime,
      change: '',
      trend: 'down',
      icon: 'Clock',
      color: 'amber',
      description: 'Average time before customers churn'
    }
  ];

  const churnRateKPI: KPI = {
    title: 'Churn Rate',
    value: `${(latestKPI.churn_rate * 100).toFixed(2)}%`,
    change: '', // Optionally calculate change vs previous month
    trend: '', // Optionally set trend
    icon: 'AlertTriangle',
    color: 'blue',
    description: 'Monthly churn rate',
    chart: true
  };

  const allKpis: KPI[] = [
    churnRateKPI,
    ...kpis
  ];

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {allKpis.map((kpi, index) => {
          const Icon = icons8[kpi.icon as keyof typeof icons8] || null;
          const colorClasses: Record<string, string> = {
            red: 'bg-red-50 text-red-700 border-red-200',
            green: 'bg-green-50 text-green-700 border-green-200',
            amber: 'bg-amber-50 text-amber-700 border-amber-200',
            blue: 'bg-blue-50 text-blue-700 border-blue-200'
          };
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow flex flex-col relative">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {Icon}
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{kpi.value}</p>
                  {kpi.title === 'Recovery Rate' && (
                    <div className="absolute top-4 right-4 w-32 h-16">
                      <ReactECharts
                        option={{
                          grid: { left: 0, right: 0, top: 0, bottom: 0 },
                          xAxis: { show: false, type: 'category', data: recoveryRateData.slice(-10).map(d => d.MONTH) },
                          yAxis: { show: false },
                          series: [{
                            type: 'line',
                            data: recoveryRateData.slice(-10).map(d => d.recovery_rate),
                            lineStyle: { color: '#43aa8b', width: 2 },
                            areaStyle: { color: '#b7e4c7' },
                            symbol: 'none',
                            smooth: true // Make the line smooth
                          }],
                          tooltip: {
                            trigger: 'axis',
                            formatter: params => {
                              const d = recoveryRateData.slice(-10)[params[0].dataIndex];
                              return `<div><strong>${d.MONTH}</strong></div><div>Recovery Rate: ${d.recovery_rate.toFixed(2)}</div><div>Recovered: ${d.recovered_users}</div><div>Churned: ${d.churned_users}</div>`;
                            }
                          }
                        }}
                        style={{ width: '100%', height: 64 }}
                      />
                    </div>
                  )}
                  {kpi.title === 'Churn Rate' && (
                    <div className="absolute top-4 right-4 w-32 h-16">
                      <ReactECharts
                        option={{
                          grid: { left: 0, right: 0, top: 0, bottom: 0 },
                          xAxis: { show: false, type: 'category', data: churnData.slice(-12).map(d => d.MONTH) },
                          yAxis: { show: false, min: 0, max: 1 },
                          series: [{
                            type: 'line',
                            data: churnData.slice(-12).map(d => d.churn_rate),
                            lineStyle: { color: '#00b4d8', width: 2 },
                            areaStyle: { color: '#90e0ef' },
                            symbol: 'none',
                            smooth: true // Make the line smooth
                          }],
                          tooltip: {
                            trigger: 'axis',
                            formatter: params => {
                              const d = churnData.slice(-12)[params[0].dataIndex];
                              return `<div><strong>${new Date(d.MONTH).toLocaleString('default', { month: 'short', year: '2-digit' })}</strong></div><div>Churn Rate: ${(d.churn_rate * 100).toFixed(2)}%</div><div>Churned Users: ${d.churned_users}</div><div>Cumulative Users: ${d.cumulative_users}</div>`;
                            }
                          }
                        }}
                        style={{ width: '100%', height: 64 }}
                      />
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-2">{kpi.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="w-full">
        <div className="w-full">
          <ChurnDistributionChart palette={churnPalette} />
        </div>
        {/* <ChurnRiskTrendChart palette={churnPalette} /> */}
      </div>

      {/* Churn Rate KPI */}
      {/* <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Churn Rate KPI</h2>
        <div className="flex space-x-8 mb-8">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-gray-500 text-xs">Churn Rate</span>
            <span className="text-2xl font-bold text-[#03045e]">{(latestKPI.churn_rate * 100).toFixed(2)}%</span>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-gray-500 text-xs">Churned Users</span>
            <span className="text-2xl font-bold text-[#03045e]">{latestKPI.churned_users}</span>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-gray-500 text-xs">Cumulative Users</span>
            <span className="text-2xl font-bold text-[#03045e]">{latestKPI.cumulative_users}</span>
          </div>
        </div>
      </div> */}

      {/* Churn Revenue Impact Card */}
      <ChurnRevenueImpactCard organization_id={organization_id} palette={churnPalette} />

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            {icons8.Target}
            <div className="text-left">
              <p className="font-medium text-blue-900">Create Retention Campaign</p>
              <p className="text-sm text-blue-700">Target high-risk customers</p>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            {icons8.Users}
            <div className="text-left">
              <p className="font-medium text-green-900">Export Customer List</p>
              <p className="text-sm text-green-700">Download at-risk customers</p>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            {icons8.TrendingUp}
            <div className="text-left">
              <p className="font-medium text-purple-900">Run Scenario Analysis</p>
              <p className="text-sm text-purple-700">Test retention strategies</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChurnDashboard;