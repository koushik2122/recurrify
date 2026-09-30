import { NextResponse } from 'next/server'
import { requireAppContext } from '@/lib/app-data'
import { parseCsv } from '@/lib/csv'

export async function POST(request: Request) {
  try {
    const { supabase, organization } = await requireAppContext()
    const body = await request.json(); const csv = String(body.csv || '')
    if (!csv || csv.length > 5_000_000) return NextResponse.json({error:'CSV is missing or too large.'},{status:400})
    const rows = parseCsv(csv); const valid:any[]=[]; const invalid:any[]=[]
    for (const r of rows) {
      const date = r.date || r.transaction_date || r.transactiondate
      const description = r.description || r.memo || r.details || ''
      const vendor = r.vendor || r.merchant || r.payee || description || 'Unknown'
      const amount = Number(String(r.amount || r.value || '').replace(/[^0-9.-]/g,''))
      if(!date || Number.isNaN(Date.parse(date)) || !description || !Number.isFinite(amount) || amount < 0) { invalid.push(r); continue }
      valid.push({date,description,vendor,amount,currency:(r.currency||'INR').toUpperCase(),payment_method:r.payment_method||r.paymentmethod||null,category:r.category||null,department:r.department||null})
    }
    const { data: depts } = await supabase.from('departments').select('id,name').eq('organization_id',organization.id)
    const deptMap = new Map((depts||[]).map(d=>[d.name.toLowerCase(),d.id]))
    const vendorCache = new Map<string,string>()
    const inserts=[]
    for (const r of valid) {
      const key=r.vendor.trim().toLowerCase(); let vendorId=vendorCache.get(key)
      if(!vendorId){ const existing=await supabase.from('vendors').select('id').eq('organization_id',organization.id).eq('normalized_name',key).maybeSingle(); vendorId=existing.data?.id
        if(!vendorId){ const created=await supabase.from('vendors').insert({organization_id:organization.id,name:r.vendor.trim(),normalized_name:key}).select('id').single(); if(created.error) throw created.error; vendorId=created.data.id }
        vendorCache.set(key,vendorId)
      }
      inserts.push({organization_id:organization.id,department_id:r.department?deptMap.get(r.department.toLowerCase())||null:null,vendor_id:vendorId,transaction_date:r.date,description:r.description,amount:r.amount,currency:r.currency,payment_method:r.payment_method,category:r.category})
    }
    for(let i=0;i<inserts.length;i+=200){const {error}=await supabase.from('transactions').insert(inserts.slice(i,i+200));if(error)throw error}
    const origin = new URL(request.url).origin; await fetch(`${origin}/api/recurring/detect`, {method:'POST', headers:{cookie:request.headers.get('cookie')||''}})
    return NextResponse.json({imported:valid.length,invalid:invalid.length,invalidRows:invalid.slice(0,50)})
  } catch(e:any) { const status=e?.message==='UNAUTHENTICATED'?401:500; return NextResponse.json({error:e?.message||'Import failed'},{status}) }
}
