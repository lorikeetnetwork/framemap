-- Drop the insecure view
DROP VIEW IF EXISTS public.admin_users_view;

-- Add RLS policy for admins to update roles
CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));