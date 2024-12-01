'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Manga {
  _id: string;
  title: string;
  author: string;
  description: string;
  imageUrl: string;
}

export default function MangaSection() {
  const [mangaList, setMangaList] = useState<Manga[]>([]);

  useEffect(() => {
    const fetchManga = async () => {
      const res = await fetch('/api/manga');
      const data: Manga[] = await res.json();
      setMangaList(data);
    };
    fetchManga();
  }, []);

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-purple-300 mb-12">أحدث المانجات</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {mangaList.map((manga) => (
            <Link key={manga._id} href={`/manga/${manga._id}`}>
              <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl">
                <Image
                  src={manga.imageUrl}
                  alt={manga.title}
                  width={400}
                  height={600}
                  className="object-cover w-full h-64"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-purple-300 mb-2">{manga.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">المؤلف: {manga.author}</p>
                  <p className="text-gray-300 text-sm line-clamp-3">{manga.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
