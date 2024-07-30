"use client"
import axios from 'axios';
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  id:string
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response=await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/user`,{withCredentials:true});
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value= {{ user, loading, setUser }
}>
  { children }
  </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};