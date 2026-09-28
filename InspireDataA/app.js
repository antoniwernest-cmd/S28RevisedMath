(() => {
 'use strict';
 const $=id=>document.getElementById(id),A=window.STADIUM_ACTIVITIES,E=window.Stadium,PROJECT=window.STADIUM_PROJECT||{name:'InspireStadium',key:'inspire-stadium-session-v2'},KEY=PROJECT.key;
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const range=(max,step=1)=>Array.from({length:Math.floor(max/step)+1},(_,i)=>i*step);
 const time=v=>String(Math.floor(v/60)).padStart(2,'0')+':'+String(Math.floor(v%60)).padStart(2,'0');
 const flower='<svg class="flower" viewBox="0 0 30 30" aria-hidden="true"><path d="M15 16C2 12 5 1 15 2C25 1 28 12 15 16M15 16C20 3 31 11 27 20C23 30 13 30 15 16M15 16C24 26 11 32 5 24C-2 15 5 7 15 16" fill="#fff" stroke="#47724e" stroke-width="1.3"/><circle cx="15" cy="16" r="3" fill="#dfa22b"/></svg>';
 const localFiles=location.protocol==='file:';
 let store,session;
 try{store=localStorage;session=JSON.parse(store.getItem(KEY)||'null')}catch{try{store=sessionStorage;session=JSON.parse(store.getItem(KEY)||'null')}catch{session=null}}
 // A local HTML file may have a separate storage area from its neighbours.
 // Carry the current session in the local URL fragment so file-to-file navigation is reliable.
 if(localFiles){try{session=location.hash.startsWith('#session=')?JSON.parse(decodeURIComponent(location.hash.slice(9))):null}catch{session=null}}
 const pageNumber=Number(document.body.dataset.page||0),a=A[pageNumber-1];
 let selected=null,dirtyTimer=Date.now(),lastPersist=Date.now(),drag=null,suppressClickUntil=0;
 function persist(){try{const json=JSON.stringify(session);if(localFiles&&a)history.replaceState(null,'','#session='+encodeURIComponent(json));try{store?.setItem(KEY,json)}catch(error){if(!localFiles)throw error;}if($('saveStatus'))$('saveStatus').textContent='Answers saved'}catch{if($('saveStatus'))$('saveStatus').textContent='Saving unavailable — keep this page open';}}
 function activityURL(n){return A[n-1].file+(localFiles?'#session='+encodeURIComponent(JSON.stringify(session)):'')}
 function tick(){
  if(!session||!a)return;
  const now=Date.now(),elapsed=(now-dirtyTimer)/1000;dirtyTimer=now;
  if(!document.hidden){session.times[a.number]=(session.times[a.number]||0)+elapsed;session.totalTime=(session.totalTime||0)+elapsed;}
  if($('timer'))$('timer').textContent='Page '+time(session.times[a.number]||0);
  if(now-lastPersist>4000){persist();lastPersist=now}
 }
 if(pageNumber===0){
  // Only entry to the landing page starts a clean session; activity navigation never resets.
  try{store.removeItem(KEY)}catch{}
  $('app').innerHTML=`<main class="landing"><section class="landing-card"><div class="intro"><div class="eyebrow">Grade 3 · Ontario mathematics</div><div class="season" aria-hidden="true">🍁 🎃 🧱</div><h1>${esc(PROJECT.name)}</h1><p>October discoveries.<br>${A.length} activities to explore data.</p><form id="entryForm" class="entry-form"><label for="studentId">💡 ENTER ANY NUMBER YOU CHOOSE</label><input id="studentId" type="text" maxlength="40" autocomplete="off" required placeholder="Enter your student ID"><button class="primary" type="submit">Start the activities →</button></form><p class="notice">Entering starts a fresh project. Your answers save as you move between activities.</p></div><div class="course"><div class="eyebrow">Your fall data collection</div>${[['🍎','Sort by two and three attributes','D1.1'],['🚚','Observe, interview, experiment','D1.2'],['📊','Pictographs and bar graphs','D1.3'],['🧱','Mean, mode and fair sharing','D1.4'],['🍂','Use evidence to make decisions','D1.5']].map(c=>`<div class="course-row"><span>${c[0]}</span><strong>${c[1]}</strong><small>${A.filter(p=>p.strand===c[2]).length} activities</small></div>`).join('')}<p class="notice">D1.1–D1.5 · Drag, tap, select, slide and build.<br>Includes individual marks and a printable PDF assessment.</p></div></section></main>`;
  $('entryForm').onsubmit=e=>{e.preventDefault();const student=$('studentId').value.trim();if(!student)return;session={student,started:new Date().toISOString(),answers:{},times:{},totalTime:0};persist();location.href=activityURL(1)};
  return;
 }
 if(!a){$('app').innerHTML='<p>Activity not found. <a href="index.html">Open InspireStadium</a></p>';return;}
 if(!session||typeof session.answers!=='object'||!session.student){location.replace('index.html');return;}
 document.title=PROJECT.name+' · '+a.number+' · '+a.title;
 document.body.dataset.source=a.sourceNumber;session.times ||= {};session.answers[a.number] ||= {};
 const state=()=>session.answers[a.number];
 function saveField(key,value){state()[key]=value;persist()}
 function selectControl(id,label,options,value){return `<label class="question">${esc(label)}<select data-field="${esc(id)}" aria-label="${esc(label)}"><option value="">Choose…</option>${options.map(x=>`<option value="${esc(x)}"${String(value)===String(x)?' selected':''}>${esc(x)}</option>`).join('')}</select></label>`}
 function questions(qs=a.questions||[]){return `<div class="questions">${qs.map(q=>selectControl(q.id,q.label,q.options,state()[q.id])).join('')}</div>`}
 function token(id,label,emoji='',source='bank'){return `<button type="button" class="token${selected?.id===String(id)&&selected?.source===source?' selected':''}" draggable="false" data-token="${esc(id)}" data-source="${source}" aria-label="${esc(label)}${a.type==='sort'?' card '+String(id).toUpperCase():''}">${emoji?`<span class="emoji" aria-hidden="true"${label.startsWith('Orange')?' style="color:#df8317"':label.startsWith('Purple')?' style="color:#9151ae"':label.startsWith('Blue')?' style="color:#397cc1"':label.startsWith('Green')?' style="color:#418d48"':''}>${emoji}</span>`:''}<span>${esc(label)}</span>${a.type==='sort'?`<small>${esc(id).toUpperCase()}</small>`:''}</button>`}
 function drop(id,label,contents='',classes=''){return `<div class="drop ${classes}" role="button" tabindex="0" data-drop="${esc(id)}" aria-label="${esc(label)}"><span class="drop-label">${esc(label)}</span>${contents}</div>`}
 function sortContents(index){return a.items.filter(i=>state().placements?.[i.id]===index).map(i=>token(i.id,i.label,i.emoji,'placed')).join('')}
 function treeSVG(){const p=(x,y,X,Y)=>`<path d="M${x} ${y} L${X} ${Y}"/>`;let paths=p(4,50,23,25)+p(4,50,23,75);[25,75].forEach((y,i)=>{paths+=p(23,y,49,12.5+i*50)+p(23,y,49,37.5+i*50)});[12.5,37.5,62.5,87.5].forEach((y,i)=>{paths+=p(49,y,82,6.25+i*25)+p(49,y,82,18.75+i*25)});return `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><g fill="none" stroke="#a9b7a3" stroke-width=".4">${paths}</g></svg>`}
 function sortView(){
  let body='';
  if(a.layout==='carroll')body=`<div class="carroll"><div></div>${a.columns.map(x=>`<div class="head">${x}</div>`).join('')}${a.rows.map((r,i)=>`<div class="head">${r}</div>${[0,1].map(j=>drop(i*2+j,a.groups[i*2+j],sortContents(i*2+j))).join('')}`).join('')}</div>`;
  else if(a.layout==='venn')body=`<div class="venn"><div class="circle left"></div><div class="circle right"></div><span class="vlabel left">${a.attributes[0]}</span><span class="vlabel right">${a.attributes[1]}</span>${a.groups.map((g,i)=>drop(i,g,sortContents(i),'vdrop v'+i)).join('')}</div>`;
  else if(a.layout==='treeSort')body=`<div class="tree-heads"><span>Vehicle type</span><span>Colour</span><span>Load</span></div><div class="tree tree-sort">${treeSVG()}${['Car','Truck'].map((v,i)=>`<div class="node" style="left:23%;top:${25+i*50}%">${v}</div>`).join('')}${['Red','Blue','Red','Blue'].map((v,i)=>`<div class="node" style="left:49%;top:${12.5+i*25}%">${v}</div>`).join('')}${a.groups.map((g,i)=>`<div style="position:absolute;left:63%;top:${6.25+i*12.5}%;transform:translateY(-50%);font-size:10px">${g.split(' · ')[2]}</div><div class="node leaf" style="top:${6.25+i*12.5}%">${drop(i,g,sortContents(i))}</div>`).join('')}</div>`;
  else if(a.layout==='table3')body=`<table class="data-table sorting-table"><thead><tr><th>Colour</th><th>Size</th><th>Edge</th><th>Leaf cards</th></tr></thead><tbody>${a.groups.map((g,i)=>`<tr>${g.split(' · ').map(v=>'<td>'+esc(v)+'</td>').join('')}<td>${drop(i,g,sortContents(i))}</td></tr>`).join('')}</tbody></table>`;
  else body=`<div class="sort-grid ${a.layout}">${a.groups.map((g,i)=>drop(i,g,sortContents(i))).join('')}</div>`;
  return body+`<div class="bank" data-drop="bank" tabindex="0" role="button" aria-label="Card bank. Return a card here."><span class="bank-label">Card bank · drag a card, or select it then tap a pad · return cards here</span>${a.items.filter(i=>state().placements?.[i.id]===undefined).map(i=>token(i.id,i.label,i.emoji)).join('')||'<span class="notice">All cards are placed. You can still move any card.</span>'}</div>`;
 }
 function treeView(){
  const nodes=a.nodes.map((n,i)=>{const x=i<2?23:i<6?49:82,y=i<2?25+i*50:i<6?12.5+(i-2)*25:6.25+(i-6)*12.5;return `<div class="node" style="left:${x}%;top:${y}%">${drop(i,n[1],state().nodes?.[i]?token(i,state().nodes[i],'','placed'):'')}</div>`}).join('');
  const labels=[...new Set(a.nodes.map(n=>n[0]))].reverse();
  return `<div class="tree-heads">${a.levels.map(l=>'<span>'+l+'</span>').join('')}</div><div class="tree">${treeSVG()}${nodes}</div><div class="bank" data-drop="bank" role="button" tabindex="0" aria-label="Characteristic bank"><span class="bank-label">Characteristic cards · New and Worn can be used on every branch</span>${labels.map(l=>token(l,l)).join('')}</div>`;
 }
 function tally(n){let h='<span class="tally" aria-hidden="true">';while(n>=5){h+='<span class="tally-group five"><i></i><i></i><i></i><i></i></span>';n-=5}if(n)h+='<span class="tally-group">'+'<i></i>'.repeat(n)+'</span>';return h+'</span>'}
 function table(categories,values,heading='Frequency',withTally=false){return `<table class="data-table"><thead><tr><th>Category</th>${withTally?'<th>Tally</th>':''}<th>${esc(heading)}</th></tr></thead><tbody>${categories.map((c,i)=>`<tr><th scope="row">${esc(c)}</th>${withTally?'<td>'+tally(values[i])+'</td>':''}<td>${values[i]}</td></tr>`).join('')}</tbody></table>`}
 function interviewChild(index){const faces=['👧🏻','👦🏽','🧒🏼','👧🏾','👦🏻','🧒🏿','👧🏽','👦🏾','🧒🏻','👧🏼','👦🏿','🧒🏽'];return `<span class="interview-child" role="img" aria-label="Child ${index+1}">${faces[index%faces.length]}</span>`;}
 function frequencyView(){
  const n=state().revealed||0,last=n?a.records[n-1]:null,label=a.method==='interview'?'Ask next visitor':a.method==='experiment'?'Run next trial':'Observe next';
  let visual='';
  if(last&&a.sourceNumber===10)visual=`<div class="mini-tower" aria-label="${esc(last)}">${'<i></i>'.repeat(parseInt(last))}</div>`;
  if(last&&a.method==='experiment')visual=`<div class="trial-track" aria-hidden="true">${range(4).map(v=>'<span>'+v+'</span>').join('')}<b style="--travel:${parseInt(last)*22}%">${a.sourceNumber===9?'🚗':'🍂'}</b></div>`;
  return `<div class="two-col"><section class="panel"><h2>${a.method==='interview'?'Interview station':a.method==='experiment'?'Experiment station':'Observation station'}</h2><div class="record-current" aria-live="polite">${last?`${a.method==='interview'?interviewChild(n-1):a.emoji?.[last]||a.icon} ${esc(last)}`:'Ready for the first record'}${visual}</div><div class="record-controls"><button class="primary" id="reveal"${n>=a.records.length?' disabled':''}>${label}</button><span class="notice">${n} / ${a.records.length} records</span></div><div class="record-log">${a.records.slice(0,n).map((r,i)=>`<span>${i+1}. ${esc(r)}</span>`).join('')}</div><p class="notice">Classroom simulation · The record history stays here so you can check your counts.</p></section><section class="panel"><h2>Your frequency table</h2><table class="data-table"><tr><th>Category</th><th>Tally</th><th>Frequency</th></tr>${a.categories.map((c,i)=>`<tr><th scope="row">${c}</th><td>${state()['count'+i]!==undefined?tally(Number(state()['count'+i])):'—'}</td><td><select data-field="count${i}" aria-label="${esc(c)} frequency"><option value="">Choose…</option>${range(a.records.length).map(v=>`<option${String(state()['count'+i])===String(v)?' selected':''}>${v}</option>`).join('')}</select></td></tr>`).join('')}</table></section></div>${questions()}`;
 }
 function pictures(count,emoji){let h='';for(let i=0;i<Math.floor(count);i++)h+=`<span class="picture" aria-hidden="true">${emoji}</span>`;if(count%1)h+=`<span class="picture half" aria-hidden="true">${emoji}</span>`;return h;}
 function chart(categories,values,unit,max,editable=false){
  return `<div class="chart"><div class="plot">${range(max,unit).map(v=>`<div class="gridline" style="bottom:${v/max*100}%"><span class="tick">${v}</span></div>`).join('')}${categories.map((c,i)=>`<div class="bar-slot"><div class="bar" data-bar="${i}" style="height:${Number(values[i]||0)/max*100}%"><span class="bar-value">${values[i]??''}</span></div><span class="bar-label">${esc(c)}</span></div>`).join('')}</div></div>`;
 }
 function graphMeta(){return `<div class="meta">${selectControl('title','Choose a title',[a.graphTitle,'Our favourite colours','Rainfall in July'],state().title)}${selectControl('label','Category label',[a.label,'Shoe size','Temperature'],state().label)}${selectControl('scale',a.type==='bar'?'Scale: one interval represents…':'One full picture represents…',[1,2,5,10],state().scale)}${selectControl('source','Source',[a.source,'An unknown online photo','No record was collected'],state().source)}${a.type==='bar'?selectControl('yLabel','Vertical-axis label',[a.yLabel,'Temperature in degrees','Height in metres'],state().yLabel):''}</div>`}
 function graphView(){
  let g=`<div class="graph-title">${esc(state().title||'Choose your graph title')}</div>`;
  if(a.type==='pictograph'){
   g+=`<div class="pictograph-label">${esc(state().label||'Choose the category label')}</div>`;
   g+=a.categories.map((c,i)=>`<div class="pict-row"><span class="pict-label">${c}</span><div class="pictures" aria-label="${esc(c)}: ${state()['value'+i]??'no'} pictures">${pictures(Number(state()['value'+i]||0),a.emoji)}</div><div class="pict-control"><button data-picture="${i}" data-delta="-${a.unit===2?.5:1}" aria-label="Remove picture for ${esc(c)}">−</button><output>${state()['value'+i]??'—'}</output><button data-picture="${i}" data-delta="${a.unit===2?.5:1}" aria-label="Add picture for ${esc(c)}">+</button></div></div>`).join('');
   g+=`<div class="key">Each ${a.emoji} represents ${esc(state().scale||'…')} ${a.icon==='🃏'?'cards':a.icon==='🎃'?'pumpkins':'apples'}.</div>`;
  }else{
   g+=`<div class="axis-label">${esc(state().yLabel||'Choose the vertical-axis label')}</div>${chart(a.categories,a.values.map((_,i)=>state()['value'+i]),a.unit,a.max,true)}<div class="axis-label">${esc(state().label||'Choose the category label')}</div><div class="height-controls">${a.categories.map((c,i)=>{
    const v=state()['value'+i];
    if(a.control==='select')return `<label>${c}<select data-field="value${i}" aria-label="${c} bar height"><option value="">Choose…</option>${range(a.max).map(n=>`<option${String(v)===String(n)?' selected':''}>${n}</option>`).join('')}</select></label>`;
    if(a.control==='slider')return `<label>${c}<input type="range" min="0" max="${a.max}" step="1" value="${v||0}" data-slider="value${i}" aria-label="${c} bar height"><output data-output="value${i}">${v??'Not set'}</output></label>`;
    return `<label>${c}<span class="stepper"><button data-height="${i}" data-delta="-1" aria-label="Lower ${c} bar">−</button><output>${v??'—'}</output><button data-height="${i}" data-delta="1" aria-label="Raise ${c} bar">+</button></span></label>`;
   }).join('')}</div>`;
  }
  return `<div class="two-col"><section class="panel"><h2>Source data</h2>${table(a.categories,a.values,'Total',true)}<p class="graph-source">Source: ${esc(a.source)}</p>${graphMeta()}</section><section class="panel">${g}<p class="graph-source">Source: ${esc(state().source||'Choose the source')}</p></section></div>`;
 }
 function meanView(){const shares=E.meanState(a,state()),total=a.values.reduce((x,y)=>x+y,0),reserve=total-shares.reduce((x,y)=>x+y,0);return `<div class="panel"><p>Starting amounts: <strong>${a.values.join(', ')}</strong> · Total: <strong>${total} ${a.unit}</strong></p><div class="shares">${shares.map((v,i)=>`<section class="share"><div class="tower" aria-label="Group ${i+1}: ${v} ${a.unit}">${Array.from({length:v},()=>'<span class="brick"></span>').join('')}</div><p class="notice">Group ${i+1}</p><div class="stepper"><button data-share="${i}" data-delta="-1" aria-label="Move one from group ${i+1} to reserve"${v===0?' disabled':''}>−</button><output>${v}</output><button data-share="${i}" data-delta="1" aria-label="Move one from reserve to group ${i+1}"${reserve===0?' disabled':''}>+</button></div></section>`).join('')}</div><div class="reserve" aria-live="polite">Reserve: ${reserve} ${a.unit}</div></div><div class="questions">${selectControl('mean','Mean number of '+a.unit,range(15),state().mean)}</div>${questions()}`}
 function modeView(){return `<div class="values">${a.values.map(v=>'<span class="value-chip">'+v+'</span>').join('')}</div><div class="modes" role="group" aria-label="Select all modes">${a.options.map(v=>`<button data-mode="${esc(v)}" aria-pressed="${(state().modes||[]).map(String).includes(String(v))}">${esc(v)}</button>`).join('')}</div>${questions()}`}
 function analyseView(){let h='';
  if(a.display==='numbers')h='<div class="values">'+a.values.map(v=>'<span class="value-chip">'+v+'</span>').join('')+'</div>';
  if(a.display==='table')h=table(a.categories,a.values);
  if(a.display==='datasets')h='<table class="data-table"><tr><th>Club</th><th>Tower heights in bricks</th></tr>'+a.sets.map(s=>'<tr><th>'+s.name+'</th><td><div class="number-grid">'+s.values.map(v=>'<span>'+v+'</span>').join('')+'</div></td></tr>').join('')+'</table>';
  if(a.display==='bar')h=chart(a.categories,a.values,a.unit,a.max);
  if(a.display==='compare')h=`<div class="graph-pair">${a.scales.map((scale,i)=>`<section><h2>Graph ${i===0?'A':'B'} · scale ${scale}</h2><div class="axis-label">Number of costumes</div>${chart(a.categories,a.values,scale,a.maxima[i])}<div class="axis-label">Costume</div></section>`).join('')}</div>`;
  if(a.display==='picture')h=a.categories.map((c,i)=>`<div class="pict-row" style="grid-template-columns:105px 1fr"><strong>${c}</strong><div class="pictures" aria-label="${a.values[i]/a.unit} pictures">${pictures(a.values[i]/a.unit,a.emoji)}</div></div>`).join('')+`<div class="key">Each ${a.emoji} means ${a.unit} pumpkins.</div>`;
  if(a.display==='decision')h=`<div class="graph-pair"><section><h2>This year’s requests</h2>${table(a.categories,a.values)}</section><section><h2>Last October’s attendance</h2><div class="axis-label">Number of visitors</div>${chart(a.categories,a.secondValues,a.unit,a.max)}<div class="axis-label">Activity</div></section></div>`;
  return `<div class="panel">${h}${a.source?'<p class="graph-source">Source: '+esc(a.source)+'</p>':''}</div>${questions()}`;
 }
 function content(){return a.type==='embedded'?embeddedView():a.type==='sort'?sortView():a.type==='tree'?treeView():a.type==='frequency'?frequencyView():['pictograph','bar'].includes(a.type)?graphView():a.type==='mean'?meanView():a.type==='mode'?modeView():analyseView()}
 /* Imported pages use message snapshots, including under file:// isolation. */
let importToken='',importReady=false,importRequest=0;
const pendingImports=new Map();
function embeddedView(){importToken=Date.now()+'-'+Math.random();importReady=false;const payload={token:importToken,student:session.student,answer:state()};return `<iframe id="importFrame" title="${esc(a.title)}" src="inspiree/DreamE${a.importId}.html#${encodeURIComponent(JSON.stringify(payload))}" class="import-frame"></iframe>`;}
window.addEventListener('message',e=>{
 const frame=$('importFrame'),d=e.data;if(!frame||e.source!==frame.contentWindow||d?.token!==importToken)return;
 if(['INSPIRE_READY','INSPIRE_CHANGED','INSPIRE_SNAPSHOT_RESULT'].includes(d.type)){session.answers[a.number]=d.answer;persist();if(d.type==='INSPIRE_READY')importReady=true;if(d.type==='INSPIRE_SNAPSHOT_RESULT'){pendingImports.get(d.request)?.();pendingImports.delete(d.request);}}
});
async function captureCurrent(){
 if(a.type!=='embedded')return true;
 if(!importReady){alert('This activity is still opening. Please try again in a moment.');return false;}
 const request=++importRequest;
 try{await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>{pendingImports.delete(request);reject(new Error('No current answers received'));},4000);pendingImports.set(request,()=>{clearTimeout(timeout);resolve()});$('importFrame').contentWindow.postMessage({type:'INSPIRE_SNAPSHOT',token:importToken,request},'*')});return true;}
 catch{alert('The current answers could not be read. Your work has not been cleared. Please try again.');return false;}
}

 function renderActivity(){const old=$('workspace').scrollTop;$('activity').innerHTML=content();$('workspace').scrollTop=old;}
 function moveCard(target){
  if(!selected)return;
  if(a.type==='sort'){
   state().placements ||= {};
   if(target==='bank')delete state().placements[selected.id];else state().placements[selected.id]=Number(target);
  }else if(a.type==='tree'){
   state().nodes ||= {};
   const value=selected.source==='placed'?state().nodes[selected.id]:selected.id;
   if(target==='bank'){if(selected.source==='placed')delete state().nodes[selected.id];}
   else if(selected.source==='placed'&&String(target)!==selected.id){const old=state().nodes[target];state().nodes[target]=value;if(old)state().nodes[selected.id]=old;else delete state().nodes[selected.id];}
   else state().nodes[target]=value;
  }
  selected=null;persist();renderActivity();
 }
 async function navigate(n){if(!await captureCurrent())return;tick();persist();location.href=activityURL(n)}
 async function report(){
  if(!await captureCurrent())return;tick();persist();
  // Recalculate from current answer values on every opening; never store awarded marks.
  const rows=E.allRows(session),earned=rows.filter(r=>r.correct).length;
  const reportPanel=document.createElement('section');reportPanel.id='reportPanel';reportPanel.className='report-overlay';reportPanel.setAttribute('role','dialog');reportPanel.setAttribute('aria-modal','true');reportPanel.setAttribute('aria-label','Fresh PDF assessment');
  const summaries=A.map(p=>{const r=rows.filter(x=>x.page===p.number);return `<tr><td>${p.number}</td><td>${esc(p.title)}</td><td>${p.strand}</td><td>${r.filter(x=>x.correct).length} / ${r.length}</td><td>${time(session.times[p.number]||0)}</td></tr>`}).join('');
  const details=A.map(p=>{const r=rows.filter(x=>x.page===p.number);return `<h2>Page ${p.number} · ${esc(p.title)} · ${r.filter(x=>x.correct).length}/${r.length}</h2><table><thead><tr><th>Assessed item</th><th>Student answer</th><th>Expected answer</th><th>Mark</th></tr></thead><tbody>${r.map(x=>`<tr><td>${esc(x.item)}</td><td>${esc(x.student)}</td><td>${esc(x.expected)}</td><td class="mark ${x.correct?'pass':'not-yet'}">${x.correct?'1 / 1':'0 / 1'}</td></tr>`).join('')}</tbody></table>`}).join('');
  reportPanel.innerHTML=`<main class="report"><div class="report-actions no-print"><button id="printReport" class="primary">Print / Save as PDF</button><button id="closeReport">Back to activity</button></div><h1>${esc(PROJECT.name)} · Grade 3 Data</h1><p>Student: <strong>${esc(session.student)}</strong> · Assessed: ${esc(new Date().toLocaleString())}</p><p class="report-summary">${earned} / ${rows.length} marks</p><p>Total activity time: ${time(session.totalTime||0)}. Each item is worth one mark. Unanswered items earn zero. This report is a fresh snapshot of the current answers.</p><table><thead><tr><th>Page</th><th>Activity</th><th>Expectation</th><th>Earned / Available</th><th>Page time</th></tr></thead><tbody>${summaries}</tbody></table>${details}<p>Ontario Curriculum, Grades 1–8: Mathematics (2020), Grade 3, D1.1–D1.5. M26 assessment rules: current answers only, one row per mark, no duplicate or accumulated credit.</p></main>`;
  document.body.append(reportPanel);document.body.classList.add('reporting');$('app').inert=true;$('printReport').onclick=()=>window.print();$('closeReport').onclick=()=>{reportPanel.remove();document.body.classList.remove('reporting');$('app').inert=false;$('report').focus()};$('closeReport').focus();
 }
 const marks=E.assess(a,{}).length;
 $('app').innerHTML=`<div class="shell"><header class="top"><a class="brand" href="index.html" id="homeLink">🍁 ${esc(PROJECT.name)}</a><span class="badge">Student ${esc(session.student)}</span><span class="badge" id="timer">Page ${time(session.times[a.number]||0)}</span><div class="toolbar"><button id="curriculum">${flower}Ontario Curriculum</button><button id="report">PDF Assessment</button></div><button class="next" id="nextTop"${a.number===A.length?' disabled':''}>Next Page →</button></header><main class="workspace${a.type==='embedded'?' imported':''}" id="workspace"><div class="eyebrow">October data discoveries · ${a.strand} · ${marks} marks available</div><h1>${a.icon} ${a.title}</h1><p class="prompt">${esc(a.prompt)}</p><section class="activity" id="activity"></section></main><footer class="footer"><button id="previous"${a.number===1?' disabled':''}>← Last Page</button><select id="pageJump" aria-label="Choose activity">${A.map(p=>`<option value="${p.number}"${p.number===a.number?' selected':''}>${p.number} / ${A.length} · ${esc(p.title)}</option>`).join('')}</select><span class="status" id="saveStatus" aria-live="polite">Answers saved</span><button class="dot" id="override" aria-label="Teacher access"></button><button class="next" id="nextBottom"${a.number===A.length?' disabled':''}>Next Page →</button></footer></div><dialog id="curriculumDialog" class="dialog"><button class="close" id="closeCurriculum" aria-label="Close curriculum">×</button><div class="eyebrow">Ontario · Mathematics 2020</div><h2>Grade 3 · ${a.strand}</h2><p>${esc(window.STADIUM_CURRICULUM[a.strand])}</p>${a.importId===1?'<p>Median questions are retained from InspireE as extension work, not part of Grade 3 D1.4.</p>':''}<p><strong>On this page:</strong> ${esc(a.prompt)}</p><p class="notice">Source: The Ontario Curriculum, Grades 1–8: Mathematics, 2020 (January 2021), Grade 3, Strand D1: Data Literacy.</p></dialog><dialog id="codeDialog" class="dialog code-dialog"><form id="codeForm"><input id="code" type="password" inputmode="numeric" autocomplete="off" aria-label="Passcode"><button aria-label="Confirm" type="submit">→</button></form></dialog>`;
 renderActivity();
 $('nextTop').onclick=$('nextBottom').onclick=()=>{if(a.number<A.length)navigate(a.number+1)};
 $('previous').onclick=()=>{if(a.number>1)navigate(a.number-1)};
 $('pageJump').onchange=e=>navigate(Number(e.target.value));
 $('homeLink').onclick=e=>{if(!confirm('Return to the landing page and start a new, empty project?'))e.preventDefault();};
 $('curriculum').onclick=()=>$('curriculumDialog').showModal();$('closeCurriculum').onclick=()=>$('curriculumDialog').close();
 $('report').onclick=report;
 $('override').onclick=()=>{$('code').value='';$('codeDialog').showModal();$('code').focus()};
 $('codeForm').onsubmit=e=>{e.preventDefault();if($('code').value==='259'){A.forEach(p=>session.answers[p.number]=E.fill(p));persist();renderActivity();$('codeDialog').close()}else{$('code').value='';$('code').focus()}};
 $('activity').addEventListener('change',e=>{const el=e.target;if(el.dataset.field){saveField(el.dataset.field,el.value);renderActivity();}});
 $('activity').addEventListener('input',e=>{const el=e.target;if(el.dataset.slider){saveField(el.dataset.slider,Number(el.value));const i=Number(el.dataset.slider.replace('value','')),bar=$('activity').querySelector(`[data-bar="${i}"]`);bar.style.height=Number(el.value)/a.max*100+'%';bar.querySelector('.bar-value').textContent=el.value;$('activity').querySelector(`[data-output="${el.dataset.slider}"]`).textContent=el.value;}});
 $('activity').addEventListener('click',e=>{
  if(Date.now()<suppressClickUntil)return;
  const t=e.target.closest('[data-token]');if(t){selected={id:t.dataset.token,source:t.dataset.source};document.querySelectorAll('.token.selected').forEach(x=>x.classList.remove('selected'));t.classList.add('selected');return;}
  const d=e.target.closest('[data-drop]');if(d){moveCard(d.dataset.drop);return;}
  const b=e.target.closest('button');if(!b)return;
  if(b.id==='reveal'){saveField('revealed',Math.min(a.records.length,(state().revealed||0)+1));renderActivity();}
  if(b.dataset.picture!==undefined){const key='value'+b.dataset.picture;saveField(key,Math.max(0,Math.min(12,Number(state()[key]||0)+Number(b.dataset.delta))));renderActivity();}
  if(b.dataset.height!==undefined){const key='value'+b.dataset.height;saveField(key,Math.max(0,Math.min(a.max,Number(state()[key]||0)+Number(b.dataset.delta))));renderActivity();}
  if(b.dataset.share!==undefined){const shares=[...E.meanState(a,state())],i=Number(b.dataset.share),delta=Number(b.dataset.delta);shares[i]+=delta;state().shared=true;saveField('shares',shares);renderActivity();}
  if(b.dataset.mode!==undefined){const val=b.dataset.mode,prev=(state().modes||[]).map(String);saveField('modes',prev.includes(val)?prev.filter(x=>x!==val):[...prev,val]);renderActivity();}
 });
 $('activity').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-drop]')){e.preventDefault();moveCard(e.target.dataset.drop)}});
 $('activity').addEventListener('dragstart',e=>{const t=e.target.closest('[data-token]');if(t){selected={id:t.dataset.token,source:t.dataset.source};e.dataTransfer.setData('text/plain',t.dataset.token);e.dataTransfer.effectAllowed='move';}});
 $('activity').addEventListener('dragover',e=>{if(e.target.closest('[data-drop]'))e.preventDefault()});
 $('activity').addEventListener('drop',e=>{const d=e.target.closest('[data-drop]');if(d){e.preventDefault();moveCard(d.dataset.drop)}});
 // Pointer dragging supports touch screens; tap-select / tap-pad also works.
 $('activity').addEventListener('pointerdown',e=>{if(e.button!==0)return;const t=e.target.closest('[data-token]');if(t)drag={x:e.clientX,y:e.clientY,id:t.dataset.token,source:t.dataset.source,el:t,ghost:null};});
 document.addEventListener('pointermove',e=>{if(!drag)return;if(!drag.ghost&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>8){selected={id:drag.id,source:drag.source};drag.ghost=drag.el.cloneNode(true);drag.ghost.classList.add('ghost');document.body.append(drag.ghost)}if(drag.ghost){e.preventDefault();drag.ghost.style.left=e.clientX+'px';drag.ghost.style.top=e.clientY+'px';}},{passive:false});
 document.addEventListener('pointerup',e=>{if(!drag)return;if(drag.ghost){const d=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-drop]');drag.ghost.remove();if(d)moveCard(d.dataset.drop);suppressClickUntil=Date.now()+350}drag=null;});
 document.addEventListener('pointercancel',()=>{drag?.ghost?.remove();drag=null;});
 document.addEventListener('visibilitychange',()=>{tick();persist()});window.addEventListener('pagehide',()=>{tick();persist()});
 window.addEventListener('pageshow',event=>{if(event.persisted){const latest=localFiles?JSON.parse(decodeURIComponent(location.hash.slice(9))):JSON.parse(store.getItem(KEY)||'null');if(!latest){location.replace('index.html');return;}session=latest;session.answers[a.number]||={};dirtyTimer=Date.now();renderActivity();}});
 setInterval(tick,1000);
})();
