import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Download, MoreHorizontal, ChevronDown } from 'lucide-react';

const UnsolvedTicketsCard: React.FC = () => {
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/get-feedback?company_id=301')
      .then(res => res.json())
      .then(data => setTickets(data))
      .finally(() => setLoading(false));
  }, []);

  const filteredTickets = tickets.filter(ticket =>
    (ticket.full_text || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredTickets.length / pageSize);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const goToPrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
  const goToNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  // Reset to page 1 if filter changes and current page is out of range
  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredTickets.length, totalPages]);

  const toggleTicket = (ticketId: string) => {
    setSelectedTickets(prev =>
      prev.includes(ticketId)
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const toggleAllTickets = () => {
    if (selectedTickets.length === tickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(tickets.map(t => t.id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Customer Feedback</h3>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <div className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <span>Table View</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>New</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Ticket Table */}
      <div className="mt-4 overflow-x-auto">
        {loading ? (
          <div className="text-gray-400 text-center py-10">Loading tickets...</div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No tickets found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedTickets.map(ticket => (
                <tr key={ticket.feedback_id} className="hover:bg-gray-50">
                  {/* Summary (truncated full_text) */}
                  <td className="px-4 py-2 text-gray-800 text-sm max-w-xs truncate">
                    {(ticket.full_text || '').length > 60
                      ? ticket.full_text.slice(0, 60) + '...'
                      : ticket.full_text}
                  </td>
                  {/* Urgency pill */}
                  <td className="px-4 py-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold 
                      ${ticket.urgency?.toLowerCase().includes('high') ? 'bg-blue-100 text-blue-700' : 
                        ticket.urgency?.toLowerCase().includes('medium') ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-gray-100 text-gray-700'}`}
                    >
                      {ticket.urgency?.replace(/_/g, ' ') || '—'}
                    </span>
                  </td>
                  {/* Sentiment pill */}
                  <td className="px-4 py-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${ticket.sentiment === 'positive' ? 'bg-green-100 text-green-700' : ticket.sentiment === 'negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{ticket.sentiment}</span>
                  </td>
                  {/* Date pill */}
                  <td className="px-4 py-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-semibold">
                      {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredTickets.length > 0 && (
        <div className="px-6 py-4 flex items-center justify-between">
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${currentPage === 1 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              Previous
            </button>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default UnsolvedTicketsCard;