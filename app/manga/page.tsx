'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

interface Manga {
  _id: string;
  title: string;
  author: string;
  imageUrl: string;
  categories: string[];
}

const categoriesList = [
  'أكشن', 'مغامرة', 'كوميديا', 'دراما', 'خيال', 'تاريخي', 'رعب', 'سحر', 'فنون قتالية', 
  'ميكا', 'غموض', 'نفسي', 'رومانسي', 'مدرسة', 'خيال علمي', 'شونين', 'شريحة من الحياة', 
  'رياضة', 'خارق للطبيعة', 'إثارة', 'سينين', 'شوجو', 'عسكري', 'فضاء'
];

export default function MangaPage() {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [filteredMangaList, setFilteredMangaList] = useState<Manga[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const res = await fetch('/api/manga'); // جلب المانجات من الـ API
        if (!res.ok) {
          throw new Error('Failed to fetch manga');
        }
        const data = await res.json();
        setMangaList(data);
        setFilteredMangaList(data); // البدء بعرض جميع المانجات
      } catch (error) {
        console.error('Error fetching manga:', error);
      }
    };
    fetchManga();
  }, []);

  const filterByCategory = (category: string) => {
    setSelectedCategory(category);
    if (category === 'الكل') {
      setFilteredMangaList(mangaList);
    } else {
      setFilteredMangaList(mangaList.filter(manga => manga.categories.includes(category)));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-grow">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-grow p-6">
          <h1 className="text-4xl font-bold text-purple-300 mb-6">جميع المانجات</h1>
          
          {/* فلتر التصنيفات */}
          <div className="mb-6">
            <select 
              value={selectedCategory} 
              onChange={(e) => filterByCategory(e.target.value)} 
              className="bg-gray-800 text-white p-2 rounded"
            >
              <option value="الكل">الكل</option>
              {categoriesList.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* عرض المانجات */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMangaList.map((manga) => (
              <Link key={manga._id} href={`/manga/${manga._id}`}>
                <div className="relative hover:scale-105 transition-transform bg-gray-800 p-4 rounded-lg shadow-lg">
                  <img
                    src={manga.imageUrl}
                    alt={manga.title}
                    className="w-full h-72 object-contain rounded-lg"
                  />
                  <div className="mt-4 text-center">
                    <h3 className="text-lg font-bold text-purple-400">{manga.title}</h3>
                    <p className="text-sm text-gray-400">{manga.author}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </main>
      </div>
      <Footer />
    </div>
  );
}
