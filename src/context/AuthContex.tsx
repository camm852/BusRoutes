import React from 'react';
import { IAuthContext, IUserInformation } from '../vite-env';

const currentUser = () => {
  const userStorage = localStorage.getItem('session');
  if (userStorage) return JSON.parse(userStorage);
  else {
    return {
      name: '',
      email: ''
    };
  }
};

export const AuthContext = React.createContext<IAuthContext>({
  user: {
    name: '',
    email: ''
  },
  login: () => {},
  logout: () => {}
});

export function AuthProvider({ children }: { children: JSX.Element }) {
  const [user, setUser] = React.useState<IUserInformation>(currentUser);

  const logout = (): void => {
    localStorage.removeItem('session');
    // window.location.reload();
    setUser({
      name: '',
      email: ''
    })
    window.location.href = "/login"
  };

  const login = (userData: IUserInformation): void => {
    setUser(userData);
    window.localStorage.setItem('session', JSON.stringify(userData));
  };

  const value = React.useMemo(() => ({ user, logout, login }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;

export function useAuth() {
  return React.useContext(AuthContext);
}
