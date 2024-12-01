// app/categories/[category]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';

interface Manga {
  _id: string;
  title: string;
  author: string;
  imageUrl: string;
}

export default function CategoryPage() {
  const { category } = useParams();
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchMangasByCategory = async () => {
      try {
        const res = await fetch(`/api/categories/${category}`);
        if (!res.ok) {
          throw new Error('Failed to fetch mangas for category');
        }
        const data: Manga[] = await res.json();
        setMangaList(data);
    } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchMangasByCategory();
  }, [category]);

  if (error) {
    return <div>خطأ: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex flex-col">
<Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-grow">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-grow p-6">
          <h1 className="text-4xl font-bold text-purple-300 mb-6">التصنيف: {category}</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mangaList.length > 0 ? (
              mangaList.map((manga) => (
                <Link key={manga._id} href={`/manga/${manga._id}`}>
                  <div className="relative hover:scale-105 transition-transform">
                    <img
                      src={manga.imageUrl}
                      alt={manga.title}
                      className="w-full h-72 object-contain rounded-lg"
                    />
                    <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-2 text-center">
                      <p className="text-white">{manga.title}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-400">لا توجد مانجا متاحة لهذا التصنيف.</p>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
