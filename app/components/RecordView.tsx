'use client';

import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function RecordView({ mangaId, chapterId }: { mangaId: string; chapterId?: string }) {
  const hasRecordedView = useRef(false); // لتجنب التكرار

  useEffect(() => {
    const recordView = async () => {
      if (hasRecordedView.current) return; // منع التكرار
      hasRecordedView.current = true;

      let userId = localStorage.getItem('userId');
      if (!userId) {
        userId = uuidv4();
        localStorage.setItem('userId', userId);
      }

      try {
        await fetch('/api/views', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mangaId, chapterId, userId }),
        });
      } catch (error) {
        console.error('Error recording view:', error);
      }
    };

    recordView();
  }, [mangaId, chapterId]);

  return null;
}
