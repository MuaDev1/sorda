'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Sidebar from '../../../components/Sidebar';

interface Manga {
  _id: string;
  title: string;
}

interface User {
  _id: string;
  name: string;
  avatar: string;
}

export default function AddChapter() {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedManga, setSelectedManga] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterNumber, setChapterNumber] = useState(1);
  const [images, setImages] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchManga = async () => {
      const res = await fetch('/api/manga');
      const data: Manga[] = await res.json();
      setMangaList(data);
    };

    const fetchUsers = async () => {
      const res = await fetch('/api/users');
      const data: User[] = await res.json();
      setUserList(data);
      setFilteredUsers(data);
    };

    fetchManga();
    fetchUsers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === '') {
      setFilteredUsers(userList);
    } else {
      setFilteredUsers(userList.filter((user) => user.name.toLowerCase().includes(term)));
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const chapterData = {
      title: chapterTitle,
      number: chapterNumber,
      images: images.split(',').map((img) => img.trim()),
      mangaId: selectedManga,
      isPrivate,
      allowedUsers: selectedUsers.map((user) => user._id), // إرسال المعرفات فقط
    };
  
    const res = await fetch('/api/chapters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chapterData),
    });
  
    if (res.ok) {
      alert('تم إنشاء الفصل بنجاح!');
      router.push('/admin/chapter');
    } else {
      alert('حدث خطأ أثناء إضافة الفصل');
    }
  };
    const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-grow">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-grow p-6">
          <h1 className="text-4xl font-bold text-purple-300 mb-8">إضافة فصل جديد</h1>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <select
              className="w-full p-2 rounded bg-gray-800 text-white"
              value={selectedManga}
              onChange={(e) => setSelectedManga(e.target.value)}
            >
              <option value="">اختر المانجا</option>
              {mangaList.map((manga) => (
                <option key={manga._id} value={manga._id}>
                  {manga.title}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-800 text-white"
              placeholder="عنوان الفصل"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
            />
            <input
              type="number"
              className="w-full p-2 rounded bg-gray-800 text-white"
              placeholder="رقم الفصل"
              value={chapterNumber}
              onChange={(e) => setChapterNumber(parseInt(e.target.value, 10))}
            />
            <textarea
              className="w-full p-2 rounded bg-gray-800 text-white"
              placeholder="روابط الصور (مفصولة بفاصلة)"
              value={images}
              onChange={(e) => setImages(e.target.value)}
            />
            <div>
              <input
                type="checkbox"
                id="isPrivate"
                className="mr-2"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              <label htmlFor="isPrivate" className="text-white">جعل الفصل خاص</label>
            </div>

            {/* قائمة المستخدمين */}
            {isPrivate && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">اختر المستخدمين المسموح لهم</h3>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-gray-800 text-white"
                  placeholder="بحث عن المستخدم"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user._id}
                      className={`flex items-center p-2 bg-gray-800 rounded-lg cursor-pointer ${
                        selectedUsers.includes(user._id) ? 'border-2 border-purple-500' : ''
                      }`}
                      onClick={() => toggleUserSelection(user._id)}
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <p className="text-white">{user.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              إضافة الفصل
            </button>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
}
