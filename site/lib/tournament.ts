export type Game = { id: string; pool: string[]; choices: string[] };
export const SET_VERSION = '2026-v1-63';
export function draw(ids: string[], size: number, random = Math.random) {
  if (![16,32].includes(size) || ids.length < size) throw new Error('지원하지 않는 라운드입니다.');
  const pool = [...ids];
  for (let i=pool.length-1;i>0;i--) { const j=Math.floor(random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]; }
  return pool.slice(0,size);
}
export function replay(pool: string[], choices: string[]) {
  if (![16,32].includes(pool.length) || new Set(pool).size!==pool.length || choices.length>pool.length-1) throw new Error('잘못된 대진입니다.');
  let queue=[...pool], next: string[]=[], index=0;
  const summary=Object.fromEntries(pool.map(id=>[id,{id,appearances:1,battles:0,wins:0,champions:0}]));
  for (const choice of choices) {
    const a=queue[index],b=queue[index+1];
    if (!b || (choice!==a && choice!==b)) throw new Error('유효하지 않은 선택입니다.');
    summary[a].battles++; summary[b].battles++; summary[choice].wins++;
    next.push(choice);index+=2;
    if(index===queue.length){queue=next;next=[];index=0;}
  }
  const winner=queue.length===1?queue[0]:null;
  if(winner)summary[winner].champions=1;
  return {pair:winner?[]:queue.slice(index,index+2),round:queue.length,match:index/2+1,winner,summary:Object.values(summary)};
}
