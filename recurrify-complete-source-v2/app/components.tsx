'use client';
import Link from 'next/link';
import { useState } from 'react';
export const vendors=['AWS','Microsoft','Google','Slack','Zoom','Adobe','Canva','GitHub','Notion','Atlassian','HubSpot','Dropbox'];
export const departments=['Engineering','Marketing','Finance','Operations','HR','Sales'];
export const rows=[
 ['2026-09-28','AWS','Cloud infrastructure','$4,820','Engineering','Monthly'],['2026-09-27','Adobe Creative Cloud','Design software','$1,440','Marketing','Annual'],['2026-09-26','GitHub Enterprise','Developer tools','$3,600','Engineering','Annual'],['2026-09-25','Zoom Business','Video meetings','$1,920','Operations','Annual'],['2026-09-24','HubSpot Pro','CRM','$7,200','Sales','Annual'],['2026-09-22','Microsoft 365','Productivity','$2,460','Finance','Annual'],['2026-09-20','Slack','Collaboration','$1,180','Engineering','Monthly'],['2026-09-18','Notion','Knowledge management','$720','Operations','Annual']
];
export function PageHeader({title,description,action}:{title:string;description:string;action?:React.ReactNode}){return <div className="toolbar" style={{marginBottom:22}}><div><h1 className="title">{title}</h1><div className="muted">{description}</div></div>{action}</div>}
export function Table({headers,data}:{headers:string[];data:string[][]}){return <div className="card table-wrap"><table className="table"><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{data.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j}>{c}</td>)}</tr>)}</tbody></table></div>}
export function FilterBar(){const [q,setQ]=useState('');return <div className="card" style={{marginBottom:16,display:'flex',gap:10,flexWrap:'wrap'}}><input className="search" placeholder="Search vendors, descriptions..." value={q} onChange={e=>setQ(e.target.value)}/><select className="search"><option>All departments</option>{departments.map(x=><option key={x}>{x}</option>)}</select><select className="search"><option>All categories</option><option>Software</option><option>Cloud</option><option>Operations</option></select><button className="btn">Export</button></div>}
export function StatCards({items}:{items:string[][]}){return <div className="grid kpis">{items.map((x,i)=><div className="card" key={i}><div className="kpi-label">{x[0]}</div><div className="kpi">{x[1]}</div><div className="muted" style={{fontSize:12,marginTop:6}}>{x[2]}</div></div>)}</div>}
