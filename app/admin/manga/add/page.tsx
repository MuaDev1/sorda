'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AddManga() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const { data: session } = useSession(); // الحصول على بيانات الجلسة
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      alert('يجب تسجيل الدخول لنشر مانجا.');
      return;
    }

    const mangaData = {
      title,
      author: session.user.name, // يتم تحديد المؤلف تلقائيًا
      description,
      categories: categories.split(',').map((cat) => cat.trim()),
      imageUrl,
      publisher: {
        userId: session.user.id,
        name: session.user.name,
        avatar: session.user.image,
      },
    };
    
    const res = await fetch('/api/manga', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mangaData),
    });

    if (res.ok) {
      router.push('/admin/manga'); // إعادة التوجيه إلى قائمة المانجا
    } else {
      alert('حدث خطأ أثناء إضافة المانجا');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex flex-col">
      <Navbar />
      <div className="flex flex-grow">
        <main className="flex-grow p-6">
          <h1 className="text-4xl font-bold text-purple-300 mb-8">إضافة مانجا جديدة</h1>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-800 text-white"
              placeholder="عنوان المانجا"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="w-full p-2 rounded bg-gray-800 text-white"
              placeholder="وصف المانجا"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-800 text-white"
              placeholder="التصنيفات (مفصولة بفاصلة)"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
            />
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-800 text-white"
              placeholder="رابط صورة المانجا"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              إضافة المانجا
            </button>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
}
