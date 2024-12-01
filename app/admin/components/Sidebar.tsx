// app/components/Sidebar.tsx
import Link from 'next/link';
import { FiMenu } from 'react-icons/fi';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-16'
      } bg-gradient-to-b from-purple-800 to-gray-800 p-4 shadow-lg min-h-screen transition-all duration-300 flex flex-col`}
    >
      <button
        className="text-white text-2xl mb-6 focus:outline-none"
        onClick={toggleSidebar}
      >
        <FiMenu />
      </button>

      <nav className="flex flex-col space-y-4">
        <Link href="/admin/dashboard" className="text-white flex items-center space-x-2 hover:text-purple-300 transition">
          <span className={`${isOpen ? 'block' : 'hidden'} ml-2`}>لوحة التحكم</span>
        </Link>

        <Link href="/admin/manga" className="text-white flex items-center space-x-2 hover:text-purple-300 transition">
          <span className={`${isOpen ? 'block' : 'hidden'} ml-2`}>إدارة المانجا</span>
        </Link>

        <Link href="/admin/chapter" className="text-white flex items-center space-x-2 hover:text-purple-300 transition">
          <span className={`${isOpen ? 'block' : 'hidden'} ml-2`}>إدارة الفصول</span>
        </Link>

        <Link href="/admin/users" className="text-white flex items-center space-x-2 hover:text-purple-300 transition">
          <span className={`${isOpen ? 'block' : 'hidden'} ml-2`}>إدارة المستخدمين</span>
        </Link>

        <Link href="/admin/stats" className="text-white flex items-center space-x-2 hover:text-purple-300 transition">
          <span className={`${isOpen ? 'block' : 'hidden'} ml-2`}>الإحصائيات</span>
        </Link>

        <Link href="/" className="text-white flex items-center space-x-2 hover:text-purple-300 transition">
          <span className={`${isOpen ? 'block' : 'hidden'} ml-2`}>العودة إلى الرئيسية</span>
        </Link>
      </nav>
    </aside>
  );
}
