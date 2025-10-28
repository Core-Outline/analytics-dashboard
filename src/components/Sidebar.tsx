import React, { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp, BarChart3, Zap, Users, Share2, Heart, Settings, HelpCircle, MessageCircle, LogOut, Plug2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import SupportTicketModal from './SupportTicketModal';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, isCollapsed, onToggleCollapse }) => {
  const [isDashboardExpanded, setIsDashboardExpanded] = useState(true);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Ref to hold FormData for uploaded logo (stored in variable named `formData`)
  const formData = useRef<FormData | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fd = new FormData();
      fd.append('file', file);
      // store in the required variable name
      formData.current = fd;
      // trigger upload after file selection
      void uploadLogo();
    }
  };

  // Extract organization_id from query params
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const organization_id = searchParams.get('organization_id');

  const [organizationDetails, setOrganizationDetails] = React.useState({
    CONTACT_EMAIL: "",
    INDUSTRY: "",
    LATEST_PAYMENT: null,
    NAME: "",
    NUMBER_OF_EMPLOYEES: "",
    ORGANIZATION_ID: organization_id,
    PRICING_PLAN: null,
    WEBSITE: "",
    ORGANIZATION_LOGO: null
  });

  React.useEffect(() => {
    fetch(`https://api.coreoutline.com/organization/${organization_id}`)
      .then(res => res.json())
      .then((data) => {
        console.log(data);
        setOrganizationDetails(data.data)
    })
      .catch(() => {});
  }, [organization_id]);

  const uploadLogo = async () => {
    // Minimal safe implementation: use existing endpoint to get signed URL then PUT the file
    if (!formData.current) return;
    setIsUploading(true);
    try {
      const res = await fetch(`https://api.coreoutline.com/organization/update?id=organization_id&organization_id=${organization_id}&organization_logo`);
      const data = await res.json();
      // data.signed_url expected from the API
      if (data?.signed_url) {
        // The FormData stored under formData.current contains the file under key 'file'
        const fileBlob = formData.current.get('file') as Blob | null;
        if (fileBlob) {
          const putRes = await fetch(data.signed_url, {
            method: 'PUT',
            body: fileBlob
          });
          console.log("PUT response:", putRes);
          // If upload succeeded, refetch organization details and update state
          if (putRes.ok) {
            try {
              const orgRes = await fetch(`https://api.coreoutline.com/organization/${organization_id}`);
              const orgData = await orgRes.json();
              if (orgData?.data) {
                setOrganizationDetails(orgData.data);
              }
            } catch (err) {
              // ignore refetch errors to preserve previous behavior
            }
          }
        }


      }
    } catch (e) {
      // swallow errors for now (existing code ignored errors)
    } finally {
      setIsUploading(false);
    }
  };


  const navigationItems = [
    { id: 'financials', label: 'Financials', icon: BarChart3, source: "/icons/icons8-wallet-50.png" },
    { id: 'saas', label: 'Saas', icon: Zap, source: "/icons/icons8-laptop-metrics-64.png" },
    { id: 'customer', label: 'Customer', icon: Users, source: "/icons/icons8-human-resources-96.png" },
    { id: 'social-media', label: 'Social Media', icon: Share2, source: "/icons/icons8-collaboration-100.png" },
    { id: 'customer-feedback', label: 'Customer Feedback', icon: Heart, badge: 2, source: "/icons/icons8-online-support-100.png" },
    { id: 'custom-dashboard', label: 'Custom Dashboard', icon: Settings, source: "/icons/icons8-bot-96.png" },
    { id: 'integrations', label: 'Integrations', icon: Plug2, source: "/icons/icons8-network-96.png" },
    { id: 'churn', label: 'Churn Analysis', icon: Plug2, source: "/icons/icons8-fire-exit-100.png" }
  ];
// bg-[#03045e] 
  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-[#03045e] text-white flex flex-col fixed left-0 top-10 h-screen transition-all duration-300`}>
      {/* Logo */}
      <div className={`p-4 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
      {/* Hidden file input used to select logo image */}
      <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="hidden"
      />

      {/* Clickable logo - opens file picker */}
      <button type="button" onClick={handleLogoClick} className="p-0 m-0 bg-[#ffffff30] border-0 cursor-pointer">
      <div className="w-18 h-18 bg-[#00b4d8] rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 overflow-hidden">
      {isUploading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : organizationDetails?.ORGANIZATION_LOGO ? (
        <img
        src={organizationDetails.ORGANIZATION_LOGO}
        alt={`${organizationDetails.NAME || 'Organization'} logo`}
        className="w-full h-full object-cover"
        />
      ) : (
        (organizationDetails.NAME ? organizationDetails.NAME.charAt(0).toUpperCase() : '')
      )}
      </div>
      </button>

      {!isCollapsed && <span className="text-lg font-medium text-white">{organizationDetails.NAME}</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-2">
      {/* Dashboard Section */}
      <div className="mb-4">
      {/* {isCollapsed && (
      <div
        onClick={() => setIsDashboardExpanded(!isDashboardExpanded)}
        className="flex items-center justify-between px-3 py-2 cursor-pointer text-[#caf0f8] hover:text-white transition-colors"
      >
        <div className="flex items-center space-x-2">
        <BarChart3 className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wider">Dashboard</span>
        </div>
        {isDashboardExpanded ? (
        <ChevronUp className="w-3 h-3" />
        ) : (
        <ChevronDown className="w-3 h-3" />
        )}
      </div>
      )} */}
      
      {/* Dashboard Items */}
      <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out h-90${isCollapsed ? 'opacity-100' : 'opacity-100'}`}>
      {navigationItems.map((item) => {
        const isActive = activeSection === item.id;

        return (
        <div
          key={item.id}
          onClick={() => onSectionChange(item.id)}
          className={`relative flex items-center mt-10 ${isCollapsed ? 'justify-center' : 'justify-between'} ${isCollapsed ? 'px-3' : 'px-3 ml-4'} py-2 cursor-pointer font-medium rounded-lg transition-colors group ${
            isActive 
              ? 'text-white bg-[#FFFFFF30]' 
              : 'text-[#caf0f8] hover:text-white hover:bg-[#FFFFFF30]'
          }`}
        >
          <div className={`flex items-center ${isCollapsed ? '' : 'space-x-2'} flex-col`}>
            <img
              src={item.source}
              alt={item.label}
              className="w-6 h-6"
            />
            <span className="text-[10px] mt-1 text-white font-normal leading-none">{item.label}</span>
          </div>
         
          {/* {!isCollapsed && (
            
          )} */}

          {/* <span className="ml-3 text-base font-small text-white">{item.label}</span> */}
        </div>
        
        );
      })}
      </div>
      </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 space-y-1 mt-auto">
      <div 
      onClick={() => setIsSupportModalOpen(true)}
      className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} px-3 py-2 text-[#caf0f8] hover:text-white cursor-pointer font-medium rounded-lg hover:bg-[#0077b6] transition-colors`}
      >
      <HelpCircle className="w-4 h-4 flex-shrink-0" />
      {!isCollapsed && <span className="text-sm">Help Centre</span>}
      </div>
      <div 
      onClick={() => setIsSupportModalOpen(true)}
      className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} px-3 py-2 text-[#caf0f8] hover:text-white cursor-pointer font-medium rounded-lg hover:bg-[#0077b6] transition-colors`}
      >
      <MessageCircle className="w-4 h-4 flex-shrink-0" />
      {!isCollapsed && <span className="text-sm">Contact us</span>}
      </div>
      <a 
      href="https://www.coreoutline.com"
      className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} px-3 py-2 text-[#caf0f8] hover:text-white cursor-pointer font-medium rounded-lg hover:bg-[#0077b6] transition-colors no-underline`}
      >
      <LogOut className="w-4 h-4 flex-shrink-0" />
      {!isCollapsed && <span className="text-sm">Log out</span>}
      </a>
      </div>

      {/* Collapse Toggle Button */}
      {/* <button
      onClick={onToggleCollapse}
      className="absolute -right-3 top-4 w-6 h-6 bg-slate-800 border-2 border-slate-600 rounded-full flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
      >
      {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button> */}
      
      {/* Support Ticket Modal */}
      <SupportTicketModal 
      isOpen={isSupportModalOpen}
      onClose={() => setIsSupportModalOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
