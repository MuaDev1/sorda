// app/layout.tsx
'use client';  // تأكد من إضافة 'use client' لجعل هذا المكون Client Component

import { SessionProvider } from 'next-auth/react';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
