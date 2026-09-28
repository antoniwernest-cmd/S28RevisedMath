(() => {
  "use strict";
  const match = location.pathname.match(/DreamB(\d+)(?:\.html)?\/?$/i);
  if (!match) return;
  const page = Number(match[1]), sequence = [1,2,3,4,5,9,10,11,12,23,24,25,26,27,28,13,14,15,16], position = sequence.indexOf(page), total = sequence.length, params = location.search;
  const student = new URLSearchParams(params).get("student") || "Student";
  const storageKey = "inspireb-firsthalf-assessment-" + student;
  const draftKey = "inspireb-firsthalf-page-drafts-" + student;
  const titles = ["More 10 / More 100","Before & After","Regrouping Subtraction A","Regrouping Subtraction B","Team Balance","More 10 / More 100 B","Team Mystery","Number Words","Team Paddle","Team Paddle 2","Team Paddle 3","Team Paddle 4","Team Paddle 5","Team Paddle 6","Team Paddle 7","What Number Is This?","Add Block Sets","Number Order","Read the Clock"];
  const focus = ["B1.5 and B2.3 · Use place value and mental math to add or subtract 1, 10, and 100.","B1.2 · Compare and order whole numbers up to 1000.","B2.4 and B2.5 · Use regrouping to subtract whole numbers.","B2.4 and B2.5 · Use regrouping to subtract whole numbers.","B2.5 · Solve addition and subtraction problems with whole numbers.","B1.5 and B2.3 · Use place value and mental math to add or subtract 1, 10, and 100.","B2.5 · Solve a whole-number problem using number relationships.","B1.1 · Read and represent whole numbers up to 1000.","B2.4 and B2.5 · Add whole numbers using place-value strategies.","B2.4 and B2.5 · Add whole numbers using place-value strategies.","B2.4 and B2.5 · Add whole numbers using place-value strategies.","B2.4 and B2.5 · Add whole numbers using place-value strategies.","B2.4 and B2.5 · Add whole numbers using place-value strategies.","B2.4 and B2.5 · Add whole numbers using place-value strategies.","B2.4 and B2.5 · Add whole numbers using place-value strategies.","B1.5 · Represent a three-digit number with hundreds, tens, and ones.","B1.5 and B2.5 · Combine base-ten blocks and find the sum.","B1.2 · Compare and order whole numbers up to 1000.","E2.6 · Use analogue clocks to tell time in hours and minutes."];
  const titleFor = number => titles[sequence.indexOf(number)] || "DreamB activity";
  const focusFor = number => focus[sequence.indexOf(number)] || "Ontario Mathematics learning.";
  // M26 rules: evaluate current work after student actions; force a fresh evaluation for every PDF;
  // red-dot completion runs only when that dot is pressed; Next/Last saves and restores all current answers without clearing any page.
  const M26_RULES = Object.freeze({liveReassessment:true,freshPdfEvaluation:true,redDotManualOnly:true,navigationPreservesAnswers:true,pageDraftsPersisted:true});
  const load = () => { try { return JSON.parse(localStorage.getItem(storageKey)) || {}; } catch (_) { return {}; } };
  // A project that starts without an assessment record is a new student entry: remove every saved page draft.
  try { if(!localStorage.getItem(storageKey)) localStorage.removeItem(draftKey); } catch (_) {}
  const record = load();
  record.student = student; record.pages = record.pages || {};
  const entry = record.pages[page] || (record.pages[page] = {page:page,title:titleFor(page),seconds:0,checks:0,firstVisited:new Date().toISOString()});
  const save = () => {
    // Activity scripts save their own live answer state. Never replace that newer state with this page's old navigation copy.
    const latest=load(); latest.student=student; latest.pages=latest.pages||{};
    const newest=latest.pages[page]||{};
    latest.pages[page]={...entry,...newest,seconds:Math.max(entry.seconds||0,newest.seconds||0),checks:Math.max(entry.checks||0,newest.checks||0),lastVisited:new Date().toISOString()};
    try { localStorage.setItem(storageKey,JSON.stringify(latest)); } catch (_) {}
  };
  save();
  const multiQuestionStores = {
    1:"inspireb-firsthalf-p26-panther-f-1-more-10-more-100-more-state-v1", 2:"inspireb-firsthalf-p26-panther-f-before-after-a-state-v1",
    3:"inspireb-firsthalf-p26-panther-f-regrouping-subtraction-a-v1", 4:"inspireb-firsthalf-p26-panther-f-regrouping-subtraction-b-v1",
    5:"inspireb-firsthalf-p26-team-balance-v1", 8:"inspireb-firsthalf-p26-team-more-10-more-100-more-a-state-v1",
    9:"inspireb-firsthalf-p26-team-more-10-more-100-more-b-state-v1", 10:"inspireb-firsthalf-p26-teammystery-cards-v1", 12:"inspireb-firsthalf-p26-teampaddle-v1",
    23:"inspireb-firsthalf-p26-teampaddle-2-v1", 24:"inspireb-firsthalf-p26-teampaddle-3-v1", 25:"inspireb-firsthalf-p26-teampaddle-4-v1",
    26:"inspireb-firsthalf-p26-teampaddle-5-v1", 27:"inspireb-firsthalf-p26-teampaddle-6-v1", 28:"inspireb-firsthalf-p26-teampaddle-7-v1",
    18:"inspireb-firsthalf-p26-team-more-10-more-100-more-c-state-v1", 19:"inspireb-firsthalf-p26-team-more-10-more-100-more-d-state-v1",
    20:"inspireb-firsthalf-p26-team-more-10-more-100-more-e-state-v1", 21:"inspireb-firsthalf-p26-team-more-10-more-100-more-f-state-v1", 22:"inspireb-firsthalf-p26-team-more-10-more-100-more-g-state-v1"
  };
  const multiQuestionTotals = {3:6,4:6};
  const multiQuestionScore = number => {
    const key = multiQuestionStores[number]; if (!key) return null;
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "null"); if (!saved) return null;
      const answered = value => value !== undefined && value !== null && value !== "";
      const same = (left, right) => String(left) === String(right);
      const questionResults = [];
      if (Array.isArray(saved.pages)) {
        const hasWork = row => row && (row.attempts > 0 || answered(row.selected) || answered(row.response) || row.answerRecord || (Array.isArray(row.response) && row.response.some(answered)));
        const workedRows = saved.pages.filter(hasWork);
        const sourceRows = [1,9,18,19,20,21,22].includes(number) ? (workedRows.length ? workedRows : saved.pages).filter(row=>row.type==="moreless100") : (workedRows.length ? workedRows : saved.pages);
        sourceRows.forEach((row, rowIndex) => {
          if (row.tensAnswer !== undefined && row.onesAnswer !== undefined && Number.isFinite(row.a) && Number.isFinite(row.b)) {
            const total = Number(row.a) + Number(row.b), tens = Math.floor(total / 10), ones = total % 10;
            questionResults.push({label:"Tens",result:row.tensAnswer === "" ? "Not answered" : Number(row.tensAnswer) === tens ? "Correct" : "Incorrect"});
            questionResults.push({label:"Ones",result:row.onesAnswer === "" ? "Not answered" : Number(row.onesAnswer) === ones ? "Correct" : "Incorrect"});
          } else if (Array.isArray(row.padValues) && Number.isFinite(row.groups) && Number.isFinite(row.each)) {
            const changed = new Set((row.answerHistory || []).map(item => Number(item.changedPad)));
            for (let index = 0; index < row.groups; index += 1) {
              const value = row.padValues[index], hasAnswer = changed.has(index + 1);
              questionResults.push({label:"Pad "+(index + 1),result:!hasAnswer ? "Not answered" : Number(value) === Number(row.each) ? "Correct" : "Incorrect"});
            }
            const extraIndex = 5, extraValue = row.padValues[extraIndex], hasExtra = changed.has(extraIndex + 1);
            questionResults.push({label:"Extra",result:!hasExtra ? "Not answered" : Number(extraValue) === Number(row.extra) ? "Correct" : "Incorrect"});
          } else if (row.type === "after" && Array.isArray(row.nums) && row.answer && Array.isArray(row.answer.before) && Array.isArray(row.answer.after)) {
            const response = row.response || {}, before = Array.isArray(response.before) ? response.before : [], after = Array.isArray(response.after) ? response.after : [];
            row.nums.forEach((number, index) => {
              const beforeAnswer = before[index], afterAnswer = after[index];
              questionResults.push({label:"Number "+number+" · before",result:!answered(beforeAnswer) || Number(beforeAnswer) === 0 ? "Not answered" : same(beforeAnswer,row.answer.before[index]) ? "Correct" : "Incorrect"});
              questionResults.push({label:"Number "+number+" · after",result:!answered(afterAnswer) || Number(afterAnswer) === 0 ? "Not answered" : same(afterAnswer,row.answer.after[index]) ? "Correct" : "Incorrect"});
            });
          } else if (Array.isArray(row.questions) && Array.isArray(row.answer)) {
            const responses = Array.isArray(row.response) ? row.response : [];
            row.questions.forEach((question, questionIndex) => {
              const response = responses[questionIndex], answer = row.answer[questionIndex];
              const label = question && question.label ? question.label : "Task "+(row.page || rowIndex + 1)+" · Q"+(questionIndex + 1);
              questionResults.push({label, result:!answered(response)?"Not answered":same(response,answer)?"Correct":"Incorrect"});
            });
          } else {
            const isCorrect = row && (row.correct === true || row.isCorrect === true || row.isComplete === true);
            const isAttempted = row && ((row.attempts || 0) > 0 || answered(row.selected) || answered(row.response) || row.answerRecord);
            questionResults.push({label:"Q"+(rowIndex+1),result:!isAttempted?"Not answered":isCorrect?"Correct":"Incorrect"});
          }
        });
      } else if (saved.questions) {
        const total = multiQuestionTotals[number] || Object.keys(saved.questions).length;
        Array.from({length:total}, (_, index) => saved.questions[String(index)] || {}).forEach((row, index) => {
          const isCorrect = row && (row.correct === true || row.isCorrect === true || row.isComplete === true);
          const isAttempted = row && ((row.attempts || 0) > 0 || answered(row.selected) || answered(row.response) || row.answerRecord);
          questionResults.push({label:"Q"+(index+1),result:!isAttempted?"Not answered":isCorrect?"Correct":"Incorrect"});
        });
      }
      if (!questionResults.length) return null;
      const correct = questionResults.filter(result => result.result === "Correct").length;
      const attempted = questionResults.some(result => result.result !== "Not answered");
      return {correct,total:questionResults.length,attempted,questionResults};
    } catch (_) { return null; }
  };
  const captureAssessment = () => {
    const feedback = document.querySelector("#feedback,.feedback,#status");
    const words = feedback ? String(feedback.textContent || "").trim() : "";
    const controls = [...document.querySelectorAll("select,input[type=radio]:checked,input[type=checkbox]:checked")].map(control => control.value || control.id).filter(Boolean);
    entry.response = controls.join(", ");
    entry.assessment = /correct|great work|excellent|well done|all equal/i.test(words) ? "Correct" : /incorrect|try again|not correct|check the/i.test(words) ? "Needs review" : "Checked";
    entry.assessmentNote = words.slice(0, 220);
    save();
  };
  const savePageDraft = () => {
    try {
      const drafts=JSON.parse(localStorage.getItem(draftKey)||"{}"), controls={};
      document.querySelectorAll("select,input[type=text],input[type=number]").forEach((control,index)=>{controls[control.id||("control-"+index)]=control.value;});
      const placed=(selector,key)=>[...document.querySelectorAll(selector)].map(pad=>({key:pad.dataset[key],value:pad.querySelector("[data-number],[data-time],[data-id]")?.dataset.number||pad.querySelector("[data-number],[data-time],[data-id]")?.dataset.time||pad.querySelector("[data-number],[data-time],[data-id]")?.dataset.id||""})).filter(item=>item.key&&item.value);
      drafts[page]={controls,selectedAnswers:[...document.querySelectorAll(".answer.selected")].map(button=>({question:button.dataset.question,answer:button.dataset.answer})),selectedBlocks:[...document.querySelectorAll(".blockpick.selected")].map(block=>[...document.querySelectorAll(".blockpick")].indexOf(block)),blockSets:placed(".pad[data-place]","place"),numberOrder:placed(".pad[data-index]","index"),clockTimes:placed(".pad[data-clock]","clock")};
      localStorage.setItem(draftKey,JSON.stringify(drafts));
    } catch (_) {}
  };
  const restorePageDraft = () => {
    try {
      const draft=(JSON.parse(localStorage.getItem(draftKey)||"{}")||{})[page]; if(!draft) return;
      document.querySelectorAll("select,input[type=text],input[type=number]").forEach((control,index)=>{const value=draft.controls?.[control.id||("control-"+index)];if(value!==undefined&&control.value!==value){control.value=value;control.dispatchEvent(new Event("change",{bubbles:true}));}});
      (draft.selectedAnswers||[]).forEach(item=>document.querySelector('.answer[data-question="'+item.question+'"][data-answer="'+item.answer+'"]')?.click());
      (draft.selectedBlocks||[]).forEach(index=>document.querySelectorAll(".blockpick")[index]?.classList.add("selected"));
      (draft.blockSets||[]).forEach(item=>{document.querySelector('.choice[data-id="'+item.value+'"]')?.click();document.querySelector('.pad[data-place="'+item.key+'"]').click();});
      (draft.numberOrder||[]).forEach(item=>{document.querySelector('.number-card[data-number="'+item.value+'"]').click();document.querySelector('.pad[data-index="'+item.key+'"]').click();});
      (draft.clockTimes||[]).forEach(item=>{document.querySelector('.time-card[data-time="'+item.value+'"]').click();document.querySelector('.pad[data-clock="'+item.key+'"]').click();});
    } catch (_) {}
  };
  setTimeout(restorePageDraft,250);
  // A navigation click must persist both the visible controls and the project record.
  // Otherwise the destination page mistakes the transition for a new student entry and clears its draft.
  const go = url => { savePageDraft(); assessVisiblePage(); save(); location.href = url; };
  const destination = n => "DreamB" + n + ".html" + params;
  const style = document.createElement("style");
  style.textContent = "html,body{overscroll-behavior:none!important;overscroll-behavior-y:none!important}body.dreamb-navigation .side,body.dreamb-navigation .admin,body.dreamb-navigation .admin-panel{display:none!important}body.dreamb-navigation .app{grid-template-columns:1fr!important;padding-bottom:140px!important}body.dreamb-navigation .shell{grid-template-columns:1fr!important;padding-bottom:140px!important}body.dreamb-navigation .main,body.dreamb-navigation .workspace,body.dreamb-navigation .main-grid{width:100%!important}body.dreamb-navigation #helpBtn,body.dreamb-navigation #commentBtn,body.dreamb-navigation #formative,body.dreamb-navigation #summative,body.dreamb-navigation #pdfReport,body.dreamb-navigation #pdfReportTop,body.dreamb-navigation #pdfBtn,body.dreamb-navigation #pdpReport,body.dreamb-navigation #pdfSnaps{display:none!important}.dreamb-toolbar{position:fixed;z-index:2147483647;top:10px;right:12px;display:flex;align-items:center;gap:7px}.dreamb-toolbar button,.dreamb-page-nav button{border:3px solid #172b48;border-radius:12px;padding:9px 13px;color:#172b48;background:#fff7bd;box-shadow:0 4px 0 #3975c6;font:800 16px Arial,sans-serif;cursor:pointer}.dreamb-timer,.dreamb-page-count{min-width:75px;padding:10px;border:3px solid #172b48;border-radius:12px;background:#fff;color:#172b48;font:800 16px Arial,sans-serif;text-align:center}.dreamb-page-count{min-width:105px}.dreamb-page-nav{position:fixed;z-index:2147483647;right:16px;bottom:18px;display:flex;gap:10px}.dreamb-page-nav button{font-size:18px;padding:10px 16px}.dreamb-page-nav button:disabled{cursor:not-allowed;opacity:.55;box-shadow:none}.dreamb-modal{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:18px;background:rgba(3,10,30,.72)}.dreamb-modal[hidden]{display:none}.dreamb-modal-card{width:min(680px,100%);max-height:88vh;overflow:auto;border:4px solid #172b48;border-radius:18px;padding:20px;color:#172b48;background:#fffdf4;font:600 17px/1.45 Arial,sans-serif}.dreamb-modal-card h2{margin:0 0 10px;font-size:28px}.dreamb-modal-card button{float:right;border:3px solid #172b48;border-radius:9px;padding:7px 12px;background:#f4d76d;font-weight:800;cursor:pointer}@media(max-width:750px){.dreamb-toolbar{left:7px;right:7px;top:6px;gap:4px}.dreamb-toolbar button{padding:7px 5px;font-size:12px}.dreamb-timer,.dreamb-page-count{min-width:0;padding:8px 3px;font-size:12px}.dreamb-page-nav{left:10px;right:10px;bottom:10px}.dreamb-page-nav button{flex:1;padding:10px 6px;font-size:16px}}@media print{.dreamb-toolbar,.dreamb-page-nav{display:none!important}}";
  document.head.append(style); document.body.classList.add("dreamb-navigation");
  const nextStyle = document.createElement("style");
  nextStyle.textContent = ".dreamb-top-next{position:fixed;z-index:2147483647;top:82px;right:16px;border:3px solid #172b48;border-radius:12px;padding:10px 16px;color:#172b48;background:#fff7bd;box-shadow:0 4px 0 #3975c6;font:800 18px Arial,sans-serif;cursor:pointer}.dreamb-top-next:disabled{cursor:not-allowed;opacity:.55;box-shadow:none}@media(max-width:750px){.dreamb-top-next{top:62px;right:10px;padding:9px 12px;font-size:15px}}@media print{.dreamb-top-next{display:none!important}}";
  document.head.append(nextStyle);
  const lastStyle=document.createElement("style");
  lastStyle.textContent=".dreamb-top-last{position:fixed;z-index:2147483647;top:82px;left:16px;border:3px solid #172b48;border-radius:12px;padding:10px 16px;color:#172b48;background:#d8ecff;box-shadow:0 4px 0 #3975c6;font:800 18px Arial,sans-serif;cursor:pointer}.dreamb-top-last:disabled{cursor:not-allowed;opacity:.55;box-shadow:none}@media(max-width:750px){.dreamb-top-last{top:62px;left:10px;padding:9px 12px;font-size:15px}}@media print{.dreamb-top-last{display:none!important}}";
  document.head.append(lastStyle);
  const fmt = s => String(Math.floor(s/60)).padStart(2,"0") + ":" + String(s%60).padStart(2,"0");
  const toolbar = document.createElement("div");
  toolbar.className = "dreamb-toolbar";
  toolbar.innerHTML = '<span class="dreamb-page-count">Page '+(position+1)+' of '+total+'</span><span class="dreamb-timer">00:00</span><button type="button" data-curriculum>Ontario Curriculum</button><button type="button" data-report>Teacher / Parent Report</button>';
  document.body.append(toolbar);
  const timer = toolbar.querySelector(".dreamb-timer");
  let started = Date.now();
  const updateTime = () => { timer.textContent = fmt(Math.floor((Date.now()-started)/1000)); };
  updateTime(); setInterval(updateTime,1000);
  document.addEventListener("click", event => { if(event.target.closest("#checkPage,#checkBtn,.check,#submitBtn,#submitWork")){entry.checks++;setTimeout(captureAssessment,0);save();} },true);
  const modal = document.createElement("section");
  modal.className = "dreamb-modal"; modal.hidden = true;
  modal.innerHTML = '<div class="dreamb-modal-card" role="dialog" aria-modal="true"><button type="button" data-close>Close</button><h2>Ontario Curriculum</h2><p><b>DreamB '+page+": "+titleFor(page)+'</b></p><h3>Grade 3 Mathematics</h3><p>'+focusFor(page)+'</p><p><small>Reference: The Ontario Curriculum, Grades 1–8: Mathematics, 2020.</small></p></div>';
  document.body.append(modal);
  toolbar.querySelector("[data-curriculum]").onclick = () => { modal.hidden = false; };
  modal.querySelector("[data-close]").onclick = () => { modal.hidden = true; };
  modal.onclick = event => { if(event.target===modal) modal.hidden=true; };
  const esc = value => String(value==null?"":value).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  // M26: a report is always calculated from work now on screen, never from an old report result.
  const assessVisiblePage = () => {
    let questionResults = null;
    const result = (label, value, answer) => ({label,result:value===""||value===null||value===undefined?"Not answered":String(value)===String(answer)?"Correct":"Incorrect"});
    const buttonGroups=[...document.querySelectorAll("[data-assess-answer]")];
    if(buttonGroups.length) {
      questionResults=buttonGroups.map((group,index)=>result(group.dataset.assessLabel||("Question "+(index+1)),group.dataset.value??group.querySelector(".answer-choice.selected")?.dataset.value,group.dataset.assessAnswer));
    } else if (page===1 || page===9 || (page>=18&&page<=22)) {
      const inputs=[...document.querySelectorAll(".moreless-answer")];
      const expected=page===1?[538,641,728,845,703,899]:[287,450,374,710,525,776];
      const labels=["Add 1","Subtract 1","Add 10","Subtract 10","Add 100","Subtract 100"];
      if(inputs.length===6) questionResults=inputs.map((input,index)=>result(labels[index],input.value,expected[index]));
    } else if (page===2) {
      const rows=[...document.querySelectorAll(".before-after-row")];
      if(rows.length) questionResults=rows.flatMap((row,index)=>{const number=Number(row.querySelector(".center-number")?.textContent);return [result("Number "+number+" · before",row.querySelector(".before-answer")?.value,number-1),result("Number "+number+" · after",row.querySelector(".after-answer")?.value,number+1)];});
    } else if (page===3 || page===4) {
      const answer=document.querySelector("#answer"), numbers=(document.querySelector("#questionCard")?.textContent||"").match(/(\d+)\s*[−-]\s*(\d+)/);
      if(answer&&numbers) questionResults=[result("Subtraction dropdown",answer.value,Number(numbers[1])-Number(numbers[2]))];
    } else if (page===5) {
      const answer=document.querySelector("#answerSelect"), numbers=(document.querySelector("#equationText")?.textContent||"").match(/(\d+)\s*\+\s*(\d+)\s*=\s*(\d+)\s*\+/);
      if(answer&&numbers) questionResults=[result("Balance dropdown",answer.value,Number(numbers[1])+Number(numbers[2])-Number(numbers[3]))];
    } else if (page===10) {
      const selects=[...document.querySelectorAll(".pad select")];
      if(selects.length>=5) questionResults=selects.slice(0,5).map((input,index)=>result(index===4?"Extra":"Pad "+(index+1),input.value,index===4?0:10));
    } else if (page===11) {
      const selected=[...document.querySelectorAll(".blockpick.selected")], answered=selected.length>0;
      if(document.querySelector(".blockpick")) {
        const count=value=>selected.filter(block=>block.dataset.value===value).length;
        const blockResult=(label,value,expected)=>({label,result:!answered?"Not answered":value===expected?"Correct":"Incorrect"});
        questionResults=[blockResult("Hundreds blocks",count("100"),2),blockResult("Ten rods",count("10"),4),blockResult("Ones blocks",count("1"),9)];
      }
    } else if (page===12 || (page>=23 && page<=28)) {
      const read=id=>Number(document.querySelector(id)?.textContent?.trim()), topTens=read("#topTens"),topOnes=read("#topOnes"),bottomTens=read("#bottomTens"),bottomOnes=read("#bottomOnes"),carry=document.querySelector("#carryAnswer"),tens=document.querySelector("#tensAnswer"),ones=document.querySelector("#onesAnswer");
      if([topTens,topOnes,bottomTens,bottomOnes].every(Number.isFinite)&&carry&&tens&&ones){const expectedCarry=Math.floor((topOnes+bottomOnes)/10),expectedTens=topTens+bottomTens+expectedCarry,expectedOnes=(topOnes+bottomOnes)%10;questionResults=[result("Carry",carry.value,expectedCarry),result("Tens",tens.value,expectedTens),result("Ones",ones.value,expectedOnes)];}
    } else if (page===13) {
      const answer=document.querySelector("#answer"); if(answer) questionResults=[result("Base-ten value",answer.value,437)];
    } else if (page===14) {
      const expected={hundreds:"h300",tens:"t60",ones:"o2"},pads=[...document.querySelectorAll(".pad[data-place]")],answer=document.querySelector("#sumAnswer");
      if(pads.length===3&&answer) questionResults=[...pads.map(pad=>result(pad.dataset.place+" block",pad.querySelector("[data-id]")?.dataset.id,expected[pad.dataset.place])),result("Sum dropdown",answer.value,362)];
    } else if (page===15) {
      const expected=[128,173,246,319,405,478,529,614,688], pads=[...document.querySelectorAll(".pad[data-index]")];
      if(pads.length===9) questionResults=pads.map((pad,index)=>result("Position "+(index+1),pad.querySelector("[data-number]")?.dataset.number||pad.dataset.number||"",expected[index]));
    } else if (page===16) {
      const expected={three:"3:00",half:"6:30",quarterPast:"9:15",quarterTo:"1:45"}, pads=[...document.querySelectorAll(".pad[data-clock]")];
      if(pads.length===4) questionResults=pads.map(pad=>result("Clock "+pad.dataset.clock,pad.querySelector("[data-time]")?.dataset.time||pad.dataset.time||"",expected[pad.dataset.clock]));
    } else if (page===17) {
      const expected=["8","Leo","4","Owen"];
      if(document.querySelector(".answer[data-question]")) questionResults=expected.map((answer,index)=>result("Graph question "+(index+1),document.querySelector('.answer.selected[data-question="'+index+'"]')?.dataset.answer,answer));
    }
    if(!questionResults) return;
    const correct=questionResults.filter(item=>item.result==="Correct").length, current=load(); current.pages=current.pages||{};
    current.pages[page]={...(current.pages[page]||{}),page,title:titleFor(page),completed:correct===questionResults.length,score:correct+"/"+questionResults.length,questionResults,updatedAt:new Date().toISOString()};
    try { localStorage.setItem(storageKey,JSON.stringify(current)); } catch (_) {}
  };
  const removeUnevaluatedM26Fill = () => {
    const caps={1:6,2:10,3:6,4:6,5:1,9:6,10:5,11:3,12:3,13:1,14:4,15:9,16:4,17:4,18:6,19:6,20:6,21:6,22:6,23:3,24:3,25:3,26:3,27:3,28:3}, current=load();
    let changed=false; current.pages=current.pages||{};
    sequence.forEach(number=>{const item=current.pages[number];if(!item||!Array.isArray(item.questionResults)||!item.questionResults.length)return;const generated=item.questionResults.every((row,index)=>row.label==="Assessment item "+(index+1)&&row.result==="Correct");if(generated){delete item.questionResults;delete item.completed;delete item.score;changed=true;}});
    if(changed)try{localStorage.setItem(storageKey,JSON.stringify(current))}catch(_){}
  };
  // Keep M26 current while the student works. The PDF also invokes this evaluator again before printing.
  ["change","input","click","drop"].forEach(type=>document.addEventListener(type,event=>{
    if(!event.target.closest(".dreamb-toolbar,.dreamb-page-nav,.dreamb-teacher-access")) setTimeout(assessVisiblePage,0);
  },true));
  setInterval(assessVisiblePage,500);
  let draftSaveTimer=0;
  ["change","input","click","drop"].forEach(type=>document.addEventListener(type,event=>{
    if(event.target.closest(".dreamb-toolbar,.dreamb-page-nav,.dreamb-top-next,.dreamb-top-last,.dreamb-teacher-access"))return;
    clearTimeout(draftSaveTimer);
    draftSaveTimer=setTimeout(()=>{savePageDraft();assessVisiblePage();},100);
  }));
  window.addEventListener("pagehide",()=>{clearTimeout(draftSaveTimer);savePageDraft();assessVisiblePage();save();});
  const report = () => {
    clearTimeout(draftSaveTimer);
    savePageDraft();
    entry.seconds += Math.max(0,Math.floor((Date.now()-started)/1000)); started=Date.now(); save();
    removeUnevaluatedM26Fill();
    assessVisiblePage();
    const data=load(), pages=data.pages||{}, visited=Object.values(pages);
    const totalSeconds=visited.reduce((sum,item)=>sum+(item.seconds||0),0);
    // M26 marking rule: each page has a fixed mark maximum and every available mark has one report row.
    const maximumMarks={1:6,2:10,3:6,4:6,5:1,9:6,10:5,11:3,12:3,13:1,14:4,15:9,16:4,17:4,18:6,19:6,20:6,21:6,22:6,23:3,24:3,25:3,26:3,27:3,28:3};
    let rows="", marksEarned=0, marksAvailable=sequence.reduce((total,number)=>total+(maximumMarks[number]||0),0);
sequence.forEach((number,index) => { const item=pages[number], pageWasVisited=!!(item&&item.firstVisited), dropdownOnly=[5,13,14].includes(number), multi=pageWasVisited&&!dropdownOnly?multiQuestionScore(number):null, hasFreshItems=!!(item&&Array.isArray(item.questionResults)&&item.questionResults.length), details=multi&&[3,4].includes(number)?multi.questionResults:hasFreshItems?item.questionResults:multi?multi.questionResults:[], pageMarksAvailable=maximumMarks[number]||0; const assessment=details.length?(details.some(result=>result.result!=="Not answered")?(details.every(result=>result.result==="Correct")?"Correct":"Needs review")+" ("+details.filter(result=>result.result==="Correct").length+"/"+pageMarksAvailable+")":"Not yet assessed"):!item?"Not visited":"Not yet assessed"; const itemRows=details.slice(0,pageMarksAvailable); while(itemRows.length<pageMarksAvailable)itemRows.push({label:"Assessment item "+(itemRows.length+1),result:"Not answered"}); const pageMarksEarned=itemRows.filter(result=>result.result==="Correct").length; marksEarned+=pageMarksEarned; itemRows.forEach((result,itemIndex)=>{rows+="<tr><td>"+(index+1)+"</td><td>"+esc(titleFor(number))+"</td><td>"+(item?fmt(item.seconds||0):"Not visited")+"</td><td>"+esc(itemIndex===0?assessment:"↳ individual item")+"</td><td>"+pageMarksEarned+" / "+pageMarksAvailable+"</td><td>"+esc(result.label)+"</td><td>"+esc(result.result)+"</td><td>"+(item?item.checks||0:0)+"</td><td>"+esc(focusFor(number))+"</td></tr>";}); });
    const marksByPage=sequence.map((number,index)=>'<li><b>Page '+(index+1)+' · '+esc(titleFor(number))+':</b> '+(maximumMarks[number]||0)+' marks</li>').join('');
    const w=window.open("","_blank"); if(!w){alert("Allow pop-ups to open the Teacher / Parent Report.");return;}
    const html='<!doctype html><html><head><meta charset="utf-8"><title>InspireBFirsthalf Teacher / Parent Report</title><style>@page{size:letter landscape;margin:.45in}body{font-family:Arial,sans-serif;color:#172b48}h1{margin:0;color:#075e38}table{width:100%;border-collapse:collapse;font-size:10px}th,td{border:1px solid #405365;padding:6px;vertical-align:top}th{background:#d8f3e2;text-align:left}.summary{margin:10px 0;padding:10px;border:2px solid #075e38;background:#f5fff7}.overall-mark{display:inline-block;margin-top:7px;padding:7px 10px;border-radius:7px;background:#d8f3e2;color:#075e38;font-size:15px}.marks-by-page{margin:10px 0;padding:10px;border:2px solid #405365;border-radius:8px;background:#fff}.marks-by-page h2{margin:0 0 6px;font-size:15px}.marks-by-page ul{columns:2;margin:0;padding-left:20px;font-size:11px}.marks-by-page li{margin:3px 0}</style></head><body><h1>InspireBFirsthalf Teacher / Parent Report</h1><div class="summary"><b>Student:</b> '+esc(data.student||student)+' &nbsp; | &nbsp; <b>Pages visited:</b> '+visited.length+'/'+total+' &nbsp; | &nbsp; <b>Total recorded time:</b> '+fmt(totalSeconds)+'<br><span class="overall-mark"><b>M26 overall mark:</b> '+marksEarned+' / '+marksAvailable+'</span><br><small><b>M26 marking rule:</b> each page has a fixed mark maximum; every available mark has its own report row; and the Page Mark column shows the student’s earned mark out of that page’s available marks.</small></div><section class="marks-by-page"><h2>Marks available by page</h2><ul>'+marksByPage+'</ul></section><table><thead><tr><th>DreamB Page</th><th>Activity</th><th>Recorded Time</th><th>Page Assessment</th><th>Page Mark</th><th>Assessment Item</th><th>Item Result</th><th>Check Attempts</th><th>Ontario Curriculum Focus</th></tr></thead><tbody>'+rows+'</tbody></table></body></html>';
    w.document.write(html); w.document.close(); setTimeout(()=>w.print(),250);
  };
  toolbar.querySelector("[data-report]").onclick=report;
  const teacherStyle=document.createElement("style"); teacherStyle.textContent=".dreamb-teacher-access{position:fixed!important;z-index:2147483647!important;left:10px!important;bottom:10px!important;width:20px!important;height:20px!important;padding:0!important;border:2px solid #7d0710!important;border-radius:50%!important;background:#e0232d!important;box-shadow:0 2px 0 #7d0710!important;cursor:pointer!important}"; document.head.append(teacherStyle);
  const teacherFillKey="inspireb-firsthalf-m26-autofill-"+student;
  const completeAllM26=()=>{const filled=load();filled.student=student;filled.m26RunId=Date.now();filled.pages=filled.pages||{};try{localStorage.setItem(storageKey,JSON.stringify(filled))}catch(_){}};
  const fillRegroupingM26=()=>{
    const write=(key,questions)=>{try{const saved=JSON.parse(localStorage.getItem(key)||"{}"),state={student:student,startedAt:saved.startedAt||new Date().toISOString(),assessment:saved.assessment||"Formative",help:saved.help||0,teacherComment:saved.teacherComment||"",index:0,questions:{},interactions:saved.interactions||[]};questions.forEach(({a,b})=>{const needsTrade=a%10<b;state.questions[String(Object.keys(state.questions).length)]={traded:needsTrade,removed:Array.from({length:b},(_,index)=>index),selected:String(a-b),attempts:1,correct:true,time:0,started:Date.now()};});localStorage.setItem(key,JSON.stringify(state));}catch(_){}};
    write("inspireb-firsthalf-p26-panther-f-regrouping-subtraction-a-v1",[{a:47,b:8},{a:62,b:7},{a:53,b:6},{a:71,b:4},{a:84,b:9},{a:92,b:5}]);
    write("inspireb-firsthalf-p26-panther-f-regrouping-subtraction-b-v1",[{a:23,b:5},{a:62,b:7},{a:53,b:6},{a:71,b:4},{a:84,b:9},{a:92,b:5}]);
  };
  const teacherAccess=document.createElement("button"); teacherAccess.type="button"; teacherAccess.className="dreamb-teacher-access"; teacherAccess.setAttribute("aria-label","Teacher: fill correct answers"); teacherAccess.onclick=()=>{const code=prompt("Teacher code");if(code!=="2"&&code!=="259")return;document.dispatchEvent(new CustomEvent("dreamb-autofill",{detail:{page,student}}));}; document.body.append(teacherAccess);
  ["change","input","click","drop"].forEach(type=>document.addEventListener(type,event=>{if(event.isTrusted&&!event.target.closest(".dreamb-teacher-access")){try{localStorage.removeItem(teacherFillKey)}catch(_){}}},true));
  const setSelect=(select,value)=>{if(!select)return;select.value=String(value);select.dispatchEvent(new Event("change",{bubbles:true}));};
  const fillVisibleWork=()=>{for(let bankIndex=0;bankIndex<document.querySelectorAll("[data-assess-answer]").length;bankIndex++){const group=document.querySelectorAll("[data-assess-answer]")[bankIndex],answer=group.dataset.assessAnswer;if(group.classList.contains("bank-pad")){const card=document.querySelector('.number-bank-card[data-value="'+answer+'"]');card?.click();group.click()}else group.querySelector('.answer-choice[data-value="'+answer+'"]')?.click()}if(page===1)[...document.querySelectorAll(".moreless-answer")].forEach((select,index)=>setSelect(select,[538,641,728,845,703,899][index]));if(page===2)document.querySelectorAll(".before-after-row").forEach(row=>{const number=Number(row.querySelector(".center-number")?.textContent);setSelect(row.querySelector(".before-answer"),number-1);setSelect(row.querySelector(".after-answer"),number+1)});if(page===3||page===4){const text=document.querySelector("#questionCard")?.textContent||"",match=text.match(/(\d+)\s*[−-]\s*(\d+)/);if(match)setSelect(document.querySelector("#answer"),Number(match[1])-Number(match[2]));}if(page===5){const values=(document.querySelector("#equationText")?.textContent||"").match(/\d+/g)||[];if(values.length>=3)setSelect(document.querySelector("#answerSelect"),Number(values[0])+Number(values[1])-Number(values[2]));}if(page===10)document.querySelectorAll(".pad select").forEach((select,index)=>setSelect(select,[10,10,10,10,0][index]));if(page===11){const picks=[...document.querySelectorAll(".blockpick")];picks.filter(pick=>pick.dataset.value==="100").slice(0,2).forEach(pick=>pick.click());picks.filter(pick=>pick.dataset.value==="10").slice(0,4).forEach(pick=>pick.click());picks.filter(pick=>pick.dataset.value==="1").slice(0,9).forEach(pick=>pick.click());}if(page===13)setSelect(document.querySelector("#answer"),437);if(page===14){["h300","t60","o2"].forEach((id,index)=>{document.querySelector('.choice[data-id="'+id+'"]')?.click();document.querySelectorAll(".pad")[index]?.click();});setSelect(document.querySelector("#sumAnswer"),362);}if(page===15){[128,173,246,319,405,478,529,614,688].forEach((number,index)=>{document.querySelector('.number-card[data-number="'+number+'"]')?.click();document.querySelector('.pad[data-index="'+index+'"]')?.click();});}if(page===16){const answers={three:"3:00",half:"6:30",quarterPast:"9:15",quarterTo:"1:45"};Object.entries(answers).forEach(([clock,time])=>{document.querySelector('.time-card[data-time="'+time+'"]')?.click();document.querySelector('.pad[data-clock="'+clock+'"]')?.click();});}if(page===17){["8","Leo","4","Owen"].forEach((answer,index)=>document.querySelector('.answer[data-question="'+index+'"][data-answer="'+answer+'"]')?.click());}};
  const fillM26MissingWork=()=>{if(page===9)[...document.querySelectorAll(".moreless-answer")].forEach((select,index)=>setSelect(select,[287,450,374,710,525,776][index]));if(page===11){[["100",2],["10",4],["1",9]].forEach(([value,target])=>{const blocks=[...document.querySelectorAll('.blockpick[data-value="'+value+'"]')],selected=blocks.filter(block=>block.classList.contains("selected"));selected.slice(target).forEach(block=>block.click());blocks.filter(block=>!block.classList.contains("selected")).slice(0,Math.max(0,target-selected.length)).forEach(block=>block.click());});}};
  const fillPageNineM26=()=>{
    if(page!==12 && (page<23 || page>28))return;
    const fill=()=>{
      const read=id=>Number(document.querySelector(id)?.textContent?.trim()), topTens=read("#topTens"), topOnes=read("#topOnes"), bottomTens=read("#bottomTens"), bottomOnes=read("#bottomOnes");
      if(![topTens,topOnes,bottomTens,bottomOnes].every(Number.isFinite))return;
      const carry=Math.floor((topOnes+bottomOnes)/10), tens=topTens+bottomTens+carry, ones=(topOnes+bottomOnes)%10;
      setSelect(document.querySelector("#carryAnswer"),carry);
      setSelect(document.querySelector("#tensAnswer"),tens);
      setSelect(document.querySelector("#onesAnswer"),ones);
      setTimeout(assessVisiblePage,0);
    };
    fill(); setTimeout(fill,150); setTimeout(fill,500);
  };
  document.addEventListener("dreamb-autofill",()=>{try{localStorage.setItem(teacherFillKey,"1")}catch(_){}completeAllM26();if(sequence.includes(3))fillRegroupingM26();setTimeout(()=>{fillVisibleWork();fillM26MissingWork();fillPageNineM26();},90);});
  // Once the red dot has been authorized, every later activity page fills its own
  // visible draggable/dropdown controls on arrival. Normal student work clears this mode.
  try{
    if(localStorage.getItem(teacherFillKey)==="1"){
      setTimeout(()=>document.dispatchEvent(new CustomEvent("dreamb-autofill",{detail:{page,student,restore:true}})),180);
    }
  }catch(_){}
  const nav=document.createElement("nav"); nav.className="dreamb-page-nav"; nav.setAttribute("aria-label","DreamB page navigation");
  const previous=document.createElement("button"); previous.type="button"; previous.textContent="← Last Page"; previous.disabled=position===0; previous.setAttribute("aria-disabled",String(position===0)); previous.onclick=()=>{if(position>0)go(destination(sequence[position-1]));};
  const next=document.createElement("button"); next.type="button"; next.textContent="Next Page →"; next.disabled=position===sequence.length-1; next.onclick=()=>{if(position<sequence.length-1)go(destination(sequence[position+1]));};
  nav.append(previous,next); document.body.append(nav);
  const topNext=document.createElement("button"); topNext.type="button"; topNext.className="dreamb-top-next"; topNext.textContent="Next Page →"; topNext.disabled=position===sequence.length-1; topNext.onclick=()=>{if(position<sequence.length-1)go(destination(sequence[position+1]));}; document.body.append(topNext);
  const topLast=document.createElement("button"); topLast.type="button"; topLast.className="dreamb-top-last"; topLast.textContent="← Last Page"; topLast.disabled=position===0; topLast.onclick=()=>{if(position>0)go(destination(sequence[position-1]));}; document.body.append(topLast);
  // Keep a full student activity visible without changing its layout or saved responses.
  const fitScreen=()=>{
    if(window.matchMedia("print").matches)return;
    const fixed=new Set([toolbar,modal,teacherAccess,nav,topNext,topLast]), contentRoot=[...document.body.children].find(node=>!fixed.has(node)&&!node.matches("script,style"));
    if(!contentRoot)return;
    contentRoot.style.zoom="1";
    const contentHeight=Math.max(contentRoot.scrollHeight,contentRoot.getBoundingClientRect().height,1);
    const scale=Math.min(1,(window.innerHeight-4)/contentHeight);
    contentRoot.style.zoom=String(Math.max(.45,scale));
    document.documentElement.style.overflow="hidden";
    document.body.style.overflow="hidden";
  };
  let touchStartY=0;
  document.addEventListener("touchstart",event=>{if(event.touches.length===1)touchStartY=event.touches[0].clientY},{passive:true});
  document.addEventListener("touchmove",event=>{if(event.touches.length!==1||event.target.closest('button,input,select,textarea,[draggable="true"]'))return;const root=document.scrollingElement;if(event.touches[0].clientY>touchStartY&&(root?.scrollTop||0)<=0)event.preventDefault()},{passive:false});
  requestAnimationFrame(()=>requestAnimationFrame(fitScreen));
  window.addEventListener("resize",fitScreen);
})();
