import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Erreur déconnexion:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/?error=signout_failed`)
  }
  
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/`)
} 