import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {draw,replay} from '../lib/tournament.ts';
const movements=JSON.parse(readFileSync(new URL('../lib/movements.json',import.meta.url)));
const ids=movements.map(m=>m.id);
test('approved 64 movements and artwork are complete',()=>{
 assert.equal(movements.length,64);assert.equal(new Set(ids).size,64);
 const doc=readFileSync(new URL('../../docs/MOVEMENT-CANDIDATES.md',import.meta.url),'utf8');
 const expected=doc.split('\n').filter(l=>l.startsWith('- [x] ')).map(l=>l.slice(6).split(' — ')[0].split(' (')[0]);
 assert.deepEqual(movements.map(m=>m.name),expected);
 for(const m of movements)assert.ok(existsSync(new URL('../public'+m.image,import.meta.url)),m.name);
});
for(const size of [16,32])test(`${size} bracket completes with correct denominators`,()=>{
 for(let trial=0;trial<50;trial++){
  const pool=draw(ids,size);assert.equal(new Set(pool).size,size);
  const choices=[];let state=replay(pool,choices);
  while(!state.winner){assert.equal(state.pair.length,2);choices.push(state.pair[trial%2]);state=replay(pool,choices);}
  assert.equal(choices.length,size-1);
  assert.equal(state.summary.reduce((s,r)=>s+r.battles,0),2*(size-1));
  assert.equal(state.summary.reduce((s,r)=>s+r.wins,0),size-1);
  assert.equal(state.summary.reduce((s,r)=>s+r.champions,0),1);
  assert.ok(state.summary.every(r=>r.appearances===1));
  const champion=state.summary.find(r=>r.id===state.winner);
  assert.equal(champion.wins,Math.log2(size));
 }
});
test('rejects forged choices, invalid pool sizes and duplicate entrants',()=>{
 const pool=draw(ids,16);
 assert.throws(()=>replay(pool,['not-a-candidate']));
 assert.throws(()=>replay(pool,[pool[2]]));
 assert.throws(()=>replay([...pool.slice(1),pool[1]],[]));
 assert.throws(()=>draw(ids,64));
 assert.throws(()=>replay(ids.slice(0,8),[]));
});
test('restoring partial choices gives the same round and pair',()=>{
 const pool=draw(ids,32);const choices=[];
 for(let i=0;i<19;i++)choices.push(replay(pool,choices).pair[i%2]);
 const original=replay(pool,choices);
 const restored=JSON.parse(JSON.stringify({pool,choices}));
 assert.deepEqual(replay(restored.pool,restored.choices),original);
 assert.equal(original.round,16);
 assert.equal(original.match,4);
});
