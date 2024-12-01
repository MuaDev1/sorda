'use client';

import { useState, useEffect } from 'react';

interface Manga {
  _id: string;
  title: string;
}

interface Chapter {
  _id: string;
  title: string;
  number: number;
  isPrivate?: boolean; // إضافة الحقل الخاص
  password?: string; // إضافة حقل كلمة المرور

}

interface Comment {
  _id: string;
  author: { name: string; avatar: string };
  content: string;
  createdAt: string;
  mangaId: string;
  chapterId?: string;
}

export default function CommentsAdmin() {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedManga, setSelectedManga] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMangas = async () => {
    try {
      const res = await fetch('/api/manga');
      if (!res.ok) {
        throw new Error(`Failed to fetch mangas: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setMangas(data);
    } catch (error) {
      console.error('Error fetching mangas:', error);
    }
  };

  const fetchChapters = async (mangaId: string) => {
    try {
      const res = await fetch(`/api/manga/${mangaId}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch chapters: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setChapters(data.chapters || []);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (selectedManga) query.append('mangaId', selectedManga);
      if (selectedChapter) query.append('chapterId', selectedChapter);

      const res = await fetch(`/api/admin/comments?${query.toString()}`, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Failed to fetch comments: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (id: string) => {
    if (!confirm('هل أنت متأكد أنك تريد حذف هذا التعليق؟')) return;
  
    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error(`Failed to delete comment: ${res.status} ${res.statusText}`);
      }
      setComments((prev) => prev.filter((comment) => comment._id !== id));
      alert('تم حذف التعليق بنجاح');
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert(error instanceof Error ? error.message : 'حدث خطأ غير متوقع');
    }
  };
  
  useEffect(() => {
    fetchMangas();
  }, []);

  useEffect(() => {
    if (selectedManga) {
      fetchChapters(selectedManga);
      setSelectedChapter(''); // إعادة تعيين الفصل عند تغيير المانجا
    } else {
      setChapters([]);
    }
  }, [selectedManga]);

  useEffect(() => {
    fetchComments();
  }, [selectedManga, selectedChapter]);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-purple-300 mb-6">إدارة التعليقات</h1>

      {/* قسم اختيار المانجا والفصل */}
      <div className="bg-gray-800 p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-center">
        <select
          value={selectedManga}
          onChange={(e) => setSelectedManga(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 w-full md:w-auto"
        >
          <option value="">اختر المانجا</option>
          {mangas.map((manga) => (
            <option key={manga._id} value={manga._id}>
              {manga.title}
            </option>
          ))}
        </select>
        <select
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
          disabled={!chapters.length}
          className="px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 w-full md:w-auto"
        >
          <option value="">اختر الفصل</option>
          {chapters.map((chapter) => (
            <option key={chapter._id} value={chapter._id}>
              الفصل {chapter.number}: {chapter.title}
            </option>
          ))}
        </select>
      </div>

      {/* عرض التعليقات */}
      {loading ? (
        <p className="text-center text-white">جاري تحميل التعليقات...</p>
      ) : comments.length > 0 ? (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li
              key={comment._id}
              className="p-4 bg-gray-800 rounded-lg shadow flex justify-between items-center"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-bold text-purple-400">{comment.author.name}</p>
                  <p className="text-gray-300">{comment.content}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteComment(comment._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                حذف
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">لا توجد تعليقات لعرضها.</p>
      )}
    </div>
  );
}
