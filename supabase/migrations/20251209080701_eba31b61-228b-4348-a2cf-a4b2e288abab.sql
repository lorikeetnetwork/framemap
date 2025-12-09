-- Create table for storing user framework maps
CREATE TABLE public.framework_maps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.framework_maps ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own framework maps" 
ON public.framework_maps 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own framework maps" 
ON public.framework_maps 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own framework maps" 
ON public.framework_maps 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own framework maps" 
ON public.framework_maps 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_framework_maps_updated_at
BEFORE UPDATE ON public.framework_maps
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();