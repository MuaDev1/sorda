'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import Sidebar from '../../../../components/Sidebar';

interface Chapter {
  _id: string;
  title: string;
  number: number;
  images: string[];
  isPrivate: boolean;
  allowedUsers: string[];
}

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function EditChapterPage({ params }: { params: { chapterId: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    title: '',
    number: 0,
    images: '',
    isPrivate: false,
    allowedUsers: [] as string[],
  });
  const [users, setUsers] = useState<User[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const res = await fetch(`/api/chapters/${params.chapterId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch chapter details');
        }
        const data: Chapter = await res.json();
        setFormValues({
          title: data.title,
          number: data.number,
          images: data.images.join(', '),
          isPrivate: data.isPrivate,
          allowedUsers: data.allowedUsers || [],
        });
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        const data: User[] = await res.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchChapter();
    fetchUsers();
  }, [params.chapterId]);

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/chapters/${params.chapterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: params.chapterId,
          title: formValues.title,
          number: formValues.number,
          images: formValues.images.split(',').map((img) => img.trim()),
          isPrivate: formValues.isPrivate,
          allowedUsers: formValues.allowedUsers,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update chapter');
      }

      alert('تم تحديث الفصل بنجاح!');
    } catch (error) {
      console.error('Error updating chapter:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: name === 'isPrivate' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleUserSelection = (userId: string) => {
    setFormValues((prevValues) => {
      const updatedUsers = prevValues.allowedUsers.includes(userId)
        ? prevValues.allowedUsers.filter((id) => id !== userId)
        : [...prevValues.allowedUsers, userId];
      return { ...prevValues, allowedUsers: updatedUsers };
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-grow">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-grow p-6">
          <h1 className="text-3xl font-bold mb-6">تعديل الفصل</h1>
          <form className="space-y-6">
            <div>
              <label className="block text-lg font-semibold mb-2">العنوان</label>
              <input
                type="text"
                name="title"
                value={formValues.title}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-gray-800 text-white"
                placeholder="عنوان الفصل"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2">رقم الفصل</label>
              <input
                type="number"
                name="number"
                value={formValues.number}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-gray-800 text-white"
                placeholder="رقم الفصل"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2">روابط الصور</label>
              <textarea
                name="images"
                value={formValues.images}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-gray-800 text-white"
                placeholder="روابط الصور، مفصولة بفاصلة"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2">الفصل خاص</label>
              <input
                type="checkbox"
                name="isPrivate"
                checked={formValues.isPrivate}
                onChange={handleInputChange}
                className="w-6 h-6"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2">المستخدمون المسموح لهم</label>
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user._id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formValues.allowedUsers.includes(user._id)}
                      onChange={() => handleUserSelection(user._id)}
                      className="mr-2"
                    />
                    <p>{user.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleSave}
                className="bg-blue-500 px-4 py-2 rounded text-white"
              >
                حفظ التعديلات
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/chapter')}
                className="bg-red-500 px-4 py-2 rounded text-white"
              >
                إلغاء
              </button>
            </div>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
}
