import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LinkPreview } from "@/types/framework";

// Simple in-memory cache
const previewCache = new Map<string, LinkPreview>();

export const useLinkPreview = (url: string | undefined) => {
  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreview = useCallback(async (targetUrl: string) => {
    if (!targetUrl) return null;

    // Check cache first
    if (previewCache.has(targetUrl)) {
      return previewCache.get(targetUrl)!;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: funcError } = await supabase.functions.invoke('fetch-link-preview', {
        body: { url: targetUrl }
      });

      if (funcError) throw funcError;

      const previewData: LinkPreview = data;
      previewCache.set(targetUrl, previewData);
      setPreview(previewData);
      return previewData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch preview';
      setError(message);
      console.error('Link preview error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (url) {
      // Check cache first
      if (previewCache.has(url)) {
        setPreview(previewCache.get(url)!);
        setLoading(false);
        return;
      }
      fetchPreview(url);
    } else {
      setPreview(null);
    }
  }, [url, fetchPreview]);

  return { preview, loading, error, fetchPreview };
};

export default useLinkPreview;
