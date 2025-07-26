import React, { useState } from 'react';
import { Search, Filter, Plus, Download, MoreHorizontal, ChevronDown } from 'lucide-react';

const UnsolvedTicketsCard: React.FC = () => {
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const tickets = [
    {
      id: '1',
      client: 'Emma Watson',
      avatar: 'EW',
      subject: 'Synapse Design #1125',
      status: 'Recent',
      statusColor: 'bg-green-100 text-green-800',
      priority: 'Urgent',
      priorityColor: 'text-red-500',
      priorityIcon: '●',
      agent: 'Anindya'
    },
    {
      id: '2',
      client: 'Luke',
      avatar: 'L',
      subject: 'Change of refund my last buy | Order #125631',
      status: 'Overdue',
      statusColor: 'bg-red-100 text-red-800',
      priority: 'High',
      priorityColor: 'text-orange-500',
      priorityIcon: '◐',
      agent: 'Anindya'
    },
    {
      id: '3',
      client: 'Finley',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      subject: 'I need your help #2256',
      status: 'Remaining',
      statusColor: 'bg-orange-100 text-orange-800',
      priority: 'Medium',
      priorityColor: 'text-blue-500',
      priorityIcon: '◐',
      agent: 'Nowrin'
    },
    {
      id: '4',
      client: 'Peter Gill',
      avatar: 'PG',
      subject: 'I need your help #2256',
      status: 'Responded',
      statusColor: 'bg-blue-100 text-blue-800',
      priority: 'Low',
      priorityColor: 'text-green-500',
      priorityIcon: '◐',
      agent: 'Nowrin'
    },
    {
      id: '5',
      client: 'Freya',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      subject: 'Contact Froms #3264',
      status: 'Closed',
      statusColor: 'bg-gray-100 text-gray-800',
      priority: 'Medium',
      priorityColor: 'text-blue-500',
      priorityIcon: '◐',
      agent: 'Khalid'
    },
    {
      id: '6',
      client: 'Morrison',
      avatar: 'M',
      subject: 'I need your help #2256',
      status: 'Responded',
      statusColor: 'bg-blue-100 text-blue-800',
      priority: 'Medium',
      priorityColor: 'text-blue-500',
      priorityIcon: '◐',
      agent: 'Khalid'
    }
  ];

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
          <h3 className="text-lg font-medium text-gray-900">Unsolved Tickets</h3>
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  checked={selectedTickets.length === tickets.length}
                  onChange={toggleAllTickets}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                Client
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                Subject
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                Status
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                Priority
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                Agent
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedTickets.includes(ticket.id)}
                    onChange={() => toggleTicket(ticket.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    {ticket.avatar.startsWith('http') ? (
                      <img
                        src={ticket.avatar}
                        alt={ticket.client}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {ticket.avatar}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {ticket.client}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                    {ticket.subject}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${ticket.statusColor}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg ${ticket.priorityColor}`}>
                      {ticket.priorityIcon}
                    </span>
                    <span className="text-sm text-gray-900">
                      {ticket.priority}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-900">{ticket.agent}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <span className="text-sm text-gray-700">1 to 6 of 12</span>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Previous
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsolvedTicketsCard;