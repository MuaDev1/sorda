import { useState } from 'react';

interface Manga {
  _id: string;
  title: string;
}

interface AddChapterFormProps {
  onAdd: (chapter: { title: string; number: number; images: string[]; mangaId: string }) => void;
  mangaList: Manga[];
}

export default function AddChapterForm({ onAdd, mangaList }: AddChapterFormProps) {
  const [title, setTitle] = useState('');
  const [number, setNumber] = useState(1);
  const [images, setImages] = useState('');
  const [selectedMangaId, setSelectedMangaId] = useState('');

  const handleSubmit = () => {
    const imageArray = images.split(',').map((img) => img.trim());
    onAdd({ title, number, images: imageArray, mangaId: selectedMangaId });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-purple-400 mb-4">Add New Chapter</h2>

      {/* Manga Selection */}
      <select
        className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
        value={selectedMangaId}
        onChange={(e) => setSelectedMangaId(e.target.value)}
      >
        <option value="">Select Manga</option>
        {mangaList.map((manga) => (
          <option key={manga._id} value={manga._id}>
            {manga.title}
          </option>
        ))}
      </select>

      <input
        type="text"
        className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
        placeholder="Number"
        value={number}
        onChange={(e) => setNumber(parseInt(e.target.value))}
      />
      <textarea
        className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
        placeholder="Image URLs, comma-separated"
        value={images}
        onChange={(e) => setImages(e.target.value)}
      />
      <button onClick={handleSubmit} className="bg-green-500 px-4 py-2 rounded text-white">
        Save Chapter
      </button>
    </div>
  );
}
