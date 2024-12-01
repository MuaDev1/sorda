'use client';

import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Sidebar from '../components/Sidebar';
import Link from 'next/link';

interface Manga {
  _id: string;
  title: string;
  author: string;
  description: string;
  categories: string[];
  imageUrl: string;
  chaptersCount: number; // عدد الفصول
}

export default function ManageManga() {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const res = await fetch('/api/manga');
        if (!res.ok) {
          throw new Error('Failed to fetch manga');
        }
        const data: Manga[] = await res.json();
        setMangaList(data);
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

    fetchManga();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex flex-col">
<Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-grow">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-grow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">إدارة المانجا</h1>
            <Link href="/admin/manga/add" className="bg-blue-500 px-4 py-2 rounded text-white">
              إضافة مانجا جديدة
            </Link>
          </div>

          <div className="space-y-6">
            {mangaList.length > 0 ? (
              mangaList.map((manga) => (
                <div key={manga._id} className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center">
                  <img
                    src={manga.imageUrl}
                    alt={manga.title}
                    className="w-32 h-48 object-cover rounded-lg mr-4"
                  />
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold mb-2">{manga.title}</h2>
                    <p className="text-gray-400 mb-2">{manga.description}</p>
                    <p className="text-gray-400 mb-2">
                      التصنيفات: <span className="text-purple-400">{manga.categories.join(', ')}</span>
                    </p>
                    <p className="text-gray-400">
                      عدد الفصول: <span className="text-purple-400">{manga.chaptersCount}</span>
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <Link
                      href={`/admin/manga/${manga._id}/edit`}
                      className="bg-yellow-500 px-4 py-2 rounded text-white"
                    >
                      تعديل
                    </Link>
                    <button
                      onClick={() => handleDelete(manga._id)}
                      className="bg-red-500 px-4 py-2 rounded text-white"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">لا توجد مانجات متاحة بعد.</div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

// دالة حذف المانجا
const handleDelete = async (id: string) => {
  if (confirm('هل أنت متأكد من حذف هذه المانجا؟')) {
    try {
      const res = await fetch(`/api/manga/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Failed to delete manga');
      }
      alert('تم حذف المانجا بنجاح');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting manga:', error);
    }
  }
};
