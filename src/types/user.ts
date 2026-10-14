export type UserRole = 'admin' | 'user';

export type User = {
  id: string;
  username: string;
  password?: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  bio: string;
  role: UserRole;
};
