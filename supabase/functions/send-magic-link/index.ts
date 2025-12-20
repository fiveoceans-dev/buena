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
    const { email, redirectTo = '/' } = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
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

    // Create magic token
    const { data: tokenData, error: tokenError } = await supabaseClient
      .rpc('create_magic_token', { user_email: email })

    if (tokenError) {
      console.error('Token creation error:', tokenError)
      return new Response(
        JSON.stringify({ error: 'Failed to create magic link' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Generate magic link URL
    const baseUrl = Deno.env.get('SITE_URL') || 'http://localhost:8080'
    const magicLink = `${baseUrl}/auth/verify?token=${tokenData}&redirectTo=${encodeURIComponent(redirectTo)}`

    // Send email (you would integrate with your email service here)
    // For now, we'll just log it and return success
    console.log(`Magic link for ${email}: ${magicLink}`)

    // In production, you would send the email here using a service like:
    // - SendGrid
    // - Resend
    // - AWS SES
    // - etc.

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Sign in to Buena Retailing</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Buena Retailing</h1>
          </div>

          <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1f2937; margin-top: 0;">Sign in to your account</h2>
            <p style="color: #6b7280; margin-bottom: 20px;">
              Click the button below to sign in to your Buena Retailing account.
            </p>

            <a href="${magicLink}"
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
              Sign In
            </a>
          </div>

          <div style="color: #6b7280; font-size: 14px;">
            <p>This link will expire in 24 hours for security reasons.</p>
            <p>If you didn't request this sign-in link, you can safely ignore this email.</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px;">
            <p>Buena Retailing - Secure access to your business account</p>
          </div>
        </body>
      </html>
    `

    // TODO: Integrate with email service
    // Example with Resend:
    /*
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
    await resend.emails.send({
      from: 'auth@buenaretailing.com',
      to: email,
      subject: 'Sign in to Buena Retailing',
      html: emailHtml
    })
    */

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Magic link sent successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Magic link error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
