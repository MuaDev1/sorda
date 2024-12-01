import { useState } from 'react';

interface Chapter {
  _id: string;
  title: string;
  number: number;
  images: string[];
  isPrivate?: boolean; // إضافة الحقل الخاص
  password?: string; // إضافة حقل كلمة المرور

}

interface EditChapterFormProps {
  chapter: Chapter;
  onSave: (chapter: Chapter) => void;
  onCancel: () => void;
}

export default function EditChapterForm({ chapter, onSave, onCancel }: EditChapterFormProps) {
  const [title, setTitle] = useState(chapter.title);
  const [number, setNumber] = useState(chapter.number);
  const [images, setImages] = useState(chapter.images.join(','));

  const handleSubmit = () => {
    onSave({
      ...chapter,
      title,
      number,
      images: images.split(',').map((img) => img.trim()),
    });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-purple-400 mb-4">Edit Chapter</h2>
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
      <button onClick={handleSubmit} className="bg-blue-500 px-4 py-2 rounded text-white">
        Save Chapter
      </button>
      <button onClick={onCancel} className="bg-red-500 px-4 py-2 rounded text-white mt-2">
        Cancel
      </button>
    </div>
  );
}
