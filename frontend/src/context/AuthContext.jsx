import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // fetch current user
      fetch(`${process.env.REACT_APP_API || 'http://localhost:5000'}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (!res.ok) throw new Error('not auth');
          return res.json();
        })
        .then(data => setUser(data))
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        });
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch(`${process.env.REACT_APP_API || 'http://localhost:5000'}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw res;
    const data = await res.json();
    setToken(data.token);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    // redirect based on role
    if (data.user.role === 'admin') navigate('/admin');
    else navigate('/student');
  };

  const register = async (payload) => {
    const res = await fetch(`${process.env.REACT_APP_API || 'http://localhost:5000'}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw res;
    const data = await res.json();
    setToken(data.token);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    if (data.user.role === 'admin') navigate('/admin');
    else navigate('/student');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
