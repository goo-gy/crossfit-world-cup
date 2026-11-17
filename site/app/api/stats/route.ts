import { env } from 'cloudflare:workers';
import { SET_VERSION } from '@/lib/tournament';
export async function GET(){
 try {
  if(!env.DB)throw new Error('DB unavailable');
  const rows=await env.DB.prepare(`SELECT json_extract(j.value,'$.id') AS id, SUM(json_extract(j.value,'$.appearances')) AS appearances, SUM(json_extract(j.value,'$.battles')) AS battles, SUM(json_extract(j.value,'$.wins')) AS wins, SUM(json_extract(j.value,'$.champions')) AS champions FROM games g, json_each(g.summary) j WHERE g.completed_at IS NOT NULL AND g.version = ? GROUP BY json_extract(j.value,'$.id')`).bind(SET_VERSION).all();
  const total=await env.DB.prepare('SELECT COUNT(*) AS total FROM games WHERE completed_at IS NOT NULL AND version = ?').bind(SET_VERSION).first<{total:number}>();
  return Response.json({total:total?.total??0,rows:rows.results},{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'통계를 불러오지 못했어요.'},{status:503});}
}
