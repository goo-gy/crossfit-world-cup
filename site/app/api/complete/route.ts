import { getDb } from '@/db';
import { games } from '@/db/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { replay, SET_VERSION } from '@/lib/tournament';
import { parseCompletion } from '@/lib/api-contract';
export async function POST(request: Request) {
  try {
    if(Number(request.headers.get('content-length'))>10000)return Response.json({error:'요청이 너무 큽니다.'},{status:413});
    let input: ReturnType<typeof parseCompletion>;
    try { input = parseCompletion(await request.json()); }
    catch { return Response.json({error:'잘못된 결과입니다.'},{status:400}); }
    const {id, choices} = input;
    const db=getDb();
    const [game]=await db.select().from(games).where(eq(games.id,id)).limit(1);
    if(!game||game.version!==SET_VERSION)return Response.json({error:'게임을 찾을 수 없습니다.'},{status:404});
    const result=replay(JSON.parse(game.pool),choices);
    if(!result.winner)return Response.json({error:'아직 완료되지 않은 게임입니다.'},{status:400});
    if(game.completedAt){
      if(game.choices!==JSON.stringify(choices))return Response.json({error:'이미 다른 결과로 완료된 게임입니다.'},{status:409});
      return Response.json({winner:game.winner});
    }
    const updated=await db.update(games).set({choices:JSON.stringify(choices),summary:JSON.stringify(result.summary),winner:result.winner,completedAt:new Date().toISOString()}).where(and(eq(games.id,id),isNull(games.completedAt))).returning({id:games.id});
    if(!updated.length){
      const [saved]=await db.select().from(games).where(eq(games.id,id)).limit(1);
      if(saved.choices!==JSON.stringify(choices))return Response.json({error:'이미 완료된 게임입니다.'},{status:409});
    }
    return Response.json({winner:result.winner});
  }catch(error){
    if(error instanceof Error&&/대진|선택/.test(error.message))return Response.json({error:error.message},{status:400});
    return Response.json({error:'결과 저장에 실패했어요. 다시 시도해주세요.'},{status:503});
  }
}
