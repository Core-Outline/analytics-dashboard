import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLocation } from 'react-router-dom';


interface SupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportTicketModal: React.FC<SupportTicketModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const organization_id = searchParams.get('organization_id');
  const user_id = searchParams.get('user_id');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !body.trim()) {
      setSubmitStatus({
        success: false,
        message: 'Please fill in all fields'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://api.coreoutline.com/support/create-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          body: body + "\n\nOrganization ID: " + organization_id + "\nUser ID: " + user_id,
        }),
      });

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: 'Your support ticket has been submitted successfully!',
        });
        setTitle('');
        setBody('');
        
        // Close the modal after 2 seconds on success
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit ticket');
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred while submitting your ticket',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Prevent click inside the modal from closing it
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Handle overlay click to close modal
  const handleOverlayClick = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-md relative"
        onClick={handleModalClick}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          disabled={isSubmitting}
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Submit a Support Ticket</h2>
          
          {submitStatus && (
            <div 
              className={`p-3 mb-4 rounded-md ${
                submitStatus.success 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {submitStatus.message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Enter a title for your ticket"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Describe your issue or question in detail"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketModal;
