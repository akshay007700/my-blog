import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Admin, AdminRole } from '@/types/admin';

interface AdminContextType {
  currentAdmin: Admin | null;
  allAdmins: Admin[];
  isLoading: boolean;
  isLoggedIn: boolean;
  canEdit: boolean;
  canDelete: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addAdmin: (email: string, password: string, role: AdminRole, name: string) => Promise<boolean>;
  removeAdmin: (adminId: string) => Promise<boolean>;
  updateAdmin: (adminId: string, updates: Partial<Admin>) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const defaultAdmins: Admin[] = [
  {
    id: '1',
    email: 'admin@newsapp.com',
    password: 'admin123',
    role: 'super_admin',
    name: 'Super Admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'editor@newsapp.com',
    password: 'editor123',
    role: 'editor',
    name: 'News Editor',
    createdAt: new Date().toISOString(),
  }
];

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [allAdmins, setAllAdmins] = useState<Admin[]>(defaultAdmins);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [storedAdmin, storedAdmins] = await Promise.all([
          AsyncStorage.getItem('currentAdmin'),
          AsyncStorage.getItem('allAdmins'),
        ]);

        if (storedAdmin) setCurrentAdmin(JSON.parse(storedAdmin));
        if (storedAdmins) setAllAdmins(JSON.parse(storedAdmins));
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const admin = allAdmins.find(a => a.email === email && a.password === password);
    if (admin) {
      const adminWithLogin = { ...admin, lastLogin: new Date().toISOString() };
      setCurrentAdmin(adminWithLogin);
      await AsyncStorage.setItem('currentAdmin', JSON.stringify(adminWithLogin));
      
      // Update last login in allAdmins
      const updatedAdmins = allAdmins.map(a => 
        a.id === admin.id ? adminWithLogin : a
      );
      setAllAdmins(updatedAdmins);
      await AsyncStorage.setItem('allAdmins', JSON.stringify(updatedAdmins));
      
      return true;
    }
    return false;
  }, [allAdmins]);

  const logout = useCallback(async () => {
    setCurrentAdmin(null);
    await AsyncStorage.removeItem('currentAdmin');
  }, []);

  const addAdmin = useCallback(async (email: string, password: string, role: AdminRole, name: string): Promise<boolean> => {
    if (currentAdmin?.role !== 'super_admin') return false;

    const existingAdmin = allAdmins.find(a => a.email === email);
    if (existingAdmin) return false;

    const newAdmin: Admin = {
      id: `admin_${Date.now()}`,
      email,
      password,
      role,
      name,
      createdAt: new Date().toISOString(),
    };

    const updatedAdmins = [...allAdmins, newAdmin];
    setAllAdmins(updatedAdmins);
    await AsyncStorage.setItem('allAdmins', JSON.stringify(updatedAdmins));
    return true;
  }, [currentAdmin, allAdmins]);

  const removeAdmin = useCallback(async (adminId: string): Promise<boolean> => {
    if (currentAdmin?.role !== 'super_admin' || adminId === currentAdmin.id) return false;

    const updatedAdmins = allAdmins.filter(a => a.id !== adminId);
    setAllAdmins(updatedAdmins);
    await AsyncStorage.setItem('allAdmins', JSON.stringify(updatedAdmins));
    return true;
  }, [currentAdmin, allAdmins]);

  const updateAdmin = useCallback(async (adminId: string, updates: Partial<Admin>): Promise<boolean> => {
    if (currentAdmin?.role !== 'super_admin') return false;

    const updatedAdmins = allAdmins.map(a => 
      a.id === adminId ? { ...a, ...updates } : a
    );
    setAllAdmins(updatedAdmins);
    await AsyncStorage.setItem('allAdmins', JSON.stringify(updatedAdmins));
    
    // Update current admin if it's the same user
    if (currentAdmin.id === adminId) {
      const updatedCurrentAdmin = { ...currentAdmin, ...updates };
      setCurrentAdmin(updatedCurrentAdmin);
      await AsyncStorage.setItem('currentAdmin', JSON.stringify(updatedCurrentAdmin));
    }
    
    return true;
  }, [currentAdmin, allAdmins]);

  const canEdit = currentAdmin?.role === 'super_admin' || currentAdmin?.role === 'editor';
  const canDelete = currentAdmin?.role === 'super_admin';

  const value: AdminContextType = {
    currentAdmin,
    allAdmins,
    isLoading,
    isLoggedIn: !!currentAdmin,
    canEdit,
    canDelete,
    login,
    logout,
    addAdmin,
    removeAdmin,
    updateAdmin,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};