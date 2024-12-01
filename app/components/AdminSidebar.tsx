// components/AdminSidebar.tsx

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function AdminSidebar() {
  const { data: session } = useSession();

  return (
    <aside className="w-1/5 bg-gradient-to-b from-purple-800 to-gray-800 p-6 shadow-lg flex flex-col space-y-6 rounded-r-lg">
      <div className="flex items-center space-x-4 mb-6">
        {session && (
          <>
            <img
              src={session.user?.image ?? '/placeholder-avatar.png'}
              alt="User Avatar"
              className="rounded-full w-16 h-16 border-2 border-purple-400"
            />
            <div>
              <p className="text-lg font-semibold">{session.user?.name}</p>
              <p className="text-sm text-gray-400">{session.user?.email}</p>
            </div>
          </>
        )}
      </div>

      <nav className="flex flex-col space-y-3">
        <Link href="/admin/dashboard" className="text-purple-300 hover:bg-purple-600 hover:text-white rounded-lg p-2 transition">
          لوحة التحكم
        </Link>
        <Link href="/admin/manga" className="text-purple-300 hover:bg-purple-600 hover:text-white rounded-lg p-2 transition">
          إدارة المانجا
        </Link>
        <Link href="/admin/chapter" className="text-purple-300 hover:bg-purple-600 hover:text-white rounded-lg p-2 transition">
          إدارة الفصول
        </Link>
        <Link href="/admin/stats" className="text-purple-300 hover:bg-purple-600 hover:text-white rounded-lg p-2 transition">
          الإحصائيات
        </Link>
      </nav>
    </aside>
  );
}
