import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for saved user session
    const savedUser = localStorage.getItem('jobtracker_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signup = (name, email, password) => {
    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('jobtracker_users') || '[]');

    // Check if user already exists
    if (users.find((u) => u.email === email)) {
      throw new Error('An account with this email already exists');
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In a real app, this would be hashed
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('jobtracker_users', JSON.stringify(users));

    // Initialize empty job applications for this user
    localStorage.setItem(`jobtracker_jobs_${newUser.id}`, JSON.stringify([]));

    // Auto login after signup
    const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    setUser(sessionUser);
    localStorage.setItem('jobtracker_user', JSON.stringify(sessionUser));

    return sessionUser;
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('jobtracker_users') || '[]');
    const found = users.find((u) => u.email === email && u.password === password);

    if (!found) {
      throw new Error('Invalid email or password');
    }

    const sessionUser = { id: found.id, name: found.name, email: found.email };
    setUser(sessionUser);
    localStorage.setItem('jobtracker_user', JSON.stringify(sessionUser));

    return sessionUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jobtracker_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
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
