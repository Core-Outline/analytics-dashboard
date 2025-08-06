import React, { useState, useEffect } from 'react';
import { Plus, ChevronRight } from 'lucide-react';

const IssuesListCard: React.FC = () => {
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/get-feedback-issues?company_id=301')
      .then(res => res.json())
      .then(data => setIssues(data))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(issues.length / pageSize);
  const paginatedIssues = issues.slice((page - 1) * pageSize, page * pageSize);

  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));

  const toggleIssue = (issueId: string) => {
    setSelectedIssues(prev => 
      prev.includes(issueId) 
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Issues List</h3>
      </div>

      {/* Issues List */}
      {loading ? (
        <div className="text-gray-400 text-center py-10">Loading issues...</div>
      ) : (
        <>
        <div>
          {paginatedIssues.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No issues found.</div>
          ) : (
            paginatedIssues.map(issue => (
              <div key={issue.feedback_id} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  {/* Urgency pill */}
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold 
                    ${issue.urgency.toLowerCase().includes('high') ? 'bg-blue-100 text-blue-700' : 
                      issue.urgency.toLowerCase().includes('medium') ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-gray-100 text-gray-700'}`}
                  >
                    {issue.urgency.replace(/_/g, ' ')}
                  </span>
                  {/* Sentiment pill */}
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${issue.sentiment === 'positive' ? 'bg-green-100 text-green-700' : issue.sentiment === 'negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{issue.sentiment}</span>
                  {/* Date pill */}
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-semibold">
                    {new Date(issue.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-2 text-gray-700 text-sm">{issue.full_text}</div>
              </div>
            ))
          )}
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-4 mt-4">
            <button onClick={handlePrev} disabled={page === 1} className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>Prev</button>
            <span className="text-gray-600 text-sm">Page {page} of {totalPages}</span>
            <button onClick={handleNext} disabled={page === totalPages} className={`px-3 py-1 rounded ${page === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>Next</button>
          </div>
        )}
        </>
      )}
    </div>
  );
};

export default IssuesListCard;