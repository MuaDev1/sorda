'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Navbar from '../../components/Navbar';
import { useSession } from 'next-auth/react'; // استخدام الجلسة للتحقق من المستخدم

interface Chapter {
  _id: string;
  title: string;
  number: number;
  mangaId: string;
  mangaTitle: string;
  isPrivate?: boolean;
  password?: string;
  authorId?: string; // حقل المؤلف
}

interface Manga {
  _id: string;
  title: string;
}

export default function ChapterPage() {
  const { data: session } = useSession(); // جلب بيانات الجلسة
  const [chapterList, setChapterList] = useState<Chapter[]>([]);
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [selectedMangaId, setSelectedMangaId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchChapters = async () => {
      const res = await fetch('/api/chapters');
      const data = await res.json();
      setChapterList(data);
    };

    const fetchManga = async () => {
      const res = await fetch('/api/manga');
      const data = await res.json();
      setMangaList(data);
    };

    fetchChapters();
    fetchManga();
  }, []);

  const handleAddChapter = () => {
    router.push('/admin/chapter/add');
  };

  const handleEditChapter = (chapterId: string) => {
    router.push(`/admin/chapter/edit/${chapterId}`);
  };

  const handleOpenPrivateChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setIsPopupOpen(true);
  };

  const handleVerifyPassword = () => {
    if (selectedChapter && selectedChapter.password === passwordInput) {
      router.push(`/manga/${selectedChapter.mangaId}/chapter/${selectedChapter._id}`);
    } else {
      alert('كلمة المرور غير صحيحة');
    }
    setPasswordInput('');
    setIsPopupOpen(false);
  };

  const filteredChapters = selectedMangaId
    ? chapterList.filter((chapter) => chapter.mangaId === selectedMangaId)
    : chapterList;

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-grow p-6">
        <Navbar toggleSidebar={toggleSidebar} />
        <h1 className="text-3xl font-bold text-purple-300 mb-4">إدارة الفصول</h1>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-6"
          onClick={handleAddChapter}
        >
          إضافة فصل جديد
        </button>

        <div className="mb-6">
          <label htmlFor="mangaFilter" className="block text-gray-400 mb-2">
            تصفية الفصول حسب المانجا:
          </label>
          <select
            id="mangaFilter"
            className="bg-gray-800 text-white p-2 rounded-lg w-full"
            value={selectedMangaId || ''}
            onChange={(e) => setSelectedMangaId(e.target.value || null)}
          >
            <option value="">عرض جميع الفصول</option>
            {mangaList.map((manga) => (
              <option key={manga._id} value={manga._id}>
                {manga.title}
              </option>
            ))}
          </select>
        </div>

        <ul className="space-y-4">
          {filteredChapters.map((chapter) => (
            <li key={chapter._id} className="bg-purple-800 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-bold">
                الفصل {chapter.number}: {chapter.title}
              </h2>
              <p className="text-sm text-gray-400">المانجا: {chapter.mangaTitle}</p>
              <button
                className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                onClick={() => handleEditChapter(chapter._id)}
              >
                تعديل الفصل
              </button>
              {chapter.isPrivate && (
                <>
                  {session?.user?.id === chapter.authorId ? (
                    <button
                      className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      مخفي
                    </button>
                  ) : (
                    <button
                      className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      مخفي
                    </button>
                  )}
                </>
              )}
            </li>
          ))}
          {filteredChapters.length === 0 && (
            <li className="text-gray-400">لا توجد فصول متاحة لهذه المانجا.</li>
          )}
        </ul>
      </div>

      {isPopupOpen && selectedChapter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">أدخل كلمة المرور لقراءة الفصل الخاص</h2>
            <input
              type="password"
              className="w-full p-2 rounded bg-gray-700 text-white mb-4"
              placeholder="كلمة المرور"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                onClick={() => setIsPopupOpen(false)}
              >
                إلغاء
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                onClick={handleVerifyPassword}
              >
                تأكيد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
