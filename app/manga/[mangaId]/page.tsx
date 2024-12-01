'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import Link from 'next/link';
import Comments from '../../components/Comments';
import Likes from '@/app/components/Likes';

interface Chapter {
  _id: string;
  title: string;
  number: number;
  images: string[];
  isPrivate?: boolean; // إضافة الحقل الخاص
  password?: string; // إضافة حقل كلمة المرور

}

interface Manga {
  _id: string;
  title: string;
  author: string;
  description: string;
  categories: string[];
  imageUrl: string;
  chapters: Chapter[];
}

export default function MangaDetails() {
  const params = useParams();
  const mangaId = Array.isArray(params.mangaId) ? params.mangaId[0] : params.mangaId;
  const [manga, setManga] = useState<Manga | null>(null);
  const [views, setViews] = useState<{ totalViews: number; chapterViews: Record<string, number> } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchManga = async () => {
      if (mangaId) {
        try {
          const res = await fetch(`/api/manga/${mangaId}`);
          if (!res.ok) {
            throw new Error('Failed to fetch manga details');
          }
          const data: Manga = await res.json();
          setManga(data);
        } catch (error: unknown) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('An unknown error occurred');
          }
        }
      }
    };

    const fetchViews = async () => {
      try {
        const res = await fetch(`/api/views?mangaId=${mangaId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch views');
        }
        const data = await res.json();
        setViews(data);
      } catch (error: unknown) {
        console.error('Error fetching views:', error);
      }
    };

    fetchManga();
    fetchViews();
  }, [mangaId]);

  if (error) {
    return <div>خطأ: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-grow">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-grow p-6">
          {manga && views ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
              {/* صورة المانجا */}
              <div className="lg:col-span-1 mb-8 lg:mb-0">
                <img
                  src={manga.imageUrl}
                  alt={manga.title}
                  className="w-full h-auto object-contain rounded-lg shadow-lg"
                />
              </div>

              {/* معلومات المانجا */}
              <div className="lg:col-span-2 space-y-4">
                <h1 className="text-4xl font-bold text-purple-300 mb-4">{manga.title}</h1>
                <p className="text-lg">إجمالي المشاهدات: {views.totalViews}</p>
                <div className="text-lg text-gray-300 space-y-2">
                  <p>
                    <h3 className="text-lg font-semibold text-purple-300">المؤلف:</h3>
                    <Link
                      href={`/profile/${manga.author}`}
                      className="text-purple-400 hover:text-purple-600 transition"
                    >
                      {manga.author}
                    </Link>
                  </p>
                  <p>
                    <strong>الوصف:</strong> {manga.description}
                  </p>
                  <p>
                    <strong>التصنيفات:</strong>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {manga.categories.map((category, index) => (
                      <Link
                        key={index}
                        href={`/categories/${category}`}
                        className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm hover:bg-purple-500 transition"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* الفصول */}
                <div className="mt-8">
                  <h3 className="text-2xl font-semibold text-purple-300 mb-4">الفصول</h3>
                  {manga.chapters.length > 0 ? (
                    <ul className="space-y-2">
                      {manga.chapters.map((chapter) => (
                        <li
                          key={chapter._id}
                          className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md"
                        >
                          <Link
                            href={`/manga/${mangaId}/chapter/${chapter._id}`}
                            className="text-lg text-purple-400 hover:text-purple-600 transition"
                          >
                            الفصل {chapter.number}: {chapter.title}
                          </Link>
                          <span className="text-gray-400 text-sm">
                            مشاهدات: {views.chapterViews[chapter._id] || 0}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400">لا توجد فصول متاحة بعد.</p>
                  )}
                </div>

                <div className="mt-8">
                  <Likes mangaId={mangaId} chapterId={undefined}/>
                </div>
                <div className="mt-8">
                  <Comments mangaId={mangaId} chapterId={undefined} />
                </div>
              </div>
            </div>
          ) : (
            <div>جاري تحميل البيانات...</div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
