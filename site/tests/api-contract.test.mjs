import test from 'node:test';
import assert from 'node:assert/strict';
import { parseGameSize, parseCompletion, parseGame, parseStats, parseCompletedGame, apiErrorMessage } from '../lib/api-contract.ts';

test('unknown request bodies reject null, arrays and malformed fields',()=>{
 for(const body of [null,undefined,[],{},'invalid',{size:'32'},{size:64}])assert.throws(()=>parseGameSize(body));
 assert.equal(parseGameSize({size:16}),16);
 assert.equal(parseGameSize({size:32}),32);
 for(const body of [null,[],{}, {id:'g',choices:[1]}, {id:'g',choices:Array(32).fill('m001')}])assert.throws(()=>parseCompletion(body));
 assert.deepEqual(parseCompletion({id:'g',choices:['m001']}),{id:'g',choices:['m001']});
});
test('valid game responses narrow unknown into usable game state',()=>{
 const value={id:'game',pool:Array.from({length:16},(_,i)=>`m${i}`),choices:[]};
 assert.deepEqual(parseGame(value),value);
 for(const body of [null,{}, {...value,pool:Array(16).fill('m1')}, {...value,choices:[false]}])assert.throws(()=>parseGame(body));
});
test('stats supports empty results and rejects invalid numeric counters',()=>{
 assert.deepEqual(parseStats({total:0,rows:[]}),{total:0,rows:[]});
 const row={id:'m001',appearances:1,battles:4,wins:4,champions:1};
 assert.deepEqual(parseStats({total:1,rows:[row]}),{total:1,rows:[row]});
 for(const body of [null,{total:'1',rows:[]},{total:1,rows:[{...row,appearances:0}]},{total:1,rows:[{...row,wins:5}]}])assert.throws(()=>parseStats(body));
});
test('completion and errors handle unknown JSON safely',()=>{
 assert.deepEqual(parseCompletedGame({winner:'m001'}),{winner:'m001'});
 assert.throws(()=>parseCompletedGame({winner:null}));
 assert.equal(apiErrorMessage({error:'실패'}),'실패');
 for(const body of [null,[],{}, {error:123}])assert.equal(apiErrorMessage(body),'연결을 확인해주세요.');
});
