import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'react-toastify';

interface User {
  DEPARTMENT: string;
  EMAIL: string;
  NAME: string;
  ORGANIZATION_ID: string;
  USER_ID: number;
}

interface Organization {
  CONTACT_EMAIL: string;
  INDUSTRY: string;
  LATEST_PAYMENT: string | null;
  NAME: string;
  NUMBER_OF_EMPLOYEES: number | null;
  ORGANIZATION_ID: number;
  PRICING_PLAN: string | null;
  WEBSITE: string | null;
}

interface UserData {
  DEPARTMENT: string;
  EMAIL: string;
  NAME: string;
  ORGANIZATION_ID: string;
  USER_ID: number;
}

interface AuthData {
  userId: string;
  token: string;
}

interface AuthContextType {
  authData: AuthData | null;
  loading: boolean;
  error: string | null;
  verifyToken: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  userData: UserData | null;
  fetchUserData: (userId: string) => Promise<any>;
  fetchOrganizationData: (organizationId: string) => Promise<any>;
}

  export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData>({ userId: '', token: '' });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/auth/get-user/${userId}`);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error('Failed to fetch user data');
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  const fetchOrganizationData = async (organizationId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/organization/${organizationId}`);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error('Failed to fetch user data');
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };
  

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Login request
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Login failed');
      }

      // Fetch user data after successful login
      
      localStorage.setItem('coreOutlineAuthToken', data.token);
      setAuthData({
        userId: data.userId,
        token: data.token,
      });
      setError(null);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('coreOutlineAuthToken');
    setAuthData({ userId: '', token: '', userData: null });
  };

  const verifyToken = async () => {
    const token = localStorage.getItem('coreOutlineAuthToken');
    
    if (!token) {
      setLoading(false);
      setError('No authentication token found');
      return;
    }

    try {
      // Verify token
      const verifyResponse = await fetch('http://localhost:4000/auth/verify-token', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok || verifyData.error) {
        throw new Error(verifyData.error || 'Failed to verify token');
      }

      // Fetch user data
      
      // Update auth data with both token and user data
      setAuthData({
        userId: verifyData.data.userId,
        token,
      });
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast.error(`Authentication error: ${errorMessage}`);
      // Optionally clear the invalid token
      localStorage.removeItem('coreOutlineAuthToken');
    } finally {
      setLoading(false);
    }
  };

  // Verify token on mount
  useEffect(() => {
    verifyToken();
  }, []);
  const value = {
    authData,
    loading,
    error,
    login,
    logout,
    verifyToken,
    fetchUserData,
    fetchOrganizationData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
