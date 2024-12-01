// app/components/Sidebar.tsx
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const { data: session } = useSession();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out bg-gray-800 w-64 p-6 shadow-lg lg:translate-x-0 lg:static lg:inset-0`}
    >
      <button
        onClick={toggleSidebar}
        className="lg:hidden text-white bg-purple-600 px-4 py-2 rounded-lg mb-4"
      >
        إغلاق
      </button>
      <h2 className="text-2xl font-bold text-white mb-4">القائمة الرئيسية</h2>
      <nav className="flex flex-col space-y-2">
        <Link
          href="/"
          className="text-purple-300 hover:bg-purple-600 hover:text-white rounded-lg p-2 transition"
        >
          الصفحة الرئيسية
        </Link>
        <Link
          href="/manga"
          className="text-purple-300 hover:bg-purple-600 hover:text-white rounded-lg p-2 transition"
        >
          المانجا
        </Link>
        <Link
          href="/about"
          className="text-purple-300 hover:bg-purple-600 hover:text-white rounded-lg p-2 transition"
        >
          عن الموقع
        </Link>
        <Link
          href="https://discord.gg/mvehe8qjfv"
          className="text-purple-300 hover:bg-purple-600 hover:text-white rounded-lg p-2 transition"
        >
          اتصل بنا
        </Link>

        {session?.user && (
          <Link
            href="/profile"
            className="text-purple-300 hover:bg-purple-600 hover:text-white rounded-lg p-2 transition"
          >
            ملفي الشخصي
          </Link>
        )}

        {session?.user?.role === 'admin' && (
          <Link
            href="/admin"
            className="text-purple-300 hover:bg-purple-600 hover:text-white rounded-lg p-2 transition"
          >
            لوحة التحكم
          </Link>
        )}
      </nav>
    </aside>
  );
}
