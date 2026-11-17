import { getDb } from '@/db';
import { games } from '@/db/schema';
import movements from '@/lib/movements.json';
import { draw, SET_VERSION } from '@/lib/tournament';
import { parseGameSize } from '@/lib/api-contract';
export async function POST(request: Request) {
  try {
    let size: 16 | 32;
    try { size = parseGameSize(await request.json()); }
    catch { return Response.json({error:'16강 또는 32강을 선택해주세요.'},{status:400}); }
    const game={id:crypto.randomUUID(),pool:draw(movements.map(m=>m.id),size),choices:[]};
    await getDb().insert(games).values({id:game.id,version:SET_VERSION,pool:JSON.stringify(game.pool),createdAt:new Date().toISOString()});
    return Response.json(game,{headers:{'Cache-Control':'no-store'}});
  }catch {return Response.json({error:'게임을 시작하지 못했어요. 잠시 후 다시 시도해주세요.'},{status:503});}
}
