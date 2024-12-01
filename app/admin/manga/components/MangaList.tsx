interface Manga {
  _id: string;
  title: string;
  author: string;
  categories: string[];
}

interface MangaListProps {
  mangaList: Manga[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function MangaList({ mangaList, onEdit, onDelete }: MangaListProps) {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-purple-300 mb-4">قائمة المانجا</h2>
      <table className="w-full text-left table-auto">
        <thead>
          <tr>
            <th className="p-3 text-gray-400">العنوان</th>
            <th className="p-3 text-gray-400">المؤلف</th>
            <th className="p-3 text-gray-400">التصنيفات</th>
            <th className="p-3 text-gray-400">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {mangaList.map((manga) => (
            <tr key={manga._id} className="border-b border-gray-700">
              <td className="p-3">{manga.title}</td>
              <td className="p-3">{manga.author}</td>
              <td className="p-3">{manga.categories.join(', ')}</td>
              <td className="p-3">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
                  onClick={() => onEdit(manga._id)}
                >
                  تعديل
                </button>
                <button
                  onClick={() => onDelete(manga._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
