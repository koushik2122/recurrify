'use client'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { createClient } from '../../lib/supabase/browser'

export default function LoginPage() {
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false)
  async function submit(e:FormEvent){e.preventDefault();setLoading(true);setError('');const {error}=await createClient().auth.signInWithPassword({email,password});if(error)setError(error.message);else window.location.href='/';setLoading(false)}
  return <main className="auth-page"><section className="auth-card"><div className="brand dark">◈ Recurrify</div><h1>Welcome back</h1><p className="muted">Sign in to manage recurring spend and renewals.</p><form onSubmit={submit} className="auth-form"><label>Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} /></label><label>Password<input required type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label>{error&&<div className="error">{error}</div>}<button className="btn primary wide" disabled={loading}>{loading?'Signing in…':'Sign in'}</button></form><p className="muted small">New to Recurrify? <Link href="/register">Create an account</Link></p></section></main>
}
