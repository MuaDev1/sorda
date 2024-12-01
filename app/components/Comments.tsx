'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface CommentsProps {
  mangaId: string;
  chapterId?: string;
}

interface Comment {
  _id: string;
  author: {
    userId: string;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
}
function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsAgo < 60) {
    return 'منذ أقل من دقيقة';
  } else if (secondsAgo < 3600) {
    const minutes = Math.floor(secondsAgo / 60);
    return `منذ ${minutes} دقيقة${minutes > 1 ? '' : ''}`;
  } else if (secondsAgo < 86400) {
    const hours = Math.floor(secondsAgo / 3600);
    return `منذ ${hours} ساعة${hours > 1 ? '' : ''}`;
  } else if (secondsAgo < 2592000) {
    const days = Math.floor(secondsAgo / 86400);
    return `منذ ${days} يوم${days > 1 ? '' : ''}`;
  } else if (secondsAgo < 31536000) {
    const months = Math.floor(secondsAgo / 2592000);
    return `منذ ${months} شهر${months > 1 ? '' : ''}`;
  } else {
    const years = Math.floor(secondsAgo / 31536000);
    return `منذ ${years} سنة${years > 1 ? '' : ''}`;
  }
}


export default function Comments({ mangaId, chapterId }: CommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      const query = chapterId
        ? `?mangaId=${mangaId}&chapterId=${chapterId}`
        : `?mangaId=${mangaId}`;
      const res = await fetch(`/api/comments${query}`);
      if (!res.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await res.json();
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !session?.user) {
      setError('يجب تسجيل الدخول وكتابة تعليق.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mangaId,
          chapterId,
          content: newComment.trim(),
          author: {
            userId: session.user.id,
            name: session.user.name,
            avatar: session.user.image || '/default-avatar.png',
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save comment');
      }

      setNewComment('');
      fetchComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [mangaId, chapterId]);

  return (
    <div className="comments-section">
      <h3 className="text-2xl font-semibold text-purple-300 mb-4">التعليقات</h3>
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="flex items-start p-4 bg-gray-800 rounded-lg shadow-lg space-x-4"
            >
              {/* صورة المستخدم */}
              <img
                src={comment.author.avatar}
                alt={comment.author.name}
                className="w-12 h-12 rounded-full border-2 border-purple-400"
              />

              {/* محتوى التعليق */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-purple-400 font-bold">{comment.author.name}</p>
                  <p className="text-sm text-gray-400">
                    {timeAgo(comment.createdAt)}
                  </p>
                </div>
                <p className="text-gray-200 mt-2">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">لا توجد تعليقات بعد.</p>
        )}
      </div>

      {session?.user ? (
        <div className="mt-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="أضف تعليقك هنا..."
            className="w-full p-3 bg-gray-900 text-gray-200 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleAddComment}
            disabled={loading}
            className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-500 transition disabled:opacity-50"
          >
            {loading ? 'جاري الإرسال...' : 'إرسال'}
          </button>
        </div>
      ) : (
        <p className="text-gray-400 mt-6">يجب تسجيل الدخول لإضافة تعليق.</p>
      )}
    </div>
  );
}
