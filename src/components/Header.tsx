import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useLocation} from 'react-router-dom';
import { CreateQueryFlow } from './CreateQueryFlow';
const Header: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const user_id = searchParams.get('user_id');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetch(`https://api.coreoutline.com/auth/get-user/${user_id}`)
      .then(res => res.json())
      .then(data => setUserName(data.data.NAME))
      .finally(() => {});
  }, [user_id]);

  return (
    <header className="w-full px-8 py-4 flex fixed items-center justify-between bg-[#03045e] text-white z-50 max-h-12">
      <div className="flex items-center">
        <img
          src="/favicon.png"
          alt="Wallet"
          className="w-8 h-8"
        />
        <h1 className="text-sxl font-medium text-white-900 ml-10">Welcome Back, {userName}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <CreateQueryFlow />
        <Search className="w-6 h-6 text-white-400 cursor-pointer" />
        <Bell className="w-6 h-6 text-white-400 cursor-pointer" />
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <span className="text-white-400 font-normal">{userName}</span>
          <ChevronDown className="w-4 h-4 text-white-400" />
        </div>
      </div>
    </header>
  );
};

export default Header;