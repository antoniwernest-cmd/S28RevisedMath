(() => {
  'use strict';

  const pageNumber = Number(location.pathname.match(/Dream(\d+)(?:\.html)?\/?$/i)?.[1] || 1);
  const student = new URLSearchParams(location.search).get('student') || 'Student';
  const storageKey = 'exciteb-firsthalf-' + student;
  const totalPages = 21;
  const expectations = {
    'B1.1': 'Read, build, and break apart whole numbers up to and including 200.',
    'B1.2': 'Compare and order whole numbers up to and including 200.',
    'B2.4': 'Use objects, diagrams, and equations to add and subtract whole numbers with totals no greater than 100.',
    'C2.2': 'Find what must be added or subtracted to make two expressions equal.',
    'E2.4': 'Use seconds, minutes, hours, and other units to describe how long events last.'
  };
  const pool = [[42,35],[67,28],[48,27],[31,26],[49,36],[63,24]];
  const fixed = {
    1: {kind:'bank',title:'More and less',instruction:'Drag each answer to the right landing pad.',code:'B2.4',reason:'Students add or subtract 1, 10, and 20 with results no greater than 100.',rows:[
      {label:'Add 1',source:'37',answer:'38'},{label:'Subtract 1',source:'42',answer:'41'},
      {label:'Add 10',source:'58',answer:'68'},{label:'Subtract 10',source:'75',answer:'65'},
      {label:'Add 20',source:'26',answer:'46'},{label:'Subtract 20',source:'84',answer:'64'}]},
    2: {kind:'bank',title:'Before and after',instruction:'Place the number immediately before and after each number.',code:'B1.2',reason:'Students order neighbouring numbers, including a number above 100 but no higher than 200.',rows:[
      {label:'Before 27',source:'27',answer:'26'},{label:'After 27',source:'27',answer:'28'},
      {label:'Before 48',source:'48',answer:'47'},{label:'After 48',source:'48',answer:'49'},
      {label:'Before 65',source:'65',answer:'64'},{label:'After 65',source:'65',answer:'66'},
      {label:'Before 91',source:'91',answer:'90'},{label:'After 91',source:'91',answer:'92'},
      {label:'Before 134',source:'134',answer:'133'},{label:'After 134',source:'134',answer:'135'}]},
    3: {kind:'choice',title:'Regrouping subtraction A',instruction:'Choose the result of each subtraction. Think about trading a ten.',code:'B2.4',reason:'Students subtract within 100 using two-digit numbers and regrouping.',rows:[
      {label:'47 − 8',answer:'39'},{label:'62 − 7',answer:'55'},{label:'53 − 6',answer:'47'},
      {label:'71 − 4',answer:'67'},{label:'84 − 9',answer:'75'},{label:'92 − 5',answer:'87'}]},
    4: {kind:'choice',title:'Regrouping subtraction B',instruction:'Choose the result of each subtraction. Think about trading a ten.',code:'B2.4',reason:'Students solve a second set of subtraction questions within 100.',rows:[
      {label:'23 − 5',answer:'18'},{label:'64 − 8',answer:'56'},{label:'75 − 9',answer:'66'},
      {label:'52 − 6',answer:'46'},{label:'81 − 4',answer:'77'},{label:'93 − 7',answer:'86'}]},
    5: {kind:'choice',title:'Team Balance',instruction:'Make both sides of the equation equal.',code:'C2.2',reason:'Students find the missing amount that makes two addition expressions equivalent.',rows:[{label:'8 + 6 = 9 + ?',answer:'5',choices:['3','4','5','6','7']}]},
    6: {kind:'bank',title:'More and less B',instruction:'Drag each answer to the right landing pad.',code:'B2.4',reason:'Students add or subtract 1, 10, and 20 with results no greater than 100.',rows:[
      {label:'Add 1',source:'45',answer:'46'},{label:'Subtract 1',source:'63',answer:'62'},
      {label:'Add 10',source:'29',answer:'39'},{label:'Subtract 10',source:'92',answer:'82'},
      {label:'Add 20',source:'34',answer:'54'},{label:'Subtract 20',source:'76',answer:'56'}]},
    7: {kind:'choice',title:'Team Mystery',instruction:'Find each missing number.',code:'C2.2',reason:'Students find missing addends in equations with totals no greater than 100.',rows:[
      {label:'10 + ? = 15',answer:'5'},{label:'14 + ? = 20',answer:'6'},
      {label:'8 + ? = 17',answer:'9'},{label:'23 + ? = 30',answer:'7'},
      {label:'16 + ? = 24',answer:'8'}]},
    8: {kind:'select',title:'Build 149',instruction:'Count the hundreds, tens, and ones shown by the blocks.',code:'B1.1',reason:'Students compose 149 with base-ten materials, within the Grade 2 range to 200.',visual:'Count the blocks',visualNumber:149,rows:[
      {label:'Hundreds',answer:'1',choices:['0','1','2']},
      {label:'Tens',answer:'4',choices:['2','3','4','5']},
      {label:'Ones',answer:'9',choices:['7','8','9','0']}]},
    9: paddle(58,32,'Team Paddle','Students use tens and ones, including an exchange, to add 58 and 32 for a total of 90.'),
    16: {kind:'choice',title:'What number is this?',instruction:'Choose the number shown by 1 hundred, 3 tens, and 7 ones.',code:'B1.1',reason:'Students compose and identify a three-digit number within 200.',visual:'1 hundred + 3 tens + 7 ones',rows:[{label:'The number is',answer:'137',choices:['137','173','127','147','117']}]},
    17: {kind:'select',title:'Add block sets',instruction:'Use the tens and ones blocks to add 27 + 35.',code:'B2.4',reason:'Students model 27 + 35 = 62 with base-ten blocks and an exchange of ten ones.',visual:'27 + 35 = ?',visualAdd:[27,35],rows:[
      {label:'Tens exchanged',answer:'1',choices:['0','1','2']},
      {label:'Tens in the sum',answer:'6',choices:['4','5','6','7']},
      {label:'Ones in the sum',answer:'2',choices:['1','2','3','4']},
      {label:'Total',answer:'62',choices:['52','60','62','72']}]},
    18: {kind:'bank',title:'Number order',instruction:'Put the numbers in order from least to greatest.',code:'B1.2',reason:'Students compare and order nine whole numbers, all at or below 200.',rows:[18,27,46,59,73,108,125,147,192].map((value,index)=>({label:'Position '+(index+1),source:'',answer:String(value)}))},
    19: {kind:'bank',title:'How long does it last?',instruction:'Match each event to a reasonable duration.',code:'E2.4',reason:'Students use seconds, minutes, and hours to describe the duration of familiar events.',rows:[
      {label:'A blink lasts about',source:'👀',answer:'1 second'},
      {label:'A short song lasts about',source:'🎵',answer:'3 minutes'},
      {label:'A class lesson lasts about',source:'📚',answer:'1 hour'},
      {label:'One full day lasts',source:'☀️',answer:'24 hours'}]},
    20: {kind:'rinks',title:'CatTour: Build 24 Two Ways',instruction:'Drag number tiles into both cat rinks. Make 24 in two different ways.',code:'B2.4',reason:'Students model two different addition combinations that each total 24.',tiles:[10,5,4,1],rows:[
      {label:'🐱 Cat Rink A totals 24',answer:'24'},
      {label:'🐱 Cat Rink B totals 24',answer:'24'},
      {label:'The two combinations are different',answer:'Different'}]},
    21: {kind:'bank',title:'Ten-Frame Addition',instruction:'Count both ten-frame sets. Drag or tap the total card for each problem.',code:'B2.4',reason:'Students use ten-frame pictures to add two two-digit numbers, with totals no greater than 100.',distractors:['28','40'],rows:[
      {label:'Set 1',source:'18 + 14',a:18,b:14,answer:'32'},
      {label:'Set 2',source:'23 + 16',a:23,b:16,answer:'39'}]}
  };

  function paddle(a,b,title,reason) {
    const carry = Math.floor((a % 10 + b % 10) / 10);
    return {kind:'paddle',title,instruction:'Use the tens and ones to add. Choose the carry, tens, and ones in the answer.',code:'B2.4',reason,
      a,b,rows:[{label:'Carry ten',answer:String(carry),choices:['0','1']},
        {label:'Tens in the sum',answer:String(Math.floor((a+b)/10)),choices:Array.from({length:11},(_,i)=>String(i))},
        {label:'Ones in the sum',answer:String((a+b)%10),choices:Array.from({length:10},(_,i)=>String(i))}]};
  }
  function randomOrder() {
    const order = pool.map((_,index)=>index);
    for (let index=order.length-1;index>0;index--) {
      const other=Math.floor(Math.random()*(index+1));
      [order[index],order[other]]=[order[other],order[index]];
    }
    return order;
  }
  function validOrder(order) { return Array.isArray(order)&&order.length===6&&new Set(order).size===6&&order.every(value=>Number.isInteger(value)&&value>=0&&value<6); }
  let state;
  try { state=JSON.parse(localStorage.getItem(storageKey)||'null'); } catch (_) {}
  if (!state || typeof state!=='object') state={answers:{},seconds:{},paddleOrder:randomOrder()};
  state.answers=state.answers||{};
  state.seconds=state.seconds||{};
  state.regroupLights=state.regroupLights||{};
  if (!validOrder(state.paddleOrder)) state.paddleOrder=randomOrder();
  function config(number) {
    if (number>=10&&number<=15) {
      const [a,b]=pool[state.paddleOrder[number-10]];
      const carry=(a%10+b%10)>=10;
      return paddle(a,b,'Team Paddle '+(number-8),`Students use tens and ones to add ${a} and ${b} for a total of ${a+b}${carry?', exchanging ten ones for one ten':''}.`);
    }
    return fixed[number];
  }
  const activity=config(pageNumber);
  if (!activity) { document.body.textContent='This activity is unavailable.'; return; }
  document.title=`ExciteBFirsthalf · Page ${pageNumber} · ${activity.title}`;
  const visualGuides={
    1:['🧮 ➕ ➖','Move one step, one ten, or two tens.'],
    2:['🔢 ⬅️ ➡️','Find the neighbour just before or just after.'],
    3:['🟩 🟨 🔁','If there are too few ones, trade one ten for ten ones.'],
    4:['🟩 🟨 🔁','Use the tens and ones picture to plan your trade.'],
    5:['⚖️ ➕ 🎁','The two sides of the balance must have the same value.'],
    6:['🧮 ⬆️ ⬇️','Follow each jump forward or backward.'],
    7:['🎁 ➕ 🔍','Find the number hiding in the gift box.'],
    8:['🟦 🟩 🟨','Count hundreds squares, tens rods, and ones cubes.'],
    9:['🏓 🟩 🟨','Build both numbers with tens rods and ones cubes.'],
    10:['🏓 🟩 🟨','Start by combining the ones blocks.'],
    11:['🏓 🟩 🟨','Check whether ten ones can make a new ten.'],
    12:['🏓 🟩 🟨','Combine the tens after you count the ones.'],
    13:['🏓 🟩 🟨','Trade ten ones for one ten if needed.'],
    14:['🏓 🟩 🟨','Use the block pictures to check each place.'],
    15:['🏓 🟩 🟨','Count tens and ones separately, then combine.'],
    16:['🟦 🟩 🟨','Look at the hundreds, tens, and ones blocks.'],
    17:['🟩 🟨 🔁','Combine both block sets and exchange ten ones.'],
    18:['🔢 📏 ➡️','Follow the number line from least to greatest.'],
    19:['⏱️ 🎵 ☀️','Choose a sensible amount of time for each event.'],
    20:['🐱 🧊 🧩','Build two different collections of tiles that each make 24.'],
    21:['🔵 🔟 ➕','Count the filled dots in each ten-frame set.']
  };
  if(pageNumber===20){
    if(!Array.isArray(state.answers[20])||state.answers[20].length!==2||!state.answers[20].every(Array.isArray))state.answers[20]=[[],[]];
  }else if(!Array.isArray(state.answers[pageNumber]) || state.answers[pageNumber].length!==activity.rows.length) state.answers[pageNumber]=Array(activity.rows.length).fill(null);
  let selectedBank=null, selectedRink=null, selectedDot=null, drag=null, ghost=null, feedbackMessage='';
  let lastTick=Date.now();
  const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function save(allPages=false){
    try {
      const latest=JSON.parse(localStorage.getItem(storageKey)||'null')||{};
      const merged={...latest,...state};
      merged.answers={...(latest.answers||{}),...(allPages?state.answers:{[pageNumber]:state.answers[pageNumber]})};
      merged.seconds={...(latest.seconds||{}),[pageNumber]:Math.max(Number(latest.seconds?.[pageNumber])||0,Number(state.seconds[pageNumber])||0)};
      merged.regroupLights={...(latest.regroupLights||{}),[pageNumber]:state.regroupLights[pageNumber]||false};
      merged.visualDots={...(latest.visualDots||{}),...(allPages?state.visualDots||{}:pageNumber===21?{21:state.visualDots?.[21]}:{})};
      localStorage.setItem(storageKey,JSON.stringify(merged));
      state=merged;
    } catch (_) {}
  }
  function tick(){ const now=Date.now(),delta=Math.max(0,(now-lastTick)/1000);state.seconds[pageNumber]=(state.seconds[pageNumber]||0)+delta;lastTick=now;save();updateTimer(); }
  function formatTime(seconds){const whole=Math.floor(seconds||0);return String(Math.floor(whole/60)).padStart(2,'0')+':'+String(whole%60).padStart(2,'0');}
  function updateTimer(){ const total=Object.values(state.seconds).reduce((sum,value)=>sum+(Number(value)||0),0);document.getElementById('timeDisplay').textContent=formatTime(total); }
  function answerAt(number,index){return state.answers[number]?.[index]??null;}
  function rinkTotal(tiles){return tiles.reduce((sum,value)=>sum+Number(value),0);}
  function distinctRinks(ways){return ways[0].slice().sort((a,b)=>a-b).join(',')!==ways[1].slice().sort((a,b)=>a-b).join(',');}
  function responseFor(number,index){
    if(number!==20)return answerAt(number,index);
    const ways=state.answers[20];
    if(!Array.isArray(ways)||ways.length!==2)return null;
    if(index<2)return ways[index].length?`${ways[index].join(' + ')} = ${rinkTotal(ways[index])}`:null;
    return ways.every(way=>way.length)?distinctRinks(ways)?'Different':'Same':null;
  }
  function result(number,index){
    if(number===20){
      const ways=state.answers[20];
      if(!Array.isArray(ways)||ways.length!==2)return 'Not answered';
      if(index<2)return !ways[index].length?'Not answered':rinkTotal(ways[index])===24?'Correct':'Incorrect';
      if(ways.some(way=>!way.length))return 'Not answered';
      return ways.every(way=>rinkTotal(way)===24)&&distinctRinks(ways)?'Correct':'Incorrect';
    }
    const response=answerAt(number,index),correct=config(number).rows[index].answer;
    return response===null||response===''?'Not answered':String(response)===String(correct)?'Correct':'Incorrect';
  }
  function score(number){ const rows=config(number).rows;return rows.reduce((sum,_,index)=>sum+(result(number,index)==='Correct'?1:0),0); }
  function captureVisibleWork(){
    const work=document.getElementById('work');
    if(!work)return;
    if(activity.kind==='select'||activity.kind==='paddle'){
      work.querySelectorAll('select[data-index]').forEach(control=>{state.answers[pageNumber][Number(control.dataset.index)]=control.value||null;});
    }else if(activity.kind==='choice'){
      activity.rows.forEach((_,index)=>{state.answers[pageNumber][index]=work.querySelector(`.choice-buttons button.selected[data-index="${index}"]`)?.dataset.value||null;});
    }else if(activity.kind==='bank'){
      work.querySelectorAll('.landing-pad').forEach(pad=>{state.answers[pageNumber][Number(pad.dataset.index)]=pad.querySelector('.number-card')?.dataset.value||null;});
      if(pageNumber===21){
        state.visualDots=state.visualDots||{};
        state.visualDots[21]=activity.rows.map((_,index)=>[...work.querySelectorAll(`.frame-dot[data-problem="${index}"]`)].map(dot=>dot.classList.contains('red')?'red':dot.classList.contains('blue')?'blue':''));
      }
    }else if(activity.kind==='rinks'){
      state.answers[20]=[...work.querySelectorAll('.rink-pad')].map(pad=>[...pad.querySelectorAll('.placed-tile')].map(tile=>Number(tile.dataset.value)));
    }
    save();
  }
  function setAnswer(index,value){state.answers[pageNumber][index]=value;selectedBank=null;feedbackMessage='';save();renderWork();updateFeedback();}
  function orderValues(values){const list=[...values],seed=pageNumber*17+student.length*23;return list.sort((a,b)=>{const hash=value=>String(value).split('').reduce((sum,char)=>sum*31+char.charCodeAt(0),seed);return hash(a)%113-hash(b)%113;});}
  function optionsFor(row,index){
    if(row.choices) return orderValues(row.choices);
    const value=Number(row.answer),offsets=[0,-1,1,-2,2],values=offsets.map(offset=>value+offset).filter(number=>number>=0&&number<=200);
    return orderValues([...new Set(values.map(String))]);
  }
  function blockSet(number,hideNumber=false,litOnes=0){const hundreds=Math.floor(number/100),tens=Math.floor((number%100)/10),ones=number%10;return `<div class="model-row"><b>${hideNumber?'?':number}</b><span>${'<i class="hundred-block" aria-hidden="true"></i>'.repeat(hundreds)}${'<i class="rod" aria-hidden="true"></i>'.repeat(tens)}${Array.from({length:ones},(_,index)=>`<i class="cube${index<litOnes?' lit':''}" aria-hidden="true"></i>`).join('')}</span></div>`;}
  function regroupInfo(a,b){const ones=(a%10)+(b%10);return {ones,lit:Math.min(10,ones),canTrade:ones>=10};}
  function defaultDots(row){
    const firstSlots=Math.ceil(row.a/10)*10,secondSlots=Math.ceil(row.b/10)*10;
    return [...Array(row.a).fill('red'),...Array(firstSlots-row.a).fill(''),...Array(row.b).fill('blue'),...Array(secondSlots-row.b).fill('')];
  }
  function dotsFor(problem,row){
    state.visualDots=state.visualDots||{};
    state.visualDots[21]=state.visualDots[21]||[];
    const saved=state.visualDots[21][problem],initial=defaultDots(row);
    if(!Array.isArray(saved)||saved.length!==initial.length)state.visualDots[21][problem]=initial;
    return state.visualDots[21][problem];
  }
  function tenFrames(number,dots,offset,problem){
    return `<div class="ten-frame-set" aria-label="${number} dot places">${Array.from({length:Math.ceil(number/10)},(_,frame)=>`<div class="ten-frame">${Array.from({length:10},(_,dot)=>{const slot=offset+frame*10+dot,color=dots[slot]||'';return `<button type="button" class="frame-dot${color?' filled '+color:''}${selectedDot?.problem===problem&&selectedDot?.slot===slot?' selected':''}" data-problem="${problem}" data-slot="${slot}" aria-label="${color?color+' dot':'empty dot space'}"></button>`}).join('')}</div>`).join('')}</div>`;
  }
  let fitPending=false;
  function fitWork(){
    const work=document.getElementById('work');
    if(!work||!work.clientHeight)return;
    let stage=work.querySelector(':scope > .work-scale');
    if(!stage){
      stage=document.createElement('div');stage.className='work-scale';
      while(work.firstChild)stage.appendChild(work.firstChild);
      work.appendChild(stage);
    }
    stage.style.transform='none';
    const style=getComputedStyle(work);
    const availableHeight=work.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom)-4;
    const availableWidth=work.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight)-4;
    const scale=Math.max(.1,Math.min(1,availableHeight/Math.max(1,stage.scrollHeight),availableWidth/Math.max(1,stage.scrollWidth)));
    stage.style.transform=`scale(${scale})`;
  }
  function scheduleFit(){if(fitPending)return;fitPending=true;requestAnimationFrame(()=>{fitPending=false;fitWork();});}
  function choiceVisual(row){
    if(pageNumber===3||pageNumber===4){
      const [whole,takeAway]=row.label.match(/\d+/g).map(Number);
      const tens=Math.floor(whole/10),ones=whole%10;
      return `<div class="subtraction-model" aria-label="${tens} tens and ${ones} ones; take away ${takeAway}"><span aria-hidden="true">${'🟩'.repeat(tens)} ${'🟨'.repeat(ones)}</span><small>✋ take away ${takeAway} ones</small></div>`;
    }
    if(pageNumber===7)return '<div class="mystery-model" aria-hidden="true">➕ 🎁 = 🔍</div>';
    return '';
  }
  function renderBank() {
    const answers=state.answers[pageNumber],all=orderValues([...activity.rows.map(row=>row.answer),...(activity.distractors||[])]),used=new Set(answers.filter(value=>value!==null));
    const bankCards=all.filter(value=>!used.has(value)).map(value=>`<button type="button" class="number-card${selectedBank===value?' selected':''}" data-value="${escape(value)}">${escape(value)}</button>`).join('');
    const rows=activity.rows.map((row,index)=>{
      const placed=answers[index],card=placed===null?'<span>Drop here</span>':`<button type="button" class="number-card" data-value="${escape(placed)}">${escape(placed)}</button>`;
      const cue=pageNumber===1||pageNumber===6?(row.label.startsWith('Add')?' ⬆️':' ⬇️'):pageNumber===2?(row.label.startsWith('Before')?' ⬅️':' ➡️'):'';
      const dots=pageNumber===21?dotsFor(index,row):null,firstSlots=pageNumber===21?Math.ceil(row.a/10)*10:0;
      const frames=pageNumber===21?`<div class="ten-frame-model">${tenFrames(row.a,dots,0,index)}<b>+</b>${tenFrames(row.b,dots,firstSlots,index)}</div>`:'';
      return `<div class="question-row${pageNumber===21?' tenframe-question':''}"><div class="question-label">${escape(row.label)}<span aria-hidden="true">${cue}</span></div><div class="question-source">${escape(row.source||(pageNumber===18?'🔢':'→'))}</div><div class="landing-pad${placed===null?'':' filled'}" data-index="${index}" role="button" tabindex="0">${card}</div>${frames}</div>`;
    }).join('');
    document.getElementById('work').innerHTML=`<div class="bank-layout"><div class="bank" id="answerBank"><span class="bank-title">Answer bank · drag or tap a card</span>${bankCards}</div><div class="question-grid${pageNumber===19?' duration-grid':''}">${rows}</div></div>`;
    const workspace=document.getElementById('work');
    workspace.querySelectorAll('.number-card').forEach(card=>{
      card.addEventListener('click',event=>{event.stopPropagation();selectedBank=card.dataset.value;workspace.querySelectorAll('.number-card').forEach(item=>item.classList.toggle('selected',item.dataset.value===selectedBank));});
      card.addEventListener('pointerdown',event=>{if(event.button!==0)return;drag={value:card.dataset.value,x:event.clientX,y:event.clientY,element:card};});
      card.addEventListener('dragstart',event=>event.preventDefault());
    });
    workspace.querySelectorAll('.landing-pad').forEach(pad=>{
      const index=Number(pad.dataset.index);
      pad.addEventListener('click',()=>{if(selectedBank!==null)placeCard(index,selectedBank);else if(answers[index]!==null)setAnswer(index,null);});
      pad.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();pad.click();}});
    });
    workspace.querySelectorAll('.frame-dot').forEach(dot=>{
      dot.addEventListener('click',event=>{
        event.stopPropagation();
        const problem=Number(dot.dataset.problem),slot=Number(dot.dataset.slot),colors=dotsFor(problem,activity.rows[problem]);
        if(colors[slot])selectedDot={problem,slot};
        else if(selectedDot?.problem===problem){colors[slot]=colors[selectedDot.slot];colors[selectedDot.slot]='';selectedDot=null;save();}
        renderBank();
      });
      dot.addEventListener('pointerdown',event=>{if(event.button!==0)return;const problem=Number(dot.dataset.problem),slot=Number(dot.dataset.slot);if(!dotsFor(problem,activity.rows[problem])[slot])return;drag={kind:'dot',problem,slot,x:event.clientX,y:event.clientY,element:dot};});
      dot.addEventListener('dragstart',event=>event.preventDefault());
    });
    document.getElementById('answerBank').addEventListener('click',event=>{if(selectedBank!==null&&!event.target.closest('.number-card'))returnCard(selectedBank);});
    scheduleFit();
  }
  function placeCard(index,value){
    if(![...activity.rows.map(row=>row.answer),...(activity.distractors||[])].includes(value))return;
    const current=state.answers[pageNumber],old=current.indexOf(value);
    if(old>=0)current[old]=null;
    setAnswer(index,value);
  }
  function returnCard(value){const old=state.answers[pageNumber].indexOf(value);if(old>=0)setAnswer(old,null);}
  function renderChoices(){
    const model=pageNumber===16?`<div class="visual-model"><div class="equation">${escape(activity.visual)}</div>${blockSet(137,true)}</div>`:'';
    document.getElementById('work').innerHTML=model+`<div class="choice-grid">${activity.rows.map((row,index)=>`<section class="choice-row"><h2>${escape(row.label)}</h2>${choiceVisual(row)}<div class="choice-buttons">${optionsFor(row,index).map(value=>`<button type="button" data-index="${index}" data-value="${escape(value)}" class="${answerAt(pageNumber,index)===value?'selected':''}">${escape(value)}</button>`).join('')}</div></section>`).join('')}</div>`;
    document.querySelectorAll('.choice-buttons button').forEach(button=>button.addEventListener('click',()=>setAnswer(Number(button.dataset.index),button.dataset.value)));
    scheduleFit();
  }
  function renderSelects(){
    const visual=activity.visual?`<div class="visual-model"><div class="equation">${escape(activity.visual)}</div>${activity.visualNumber?blockSet(activity.visualNumber,true):''}${activity.visualAdd?`<div class="base-ten-sets">${activity.visualAdd.map(number=>blockSet(number)).join('')}</div>`:''}</div>`:'';
    document.getElementById('work').innerHTML=visual+`<div class="select-grid">${activity.rows.map((row,index)=>`<label class="select-card">${escape(row.label)}<select data-index="${index}" aria-label="${escape(row.label)}"><option value="">Choose</option>${row.choices.map(value=>`<option value="${escape(value)}"${answerAt(pageNumber,index)===value?' selected':''}>${escape(value)}</option>`).join('')}</select></label>`).join('')}</div>`;
    document.querySelectorAll('.select-card select').forEach(select=>select.addEventListener('change',()=>setAnswer(Number(select.dataset.index),select.value||null)));
    scheduleFit();
  }
  function renderPaddle(){
    const a=activity.a,b=activity.b;
    const showSwitch=pageNumber>=10&&pageNumber<=15,info=regroupInfo(a,b),on=showSwitch&&info.canTrade&&Boolean(state.regroupLights[pageNumber]);
    const firstLit=on?Math.min(a%10,info.lit):0,secondLit=on?info.lit-firstLit:0;
    const lightState=on?(info.canTrade?'ten-lit':'not-enough-lit'):'';
    const switchPanel=showSwitch?`<div class="regroup-panel ${lightState}"><div class="regroup-control"><button type="button" id="regroupSwitch" class="regroup-switch${on?' on':''}" aria-pressed="${on}">Regroup</button><span class="switch-emoji" aria-label="Light switch">🎚️ 💡</span></div><div class="regroup-light-row" aria-label="${on?info.lit:0} of 10 ones lit">${Array.from({length:10},(_,index)=>`<span class="regroup-light${on&&index<info.lit?' lit':''}" aria-hidden="true"></span>`).join('')}</div><p class="regroup-explanation">${on?info.canTrade?'10 ones lit — trade these 10 ones for 1 ten.':`${info.ones} ones lit — not enough to make a new ten.`:'Press Regroup to light the ones and check for a group of ten.'}</p></div>`:'';
    document.getElementById('work').innerHTML=`<div class="paddle"><div class="visual-model ${lightState}"><div class="equation">${a} + ${b}</div><div class="base-ten-sets ${lightState}">${blockSet(a,false,firstLit)}${blockSet(b,false,secondLit)}</div></div>${switchPanel}<div class="select-grid">${activity.rows.map((row,index)=>`<label class="select-card">${escape(row.label)}<select data-index="${index}" aria-label="${escape(row.label)}"><option value="">Choose</option>${row.choices.map(value=>`<option value="${escape(value)}"${answerAt(pageNumber,index)===value?' selected':''}>${escape(value)}</option>`).join('')}</select></label>`).join('')}</div></div>`;
    document.querySelectorAll('.select-card select').forEach(select=>select.addEventListener('change',()=>setAnswer(Number(select.dataset.index),select.value||null)));
    document.getElementById('regroupSwitch')?.addEventListener('click',()=>{
      if(!info.canTrade){state.regroupLights[pageNumber]=false;save();renderPaddle();alert('Regroup not needed');return;}
      state.regroupLights[pageNumber]=!state.regroupLights[pageNumber];save();renderPaddle();
    });
    scheduleFit();
  }
  function updateRinks(){feedbackMessage='';save();renderWork();updateFeedback();}
  function renderRinks(){
    const ways=state.answers[20];
    const tile=value=>`<span class="tile-count">${value}</span><span class="tile-squares" aria-hidden="true">${'<i></i>'.repeat(value)}</span>`;
    document.getElementById('work').innerHTML=`<div class="rink-scene"><div class="rink-bank" id="rinkBank"><div class="rink-bank-title">🐱 Tile bank · drag or tap any tile as many times as needed</div>${activity.tiles.map(value=>`<button type="button" class="number-card rink-tile rink-tile-${value}${selectedBank===String(value)?' selected':''}" data-value="${value}" aria-label="Tile of ${value} squares">${tile(value)}</button>`).join('')}</div><div class="rinks">${ways.map((way,index)=>`<section class="rink"><h2>🐱 Cat Rink ${index===0?'A':'B'}</h2><div class="rink-pad" data-index="${index}" role="button" tabindex="0" aria-label="Cat Rink ${index===0?'A':'B'} drop area">${way.length?way.map((value,tileIndex)=>`<button type="button" class="number-card rink-tile rink-tile-${value} placed-tile${selectedRink?.rink===index&&selectedRink?.tile===tileIndex?' selected':''}" data-rink="${index}" data-tile="${tileIndex}" data-value="${value}" title="Drag to move; tap then tap a rink to move" aria-label="Placed tile of ${value} squares">${tile(value)}</button>`).join(''):'<span class="rink-hint">Drop number tiles here</span>'}</div><p class="rink-total">${way.length?`Tiles: ${way.join(' + ')}`:'Choose tiles to make 24'}</p></section>`).join('')}</div><p class="rink-tip">🧩 Each rink needs a different combination. Tap a placed tile, then tap another rink to move it, or drag it back to the bank.</p></div>`;
    const workspace=document.getElementById('work');
    workspace.querySelectorAll('#rinkBank .number-card').forEach(card=>{
      card.addEventListener('click',event=>{event.stopPropagation();selectedBank=card.dataset.value;selectedRink=null;renderRinks();});
      card.addEventListener('pointerdown',event=>{if(event.button!==0)return;drag={kind:'rink-new',value:Number(card.dataset.value),x:event.clientX,y:event.clientY,element:card};});
      card.addEventListener('dragstart',event=>event.preventDefault());
    });
    workspace.querySelectorAll('.placed-tile').forEach(card=>{
      card.addEventListener('click',event=>{event.stopPropagation();selectedRink={rink:Number(card.dataset.rink),tile:Number(card.dataset.tile)};selectedBank=null;renderRinks();});
      card.addEventListener('pointerdown',event=>{if(event.button!==0)return;drag={kind:'rink-existing',rink:Number(card.dataset.rink),tile:Number(card.dataset.tile),value:Number(card.dataset.value),x:event.clientX,y:event.clientY,element:card};});
      card.addEventListener('dragstart',event=>event.preventDefault());
    });
    workspace.querySelectorAll('.rink-pad').forEach(pad=>{
      const index=Number(pad.dataset.index);
      const place=()=>{
        if(selectedRink){const tile=state.answers[20][selectedRink.rink].splice(selectedRink.tile,1)[0];state.answers[20][index].push(tile);selectedRink=null;updateRinks();}
        else if(selectedBank!==null){state.answers[20][index].push(Number(selectedBank));selectedBank=null;updateRinks();}
      };
      pad.addEventListener('click',place);
      pad.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();place();}});
    });
    document.getElementById('rinkBank').addEventListener('click',event=>{
      if(event.target.closest('.number-card')||!selectedRink)return;
      state.answers[20][selectedRink.rink].splice(selectedRink.tile,1);selectedRink=null;updateRinks();
    });
    scheduleFit();
  }
  function renderWork(){
    if(activity.kind==='bank')renderBank();
    if(activity.kind==='choice')renderChoices();
    if(activity.kind==='select')renderSelects();
    if(activity.kind==='paddle')renderPaddle();
    if(activity.kind==='rinks')renderRinks();
  }
  function updateFeedback(){
    const element=document.getElementById('feedback');
    element.className='feedback';
    element.textContent=feedbackMessage||'Your work is saved as you go. Select an answer for each part.';
    if(feedbackMessage)element.classList.add(score(pageNumber)===activity.rows.length?'good':'try');
  }
  function checkPage(){
    const earned=score(pageNumber),available=activity.rows.length;
    feedbackMessage=earned===available?`All ${available} marks correct.`:`${earned} of ${available} correct. Check your work and try again.`;
    updateFeedback();
  }
  function showCurriculum(){document.getElementById('curriculumModal').hidden=false;}
  function report(){
    captureVisibleWork();
    tick();
    const body=Array.from({length:totalPages},(_,number)=>{
      const page=number+1,cfg=config(page),earned=score(page),available=cfg.rows.length;
      return `<section class="report-page"><h2>Page ${page}: ${escape(cfg.title)} — ${earned}/${available}</h2><p><b>Grade 2 ${escape(cfg.code)}:</b> ${escape(expectations[cfg.code])}</p><table><thead><tr><th>Item</th><th>Student answer</th><th>Correct answer</th><th>Result</th></tr></thead><tbody>${cfg.rows.map((row,index)=>`<tr><td>${escape(row.label)}</td><td>${escape(responseFor(page,index)??'—')}</td><td>${escape(row.answer)}</td><td>${result(page,index)}</td></tr>`).join('')}</tbody></table></section>`;
    }).join('');
    const earned=Array.from({length:totalPages},(_,index)=>score(index+1)).reduce((sum,value)=>sum+value,0);
    const available=Array.from({length:totalPages},(_,index)=>config(index+1).rows.length).reduce((sum,value)=>sum+value,0);
    const windowReport=window.open('','_blank');
    if(!windowReport){alert('Allow pop-ups to open the PDF assessment.');return;}
    windowReport.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>ExciteBFirsthalf Grade 2 assessment</title><style>@page{size:letter;margin:.55in}body{font:12px Arial;color:#172b48}h1{margin:0}h2{font-size:15px;margin:17px 0 5px}.report-page{break-inside:avoid}table{width:100%;border-collapse:collapse}td,th{border:1px solid #6b7e96;padding:5px;text-align:left}th{background:#e9f5ff}</style></head><body><h1>ExciteBFirsthalf · Grade 2 assessment</h1><p><b>Student:</b> ${escape(student)} &nbsp; <b>Current score:</b> ${earned}/${available} &nbsp; <b>Time:</b> ${escape(document.getElementById('timeDisplay').textContent)}</p><p>Assessed from the answers saved when this report was opened. Unanswered items earn no marks.</p>${body}</body></html>`);
    windowReport.document.close();
    setTimeout(()=>windowReport.print(),250);
  }
  function navigate(delta){
    const destination=pageNumber+delta;
    if(destination<1||destination>totalPages)return;
    captureVisibleWork();tick();
    location.href='Dream'+destination+'.html'+location.search;
  }

  document.body.innerHTML=`<main class="activity-shell"><header class="toolbar"><strong>ExciteBFirsthalf · Page ${pageNumber} of ${totalPages}</strong><span class="timer" id="timeDisplay">00:00</span><button type="button" class="curriculum-launch" id="curriculumButton"><img src="assets/ontario-curriculum-trillium.png" alt="">Ontario Grade 2</button><button type="button" id="pdfButton">PDF Assessment</button><button type="button" id="checkButton">Check Page</button></header><section class="activity-header"><h1>${escape(activity.title)}</h1><p>${escape(activity.instruction)}</p></section><div class="visual-support"><span class="visual-support-icons" aria-hidden="true">${visualGuides[pageNumber][0]}</span><span>${escape(visualGuides[pageNumber][1])}</span></div><section class="workspace" id="work" aria-label="Activity"></section><div class="feedback" id="feedback"></div></main><button type="button" class="last-fixed last-top" id="lastTop">← Last Page</button><button type="button" class="last-fixed last-bottom" id="lastBottom">← Last Page</button><button type="button" class="next-fixed next-top" id="nextTop">Next Page →</button><button type="button" class="next-fixed next-bottom" id="nextBottom">Next Page →</button><button type="button" class="teacher-dot" id="teacherDot" title="Teacher answer fill" aria-label="Teacher: fill correct answers on all ${totalPages} pages"></button><div class="modal" id="curriculumModal" hidden><div class="modal-card" role="dialog" aria-modal="true"><h2>Ontario Grade 2 Mathematics</h2><p><b>${escape(activity.code)}</b> — ${escape(expectations[activity.code])}</p><p><b>How this page addresses it:</b> ${escape(activity.reason)}</p><p>Source: The Ontario Curriculum, Grades 1–8: Mathematics, 2020.</p><button type="button" id="closeCurriculum">Close</button></div></div>`;
  renderWork();updateFeedback();updateTimer();save();
  document.getElementById('curriculumButton').addEventListener('click',showCurriculum);
  document.getElementById('closeCurriculum').addEventListener('click',()=>document.getElementById('curriculumModal').hidden=true);
  document.getElementById('curriculumModal').addEventListener('click',event=>{if(event.target.id==='curriculumModal')event.currentTarget.hidden=true;});
  document.getElementById('pdfButton').addEventListener('click',report);
  document.getElementById('checkButton').addEventListener('click',checkPage);
  ['lastTop','lastBottom'].forEach(id=>{const button=document.getElementById(id);button.disabled=pageNumber===1;button.addEventListener('click',()=>navigate(-1));});
  ['nextTop','nextBottom'].forEach(id=>{const button=document.getElementById(id);button.disabled=pageNumber===totalPages;button.addEventListener('click',()=>navigate(1));});
  document.getElementById('teacherDot').addEventListener('click',()=>{
    if(prompt('Teacher code')!=='259')return;
    for(let number=1;number<=totalPages;number++)state.answers[number]=number===20?[[10,10,4],[10,5,5,4]]:config(number).rows.map(row=>row.answer);
    state.visualDots=state.visualDots||{};
    state.visualDots[21]=config(21).rows.map(defaultDots);
    feedbackMessage=`Teacher filled all correct answers on all ${totalPages} pages.`;
    save(true);renderWork();updateFeedback();
  });
  document.addEventListener('pointermove',event=>{
    if(!drag)return;
    if(Math.hypot(event.clientX-drag.x,event.clientY-drag.y)<8&&!ghost)return;
    if(!ghost){ghost=drag.element.cloneNode(true);ghost.classList.add('drag-ghost');document.body.appendChild(ghost);}
    ghost.style.left=event.clientX+'px';ghost.style.top=event.clientY+'px';
    if(event.cancelable)event.preventDefault();
  },{passive:false});
  document.addEventListener('pointerup',event=>{
    if(!drag)return;
    const moved=Math.hypot(event.clientX-drag.x,event.clientY-drag.y)>=8,held=drag,value=drag.value;
    ghost?.remove();ghost=null;drag=null;
    if(!moved)return;
    const target=document.elementFromPoint(event.clientX,event.clientY);
    if(held.kind==='dot'){
      const destination=target?.closest('.frame-dot');
      if(destination&&Number(destination.dataset.problem)===held.problem){
        const colors=dotsFor(held.problem,activity.rows[held.problem]),slot=Number(destination.dataset.slot);
        if(!colors[slot]&&colors[held.slot]){colors[slot]=colors[held.slot];colors[held.slot]='';selectedDot=null;save();renderBank();}
      }
      return;
    }
    if(pageNumber===20){
      const pad=target?.closest('.rink-pad');
      if(pad){
        if(held.kind==='rink-existing')state.answers[20][held.rink].splice(held.tile,1);
        state.answers[20][Number(pad.dataset.index)].push(value);
        selectedBank=null;selectedRink=null;updateRinks();
      }else if(held.kind==='rink-existing'&&target?.closest('#rinkBank')){
        state.answers[20][held.rink].splice(held.tile,1);
        selectedBank=null;selectedRink=null;updateRinks();
      }
      return;
    }
    const pad=target?.closest('.landing-pad');
    if(pad)placeCard(Number(pad.dataset.index),value);
    else if(target?.closest('#answerBank'))returnCard(value);
  });
  document.addEventListener('pointercancel',()=>{ghost?.remove();ghost=null;drag=null;});
  window.addEventListener('pagehide',()=>{captureVisibleWork();tick();});
  window.addEventListener('resize',scheduleFit);
  window.visualViewport?.addEventListener('resize',scheduleFit);
  setInterval(tick,1000);
})();
