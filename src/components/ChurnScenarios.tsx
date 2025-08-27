import React, { useState } from 'react';
import { Play, Plus, Save, Copy, Lightbulb, Target, DollarSign, Users, Zap, ArrowRight, ChevronDown, Brain } from 'lucide-react';

const ChurnScenarios = () => {
  const [activeScenario, setActiveScenario] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const scenarioTypes = [
    {
      id: 'basic_segmentation',
      title: 'Segment Analysis',
      description: 'Filter churn risk by customer segments',
      icon: Users,
      color: 'blue',
      competitive: true
    },
    {
      id: 'retention_campaign',
      title: 'Retention Campaign',
      description: 'Test discount/incentive impact on churn',
      icon: Target,
      color: 'green',
      competitive: true
    },
    {
      id: 'feature_adoption',
      title: 'Feature Adoption',
      description: 'Model feature usage impact on retention',
      icon: Zap,
      color: 'purple',
      competitive: true
    },
    {
      id: 'financial_impact',
      title: 'Financial Impact',
      description: 'Calculate revenue saved from strategies',
      icon: DollarSign,
      color: 'amber',
      competitive: true
    },
    {
      id: 'behavioral_triggers',
      title: 'Behavioral Triggers',
      description: 'Simulate behavior sequence changes',
      icon: Brain,
      color: 'indigo',
      competitive: false
    },
    {
      id: 'intervention_pathways',
      title: 'Multi-Step Interventions',
      description: 'Create complex retention journeys',
      icon: ArrowRight,
      color: 'pink',
      competitive: false
    }
  ];

  const prebuiltScenarios = [
    {
      title: "Elite Customer Email Campaign",
      description: "Target Elite customers with 15% discount offer",
      impact: "+23% retention",
      roi: "$340K saved",
      type: "retention_campaign"
    },
    {
      title: "Feature Tutorial Push",
      description: "Increase tutorial completion from 30% to 60%",
      impact: "+18% retention",
      roi: "$210K saved",
      type: "feature_adoption"
    },
    {
      title: "High-Value Customer Recovery",
      description: "Multi-touch campaign for Prime customers",
      impact: "+31% retention",
      roi: "$580K saved",
      type: "intervention_pathways"
    }
  ];

  const runScenario = () => {
    setShowResults(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scenario Planning</h1>
          <p className="text-gray-600 mt-1">Test and optimize your retention strategies</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>New Scenario</span>
        </button>
      </div>

      {/* Scenario Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarioTypes.map((type) => {
          const Icon = type.icon;
          const colorClasses = {
            blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
            green: 'bg-green-50 border-green-200 hover:bg-green-100',
            purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
            amber: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
            indigo: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
            pink: 'bg-pink-50 border-pink-200 hover:bg-pink-100'
          };
          const iconColors = {
            blue: 'text-blue-600',
            green: 'text-green-600',
            purple: 'text-purple-600',
            amber: 'text-amber-600',
            indigo: 'text-indigo-600',
            pink: 'text-pink-600'
          };

          return (
            <button
              key={type.id}
              onClick={() => setActiveScenario(type.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${colorClasses[type.color]} ${
                activeScenario === type.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <Icon className={`h-6 w-6 ${iconColors[type.color]}`} />
                {!type.competitive && (
                  <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full font-medium">
                    NEW
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{type.title}</h3>
              <p className="text-sm text-gray-600">{type.description}</p>
            </button>
          );
        })}
      </div>

      {/* Scenario Builder */}
      {activeScenario && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {scenarioTypes.find(s => s.id === activeScenario)?.title} Builder
            </h2>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Save Draft
              </button>
              <button
                onClick={runScenario}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Play className="h-4 w-4" />
                <span>Run Scenario</span>
              </button>
            </div>
          </div>

          {/* Dynamic Form Based on Scenario Type */}
          {activeScenario === 'retention_campaign' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Segment</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Elite Customers</option>
                    <option>Prime Customers</option>
                    <option>Standard Customers</option>
                    <option>Basic Customers</option>
                    <option>High Risk (All Segments)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Type</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Discount Offer</option>
                    <option>Free Month</option>
                    <option>Upgrade Incentive</option>
                    <option>Personal Call</option>
                    <option>Feature Credits</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage</label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    defaultValue="15"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>5%</span>
                    <span className="font-medium">15%</span>
                    <span>50%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Duration</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>1 Week</option>
                    <option>2 Weeks</option>
                    <option>1 Month</option>
                    <option>3 Months</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Expected Reach</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Elite customers at risk</span>
                      <span className="font-medium">312 customers</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average monthly value</span>
                      <span className="font-medium">$289</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total monthly revenue at risk</span>
                      <span className="font-medium text-red-600">$90,168</span>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-3">AI Recommendations</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex items-start space-x-2">
                      <Lightbulb className="h-4 w-4 mt-0.5" />
                      <span>Elite customers respond 23% better to personal calls than emails</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Lightbulb className="h-4 w-4 mt-0.5" />
                      <span>15% discount shows optimal cost vs retention balance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeScenario === 'behavioral_triggers' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium text-indigo-900">AI-Powered Behavioral Simulation</span>
                </div>
                <p className="text-sm text-indigo-800">
                  Model complex customer behavior sequences and intervention timing
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Trigger Sequence</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">1</div>
                      <div className="flex-1">
                        <select className="w-full p-2 border border-gray-300 rounded">
                          <option>User misses 3 consecutive logins</option>
                          <option>Support ticket created</option>
                          <option>Usage drops below 50%</option>
                          <option>Payment method fails</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-600">2</div>
                      <div className="flex-1">
                        <select className="w-full p-2 border border-gray-300 rounded">
                          <option>Send nudge email after 2 days</option>
                          <option>Show in-app notification</option>
                          <option>Schedule support call</option>
                          <option>Offer feature tutorial</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-sm font-medium text-amber-600">3</div>
                      <div className="flex-1">
                        <select className="w-full p-2 border border-gray-300 rounded">
                          <option>If no response, send SMS</option>
                          <option>Escalate to account manager</option>
                          <option>Offer discount</option>
                          <option>Provide free consultation</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <button className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 transition-colors">
                    + Add Step
                  </button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Timing & Frequency</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Trigger Sensitivity</label>
                      <input type="range" className="w-full" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Conservative</span>
                        <span>Aggressive</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Interventions per Month</label>
                      <select className="w-full p-2 border border-gray-300 rounded">
                        <option>2 interventions</option>
                        <option>4 interventions</option>
                        <option>6 interventions</option>
                        <option>Unlimited</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cool-down Period</label>
                      <select className="w-full p-2 border border-gray-300 rounded">
                        <option>3 days</option>
                        <option>1 week</option>
                        <option>2 weeks</option>
                        <option>1 month</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Section */}
      {showResults && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Scenario Results</h2>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Copy className="h-4 w-4 inline mr-2" />
                Copy Results
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Save className="h-4 w-4 inline mr-2" />
                Implement
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Retention Improvement</span>
              </div>
              <div className="text-2xl font-bold text-green-900">+23%</div>
              <div className="text-sm text-green-700">72 customers retained</div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Revenue Saved</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">$340K</div>
              <div className="text-sm text-blue-700">Annual recurring revenue</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Campaign ROI</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">580%</div>
              <div className="text-sm text-purple-700">Cost vs revenue saved</div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-900">Confidence</span>
              </div>
              <div className="text-2xl font-bold text-amber-900">87%</div>
              <div className="text-sm text-amber-700">Model prediction accuracy</div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Key Insights</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span>Elite customers show 34% higher response rate to personalized outreach</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span>Optimal timing: Contact within 48 hours of trigger event</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <span>Multi-channel approach (email + SMS) increases retention by additional 11%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pre-built Scenarios */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Pre-built Scenarios</h2>
          <span className="text-sm text-gray-500">Ready-to-use templates</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {prebuiltScenarios.map((scenario, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-medium text-gray-900">{scenario.title}</h3>
                <button className="text-blue-600 hover:text-blue-800">
                  <Play className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600 font-medium">{scenario.impact}</span>
                <span className="text-blue-600 font-medium">{scenario.roi}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChurnScenarios;