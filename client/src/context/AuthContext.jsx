import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('meditrack_token') || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('meditrack_token');
    setToken('');
    setUser(null);
  }, []);

  // Restore session from token on mount
  useEffect(() => {
    let isMounted = true;
    async function restoreSession() {
      const savedToken = localStorage.getItem('meditrack_token');
      if (!savedToken) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API}/auth/me`, {
          headers: {
            Authorization: `Bearer ${savedToken}`
          }
        });
        const data = await res.json();
        if (res.ok && data.success && data.user) {
          if (isMounted) {
            setUser(data.user);
            setToken(savedToken);
          }
        } else {
          // Token is invalid or expired
          logout();
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    restoreSession();
    return () => {
      isMounted = false;
    };
  }, [logout]);

  // Login handler
  const login = async (email, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }
    localStorage.setItem('meditrack_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  // Register handler
  const register = async (name, email, password) => {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Registration failed');
    }
    localStorage.setItem('meditrack_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout, API }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
