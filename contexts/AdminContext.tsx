import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Admin, AdminRole } from '@/types/admin';

const DEFAULT_ADMIN: Admin = {
  id: '1',
  email: 'admin@newsmod.com',
  password: 'admin123',
  role: 'super_admin',
  name: 'Super Admin',
  createdAt: new Date().toISOString(),
};

export const [AdminProvider, useAdmin] = createContextHook(() => {
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [allAdmins, setAllAdmins] = useState<Admin[]>([DEFAULT_ADMIN]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem('currentAdmin'),
      AsyncStorage.getItem('allAdmins'),
    ]).then(([storedAdmin, storedAdmins]) => {
      if (storedAdmin) {
        setCurrentAdmin(JSON.parse(storedAdmin));
      }
      if (storedAdmins) {
        setAllAdmins(JSON.parse(storedAdmins));
      }
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    console.log('Login attempt:', email);
    const admin = allAdmins.find(
      (a) => a.email === email && a.password === password
    );
    
    if (admin) {
      console.log('Login successful:', admin.email);
      setCurrentAdmin(admin);
      await AsyncStorage.setItem('currentAdmin', JSON.stringify(admin));
      return true;
    }
    
    console.log('Login failed: Invalid credentials');
    return false;
  }, [allAdmins]);

  const logout = useCallback(async () => {
    console.log('Logging out admin:', currentAdmin?.email);
    setCurrentAdmin(null);
    await AsyncStorage.removeItem('currentAdmin');
  }, [currentAdmin]);

  const addAdmin = useCallback(async (
    email: string,
    password: string,
    role: AdminRole,
    name: string
  ): Promise<boolean> => {
    if (currentAdmin?.role !== 'super_admin') {
      console.log('Permission denied: Only super admin can add admins');
      return false;
    }

    const existingAdmin = allAdmins.find((a) => a.email === email);
    if (existingAdmin) {
      console.log('Admin already exists:', email);
      return false;
    }

    const newAdmin: Admin = {
      id: Date.now().toString(),
      email,
      password,
      role,
      name,
      createdAt: new Date().toISOString(),
    };

    const updatedAdmins = [...allAdmins, newAdmin];
    setAllAdmins(updatedAdmins);
    await AsyncStorage.setItem('allAdmins', JSON.stringify(updatedAdmins));
    console.log('Admin added successfully:', email);
    return true;
  }, [currentAdmin, allAdmins]);

  const removeAdmin = useCallback(async (adminId: string): Promise<boolean> => {
    if (currentAdmin?.role !== 'super_admin') {
      console.log('Permission denied: Only super admin can remove admins');
      return false;
    }

    if (adminId === currentAdmin.id) {
      console.log('Cannot remove yourself');
      return false;
    }

    const updatedAdmins = allAdmins.filter((a) => a.id !== adminId);
    setAllAdmins(updatedAdmins);
    await AsyncStorage.setItem('allAdmins', JSON.stringify(updatedAdmins));
    console.log('Admin removed successfully');
    return true;
  }, [currentAdmin, allAdmins]);

  const canEdit = useMemo(() => {
    return currentAdmin?.role === 'super_admin' || currentAdmin?.role === 'editor';
  }, [currentAdmin]);

  const canDelete = useMemo(() => {
    return currentAdmin?.role === 'super_admin';
  }, [currentAdmin]);

  return useMemo(() => ({
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
  }), [
    currentAdmin,
    allAdmins,
    isLoading,
    canEdit,
    canDelete,
    login,
    logout,
    addAdmin,
    removeAdmin,
  ]);
});
