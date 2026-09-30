export function parseCsv(input: string) {
  const rows:string[][]=[]; let row:string[]=[]; let cell=''; let quoted=false
  for(let i=0;i<input.length;i++) { const c=input[i]
    if(c==='"') { if(quoted && input[i+1]==='"'){cell+='"';i++} else quoted=!quoted }
    else if(c===',' && !quoted){row.push(cell.trim());cell=''}
    else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&input[i+1]==='\n')i++;row.push(cell.trim());cell='';if(row.some(Boolean))rows.push(row);row=[]}
    else cell+=c
  }
  if(cell.length||row.length){row.push(cell.trim());if(row.some(Boolean))rows.push(row)}
  if(!rows.length) return []
  const headers=rows[0].map(x=>x.toLowerCase().replace(/[^a-z0-9]+/g,'_'))
  return rows.slice(1).map((r,idx)=>({...Object.fromEntries(headers.map((h,i)=>[h,r[i]??''])), __row:idx+2}))
}
