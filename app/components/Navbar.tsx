// app/components/Navbar.tsx
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-black bg-opacity-80 shadow-md p-4 flex justify-between items-center rounded-b-lg">
      <div className="text-2xl font-bold text-purple-400">
        <Link href="/">سوردا</Link>
      </div>

      <div className="lg:hidden">
        <button onClick={toggleSidebar} className="text-white bg-purple-600 px-4 py-2 rounded-lg">
          القائمة
        </button>
      </div>

      <div className="hidden lg:flex items-center space-x-4">
        {status === 'authenticated' && session?.user ? (
          <Link href="/profile" className="flex items-center space-x-2 hover:opacity-80 transition">
            <p className="text-white">{session?.user?.name}</p>
            <Image
              src={session?.user?.image ?? '/placeholder-avatar.png'}
              alt={session?.user?.name || 'User Avatar'}
              width={40}
              height={40}
              className="rounded-full border-2 border-purple-400"
            />
          </Link>
        ) : (
          <button
            onClick={() => signIn('discord')} // توجيه المستخدم مباشرة إلى تسجيل الدخول باستخدام Discord
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            تسجيل الدخول
          </button>
        )}
      </div>
    </nav>
  );
}
