// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

interface Manga {
  _id: string;
  title: string;
  author: string;
  imageUrl: string;
}

export default function Home() {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const res = await fetch('/api/manga'); // استدعاء الـ API
        if (!res.ok) {
          throw new Error('Failed to fetch manga');
        }
        const data = await res.json();
        setMangaList(data);
      } catch (error) {
        console.error('Error fetching manga:', error);
      }
    };
    fetchManga();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-grow">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-grow p-6">
          <h1 className="text-4xl font-bold text-purple-300 mb-6">مانجا عربية</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mangaList.map((manga) => (
              <Link key={manga._id} href={`/manga/${manga._id}`}>
                <div className="relative hover:scale-105 transition-transform">
                  <img
                    src={manga.imageUrl}
                    alt={manga.title}
                    className="w-full h-72 object-contain"
                  />
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
