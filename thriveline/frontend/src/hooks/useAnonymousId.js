import { useState, useEffect } from 'react';

export function useAnonymousId() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let id = localStorage.getItem('thriveline_anonymous_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('thriveline_anonymous_id', id);
    }
    setUserId(id);
  }, []);

  return userId;
}
