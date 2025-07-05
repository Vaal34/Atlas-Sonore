import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'spotify',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/profile`,
      scopes: 'user-top-read user-read-private user-read-email user-library-read playlist-read-private'
    },
  })

  if (error) {
    console.error('Erreur auth:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/?error=auth_failed`)
  }

  if (data.url) {
    return NextResponse.redirect(data.url)
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/`)
} 