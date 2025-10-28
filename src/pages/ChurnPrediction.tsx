import React, { useState } from 'react';
import ChurnDashboard from '../components/ChurnDashboard';
import ChurnCustomerTable from '../components/ChurnCustomerTable';
import ChurnScenarios from '../components/ChurnScenarios';

const icons8 = {
  BarChart3: <img src="https://img.icons8.com/color/48/combo-chart.png" alt="Dashboard" style={{ width: 16, height: 16 }} />,
  User: <img src="https://img.icons8.com/color/48/user.png" alt="Customer Risk" style={{ width: 16, height: 16 }} />,
  Lightbulb: <img src="https://img.icons8.com/color/48/idea.png" alt="Scenarios" style={{ width: 16, height: 16 }} />,
  Brain: <img src="https://img.icons8.com/color/48/brain.png" alt="Brain" style={{ width: 24, height: 24 }} />,
  Settings: <img src="https://img.icons8.com/color/48/settings.png" alt="Settings" style={{ width: 20, height: 20 }} />
};

function ChurnPrediction() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: 'BarChart3' },
    { id: 'customers', name: 'Customer Risk', icon: 'User' },
    // { id: 'scenarios', name: 'Scenarios', icon: 'Lightbulb' },
  ];

  return (
    <div className="bg-gray-50" style={{ marginTop:"2vw", marginLeft:"4vw", borderTopLeftRadius: '2rem', width: "95vw", paddingTop: "8vh", padding: "2rem" }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* <div className="p-2 bg-blue-600 rounded-lg">
                {icons8.Brain}
              </div> */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Churn Analysis</h1>
                <p className="text-sm text-gray-500">Predictive Customer Retention for Organizations</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-sm font-medium text-gray-900">2 hours ago</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                {icons8.Settings}
              </button>
            </div>
          </div>
        </div>
        {/* Navigation */}
        <div className="px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {icons8[tab.icon as keyof typeof icons8]}
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {activeTab === 'dashboard' && <ChurnDashboard />}
        {activeTab === 'customers' && <ChurnCustomerTable />}
        {activeTab === 'scenarios' && <ChurnScenarios />}
      </div>
    </div>
  );
}

export default ChurnPrediction;