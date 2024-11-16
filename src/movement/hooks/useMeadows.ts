// src/movement/hooks/useMeadows.ts

import { useState, useCallback } from 'react';
import { Meadow, CreateMeadowInput, UpdateMeadowInput } from '@/types/meadow';
import { MeadowType, MeadowStatus } from '@prisma/client';

export function useMeadows() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeadows = useCallback(async (params?: {
    type?: MeadowType;
    status?: MeadowStatus;
    search?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (params?.type) queryParams.append('type', params.type);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.search) queryParams.append('search', params.search);

      const response = await fetch(`/api/movement/meadows?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch meadows');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createMeadow = useCallback(async (data: CreateMeadowInput): Promise<Meadow | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/movement/meadows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create meadow');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateMeadow = useCallback(async (data: UpdateMeadowInput): Promise<Meadow | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/movement/meadows/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update meadow');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteMeadow = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/movement/meadows/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete meadow');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const joinMeadow = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/movement/meadows/${id}/join`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to join meadow');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const leaveMeadow = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/movement/meadows/${id}/leave`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to leave meadow');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    fetchMeadows,
    createMeadow,
    updateMeadow,
    deleteMeadow,
    joinMeadow,
    leaveMeadow,
  };
}
