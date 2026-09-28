(()=>{
  const student=new URLSearchParams(location.search).get('student')||'Student';
  const storageKey='inspiree-card-tree-'+student;
  let state={};try{state=JSON.parse(window.InspireMemory.getItem(storageKey)||'{}')}catch(error){}state.places||={};

  const cards=[
    ['sports-cards','Sports Cards'],['game-character-cards','Game Character Cards'],
    ['team-sport','Team Sport'],['individual-sport','Individual Sport'],['human','Human'],['creature','Creature'],
    ['team-new','New'],['team-worn','Worn'],['individual-new','New'],['individual-worn','Worn'],
    ['human-new','New'],['human-worn','Worn'],['creature-new','New'],['creature-worn','Worn']
  ];
  const cardById=Object.fromEntries(cards);
  const reportLabel={"sports-cards":"Sports Cards","game-character-cards":"Game Character Cards","team-sport":"Team Sport","individual-sport":"Individual Sport",human:"Human",creature:"Creature","team-new":"New — Team Sport","team-worn":"Worn — Team Sport","individual-new":"New — Individual Sport","individual-worn":"Worn — Individual Sport","human-new":"New — Human","human-worn":"Worn — Human","creature-new":"New — Creature","creature-worn":"Worn — Creature"};
  const choiceGroups=[
    ['Level 1: Type of Card',['sports-cards','game-character-cards']],
    ['Sports Cards: Category',['team-sport','individual-sport']],
    ['Game Character Cards: Category',['human','creature']],
    ['Team Sport: Condition of Card',['team-new','team-worn']],
    ['Individual Sport: Condition of Card',['individual-new','individual-worn']],
    ['Human: Condition of Card',['human-new','human-worn']],
    ['Creature: Condition of Card',['creature-new','creature-worn']]
  ];
  Object.keys(state.places).forEach(id=>{if(!cardById[id])delete state.places[id]});
  const save=()=>window.InspireMemory.setItem(storageKey,JSON.stringify(state));
  const esc=value=>String(value).replace(/[&<>]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[char]));
  const placedIn=pad=>Object.entries(state.places).find(([,destination])=>destination===pad)?.[0];
  const card=id=>`<span class="token" draggable="false" role="button" tabindex="0" data-card="${id}">${cardById[id]}</span>`;
  const pad=(id,left,top)=>`<div class="tree-node" role="button" tabindex="0" data-pad="${id}" style="--left:${left}%;--top:${top}%">${placedIn(id)?card(placedIn(id)):''}</div>`;

  function tree(){return `<div class="tree-scroll"><section class="tree-diagram" aria-label="Horizontal attribute tree">
    <b class="tree-head one">Type of Card</b><b class="tree-head two">Category</b><b class="tree-head three">Conditions of Card</b>
    <svg viewBox="0 0 1050 650" preserveAspectRatio="none" aria-hidden="true">
      <line x1="88" y1="325" x2="245" y2="185"/><line x1="88" y1="325" x2="245" y2="470"/>
      <line x1="275" y1="185" x2="465" y2="95"/><line x1="275" y1="185" x2="465" y2="230"/>
      <line x1="275" y1="470" x2="465" y2="420"/><line x1="275" y1="470" x2="465" y2="550"/>
      <line x1="495" y1="95" x2="700" y2="50"/><line x1="495" y1="95" x2="700" y2="130"/>
      <line x1="495" y1="230" x2="700" y2="185"/><line x1="495" y1="230" x2="700" y2="255"/>
      <line x1="495" y1="420" x2="700" y2="385"/><line x1="495" y1="420" x2="700" y2="455"/>
      <line x1="495" y1="560" x2="700" y2="525"/><line x1="495" y1="560" x2="700" y2="595"/>
      <circle cx="88" cy="325" r="44"/><text x="88" y="318" text-anchor="middle">Start</text><text class="small-text" x="88" y="340" text-anchor="middle">cards</text>
    </svg>
    ${pad('sports-cards',25,28)}${pad('game-character-cards',25,72)}
    ${pad('team-sport',46,15)}${pad('individual-sport',46,35)}${pad('human',46,65)}${pad('creature',46,86)}
    ${pad('team-new',76,8)}${pad('team-worn',76,20)}${pad('individual-new',76,29)}${pad('individual-worn',76,39)}
    ${pad('human-new',76,60)}${pad('human-worn',76,70)}${pad('creature-new',76,81)}${pad('creature-worn',76,92)}
  </section></div>`}

  const reassess=()=>cards.map(([id,label])=>({label,item:reportLabel[id],student:state.places[id]||'Not placed',correct:state.places[id]===id}));
  function updateScore(){window.InspireHost.emit();const rows=reassess(),got=rows.filter(row=>row.correct).length;document.querySelector('#score').textContent=`Current score: ${got} / ${rows.length} marks`;window.parent.postMessage({type:'DREAME_CARD_TREE',rows,got,available:rows.length},'*')}

  function render(){
    const bank=choiceGroups.map(([title,ids])=>`<section class="choice-group"><h3>${title}</h3><div class="bank" data-pad="bank">${ids.filter(id=>!state.places[id]).map(card).join('')}</div></section>`).join('');
    document.body.innerHTML=`<div class="shell"><header class="topbar"><div class="brand">InspireE <small>CARD CLASSIFICATION LAB</small></div><div class="tools"><span class="pill">Dream E4 of 4</span><span class="pill student-id">Student ID: ${esc(student)}</span><span class="pill" id="timer">00:00</span><button id="curr" class="curriculum-button"><span class="trillium" aria-hidden="true">✿</span>Grade 2 &amp; 3 Expectations</button><button id="report">PDF Assessment Report</button><button id="fillAnswers" class="answer-dot" aria-label="Fill correct answers" title="Fill correct answers"></button></div></header><main class="page"><section class="hero"><span class="tag">D1.1</span><h1>Card Classification Tree</h1></section><section class="card"><div class="note">Each branch has exactly two choices. Drag each card label to its blank pad. Level 1: Type of Card. Level 2: Category. Level 3: Conditions of Card. Drag a placed card back to the card bank or to another pad to correct it.</div><h2>Draggable cards</h2><div class="choice-groups">${bank}</div>${tree()}</section><div id="score" class="score"></div></main><a class="nav-link bottom" href="index.html">Home</a></div>`;
    bind();updateScore();fitPage();
  }

  let picked='',drag=null;
  function place(destination){if(!picked)return;if(destination==='bank')delete state.places[picked];else{const displaced=placedIn(destination);if(displaced)delete state.places[displaced];state.places[picked]=destination}picked='';save();render()}
  document.addEventListener('pointerdown',e=>{const card=e.target.closest('[data-card]');if(card){picked=card.dataset.card;drag={x:e.clientX,y:e.clientY,card,ghost:null}}});
  document.addEventListener('pointermove',e=>{if(!drag)return;if(!drag.ghost&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>8){drag.ghost=drag.card.cloneNode(true);drag.ghost.style.cssText='position:fixed;pointer-events:none;z-index:999;background:white;padding:10px;border:2px solid green';document.body.append(drag.ghost)}if(drag.ghost){e.preventDefault();drag.ghost.style.left=e.clientX+'px';drag.ghost.style.top=e.clientY+'px'}},{passive:false});
  document.addEventListener('pointerup',e=>{if(drag?.ghost){drag.ghost.remove();const pad=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-pad]');if(pad)place(pad.dataset.pad)}drag=null;});
  document.addEventListener('pointercancel',()=>{drag?.ghost?.remove();drag=null});
  document.addEventListener('click',e=>{const c=e.target.closest('[data-card]');if(c){picked=c.dataset.card;return}const p=e.target.closest('[data-pad]');if(p)place(p.dataset.pad)});
  document.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const c=e.target.closest('[data-card]'),p=e.target.closest('[data-pad]');if(c||p){e.preventDefault();if(c)picked=c.dataset.card;else place(p.dataset.pad)}});
  function bind(){
    let dragged='';
    document.querySelectorAll('[data-card]').forEach(item=>item.addEventListener('dragstart',()=>dragged=item.dataset.card));
    document.querySelectorAll('[data-pad]').forEach(target=>{
      target.addEventListener('dragover',event=>event.preventDefault());
      target.addEventListener('drop',event=>{
        event.preventDefault();if(!dragged)return;
        const destination=target.dataset.pad;
        if(destination==='bank')delete state.places[dragged];
        else {const displaced=placedIn(destination);if(displaced)delete state.places[displaced];state.places[dragged]=destination}
        save();render();
      });
    });
    document.querySelector('#curr').onclick=curriculum;
    document.querySelector('#report').onclick=report;
    document.querySelector('#fillAnswers').onclick=fillCorrect;
    let seconds=Number(state.seconds||0),timer=document.querySelector('#timer');
    timer.textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
    clearInterval(window.inspireTreeTimer);window.inspireTreeTimer=setInterval(()=>{seconds++;state.seconds=seconds;timer.textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');if(seconds%10===0)save()},1000);
  }

  function fitPage(){const shell=document.querySelector('.shell');if(!shell)return;document.documentElement.style.setProperty('--dreame4-scale','1');shell.style.width='100%';shell.style.minHeight='100vh';requestAnimationFrame(()=>{const scale=Math.min(1,(window.innerHeight-6)/shell.scrollHeight);shell.style.width=(100/scale)+'%';shell.style.minHeight=(100/scale)+'vh';document.documentElement.style.setProperty('--dreame4-scale',String(scale))})}
  window.addEventListener('resize',fitPage);
  function curriculum(){const modal=document.createElement('div');modal.className='modal';modal.innerHTML='<section><button>Close</button><h2>✿ Ontario Curriculum Expectations</h2><div class="expectation"><h3>Grade 2</h3><p>Organize and sort data using attributes, and describe the groups.</p></div><div class="expectation"><h3>Grade 3</h3><p>Collect, organize, and classify data using more than one attribute, and display the relationships in a diagram.</p></div><p>This activity connects these expectations through card type, category, and condition.</p></section>';modal.querySelector('button').onclick=()=>modal.remove();document.body.append(modal)}
  function fillCorrect(){if(window.prompt('')!=='259')return;state.places=Object.fromEntries(cards.map(([id])=>[id,id]));save();render()}
  function report(){save();const rows=reassess(),got=rows.filter(row=>row.correct).length,windowRef=window.open('','_blank');windowRef.document.write(`<!doctype html><title>InspireE Assessment</title><style>body{font:16px Arial;padding:28px;color:#182c49}table{width:100%;border-collapse:collapse}th,td{border:1px solid #182c49;padding:9px;text-align:left}th{background:#eaf6ff}.yes{color:#14713a;font-weight:bold}.no{color:#a31d2b;font-weight:bold}</style><h1>InspireE Teacher / Parent Report</h1><p><b>Student:</b> ${esc(student)}<br><b>Score:</b> ${got} / ${rows.length}</p><table><tr><th>Characteristic</th><th>Student location</th><th>Correct location</th><th>Result</th></tr>${rows.map(row=>`<tr><td>${esc(row.item)}</td><td>${esc(row.student)}</td><td>${esc(row.item)}</td><td class="${row.correct?'yes':'no'}">${row.correct?'Correct':'Incorrect'}</td></tr>`).join('')}</table><script>setTimeout(print,250)<\/script>`);windowRef.document.close()}
  window.InspireHost.register(()=>({places:{...state.places}}),v=>{state.places=v.places||{};render()});
  render();
})();
