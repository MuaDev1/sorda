import NextAuth from 'next-auth';

declare module 'next-auth' {

  interface User {
    id: string;
    role: string; // إضافة الحقل role
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;  // إضافة role هنا
    };
  }
}