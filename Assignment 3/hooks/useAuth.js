import { useState } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);

  const login = (u) => setUser(u);
  const logout = () => setUser(null);

  return { user, login, logout };
};

export default useAuth;
