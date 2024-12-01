'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import Comments from '../../../../components/Comments';
import Likes from '@/app/components/Likes';
import RecordView from '@/app/components/RecordView';
import { useSession } from 'next-auth/react';

interface Chapter {
  _id: string;
  title: string;
  number: number;
  images: string[];
  isPrivate?: boolean;
}

interface Manga {
  _id: string;
  title: string;
  chapters: Chapter[];
  authorId?: string;
}

export default function ChapterDetails() {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [manga, setManga] = useState<Manga | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showToggleButton, setShowToggleButton] = useState(false);
  const { data: session, status } = useSession();
  const { mangaId, chapterId } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchChapter = async () => {
      if (mangaId && chapterId) {
        try {
          const res = await fetch(`/api/manga/${mangaId}`);
          if (!res.ok) throw new Error('Failed to fetch manga');
          const data: Manga = await res.json();
          const selectedChapter = data.chapters.find((ch) => ch._id === chapterId);

          // التحقق من الوصول
          if (
            selectedChapter?.isPrivate &&
            (!session || (session.user?.role !== 'admin' && session.user?.id !== data.authorId))
          ) {
            throw new Error('Unauthorized');
          }

          setManga(data);
          setChapter(selectedChapter || null);
        } catch (error) {
          console.error(error);
          router.replace(`/manga/${mangaId}`);
            return;
        }
      }
    };

    if (status !== 'loading') {
      fetchChapter();
    }
  }, [mangaId, chapterId, session, status, router]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setShowToggleButton(true);
      } else {
        setShowToggleButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleChapterChange = (newChapterId: string) => {
    router.push(`/manga/${mangaId}/chapter/${newChapterId}`);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex flex-col">
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className={`fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg transition transform ${
            showToggleButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          القائمة
        </button>
      )}
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex-grow flex">
        <aside
          className={`fixed inset-y-0 left-0 z-50 bg-gray-800 w-64 p-6 transition-transform transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:static`}
        >
          <button
            onClick={toggleSidebar}
            className="lg:hidden bg-purple-600 text-white px-4 py-2 rounded-lg mb-4"
          >
            إغلاق القائمة
          </button>
          {manga && (
            <nav>
              <h2 className="text-2xl font-bold mb-4">{manga.title}</h2>
              <ul className="space-y-2">
                {manga.chapters.map((ch) => (
                  <li key={ch._id}>
                    <button
                      onClick={() => handleChapterChange(ch._id)}
                      className={`block w-full text-left px-4 py-2 rounded-lg ${
                        ch._id === chapterId ? 'bg-purple-700 text-white' : 'bg-gray-700 text-gray-300 hover:bg-purple-600'
                      }`}
                    >
                      الفصل {ch.number}: {ch.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </aside>
        <main className="flex-grow p-6 max-w-screen-lg mx-auto">
          {chapter ? (
            <div>
              <h1 className="text-3xl font-bold mb-4">{chapter.title}</h1>
              <div className="space-y-4 mb-8">
                {chapter.images.map((img, idx) => (
                  <img key={idx} src={img} alt={`Page ${idx + 1}`} className="w-full h-auto rounded-lg shadow-md" />
                ))}
              </div>
              <div className="mt-8">
                <Likes mangaId={mangaId} chapterId={chapterId} />
              </div>
              <RecordView mangaId={mangaId} chapterId={chapterId} />
              <div className="mt-8">
                <Comments mangaId={mangaId} chapterId={chapterId} />
              </div>
            </div>
          ) : (
            <div className="text-center">الفصل غير متاح أو أنك غير مصرح بقراءته</div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
