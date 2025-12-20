import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { token } = await req.json()

    if (!token) {
      return new Response(
        JSON.stringify({ valid: false, message: 'Token is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Validate the magic token
    const { data: validationData, error: validationError } = await supabaseClient
      .rpc('validate_magic_token', { token })

    if (validationError) {
      console.error('Token validation error:', validationError)
      return new Response(
        JSON.stringify({ valid: false, message: 'Invalid token' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check validation result
    const result = validationData[0]
    if (!result.is_valid) {
      let message = 'Invalid or expired magic link'
      if (result.is_expired) {
        message = 'Magic link has expired. Please request a new one.'
      } else if (result.is_used) {
        message = 'Magic link has already been used.'
      }

      return new Response(
        JSON.stringify({ valid: false, message }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Token is valid, now we need to ensure the user exists and sign them in
    const userEmail = result.email

    // Check if user exists in auth.users
    const { data: existingUser, error: userCheckError } = await supabaseClient.auth.admin.getUserByEmail(userEmail)

    let userId: string

    if (userCheckError || !existingUser.user) {
      // User doesn't exist, create them
      const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
        email: userEmail,
        email_confirm: true, // Auto-confirm email since they validated the magic link
        user_metadata: {
          source: 'magic_link'
        }
      })

      if (createError || !newUser.user) {
        console.error('User creation error:', createError)
        return new Response(
          JSON.stringify({ valid: false, message: 'Failed to create user account' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      userId = newUser.user.id
    } else {
      userId = existingUser.user.id
    }

    // Ensure customer profile exists
    const { error: customerError } = await supabaseClient
      .rpc('get_or_create_customer', { user_email: userEmail })

    if (customerError) {
      console.error('Customer creation error:', customerError)
      // Don't fail the auth if customer creation fails
    }

    // Generate a session for the user
    const { data: sessionData, error: sessionError } = await supabaseClient.auth.admin.generateLink({
      type: 'magiclink',
      email: userEmail,
      options: {
        redirectTo: req.headers.get('origin') || 'http://localhost:8080'
      }
    })

    if (sessionError) {
      console.error('Session generation error:', sessionError)
      return new Response(
        JSON.stringify({ valid: false, message: 'Failed to generate session' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({
        valid: true,
        message: 'Authentication successful',
        session: sessionData
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Magic link validation error:', error)
    return new Response(
      JSON.stringify({ valid: false, message: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

