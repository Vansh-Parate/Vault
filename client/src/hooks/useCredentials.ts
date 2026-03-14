import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import type { Credential, DashboardStats } from '../types';

export function useCredentials(category?: string, search?: string) {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredentials = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (category && category !== 'ALL') params.category = category;
      if (search) params.search = search;

      const { data } = await api.get('/credentials', { params });
      setCredentials(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch credentials');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  return { credentials, loading, error, refetch: fetchCredentials };
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/stats');
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, loading };
}

export function useCredential(id: string | undefined) {
  const [credential, setCredential] = useState<Credential | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchCredential = async () => {
      try {
        const { data } = await api.get(`/credentials/${id}`);
        setCredential(data);
      } catch (err) {
        console.error('Failed to fetch credential', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCredential();
  }, [id]);

  return { credential, loading, setCredential };
}
