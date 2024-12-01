'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react'; // استيراد signOut
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import Link from 'next/link';

interface Manga {
  _id: string;
  title: string;
  imageUrl: string;
  description: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (session?.user?.name) {
      const fetchMangas = async () => {
        const res = await fetch(`/api/manga?author=${session.user.name}`);
        const data: Manga[] = await res.json();
        setMangaList(data);
      };
      fetchMangas();
    }
  }, [session?.user?.name]);

  if (!session?.user) {
    return <div>يجب تسجيل الدخول للوصول إلى هذه الصفحة.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-grow">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-grow p-6">
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={session.user.image || '/default-avatar.png'}
              alt={session.user.name || 'User Avatar'}
              className="w-20 h-20 rounded-full border-2 border-purple-400"
            />
            <div>
              <h1 className="text-3xl font-bold text-purple-300">{session.user.name}</h1>
              <button
                onClick={() => signOut()} // زر تسجيل الخروج
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-purple-300 mb-4">أعمالك المنشورة:</h2>
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
            <p className="text-gray-400">لم تقم بنشر أي مانجا حتى الآن.</p>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
