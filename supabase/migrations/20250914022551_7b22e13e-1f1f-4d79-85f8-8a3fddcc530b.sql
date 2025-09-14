-- Create site_buena schema for business logic
CREATE SCHEMA IF NOT EXISTS site_buena;

-- Create site_buena_profiles table in public schema for auth integration
CREATE TABLE public.site_buena_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'customer',
  preferences JSONB DEFAULT '{"notifications": true, "newsletter": false}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure one profile per user per site
  UNIQUE(user_id, site_id)
);

-- Enable RLS on site_buena_profiles
ALTER TABLE public.site_buena_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for site_buena_profiles
CREATE POLICY "Users can view their own buena profiles" 
ON public.site_buena_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own buena profiles" 
ON public.site_buena_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own buena profiles" 
ON public.site_buena_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add timestamp trigger for site_buena_profiles
CREATE TRIGGER update_site_buena_profiles_updated_at
BEFORE UPDATE ON public.site_buena_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Helper function to get user's buena profile
CREATE OR REPLACE FUNCTION public.get_user_buena_profile(site_schema text)
RETURNS TABLE (
  id uuid,
  role text,
  preferences jsonb,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path TO 'public'
AS $$
BEGIN
    RETURN QUERY
    SELECT 
      sbp.id,
      sbp.role,
      sbp.preferences,
      sbp.created_at,
      sbp.updated_at
    FROM public.site_buena_profiles sbp
    JOIN public.sites s ON s.id = sbp.site_id
    WHERE s.schema_name = site_schema 
    AND sbp.user_id = auth.uid();
END;
$$;

-- Update ensure_membership_for_domain function to handle buena sites
CREATE OR REPLACE FUNCTION public.ensure_membership_for_domain()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    current_host text;
    site_record record;
BEGIN
    -- Get current host from request headers
    current_host := current_setting('request.headers', true)::json->>'host';
    
    -- Find the site for this domain
    SELECT * INTO site_record FROM public.sites WHERE domain = current_host AND active = true;
    
    -- If site exists and user is authenticated, ensure membership
    IF site_record.id IS NOT NULL AND auth.uid() IS NOT NULL THEN
        -- Create site membership
        INSERT INTO public.site_members (site_id, user_id, role)
        VALUES (site_record.id, auth.uid(), 'member')
        ON CONFLICT (site_id, user_id) DO NOTHING;
        
        -- Create regatta profile for regatta sites
        IF site_record.schema_name = 'site_regatta' THEN
            INSERT INTO public.site_regatta_profiles (user_id, site_id)
            VALUES (auth.uid(), site_record.id)
            ON CONFLICT (user_id, site_id) DO NOTHING;
        END IF;
        
        -- Create Web3 Analytics profile for web3analytics sites
        IF site_record.schema_name = 'site_web3analytics' THEN
            INSERT INTO public.site_web3analytics_profiles (user_id, site_id)
            VALUES (auth.uid(), site_record.id)
            ON CONFLICT (user_id, site_id) DO NOTHING;
        END IF;
        
        -- Create buena profile for buena sites
        IF site_record.schema_name = 'site_buena' THEN
            INSERT INTO public.site_buena_profiles (user_id, site_id)
            VALUES (auth.uid(), site_record.id)
            ON CONFLICT (user_id, site_id) DO NOTHING;
        END IF;
    END IF;
END;
$$;