const B=(import.meta.env.VITE_API_URL||'http://localhost:5000').replace(/\/$/,'');
export async function api(path,o={}){
 const t=localStorage.getItem('mv_t');
 const r=await fetch(B+'/api'+path,{method:o.method||'GET',headers:{'Content-Type':'application/json',...(t&&{Authorization:'Bearer '+t})},body:o.body?JSON.stringify(o.body):undefined});
 const d=await r.json().catch(()=>({}));
 if(!r.ok)throw new Error(d.message||'Request failed');
 return d;
}
