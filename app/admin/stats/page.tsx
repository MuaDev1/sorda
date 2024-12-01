'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../../components/Footer';

interface Stats {
  totalManga: number;
  totalChapters: number;
  totalUsers: number;
  totalComments: number;
  totalLikes: number;
  totalViews: number;
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (!res.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await res.json();
        setStats(data);
        setLoading(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-grow">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-grow p-6">
          <h1 className="text-3xl font-bold text-purple-300 mb-6">إحصائيات الموقع</h1>

          {stats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-purple-400">إجمالي المانجا</h2>
                <p className="text-4xl font-bold">{stats.totalManga}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-purple-400">إجمالي الفصول</h2>
                <p className="text-4xl font-bold">{stats.totalChapters}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-purple-400">إجمالي المستخدمين</h2>
                <p className="text-4xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-purple-400">إجمالي التعليقات</h2>
                <p className="text-4xl font-bold">{stats.totalComments}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-purple-400">إجمالي الإعجابات</h2>
                <p className="text-4xl font-bold">{stats.totalLikes}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-purple-400">إجمالي المشاهدات</h2>
                <p className="text-4xl font-bold">{stats.totalViews}</p>
              </div>
            </div>
          ) : (
            <div>لا توجد بيانات متاحة حاليًا</div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
