-- Magic Link Authentication System
-- Secure token-based authentication for passwordless login

-- Create auth_tokens table for magic link tokens
CREATE TABLE IF NOT EXISTS public.auth_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Create index for token lookup
CREATE INDEX IF NOT EXISTS idx_auth_tokens_token_hash ON public.auth_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_email ON public.auth_tokens(email);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_expires_at ON public.auth_tokens(expires_at);

-- Enable RLS
ALTER TABLE public.auth_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only see their own tokens)
CREATE POLICY "Users can view their own auth tokens"
    ON public.auth_tokens FOR SELECT
    USING (email = (auth.jwt() ->> 'email'));

-- Function to generate secure magic link tokens
CREATE OR REPLACE FUNCTION public.generate_magic_token()
RETURNS TEXT AS $$
BEGIN
    -- Generate a cryptographically secure random token
    RETURN encode(gen_random_bytes(32), 'base64url');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to hash tokens for storage
CREATE OR REPLACE FUNCTION public.hash_token(token TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Use SHA-256 for token hashing
    RETURN encode(digest(token, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create magic link token
CREATE OR REPLACE FUNCTION public.create_magic_token(user_email TEXT, expiry_hours INTEGER DEFAULT 24)
RETURNS TEXT AS $$
DECLARE
    token TEXT;
    token_hash TEXT;
    expiry_timestamp TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Generate token
    token := public.generate_magic_token();

    -- Hash token for storage
    token_hash := public.hash_token(token);

    -- Calculate expiry
    expiry_timestamp := now() + (expiry_hours || ' hours')::INTERVAL;

    -- Store token
    INSERT INTO public.auth_tokens (email, token_hash, expires_at)
    VALUES (user_email, token_hash, expiry_timestamp);

    -- Return the plain token for email
    RETURN token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate magic link token
CREATE OR REPLACE FUNCTION public.validate_magic_token(token TEXT)
RETURNS TABLE (
    email TEXT,
    is_valid BOOLEAN,
    is_expired BOOLEAN,
    is_used BOOLEAN
) AS $$
DECLARE
    token_hash TEXT;
    token_record RECORD;
BEGIN
    -- Hash the input token
    token_hash := public.hash_token(token);

    -- Find token record
    SELECT * INTO token_record
    FROM public.auth_tokens
    WHERE token_hash = token_hash
    LIMIT 1;

    -- Check if token exists
    IF token_record.id IS NULL THEN
        RETURN QUERY SELECT ''::TEXT, false, false, false;
        RETURN;
    END IF;

    -- Check if token is expired
    IF token_record.expires_at < now() THEN
        RETURN QUERY SELECT token_record.email, false, true, false;
        RETURN;
    END IF;

    -- Check if token is already used
    IF token_record.used_at IS NOT NULL THEN
        RETURN QUERY SELECT token_record.email, false, false, true;
        RETURN;
    END IF;

    -- Token is valid - mark as used
    UPDATE public.auth_tokens
    SET used_at = now()
    WHERE id = token_record.id;

    -- Return success
    RETURN QUERY SELECT token_record.email, true, false, false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired tokens (can be called by cron job)
CREATE OR REPLACE FUNCTION public.cleanup_expired_tokens()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.auth_tokens
    WHERE expires_at < now() - INTERVAL '30 days';

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user profile or create if doesn't exist
CREATE OR REPLACE FUNCTION public.get_or_create_customer(user_email TEXT)
RETURNS UUID AS $$
DECLARE
    customer_id UUID;
    user_id UUID;
BEGIN
    -- Try to find existing customer
    SELECT c.id INTO customer_id
    FROM public.customers c
    WHERE c.email = user_email;

    -- If customer exists, return their ID
    IF customer_id IS NOT NULL THEN
        RETURN customer_id;
    END IF;

    -- Get user ID from auth.users (if exists)
    SELECT au.id INTO user_id
    FROM auth.users au
    WHERE au.email = user_email;

    -- Create new customer record
    INSERT INTO public.customers (
        user_id,
        email,
        customer_type,
        is_active,
        preferences,
        shipping_addresses
    ) VALUES (
        user_id,
        user_email,
        'individual',
        true,
        '{"notifications": {"email": true, "sms": false}, "marketing": false, "newsletter": false}'::jsonb,
        '[]'::jsonb
    )
    RETURNING id INTO customer_id;

    RETURN customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
