
import { useState, useEffect } from 'react';
import { useRedFlags } from './useRedFlags';

export const useEntityRedFlags = (entityType: 'member' | 'plot', entityId: string) => {
  const [hasActiveRedFlags, setHasActiveRedFlags] = useState(false);
  const [loading, setLoading] = useState(true);
  const { getEntityRedFlags } = useRedFlags();

  const checkRedFlags = async () => {
    if (!entityId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data } = await getEntityRedFlags(entityType, entityId);
      const activeRedFlags = data.filter(flag => !flag.resolved);
      setHasActiveRedFlags(activeRedFlags.length > 0);
    } catch (error) {
      console.error('Error checking red flags:', error);
      setHasActiveRedFlags(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkRedFlags();
  }, [entityType, entityId]);

  return { hasActiveRedFlags, loading, refetch: checkRedFlags };
};
