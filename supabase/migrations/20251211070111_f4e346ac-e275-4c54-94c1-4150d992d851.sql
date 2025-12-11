-- Create storage bucket for framework images
INSERT INTO storage.buckets (id, name, public)
VALUES ('framework-images', 'framework-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own images
CREATE POLICY "Users can upload their own images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'framework-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own images
CREATE POLICY "Users can update their own images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'framework-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete their own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'framework-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to all images in the bucket
CREATE POLICY "Public read access for framework images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'framework-images');