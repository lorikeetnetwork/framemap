import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { FrameworkNode } from '@/types/framework';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

export interface FrameworkMap {
  id: string;
  name: string;
  description: string | null;
  data: FrameworkNode;
  canvas_positions: Record<string, { x: number; y: number }> | null;
  created_at: string;
  updated_at: string;
}

export const useFrameworkMaps = () => {
  const { user } = useAuth();
  const [maps, setMaps] = useState<FrameworkMap[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMaps = async () => {
    if (!user) {
      setMaps([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('framework_maps')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      // Cast the data properly
      const typedMaps = (data || []).map(item => ({
        ...item,
        data: item.data as unknown as FrameworkNode,
        canvas_positions: item.canvas_positions as Record<string, { x: number; y: number }> | null
      }));
      
      setMaps(typedMaps);
    } catch (error) {
      console.error('Error fetching maps:', error);
      toast.error('Failed to load saved maps');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaps();
  }, [user]);

  const saveMap = async (name: string, data: FrameworkNode, description?: string): Promise<FrameworkMap | null> => {
    if (!user) {
      toast.error('Please sign in to save maps');
      return null;
    }

    try {
      const { data: savedMap, error } = await supabase
        .from('framework_maps')
        .insert({
          user_id: user.id,
          name,
          description: description || null,
          data: data as unknown as Json
        })
        .select()
        .single();

      if (error) throw error;

      const typedMap = {
        ...savedMap,
        data: savedMap.data as unknown as FrameworkNode,
        canvas_positions: savedMap.canvas_positions as Record<string, { x: number; y: number }> | null
      };

      setMaps(prev => [typedMap, ...prev]);
      toast.success('Map saved successfully!');
      return typedMap;
    } catch (error) {
      console.error('Error saving map:', error);
      toast.error('Failed to save map');
      return null;
    }
  };

  const updateMap = async (id: string, updates: { name?: string; data?: FrameworkNode; description?: string; canvas_positions?: Record<string, { x: number; y: number }> | null }): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to update maps');
      return false;
    }

    try {
      const updatePayload: { name?: string; description?: string; data?: Json; canvas_positions?: Json } = {};
      if (updates.name) updatePayload.name = updates.name;
      if (updates.description !== undefined) updatePayload.description = updates.description;
      if (updates.canvas_positions !== undefined) updatePayload.canvas_positions = updates.canvas_positions as unknown as Json;
      if (updates.data) updatePayload.data = updates.data as unknown as Json;

      const { error } = await supabase
        .from('framework_maps')
        .update(updatePayload)
        .eq('id', id);

      if (error) throw error;

      await fetchMaps();
      toast.success('Map updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating map:', error);
      toast.error('Failed to update map');
      return false;
    }
  };

  const deleteMap = async (id: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to delete maps');
      return false;
    }

    try {
      const { error } = await supabase
        .from('framework_maps')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMaps(prev => prev.filter(m => m.id !== id));
      toast.success('Map deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting map:', error);
      toast.error('Failed to delete map');
      return false;
    }
  };

  return {
    maps,
    loading,
    saveMap,
    updateMap,
    deleteMap,
    refreshMaps: fetchMaps
  };
};
