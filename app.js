'use strict';
/* FocusGrove v2 — original free focus app. All logic & artwork written from scratch. */
const SPECIES=[
 {id:'oak',name:'Oak',cost:0,shape:'round',c1:'#16a34a',c2:'#22c55e'},
 {id:'pine',name:'Pine',cost:0,shape:'pine',c1:'#15803d',c2:'#166534'},
 {id:'bamboo',name:'Bamboo',cost:30,shape:'bamboo',c1:'#4d7c0f',c2:'#65a30d'},
 {id:'sunflower',name:'Sunflower',cost:40,shape:'flower',c1:'#eab308',c2:'#facc15'},
 {id:'cherry',name:'Cherry Blossom',cost:50,shape:'round',c1:'#f472b6',c2:'#f9a8d4'},
 {id:'palm',name:'Palm',cost:50,shape:'palm',c1:'#65a30d',c2:'#84cc16'},
 {id:'cactus',name:'Cactus',cost:60,shape:'cactus',c1:'#16a34a',c2:'#4ade80'},
 {id:'maple',name:'Maple',cost:80,shape:'round',c1:'#ea580c',c2:'#f97316'},
 {id:'willow',name:'Willow',cost:100,shape:'willow',c1:'#65a30d',c2:'#a3e635'},
 {id:'bonsai',name:'Bonsai',cost:150,shape:'round',c1:'#15803d',c2:'#86efac'},
 {id:'lavender',name:'Lavender',cost:120,shape:'flower',c1:'#a855f7',c2:'#c084fc'},
 {id:'sequoia',name:'Sequoia',cost:200,shape:'pine',c1:'#166534',c2:'#14532d'}];
const SCENES=[{id:'meadow',name:'Meadow',cost:0},{id:'sunset',name:'Sunset',cost:100},{id:'snow',name:'Snow',cost:100},{id:'desert',name:'Desert',cost:100}];
const QUOTES=['Small roots, deep focus.','Grow slow, grow steady.','One quiet minute at a time.','Your future self is watching this tree grow.','Attention is sunlight. Spend it well.','Stillness is a kind of strength.','Plant today, shade tomorrow.','Begin small. Finish proud.'];
const ACH=[
 {id:'first',icon:'🌱',name:'First Sprout',desc:'Grow your first tree',test:c=>c.done.length>=1},
 {id:'ten',icon:'🌳',name:'Grove Keeper',desc:'Grow 10 trees',test:c=>c.done.length>=10},
 {id:'fifty',icon:'🌲',name:'Forest Builder',desc:'Grow 50 trees',test:c=>c.done.length>=50},
 {id:'hundred',icon:'🏞️',name:'Hundred Club',desc:'Grow 100 trees',test:c=>c.done.length>=100},
 {id:'hour',icon:'⏰',name:'One Focused Hour',desc:'100 total focus minutes',test:c=>c.totalMin>=100},
 {id:'thousand',icon:'☀️',name:'Thousand Minutes',desc:'1,000 total focus minutes',test:c=>c.totalMin>=1000},
 {id:'marathon',icon:'🏃',name:'Marathon Mind',desc:'Complete a 90+ minute session',test:c=>c.maxSession>=90},
 {id:'streak3',icon:'🔥',name:'3-Day Streak',desc:'Focus 3 days in a row',test:c=>c.streak>=3},
 {id:'streak7',icon:'🔥',name:'7-Day Streak',desc:'Focus 7 days in a row',test:c=>c.streak>=7},
 {id:'diverse',icon:'🎨',name:'Diverse Grove',desc:'Grow 5 different species',test:c=>c.speciesSet.size>=5},
 {id:'early',icon:'🌅',name:'Early Bird',desc:'Finish a session before 8am',test:c=>c.early},
 {id:'night',icon:'🦉',name:'Night Owl',desc:'Finish a session after 10pm',test:c=>c.late},
 {id:'perfect',icon:'💯',name:'Perfect Ten',desc:'10 grown trees with no withered ones',test:c=>c.done.length>=10&&c.dead.length===0},
 {id:'goal',icon:'🎯',name:'Goal Getter',desc:'Hit your daily goal in one day',test:c=>c.bestDay>=c.goal}];
const KEY='focusgrove.v1';
function defaults(){return{sessions:[],points:0,unlocked:['oak','pine'],scenes:['meadow'],scene:'meadow',goal:120,dark:false,notify:false,allowlist:'',friends:['You'],room:[],roomCode:'',awards:{}};}
let store=Object.assign(defaults(),loadRaw());
function loadRaw(){try{return JSON.parse(localStorage.getItem(KEY))||{};}catch{return{};}}
function save(){localStorage.setItem(KEY,JSON.stringify(store));}
function $(id){return document.getElementById(id);}
let selectedMin=25,selectedSpecies='oak',mode='timer',timer=null,endAt=0,startAt=0,totalSec=0,current=null,lastSessionId=null,breakTimer=null,hiddenAt=0,deferredInstall=null,roomSel=new Set(store.room.length?store.room:['You']);

/* ---- original SVG artwork by shape & growth stage ---- */
function treeSVG(sp,stage,dead,small){
 const s=typeof sp==='string'?SPECIES.find(x=>x.id===sp)||SPECIES[0]:sp;
 const c1=dead?'#9ca3af':s.c1,c2=dead?'#6b7280':s.c2,trunk=dead?'#78716c':'#92400e';
 const W=small?52:150,H=small?62:180;
 if(stage===0)return `<svg width="${W}" height="${H}" viewBox="0 0 150 180"><ellipse cx="75" cy="158" rx="34" ry="9" fill="#bbf7d0"/><ellipse cx="75" cy="150" rx="13" ry="9" fill="${trunk}"/><path d="M75 148 q4 -14 12 -18" stroke="#16a34a" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;
 if(stage===1)return `<svg width="${W}" height="${H}" viewBox="0 0 150 180"><ellipse cx="75" cy="162" rx="38" ry="9" fill="#bbf7d0"/><path d="M75 160 L75 118" stroke="${trunk}" stroke-width="7" stroke-linecap="round"/><ellipse cx="62" cy="112" rx="15" ry="9" fill="${c1}" transform="rotate(-25 62 112)"/><ellipse cx="89" cy="104" rx="15" ry="9" fill="${c2}" transform="rotate(25 89 104)"/></svg>`;
 const h=[0,0,86,64,40][stage],r=[0,0,26,40,54][stage];let top='';
 if(s.shape==='pine')top=`<path d="M75 ${h-38} L${75+r} ${h+42} L${75-r} ${h+42} Z" fill="${c1}"/><path d="M75 ${h-14} L${75+r+8} ${h+66} L${75-r-8} ${h+66} Z" fill="${c2}"/>`;
 else if(s.shape==='palm')top=`<path d="M75 ${h} q-44 -26 -58 4 M75 ${h} q-20 -38 8 -46 M75 ${h} q30 -30 48 -6 M75 ${h} q44 -8 44 18" stroke="${c1}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
 else if(s.shape==='bamboo')top=`<path d="M58 165 L58 ${h+10} M75 165 L75 ${h-8} M92 165 L92 ${h+16}" stroke="${c1}" stroke-width="9" stroke-linecap="round"/><path d="M58 ${h+34} h34 M75 ${h+10} h30" stroke="${c2}" stroke-width="5"/>`;
 else if(s.shape==='cactus')top=`<path d="M75 165 L75 ${h+6} M75 ${h+52} q-24 0 -24 -22 M99 ${h+66} q24 0 24 -26" stroke="${c1}" stroke-width="13" fill="none" stroke-linecap="round"/>`;
 else if(s.shape==='flower')top=`<circle cx="75" cy="${h+16}" r="${r*0.55}" fill="${c2}"/><circle cx="75" cy="${h+16}" r="${r*0.28}" fill="${c1}"/><path d="M75 165 L75 ${h+24}" stroke="#16a34a" stroke-width="7" stroke-linecap="round"/>`;
 else if(s.shape==='willow')top=`<circle cx="75" cy="${h+14}" r="${r*0.8}" fill="${c1}"/><path d="M45 ${h+24} q-4 34 6 52 M75 ${h+30} q0 36 4 54 M105 ${h+24} q4 34 -6 52" stroke="${c2}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
 else top=`<circle cx="75" cy="${h+18}" r="${r}" fill="${c1}"/><circle cx="${75-r+8}" cy="${h+38}" r="${r*0.68}" fill="${c2}"/><circle cx="${75+r-8}" cy="${h+38}" r="${r*0.68}" fill="${c1}"/>`;
 const trunkLine=s.shape==='flower'||s.shape==='bamboo'||s.shape==='cactus'?'':`<path d="M75 165 L75 ${h+30}" stroke="${trunk}" stroke-width="9" stroke-linecap="round"/>`;
 return `<svg width="${W}" height="${H}" viewBox="0 0 150 180"><ellipse cx="75" cy="166" rx="44" ry="9" fill="#bbf7d0"/>${trunkLine}${top}</svg>`;
}

/* ---- generative ambient sound (no audio files, all synthesized) ---- */
let AC=null,soundNodes=[];
function stopSound(){soundNodes.forEach(n=>{try{n.stop&&n.stop();}catch{} try{n.disconnect&&n.disconnect();}catch{}});soundNodes=[];if(window._birdInt){clearInterval(window._birdInt);window._birdInt=null;}}
function startSound(type){
 stopSound(); if(type==='none')return;
 try{
  AC=AC||new(window.AudioContext||window.webkitAudioContext)();
  if(type==='forest'){window._birdInt=setInterval(()=>{if(!timer)return;const o=AC.createOscillator(),g=AC.createGain();o.type='sine';const t=AC.currentTime;o.frequency.setValueAtTime(2200+Math.random()*1200,t);o.frequency.exponentialRampToValueAtTime(3200,t+.12);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.06,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+.2);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+.22);},2600);return;}
  const len=2*AC.sampleRate,buf=AC.createBuffer(1,len,AC.sampleRate),d=buf.getChannelData(0);let last=0;
  for(let i=0;i<len;i++){const w=Math.random()*2-1; if(type==='white'){d[i]=w*.25;}else{last=(last+.02*w)/1.02;d[i]=last*3.2;}}
  const src=AC.createBufferSource();src.buffer=buf;src.loop=true;
  const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=type==='rain'?900:type==='ocean'?500:400;
  const g=AC.createGain();g.gain.value=type==='cafe'?.12:.2;
  if(type==='ocean'){const lfo=AC.createOscillator(),lg=AC.createGain();lfo.frequency.value=.12;lg.gain.value=.1;lfo.connect(lg);lg.connect(g.gain);lfo.start();soundNodes.push(lfo);}
  src.connect(f);f.connect(g);g.connect(AC.destination);src.start();soundNodes.push(src);
 }catch{}
}
function chime(){try{const ctx=AC||new(window.AudioContext||window.webkitAudioContext)();[523,659,784].forEach((fr,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=fr;o.connect(g);g.connect(ctx.destination);g.gain.setValueAtTime(.12,ctx.currentTime+i*.15);o.start(ctx.currentTime+i*.15);o.stop(ctx.currentTime+i*.15+.25);});}catch{}}

/* ---- tabs ---- */
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.panel').forEach(p=>p.hidden=p.id!=='panel-'+b.dataset.tab);renderAll();});

/* ---- setup controls ---- */
$('modeChips').querySelectorAll('.chip').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;$('modeChips').querySelectorAll('.chip').forEach(x=>x.classList.toggle('active',x===b));$('durationBlock').style.display=mode==='timer'?'block':'none';renderIdle();});
$('durationChips').querySelectorAll('.chip').forEach(b=>b.onclick=()=>{selectedMin=+b.dataset.min;$('customMin').value='';$('durationChips').querySelectorAll('.chip').forEach(x=>x.classList.toggle('active',x===b));renderIdle();});
$('customMin').addEventListener('input',e=>{const v=+e.target.value;if(v>0){selectedMin=v;$('durationChips').querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));renderIdle();}});
function renderSpecies(){
 $('speciesChips').innerHTML='';
 SPECIES.forEach(sp=>{const un=store.unlocked.includes(sp.id);const b=document.createElement('button');b.className='chip'+(sp.id===selectedSpecies?' active':'')+(un?'':' locked');b.textContent=(un?'':'🔒 ')+sp.name+(un?'':` · ☀️${sp.cost}`);b.onclick=()=>{if(!un){alert(`${sp.name} is in the Grove shop — unlock it with ☀️${sp.cost} sunlight points earned by focusing. No money, ever.`);return;}selectedSpecies=sp.id;renderSpecies();renderIdle();};$('speciesChips').appendChild(b);});
 const sp=SPECIES.find(s=>s.id===selectedSpecies);$('speciesHint').textContent=store.unlocked.includes(sp.id)?`${sp.name} selected.`:`Locked — unlock in Grove → Shop.`;
}
function fmt(sec){sec=Math.max(0,Math.round(sec));return String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0');}
function renderTree(p){const stage=p<=0?0:p<.3?1:p<.6?2:p<.9?3:4;$('treeStage').innerHTML=treeSVG(current?current.species:selectedSpecies,stage,false);}
function renderIdle(){$('timerText').textContent=mode==='timer'?fmt(selectedMin*60):'00:00';$('quoteText').textContent='';renderTree(0);}

/* ---- planting / timer ---- */
$('plantBtn').onclick=()=>{
 const custom=+$('customMin').value;const mins=mode==='timer'?(custom>0?custom:selectedMin):0;
 current={species:selectedSpecies,tag:$('tagSelect').value,note:$('noteInput').value.trim(),minutes:mins,mode,participants:[...roomSel],startedAt:new Date().toISOString()};
 startAt=Date.now();totalSec=mins*60;endAt=startAt+totalSec*1000;
 $('setupPanel').hidden=true;$('runningPanel').hidden=false;$('breakPanel').hidden=true;$('diaryPanel').hidden=true;
 $('finishEarlyBtn').hidden=mode!=='stopwatch';
 $('quoteText').textContent='“'+QUOTES[Math.floor(Math.random()*QUOTES.length)]+'”';
 $('statusText').textContent=`Growing your ${SPECIES.find(s=>s.id===selectedSpecies).name} — ${current.tag}${current.participants.length>1?' · with '+current.participants.join(', '):''}${$('deepFocus').checked&&store.allowlist?' · Allowed apps: '+store.allowlist:''}`;
 startSound($('soundSelect').value);timer=setInterval(tick,250);tick();
};
function elapsedSec(){return (Date.now()-startAt)/1000;}
function tick(){
 if(mode==='timer'){const left=(endAt-Date.now())/1000;$('timerText').textContent=fmt(left);renderTree(1-left/totalSec);if(left<=0)finish(true);}
 else{const el=elapsedSec();$('timerText').textContent=fmt(el);renderTree(Math.min(el/3600,1));$('finishEarlyBtn').textContent=el>=600?'Finish & grow tree (stopwatch)':`Finish & grow tree — ${Math.ceil(600-el)}s to minimum`;$('finishEarlyBtn').disabled=el<600;}
}
$('finishEarlyBtn').onclick=()=>{if(elapsedSec()>=600)finish(true);};
$('giveUpBtn').onclick=()=>{if($('deepFocus').checked&&!confirm('Deep focus is on. Giving up will wither this tree. Really sure?'))return;if(!confirm('Give up? This tree will wither.'))return;finish(false);};
document.addEventListener('visibilitychange',()=>{if(!timer)return;if(document.hidden){hiddenAt=Date.now();}else if($('strictFocus').checked&&hiddenAt&&(Date.now()-hiddenAt)>10000){$('statusText').textContent='Strict mode: you left for over 10 seconds.';finish(false);}});
window.addEventListener('beforeunload',e=>{if(timer){e.preventDefault();e.returnValue='';}});
function finish(completed){
 clearInterval(timer);timer=null;stopSound();
 const mins=mode==='timer'?current.minutes:Math.floor(elapsedSec()/60);
 const planned=mode==='timer'?current.minutes:Math.max(mins,10);
 const sess={id:Date.now(),date:new Date().toISOString(),minutes:completed?mins:Math.floor(elapsedSec()/60),planned,species:current.species,tag:current.tag,note:current.note,reflection:'',completed,participants:current.participants,mode:current.mode};
 store.sessions.unshift(sess);lastSessionId=sess.id;
 if(completed){store.points+=mins;$('treeStage').innerHTML=treeSVG(current.species,4,false);$('statusText').textContent=`🎉 Fully grown and added to your grove! +${mins} ☀️`;$('diaryPanel').hidden=false;$('breakPanel').hidden=false;chime();if(store.notify&&'Notification' in window&&Notification.permission==='granted')new Notification('FocusGrove 🌳',{body:'Your tree is fully grown. Great focus!'});}
 else{$('treeStage').innerHTML=treeSVG(current.species,3,true);$('statusText').textContent='This tree withered. No shame — plant another when ready.';}
 current=null;$('setupPanel').hidden=false;$('runningPanel').hidden=true;save();checkAwards();renderAll();
}
$('diarySaveBtn').onclick=()=>{const s=store.sessions.find(x=>x.id===lastSessionId);if(s){s.reflection=$('diaryInput').value.trim();save();renderAll();}$('diaryPanel').hidden=true;$('statusText').textContent='Reflection saved to your timeline. 📝';};
let breakLeft=300;
$('breakBtn').onclick=()=>{breakLeft=300;$('breakText').textContent=fmt(breakLeft);clearInterval(breakTimer);breakTimer=setInterval(()=>{breakLeft--;$('breakText').textContent=fmt(breakLeft);if(breakLeft<=0){clearInterval(breakTimer);$('breakText').textContent='Break over — ready to plant again?';chime();}},1000);};
$('breakSkipBtn').onclick=()=>{clearInterval(breakTimer);$('breakPanel').hidden=true;};

/* ---- helpers / stats ---- */
function sameDay(a,b){return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();}
function doneList(){return store.sessions.filter(s=>s.completed);}
function streak(done){let n=0;const d=new Date();if(!done.some(s=>sameDay(new Date(s.date),d)))d.setDate(d.getDate()-1);while(done.some(s=>sameDay(new Date(s.date),d))){n++;d.setDate(d.getDate()-1);}return n;}
function minutesOn(done,d){return done.filter(s=>sameDay(new Date(s.date),d)).reduce((a,s)=>a+s.minutes,0);}
function ctx(){const done=doneList(),dead=store.sessions.filter(s=>!s.completed);const days={};done.forEach(s=>{const k=new Date(s.date).toDateString();days[k]=(days[k]||0)+s.minutes;});return{done,dead,totalMin:done.reduce((a,s)=>a+s.minutes,0),streak:streak(done),speciesSet:new Set(done.map(s=>s.species)),maxSession:Math.max(0,...done.map(s=>s.minutes)),early:done.some(s=>new Date(s.date).getHours()<8),late:done.some(s=>new Date(s.date).getHours()>=22),bestDay:Math.max(0,...Object.values(days)),goal:store.goal};}
function checkAwards(){const c=ctx();let newOnes=[];ACH.forEach(a=>{if(!store.awards[a.id]&&a.test(c)){store.awards[a.id]=new Date().toISOString();newOnes.push(a.name);}});if(newOnes.length){save();setTimeout(()=>alert('🏆 Achievement unlocked: '+newOnes.join(', ')),300);}}
function bars(map){const max=Math.max(1,...Object.values(map));return Object.entries(map).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="hbar"><span class="lbl">${escapeHtml(k)}</span><div class="fill" style="width:${Math.round(v/max*55)}%"></div><span class="val">${v}m</span></div>`).join('')||'<p class="hint">No data yet.</p>';}
function escapeHtml(t){return String(t||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

/* ---- grove & shop ---- */
let grovePeriod='day';
$('groveFilters').querySelectorAll('.chip').forEach(b=>b.onclick=()=>{grovePeriod=b.dataset.period;$('groveFilters').querySelectorAll('.chip').forEach(x=>x.classList.toggle('active',x===b));renderGrove();});
function inPeriod(dateStr){const d=new Date(dateStr),now=new Date();if(grovePeriod==='all')return true;if(grovePeriod==='day')return sameDay(d,now);if(grovePeriod==='week'){const s=new Date(now);s.setDate(now.getDate()-now.getDay());return d>=s;}if(grovePeriod==='month')return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();if(grovePeriod==='year')return d.getFullYear()===now.getFullYear();return true;}
function renderGrove(){
 document.body.dataset.scene=store.scene;
 $('sceneSelect').innerHTML=SCENES.filter(s=>store.scenes.includes(s.id)).map(s=>`<option value="${s.id}" ${s.id===store.scene?'selected':''}>${s.name}</option>`).join('');
 const trees=doneList().filter(s=>inPeriod(s.date));
 $('groveGrid').innerHTML=trees.map(s=>`<div class="grove-cell">${treeSVG(s.species,4,false,true)}<small>${s.minutes}m · ${new Date(s.date).toLocaleDateString()}</small></div>`).join('');
 $('groveEmpty').style.display=trees.length?'none':'block';
 const shop=[...SPECIES.filter(s=>!store.unlocked.includes(s.id)).map(s=>({kind:'species',id:s.id,name:s.name,cost:s.cost})),...SCENES.filter(s=>!store.scenes.includes(s.id)).map(s=>({kind:'scene',id:s.id,name:s.name+' scene',cost:s.cost}))];
 $('shopList').innerHTML=shop.length?shop.map(i=>`<div class="shop-item"><span>${escapeHtml(i.name)}</span><span>☀️ ${i.cost}</span><button data-kind="${i.kind}" data-id="${i.id}" data-cost="${i.cost}" ${store.points<i.cost?'disabled':''}>${store.points<i.cost?'Keep focusing':'Unlock'}</button></div>`).join(''):'<p class="hint">Everything unlocked. Your grove is complete! 🎉</p>';
 $('shopList').querySelectorAll('button').forEach(b=>b.onclick=()=>{const cost=+b.dataset.cost;if(store.points<cost)return;store.points-=cost;if(b.dataset.kind==='species')store.unlocked.push(b.dataset.id);else store.scenes.push(b.dataset.id);save();renderSpecies();renderAll();});
}
$('sceneSelect').onchange=e=>{store.scene=e.target.value;save();renderGrove();};

/* ---- stats / history / awards / together ---- */
function renderAll(){
 $('points').textContent=store.points;renderSpecies();renderGrove();
 const c=ctx(),done=c.done;
 $('goalDone').textContent=minutesOn(done,new Date());$('goalTarget').textContent=store.goal;$('goalFill').style.width=Math.min(100,minutesOn(done,new Date())/store.goal*100)+'%';
 $('statMinutes').textContent=c.totalMin;$('statPlanted').textContent=done.length;$('statWithered').textContent=c.dead.length;$('statStreak').textContent=c.streak;
 $('statRate').textContent=store.sessions.length?Math.round(done.length/store.sessions.length*100)+'%':'—';
 $('statAvg').textContent=done.length?Math.round(c.totalMin/done.length):0;$('statBest').textContent=c.bestDay;$('statToday').textContent=minutesOn(done,new Date());
 const days=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));return d;});const vals=days.map(d=>minutesOn(done,d));const max=Math.max(...vals,1);
 $('weekChart').innerHTML=days.map((d,i)=>`<div class="bar-wrap"><div class="bar" style="height:${Math.round(vals[i]/max*78)}px"></div><small>${'SMTWTFS'[d.getDay()]}</small><br><small>${vals[i]}m</small></div>`).join('');
 const d30=[...Array(30)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-(29-i));return minutesOn(done,d);});const m30=Math.max(...d30,1);
 $('monthChart').innerHTML=d30.map(v=>`<div class="bar-wrap"><div class="bar" style="height:${Math.round(v/m30*48)}px"></div></div>`).join('');
 const byTag={},bySp={};done.forEach(s=>{byTag[s.tag]=(byTag[s.tag]||0)+s.minutes;const nm=(SPECIES.find(x=>x.id===s.species)||{}).name||s.species;bySp[nm]=(bySp[nm]||0)+s.minutes;});
 $('tagBars').innerHTML=bars(byTag);$('speciesBars').innerHTML=bars(bySp);
 const q=($('historySearch').value||'').toLowerCase(),f=$('historyFilter').value;
 const list=store.sessions.filter(s=>(f==='all'||(f==='done')===s.completed||f==='all')&&(f==='all'||(f==='done'?s.completed:!s.completed))&&(!q||(s.tag+' '+s.species+' '+s.note+' '+(s.reflection||'')).toLowerCase().includes(q)));
 $('historyList').innerHTML=list.slice(0,50).map(s=>`<li><span class="${s.completed?'':'dead'}">${s.completed?'🌳':'🥀'} ${escapeHtml(s.tag)} · ${s.minutes}/${s.planned}m · ${(SPECIES.find(x=>x.id===s.species)||{}).name||''} ${s.note?'· '+escapeHtml(s.note):''} ${s.reflection?'· 📝 '+escapeHtml(s.reflection):''}</span><span>${new Date(s.date).toLocaleDateString()} ${new Date(s.date).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span></li>`).join('')||'<li>No sessions match.</li>';
 $('awardGrid').innerHTML=ACH.map(a=>`<div class="award ${store.awards[a.id]?'unlocked':''}"><span>${a.icon} <strong>${a.name}</strong><br><small>${a.desc}</small></span><span>${store.awards[a.id]?'Unlocked ✓':'Locked'}</span></div>`).join('');
 $('friendList').innerHTML=store.friends.map(n=>`<li><span>👤 ${escapeHtml(n)}</span>${n!=='You'?`<button class="ghost" data-del="${escapeHtml(n)}">remove</button>`:''}</li>`).join('');
 $('friendList').querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{store.friends=store.friends.filter(x=>x!==b.dataset.del);roomSel.delete(b.dataset.del);save();renderAll();});
 $('roomBox').innerHTML=store.friends.map(n=>`<button class="chip ${roomSel.has(n)?'active':''}" data-room="${escapeHtml(n)}">${escapeHtml(n)}</button>`).join('');
 $('roomBox').querySelectorAll('[data-room]').forEach(b=>b.onclick=()=>{roomSel.has(b.dataset.room)?roomSel.delete(b.dataset.room):roomSel.add(b.dataset.room);if(!roomSel.size)roomSel.add('You');store.room=[...roomSel];save();renderAll();});
 $('roomCode').textContent=store.roomCode?`Room code: ${store.roomCode} — participants: ${[...roomSel].join(', ')}`:'';
 const lead={};done.forEach(s=>{(s.participants&&s.participants.length?s.participants:['You']).forEach(p=>lead[p]=(lead[p]||0)+s.minutes);});
 $('leaderList').innerHTML=Object.entries(lead).sort((a,b)=>b[1]-a[1]).map(([n,v],i)=>`<li><span>${['🥇','🥈','🥉'][i]||'🏅'} ${escapeHtml(n)}</span><span>${v} min</span></li>`).join('')||'<li>No focus logged yet.</li>';
 $('goalInput').value=store.goal;$('darkToggle').checked=store.dark;$('notifyToggle').checked=store.notify;$('allowInput').value=store.allowlist;
 document.body.classList.toggle('dark',store.dark);
}
$('historySearch').addEventListener('input',renderAll);$('historyFilter').onchange=renderAll;
$('friendAddBtn').onclick=()=>{const v=$('friendInput').value.trim();if(v&&!store.friends.includes(v)){store.friends.push(v);$('friendInput').value='';save();renderAll();}};
$('roomBtn').onclick=()=>{store.roomCode='FG-'+Math.random().toString(36).slice(2,6).toUpperCase();store.room=[...roomSel];save();renderAll();alert('Room created: '+store.roomCode+'\nShare this code — friends plant the same duration at the same time on their devices, with this room selected.');};
$('goalInput').onchange=e=>{const v=+e.target.value;if(v>=5){store.goal=v;save();renderAll();}};
$('darkToggle').onchange=e=>{store.dark=e.target.checked;save();renderAll();};
$('notifyToggle').onchange=e=>{store.notify=e.target.checked;save();};
$('notifyBtn').onclick=()=>{if('Notification' in window)Notification.requestPermission();};
$('allowSaveBtn').onclick=()=>{store.allowlist=$('allowInput').value.trim();save();$('statusText').textContent='Allowed-apps list saved.';};

/* ---- data export / import ---- */
function download(name,text,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000);}
$('exportJsonBtn').onclick=()=>download('focusgrove-data.json',JSON.stringify(store,null,2),'application/json');
$('exportCsvBtn').onclick=()=>download('focusgrove-sessions.csv','date,minutes,planned,species,tag,completed,note,reflection\n'+store.sessions.map(s=>[s.date,s.minutes,s.planned,s.species,s.tag,s.completed,JSON.stringify(s.note||''),JSON.stringify(s.reflection||'')].join(',')).join('\n'),'text/csv');
$('importFile').onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(t=>{try{const d=JSON.parse(t);if(!Array.isArray(d.sessions))throw 0;store=Object.assign(defaults(),d);save();roomSel=new Set(store.room.length?store.room:['You']);renderIdle();renderAll();alert('Data imported ✓');}catch{alert('That file does not look like FocusGrove data.');}});};
$('clearBtn').onclick=()=>{if(confirm('Delete all FocusGrove data on this device?')){store=defaults();roomSel=new Set(['You']);save();renderIdle();renderAll();}};

/* ---- PWA ---- */
if('serviceWorker' in navigator)navigator.serviceWorker.register('service-worker.js').catch(()=>{});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;$('installBtn').hidden=false;});
$('installBtn').onclick=async()=>{if(deferredInstall){deferredInstall.prompt();deferredInstall=null;$('installBtn').hidden=true;}};

renderIdle();renderAll();
