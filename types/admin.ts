export type AdminRole = 'super_admin' | 'editor' | 'viewer';

export interface Admin {
  id: string;
  email: string;
  password: string;
  role: AdminRole;
  name: string;
  createdAt: string;
  lastLogin?: string;
}