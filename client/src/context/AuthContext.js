import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const token = localStorage.getItem('token');

  const fetchUser = useCallback(async () => {
    try {
      if (token) {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      }
    } catch (err) {
      console.log("Auth failed");
    }
  }, [token]);

 useEffect(() => {
  fetchUser();
}, [fetchUser]);


  return (
    <AuthContext.Provider value={{ user, setUser, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};