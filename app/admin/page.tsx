'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from '../components/Footer';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // إضافة حالة sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // دالة لتبديل حالة sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || session.user?.role !== 'admin') {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-grow">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-grow p-6">
          <h1 className="text-4xl font-bold text-purple-300 mb-6">مرحبًا، {session.user.name}!</h1>

          {/* قسم الإحصائيات */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* بطاقة إدارة المانجا */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-6 rounded-lg shadow-lg transition transform hover:scale-105">
              <h2 className="text-xl font-bold mb-4">إدارة المانجا</h2>
              <p>إضافة أو تعديل أو حذف المانجا.</p>
              <a href="/admin/manga" className="mt-4 inline-block px-4 py-2 bg-white text-black rounded-lg">إدارة المانجا</a>
            </div>

            {/* بطاقة إدارة الفصول */}
            <div className="bg-gradient-to-r from-green-500 to-green-700 p-6 rounded-lg shadow-lg transition transform hover:scale-105">
              <h2 className="text-xl font-bold mb-4">إدارة الفصول</h2>
              <p>إضافة أو تعديل الفصول.</p>
              <a href="/admin/chapter" className="mt-4 inline-block px-4 py-2 bg-white text-black rounded-lg">إدارة الفصول</a>
            </div>

            {/* بطاقة الإحصائيات */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 rounded-lg shadow-lg transition transform hover:scale-105">
              <h2 className="text-xl font-bold mb-4">الإحصائيات</h2>
              <p>عرض الإحصائيات حول الموقع.</p>
              <a href="/admin/stats" className="mt-4 inline-block px-4 py-2 bg-white text-black rounded-lg">عرض الإحصائيات</a>
            </div>

            {/* بطاقة إدارة التعليقات */}
            <div className="bg-gradient-to-r from-red-500 to-red-700 p-6 rounded-lg shadow-lg transition transform hover:scale-105">
              <h2 className="text-xl font-bold mb-4">إدارة التعليقات</h2>
              <p>عرض التعليقات وإدارتها.</p>
              <a href="/admin/comments" className="mt-4 inline-block px-4 py-2 bg-white text-black rounded-lg">إدارة التعليقات</a>
            </div>
          </section>

          {/* قسم المخططات والرسوم البيانية */}
          <section className="mt-8">
            <h2 className="text-3xl font-bold text-purple-300 mb-4">لوحة الإحصائيات</h2>
            {/* Placeholder for charts */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <p className="text-center text-gray-300">مخطط يوضح الأنشطة الأخيرة</p>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
