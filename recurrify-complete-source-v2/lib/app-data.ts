import { createClient } from './supabase/server'

export async function getAppContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null, organization: null, membership: null }
  const { data: membership } = await supabase.from('organization_members').select('organization_id, role').eq('user_id', user.id).limit(1).maybeSingle()
  if (!membership) return { supabase, user, organization: null, membership: null }
  const { data: organization } = await supabase.from('organizations').select('*').eq('id', membership.organization_id).single()
  return { supabase, user, organization, membership }
}

export async function requireAppContext() {
  const ctx = await getAppContext()
  if (!ctx.user) throw new Error('UNAUTHENTICATED')
  if (!ctx.organization) throw new Error('NO_ORGANIZATION')
  return ctx as typeof ctx & { user: NonNullable<typeof ctx.user>; organization: NonNullable<typeof ctx.organization>; membership: NonNullable<typeof ctx.membership> }
}

export function monthlyEquivalent(cost: number, frequency: string) {
  const f = frequency.toLowerCase()
  if (f.includes('annual') || f === 'yearly') return cost / 12
  if (f.includes('semi')) return cost / 6
  if (f.includes('quarter')) return cost / 3
  if (f.includes('week')) return cost * 52 / 12
  return cost
}
export function annualEquivalent(cost: number, frequency: string) { return monthlyEquivalent(cost, frequency) * 12 }
export function nextDate(date: string, frequency: string) {
  const d = new Date(`${date}T00:00:00Z`); const f = frequency.toLowerCase()
  if (f.includes('annual') || f === 'yearly') d.setUTCFullYear(d.getUTCFullYear()+1)
  else if (f.includes('semi')) d.setUTCMonth(d.getUTCMonth()+6)
  else if (f.includes('quarter')) d.setUTCMonth(d.getUTCMonth()+3)
  else if (f.includes('week')) d.setUTCDate(d.getUTCDate()+7)
  else d.setUTCMonth(d.getUTCMonth()+1)
  return d.toISOString().slice(0,10)
}

export function recurringScore(items: {date:string; amount:number; description:string; vendor:string}[]) {
  if (items.length < 2) return { confidence: 0, frequency: 'custom', avg: items[0]?.amount ?? 0 }
  const sorted = [...items].sort((a,b)=>a.date.localeCompare(b.date))
  const gaps = sorted.slice(1).map((x,i)=>Math.max(1,Math.round((Date.parse(x.date)-Date.parse(sorted[i].date))/86400000)))
  const avgGap = gaps.reduce((a,b)=>a+b,0)/gaps.length
  const avg = sorted.reduce((a,b)=>a+b.amount,0)/sorted.length
  const variation = avg ? Math.min(1, sorted.reduce((s,x)=>s+Math.abs(x.amount-avg),0)/(sorted.length*avg)) : 1
  const frequency = avgGap <= 10 ? 'weekly' : avgGap <= 45 ? 'monthly' : avgGap <= 120 ? 'quarterly' : avgGap <= 240 ? 'semiannual' : 'annual'
  const frequencyScore = Math.max(0, 1 - Math.min(1, Math.abs(avgGap - ({weekly:7,monthly:30,quarterly:91,semiannual:182,annual:365}[frequency] as number))/120))
  const amountScore = 1-variation
  const confidence = Math.round((0.30*1 + 0.30*frequencyScore + 0.20*amountScore + 0.10*0.8 + 0.10*0.8)*100)
  return { confidence, frequency, avg }
}
