'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import Link from 'next/link';

interface Manga {
  _id: string;
  title: string;
  imageUrl: string;
  description: string;
}

export default function AuthorProfile() {
  const { author } = useParams();
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false); // لإدارة حالة السايد بار

  // تبديل حالة السايد بار
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (author) {
      const fetchMangas = async () => {
        try {
          const res = await fetch(`/api/manga?author=${author}`);
          if (!res.ok) {
            throw new Error('Failed to fetch manga for author');
          }
          const data: Manga[] = await res.json();
          setMangaList(data);
        } catch (error) {
          console.error('Error fetching manga:', error);
        }
      };
      fetchMangas();
    }
  }, [author]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-grow">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-grow p-6">
          <h1 className="text-3xl font-bold text-purple-300 mb-6">أعمال المؤلف: {author}</h1>
          {mangaList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mangaList.map((manga) => (
                <Link
                  key={manga._id}
                  href={`/manga/${manga._id}`}
                  className="block bg-gray-800 p-4 rounded-lg shadow-md"
                >
                  <img
                    src={manga.imageUrl}
                    alt={manga.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-bold text-purple-400">{manga.title}</h3>
                  <p className="text-sm text-gray-400 mt-2">{manga.description}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">لا توجد أعمال لهذا المؤلف حتى الآن.</p>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
