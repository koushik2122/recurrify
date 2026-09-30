'use client'
import {useEffect} from 'react'
import {createClient} from '../../lib/supabase/browser'
export default function Logout(){useEffect(()=>{createClient().auth.signOut().finally(()=>{window.location.href='/login'})},[]);return <main className="auth-page"><div className="auth-card"><h1>Signing out…</h1><p className="muted">Your session is being closed securely.</p></div></main>}
