'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface LikesProps {
  mangaId: string;
  chapterId?: string;
}

export default function Likes({ mangaId, chapterId }: LikesProps) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState<number>(0);
  const [userLiked, setUserLiked] = useState<boolean>(false);

  const fetchLikes = async () => {
    try {
      const query = chapterId
        ? `?mangaId=${mangaId}&chapterId=${chapterId}`
        : `?mangaId=${mangaId}`;
      const res = await fetch(`/api/likes${query}`);
      if (!res.ok) {
        throw new Error('Failed to fetch likes');
      }
      const data = await res.json();
      setLikes(data.length);

      if (session?.user) {
        const liked = data.some((like: { userId: string }) => like.userId === session.user.id);
        setUserLiked(liked);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleLike = async () => {
    if (!session?.user) {
      alert('يجب تسجيل الدخول لإعطاء إعجاب.');
      return;
    }

    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          mangaId,
          chapterId,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to toggle like');
      }

      fetchLikes();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [mangaId, chapterId, session]);

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={toggleLike}
        className={`flex items-center px-4 py-2 rounded-lg transition-all shadow-md ${
          userLiked
            ? 'bg-purple-600 text-white hover:bg-purple-700'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
      >
        {userLiked ? (
          <span className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-5 h-5"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>أعجبني</span>
          </span>
        ) : (
          <span className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
              />
            </svg>
            <span>إعجاب</span>
          </span>
        )}
      </button>
      <span className="text-gray-300 text-sm">{likes} إعجاب</span>
    </div>
  );
}
