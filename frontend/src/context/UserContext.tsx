import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { getUsers } from '@/api/users';

interface UserContextType {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  setCurrentUser: (user: User | null) => void;
  refreshUsers: () => Promise<User[]>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'elementary-math-current-user';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshUsers = useCallback(async (): Promise<User[]> => {
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
      return fetchedUsers;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return [];
    }
  }, []);

  const setCurrentUser = useCallback((user: User | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, []);

  useEffect(() => {
    async function initialize() {
      setLoading(true);
      const fetchedUsers = await refreshUsers();

      // Restore current user from localStorage
      const savedUser = localStorage.getItem(CURRENT_USER_KEY);
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser) as User;
          // Verify user still exists
          const found = fetchedUsers.find((u) => u.id === parsed.id);
          if (found) {
            setCurrentUserState(found);
          } else {
            localStorage.removeItem(CURRENT_USER_KEY);
          }
        } catch {
          localStorage.removeItem(CURRENT_USER_KEY);
        }
      }
      setLoading(false);
    }
    initialize();
  }, [refreshUsers]);

  return (
    <UserContext.Provider value={{ currentUser, users, loading, setCurrentUser, refreshUsers }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
