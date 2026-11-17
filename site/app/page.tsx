'use client';
import { useEffect, useRef, useState } from 'react';
import movements from '@/lib/movements.json';
import { replay, SET_VERSION, type Game } from '@/lib/tournament';
import { apiErrorMessage, parseGame, parseStats, parseCompletedGame, type Stats } from '@/lib/api-contract';
const getMovement=(id:string)=>movements.find(m=>m.id===id)!;
const pct=(a:number,b:number)=>b?`${(a/b*100).toFixed(1)}%`:'—';
const storageKey=`worst-workout-game-${SET_VERSION}`;
async function api<T>(url:string,parse:(value:unknown)=>T,body?:unknown):Promise<T>{
 const response=await fetch(url,body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:undefined);
 const data:unknown=await response.json();
 if(!response.ok)throw new Error(apiErrorMessage(data));
 return parse(data);
}
function persist(game:Game|null){try{if(game)sessionStorage.setItem(storageKey,JSON.stringify(game));else sessionStorage.removeItem(storageKey);}catch{}}
export default function Home(){
 const [view,setView]=useState<'home'|'play'|'result'|'stats'|'candidates'|'shared'>('home');
 const [size,setSize]=useState(32),[game,setGame]=useState<Game|null>(null),[stats,setStats]=useState<Stats|null>(null),[error,setError]=useState(''),[busy,setBusy]=useState(false),[saved,setSaved]=useState(false),[shared,setShared]=useState<string|null>(null),[query,setQuery]=useState(''),[notice,setNotice]=useState('');
 const lock=useRef(false);
 const state=game?replay(game.pool,game.choices):null;
 async function loadStats(){try{setStats(await api('/api/stats',parseStats));}catch(e){setError((e as Error).message);}}
 async function finish(g:Game){setSaved(false);setError('');try{await api('/api/complete',parseCompletedGame,{id:g.id,choices:g.choices});setSaved(true);await loadStats();}catch(e){setError((e as Error).message);}}
 useEffect(()=>{let restored:Game|null=null;try{const raw=sessionStorage.getItem(storageKey);if(raw){const g=JSON.parse(raw);if(typeof g.id!=='string'||g.pool.some((id:string)=>!movements.some(m=>m.id===id)))throw Error();replay(g.pool,g.choices);restored=g;}}catch{persist(null);}
 const id=new URLSearchParams(location.search).get('pick');
 if(id&&movements.some(m=>m.id===id)){setShared(id);setView('shared');}
 else if(restored){setGame(restored);const done=replay(restored.pool,restored.choices).winner;setView(done?'result':'play');if(done)void finish(restored);}
 void loadStats();
 // Restore once; subsequent state belongs to the active game.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[]);
 async function start(){if(lock.current)return;lock.current=true;setBusy(true);setError('');try{const g=await api('/api/games',parseGame,{size});setGame(g);persist(g);setSaved(false);setView('play');history.replaceState(null,'',location.pathname);}catch(e){setError((e as Error).message);}finally{setBusy(false);lock.current=false;}}
 function choose(id:string){if(!game||lock.current||state?.winner)return;lock.current=true;const g={...game,choices:[...game.choices,id]};setGame(g);persist(g);if(replay(g.pool,g.choices).winner){setView('result');void finish(g);}setTimeout(()=>{lock.current=false;},300);}
 function home(){setError('');setNotice('');setView('home');history.replaceState(null,'',location.pathname);}
 async function share(id:string){const url=`${location.origin}/?pick=${encodeURIComponent(id)}`;try{await navigator.clipboard.writeText(url);setNotice('결과 링크를 복사했어요.');}catch{setNotice(`결과 링크: ${url}`);}}
 const sorted=(stats?.rows??[]).slice().sort((a,b)=>b.champions/b.appearances-a.champions/a.appearances||b.champions-a.champions||a.id.localeCompare(b.id));
 const champion=state?.winner?getMovement(state.winner):null;
 const championStats=stats?.rows.find(r=>r.id===champion?.id);
 function rankings(limit?:number){return <div className="rankings"><div className="table-head"><span>순위 / 동작</span><span>우승률</span><span>대결 승률</span></div>{sorted.length?sorted.slice(0,limit).map((row,i)=><div className="rank-row" key={row.id}><span className="rank-no">{String(i+1).padStart(2,'0')}</span><div className="rank-name">{getMovement(row.id)?.name}<small>{row.champions}회 우승 · {row.appearances}게임 포함</small></div><strong>{pct(row.champions,row.appearances)}</strong><span>{pct(row.wins,row.battles)}</span></div>):<div className="empty">{stats?'아직 완료된 게임이 없어요. 첫 번째 최악을 골라주세요.':'통계를 불러오는 중입니다.'}</div>}</div>}
 return <div className="site"><header className="header"><button className="brand" onClick={home} aria-label="시작 화면"><span className="brand-icon">W.</span><span>worst workout<span className="brand-sub">Community picks · 2026</span></span></button><nav aria-label="주 메뉴"><button className={view==='candidates'?'active':''} onClick={()=>{setView('candidates');setError('');}}>동작 도감 <span>{movements.length}</span></button><button className={view==='stats'?'active':''} onClick={()=>{setError('');setView('stats');void loadStats();}}>전체 랭킹 ↗</button></nav></header>
 {error&&<div role="alert" className="error">{error} <button onClick={()=>{if(view==='result'&&game)void finish(game);else void loadStats();}}>다시 시도</button></div>}
 {view==='home'&&<main className="home">
  <section className="hero-copy" aria-labelledby="hero-title">
   <p className="hero-eyebrow"><span className="dot"/> 2026 최악의 동작 월드컵 <span aria-hidden="true">→</span></p>
   <h1 id="hero-title">생각만 해도 숨찬 동작.<br/><span>최악은 당신이 정해요.</span></h1>
   <p className="muted intro">{movements.length}개의 크로스핏 동작 중, 나에게 더 힘든 동작을 골라보세요.<br/>마지막 선택이 끝나면 모두의 생각도 확인할 수 있어요.</p>
   <div className="start-panel">
    <div className="round-select" role="group" aria-label="라운드 선택">{[16,32].map(n=><button key={n} aria-pressed={size===n} className={size===n?'selected':''} onClick={()=>setSize(n)}>{n}강 <small>{n-1}번의 선택</small></button>)}</div>
    <div className="hero-actions"><button className="primary" disabled={busy} onClick={()=>void start()}>{busy?'대진 준비 중…':'나의 최악 고르기'}<span aria-hidden="true">→</span></button><button className="secondary" onClick={()=>{setView('candidates');setError('');}}>동작 둘러보기 <span aria-hidden="true">↗</span></button></div>
    <p className="micro">로그인 없이 바로 시작 <span aria-hidden="true">·</span> 약 {size===16?'2':'4'}분 소요</p>
    {game&&!state?.winner&&<button className="resume" onClick={()=>setView('play')}>진행 중인 게임 이어하기 →</button>}
   </div>
  </section>
  <section className="movement-preview" aria-labelledby="preview-title">
   <div className="preview-heading"><h2 id="preview-title">익숙한 동작도, 선택은 다르게.</h2><span>{movements.length} movements. Your perspective.</span></div>
   <div className="preview-grid">{[
    {id:'m017',label:'바벨을 드는 순간',description:'스쿼트에 프레스까지. 쉬는 틈 없는 한 동작.'},
    {id:'m049',label:'맨몸이면 충분해요',description:'아무 장비 없이도 충분히 숨찰 수 있으니까.'},
    {id:'m055',label:'끝나지 않는 유산소',description:'미터는 천천히, 심박수는 빠르게 올라가죠.'}
   ].map(item=>{const m=getMovement(item.id);return <article className="preview-card" key={item.id}><div className="preview-card-top"><span>{m.category}</span><span aria-hidden="true">↗</span></div><div className="preview-art"><img src={m.image} alt=""/></div><div className="preview-card-copy"><p>{item.label}</p><h3>{m.name}</h3><p className="muted">{item.description}</p></div></article>})}</div>
   <p className="preview-caption">무거운 무게부터 끝없는 반복까지. <span>당신만의 기준으로 골라주세요.</span></p>
  </section>
  <section className="home-bottom" aria-labelledby="rules-title">
   <div className="rules-intro"><p className="eyebrow">HOW IT WORKS</p><h2 id="rules-title">선택은 간단하게.<br/>취향은 확실하게.</h2><p className="muted">정답은 없어요. 나의 경험을 따라가 보세요.</p></div>
   <div className="steps"><p><b>01</b><span>두 동작을 비교하고</span></p><p><b>02</b><span>나에게 더 최악인 쪽을 선택</span></p><p><b>03</b><span>마지막에 모두의 선택 확인</span></p></div>
   <button className="stat-teaser" onClick={()=>{setView('stats');void loadStats();}}><small><span className="dot"/> COMMUNITY PICKS</small><strong>{stats?stats.total.toLocaleString():'—'}<span>개</span></strong><span className="stat-description">지금까지 완료한 게임</span><span className="stat-link">전체 랭킹 확인하기 <span aria-hidden="true">→</span></span></button>
  </section>
 </main>}
 {view==='play'&&game&&state&&!state.winner&&<main className="play"><div className="section-heading"><div><p className="eyebrow">PICK THE WORST</p><h1>{state.round===2?'결승':`${state.round}강`} <span>{state.match} / {state.round/2}</span></h1></div><span className="progress-label">{game.choices.length} / {game.pool.length-1} 선택</span></div><div className="progress"><div style={{width:`${game.choices.length/(game.pool.length-1)*100}%`}}/></div><p className="match-prompt" aria-live="polite">둘 중 나에게 <strong>더 최악인 동작</strong>은?</p><div className="arena" key={`${state.round}-${state.match}`}>{state.pair.map((id,i)=>{const m=getMovement(id);return <button className="movement-card" key={id} onClick={()=>choose(id)}><div className="card-meta"><span>{m.category}</span><span>0{i+1} ↗</span></div><img src={m.image} alt="" onError={e=>{e.currentTarget.style.visibility='hidden';}}/><div className="card-label"><h2>{m.name}</h2><span>선택하기 ↗</span></div></button>})}<span className="versus" aria-hidden="true">VS</span></div><p className="micro">선택한 동작이 다음 라운드로 진출합니다.</p></main>}
 {view==='result'&&champion&&<main className="result"><p className="eyebrow">YOUR WORST WORKOUT OF 2026</p><h1>나의 최악은,<br/><span>{champion.name}.</span></h1><div className="result-grid"><div className="winner-art"><span className="winner-badge">THE WORST #1</span><img src={champion.image} alt={champion.name}/></div><div className="result-info"><p className="eyebrow">THE COMMUNITY SAYS</p><h2>다른 사람들도<br/>같은 생각일까요?</h2><div className="metrics"><div><strong>{championStats?pct(championStats.champions,championStats.appearances):'—'}</strong><span>우승률</span></div><div><strong>{championStats?pct(championStats.wins,championStats.battles):'—'}</strong><span>대결 승률</span></div></div><p className="micro">{championStats?`${championStats.appearances}개 완료 게임에 포함 · ${championStats.champions}회 우승`:'완료 게임 통계를 확인하고 있습니다.'}</p><p className="save-status" role="status">{saved?'✓ 결과가 전체 통계에 반영됐어요.':error?'결과가 아직 저장되지 않았어요. 위에서 다시 시도해주세요.':'결과를 저장하고 있어요…'}</p><button className="primary" onClick={()=>void share(champion.id)}>내 최악 공유하기 <span>↗</span></button><button className="secondary" onClick={()=>{home();setGame(null);persist(null);}}>다시 고르기 ↻</button></div></div><section className="ranking-section"><p className="eyebrow">COMMUNITY RANKING</p><h2>모두가 뽑은 최악</h2>{rankings(5)}<button className="text-link" onClick={()=>setView('stats')}>전체 순위 보기 ↗</button></section></main>}
 {view==='shared'&&shared&&<main className="result shared"><p className="eyebrow">A WORST WORKOUT PICK</p><h1>친구가 고른 최악,<br/><span>{getMovement(shared).name}.</span></h1><img className="shared-img" src={getMovement(shared).image} alt={getMovement(shared).name}/><p className="muted">당신에게도 이 동작이 최악인가요?</p><button className="primary" onClick={home}>나의 최악 고르기 ↗</button></main>}
 {view==='stats'&&<main className="listing"><p className="eyebrow">COMMUNITY RANKING</p><div className="section-heading"><h1>모두의 최악<span>.</span></h1><span>{stats?.total??'—'}개 완료 게임</span></div><p className="muted">최악으로 선택된 동작들의 순위. 여러분의 선택이 쌓입니다.</p>{rankings()}<details className="stats-help"><summary>통계는 어떻게 계산하나요?</summary><p>우승률 = 최종 우승 횟수 ÷ 해당 동작이 포함된 완료 게임 수.<br/>대결 승률 = 선택된 대결 수 ÷ 해당 동작의 전체 대결 수.<br/>끝까지 완료한 게임만 반영하며, 재참여도 별도 게임으로 집계합니다. 사람 수를 세거나 사용자를 식별하지 않습니다. 우승률, 우승 횟수 순으로 정렬하며, 적은 표본과 무작위 대진에 영향을 받는 재미용 통계입니다.</p></details><button className="primary" onClick={home}>나도 골라보기 ↗</button></main>}
 {view==='candidates'&&<main className="listing"><p className="eyebrow">MOVEMENT LIBRARY</p><h1>{movements.length}개의 동작<span>.</span></h1><p className="muted">익숙한 동작부터 보기만 해도 숨찬 동작까지.</p><label className="search">동작 검색<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="예: 버피, 클린, 덤벨"/></label><div className="catalog">{movements.filter(m=>m.name.includes(query.trim())).map(m=><article key={m.id}><img loading="lazy" src={m.image} alt=""/><small>{m.category}</small><h2>{m.name}</h2></article>)}</div>{!movements.some(m=>m.name.includes(query.trim()))&&<p className="empty">검색 결과가 없습니다.</p>}</main>}
 {notice&&<div className="toast" role="status">{notice}<button aria-label="닫기" onClick={()=>setNotice('')}>×</button></div>}<footer><span>WORST WORKOUT CLUB © 2026</span><span>취향에는 정답이 없습니다. 최악에도.</span><small>팬이 만든 비공식 프로젝트 · CrossFit과 제휴하지 않습니다.</small></footer></div>
}
