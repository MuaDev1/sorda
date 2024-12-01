// app/admin/users/page.tsx
"use client"
import { useState, useEffect } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users');
      const data: User[] = await res.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    setUsers(users.filter((user) => user._id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-purple-300 mb-6">إدارة المستخدمين</h1>
      <p className="text-lg text-gray-300 mb-8">إضافة، تعديل أو حذف المستخدمين.</p>

      <div className="bg-purple-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-purple-200 mb-4">قائمة المستخدمين</h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-3 text-gray-400">الاسم</th>
              <th className="p-3 text-gray-400">البريد الإلكتروني</th>
              <th className="p-3 text-gray-400">الدور</th>
              <th className="p-3 text-gray-400">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-gray-700">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2">
                    تعديل
                  </button>
                  <button onClick={() => handleDelete(user._id)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
