'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../../components/Navbar';
import Footer from '../../components/Footer';
import Sidebar from '../../../components/Sidebar';

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
  
  // قائمة التصنيفات المتاحة (باستثناء التصنيفات المخلة)
  const availableCategories = [
    'أكشن', 'مغامرة', 'كوميديا', 'دراما', 'خيال', 'تاريخي',
    'رعب', 'سحر', 'فنون قتالية', 'ميكا', 'غموض', 'نفسي',
    'رومانسي', 'مدرسة', 'خيال علمي', 'شونين', 'شريحة من الحياة',
    'رياضة', 'خارق للطبيعة', 'إثارة', 'سينين', 'شوجو', 'عسكري',
    'فضاء',
      ];
  
  export default function EditManga({ params }: { params: { mangaId: string } }) {
    const [manga, setManga] = useState<Manga | null>(null);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  
    const router = useRouter();
  
    useEffect(() => {
      const fetchManga = async () => {
        try {
          const res = await fetch(`/api/manga/${params.mangaId}`);
          if (!res.ok) {
            throw new Error('Failed to fetch manga');
          }
          const data: Manga = await res.json();
          setManga(data);
          setTitle(data.title);
          setAuthor(data.author);
          setDescription(data.description);
          setCategories(data.categories);
          setImageUrl(data.imageUrl);
          setLoading(false);
        } catch (error: unknown) {
            if (error instanceof Error) {
              setError(error.message);
            } else {
              setError('An unknown error occurred');
            }
          } finally {
            setLoading(false);
          }
          };
  
      fetchManga();
    }, [params.mangaId]);
  
    const handleUpdate = async () => {
      try {
        const res = await fetch(`/api/manga/${params.mangaId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            author,
            description,
            categories,
            imageUrl,
          }),
        });
  
        if (!res.ok) {
          throw new Error('Failed to update manga');
        }
  
        alert('تم تعديل المانجا بنجاح');
        router.push('/admin/manga');
      } catch (error) {
      }
    };
  
    const handleCategoryChange = (selectedCategory: string) => {
      if (categories.includes(selectedCategory)) {
        setCategories(categories.filter((cat) => cat !== selectedCategory));
      } else {
        setCategories([...categories, selectedCategory]);
      }
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
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <main className="flex-grow p-6">
            <h1 className="text-3xl font-bold mb-6">تعديل المانجا</h1>
  
            <div className="space-y-4">
              <div>
                <label className="block text-lg mb-2">عنوان المانجا</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                />
              </div>
  
              <div>
                <label className="block text-lg mb-2">المؤلف</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                />
              </div>
  
              <div>
                <label className="block text-lg mb-2">الوصف</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                />
              </div>
  
              <div>
                <label className="block text-lg mb-2">التصنيفات</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {availableCategories.map((category) => (
                    <div key={category}>
                      <input
                        type="checkbox"
                        id={category}
                        checked={categories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="mr-2"
                      />
                      <label htmlFor={category}>{category}</label>
                    </div>
                  ))}
                </div>
              </div>
  
              <div>
                <label className="block text-lg mb-2">رابط الصورة</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                />
              </div>
  
              <div className="mt-6">
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 px-4 py-2 rounded text-white"
                >
                  حفظ التعديلات
                </button>
              </div>
  
              <div className="mt-8">
                <h3 className="text-2xl font-bold mb-4">الفصول الحالية</h3>
                <ul>
                  {manga?.chapters.map((chapter) => (
                    <li key={chapter._id} className="mb-2">
                      <span className="text-lg">{chapter.title}</span> - الفصل {chapter.number}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
  