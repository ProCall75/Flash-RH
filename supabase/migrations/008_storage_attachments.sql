-- ═══════════════════════════════════════════════
-- 008: Storage bucket for attachments + PWA support
-- ═══════════════════════════════════════════════

-- Create the 'attachments' storage bucket for message attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'attachments',
    'attachments',
    true,
    10485760, -- 10 MB max
    ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
) ON CONFLICT (id) DO NOTHING;

-- RLS policies for the attachments bucket
-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'attachments');

-- Allow anyone to read public attachments
CREATE POLICY "Public can read attachments"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'attachments');

-- Allow admins to delete attachments
CREATE POLICY "Admins can delete attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'attachments'
    AND get_my_role() = 'admin'
);
