export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

// Seed users for testing
export const seedUsers: User[] = [
  {
    id: 'user-001',
    email: 'test@example.com',
    password: 'Password123!',
    name: 'Test User',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'user-002',
    email: 'admin@techstore.com',
    password: 'Admin@2024',
    name: 'Admin User',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'user-003',
    email: 'john.doe@email.com',
    password: 'JohnDoe123!',
    name: 'John Doe',
    createdAt: new Date('2024-02-20'),
  },
];

// Simple in-memory user storage (simulates database)
let registeredUsers: User[] = [...seedUsers];

export const findUserByEmail = (email: string): User | undefined => {
  return registeredUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const validateLogin = (email: string, password: string): { success: boolean; user?: User; error?: string } => {
  const user = findUserByEmail(email);
  
  if (!user) {
    return { success: false, error: 'No account found with this email address' };
  }
  
  if (user.password !== password) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }
  
  return { success: true, user };
};

export const registerUser = (email: string, password: string, name: string): { success: boolean; user?: User; error?: string } => {
  const existingUser = findUserByEmail(email);
  
  if (existingUser) {
    return { success: false, error: 'An account with this email already exists' };
  }
  
  const newUser: User = {
    id: `user-${Date.now()}`,
    email,
    password,
    name,
    createdAt: new Date(),
  };
  
  registeredUsers.push(newUser);
  
  return { success: true, user: newUser };
};

export const resetUsers = (): void => {
  registeredUsers = [...seedUsers];
};
