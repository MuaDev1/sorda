interface Chapter {
    _id: string;
    title: string;
    number: number;
    images: string[];
    isPrivate?: boolean; // إضافة الحقل الخاص
    password?: string; // إضافة حقل كلمة المرور
  
  }
  
  interface ChapterListProps {
    chapters: Chapter[];
    onEdit: (chapter: Chapter) => void;
    onDelete: (id: string) => void;
  }
  
  export default function ChapterList({ chapters, onEdit, onDelete }: ChapterListProps) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-purple-400 mb-4">Chapter List</h2>
        {chapters.map((chapter) => (
          <div key={chapter._id} className="border-b border-gray-700 p-4 mb-4">
            <h3 className="text-lg font-bold">{chapter.title} (Chapter {chapter.number})</h3>
            <p>Images: {chapter.images.join(', ')}</p>
            <div className="flex space-x-4 mt-2">
              <button
                className="bg-blue-500 px-4 py-2 rounded text-white"
                onClick={() => onEdit(chapter)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 px-4 py-2 rounded text-white"
                onClick={() => onDelete(chapter._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }
  