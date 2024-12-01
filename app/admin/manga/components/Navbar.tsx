export default function Navbar() {
    return (
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white font-bold text-xl">
            لوحة التحكم - إدارة المانجا
          </div>
          <div className="text-white">
            <a href="/admin/manga" className="mr-4">إدارة المانجا</a>
            <a href="/admin/users" className="mr-4">إدارة المستخدمين</a>
            <a href="/admin/stats">الإحصائيات</a>
          </div>
        </div>
      </nav>
    );
  }
  