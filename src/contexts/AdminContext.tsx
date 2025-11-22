import { createContext, useState, ReactNode } from "react";

type AdminContextType = {
  isLogged: boolean;
  login: () => void;
  logout: () => void;
};

export const AdminContext = createContext<AdminContextType>({
  isLogged: false,
  login: () => {},
  logout: () => {},
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isLogged, setIsLogged] = useState(false);

  function login() {
    setIsLogged(true);
  }
  function logout() {
    setIsLogged(false);
  }

  return (
    <AdminContext.Provider value={{ isLogged, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}
