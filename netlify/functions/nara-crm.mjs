import {getStore,getDeployStore} from "@netlify/blobs";
export default async function handler(req,context){
 if(req.method!=="GET")return Response.json({error:"Method not allowed"},{status:405});
 const expected=Netlify.env.get("NARA_CRM_ADMIN_TOKEN");
 const supplied=(req.headers.get("authorization")||"").replace(/^Bearer /i,"");
 if(!expected||!supplied||supplied.length!==expected.length){return Response.json({error:"Unauthorized"},{status:401,headers:{"Cache-Control":"no-store"}})}
 const a=new TextEncoder().encode(expected),b=new TextEncoder().encode(supplied);let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];if(diff)return Response.json({error:"Unauthorized"},{status:401});
 try{
 const deploymentContext=Netlify.env.get("CONTEXT")||process.env.CONTEXT||context?.deploy?.context||"";
 const store=deploymentContext==="production"?getStore({name:"nara-leads-production",consistency:"strong"}):getDeployStore("nara-leads-preview");
 const result=await store.list({prefix:"lead/"});const keys=result.blobs.slice(0,100).map(x=>x.key);
 const leads=(await Promise.all(keys.map(key=>store.get(key,{type:"json"})))).filter(Boolean).sort((a,b)=>b.created_at.localeCompare(a.created_at));
 return Response.json({leads,returned:leads.length,limited:result.blobs.length>100},{headers:{"Cache-Control":"no-store"}});
 }catch(e){console.error("NARA CRM read error",e?.name);return Response.json({error:"CRM belum tersedia"},{status:503})}
}
export const config={rateLimit:{action:"rate_limit",aggregateBy:"ip",windowSize:60,windowLimit:20}};
