import React, { useState } from 'react';
import { Plus, ChevronRight } from 'lucide-react';

const IssuesListCard: React.FC = () => {
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

  const issues = [
    {
      id: 'login-account',
      title: 'Login and Account',
      description: 'I cannot reset my password'
    },
    {
      id: 'cancellations-returns',
      title: 'Cancellations and Returns',
      description: 'I should not have to pay before delivery because I also have to pay a fee to return it.'
    },
    {
      id: 'shopping',
      title: 'Shopping',
      description: 'Your homepage never seems to have the things that I want to buy. I have to search for it everytime.'
    },
    {
      id: 'order-issue',
      title: 'Order Issue',
      description: 'I received the wrong item in my order and the delivery was'
    }
  ];

  const toggleIssue = (issueId: string) => {
    setSelectedIssues(prev => 
      prev.includes(issueId) 
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Issues List</h3>
        <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {issues.map((issue) => (
          <div key={issue.id} className="flex items-start space-x-3">
            {/* Checkbox */}
            <input
              type="checkbox"
              id={issue.id}
              checked={selectedIssues.includes(issue.id)}
              onChange={() => toggleIssue(issue.id)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            
            {/* Issue Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 mb-1">
                {issue.title}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {issue.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
          <span>View all</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default IssuesListCard;