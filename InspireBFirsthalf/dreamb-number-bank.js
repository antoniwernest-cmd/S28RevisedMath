(() => {
  "use strict";
  const shuffleStable = values => {
    const list=[...values];
    let seed=list.reduce((sum,value,index)=>sum+Number(value)*(index+17),711);
    for(let index=list.length-1;index>0;index--){seed=(seed*1664525+1013904223)>>>0;const other=seed%(index+1);[list[index],list[other]]=[list[other],list[index]];}
    return list;
  };
  function render({board,mode,tasks,response,onChange}) {
    const numbers=shuffleStable(tasks.map(task=>task.answer));
    let selected=null,pointerDrag=null,ghost=null,suppressClick=false;
    const answerAt=index=>mode==="before-after" ? response?.[tasks[index].side]?.[tasks[index].row] : response?.[index];
    const placements=tasks.map((_,index)=>{const value=answerAt(index);return value===null||value===undefined||value===""||Number(value)===0?null:Number(value)});
    const activity=document.createElement("section");activity.className="number-bank-activity "+mode;
    board.replaceChildren(activity);
    const card=value=>`<button type="button" class="number-bank-card${selected===value?' selected':''}" draggable="true" data-value="${value}" aria-label="Number ${value}">${value}</button>`;
    const bank=document.createElement("div");bank.className="number-bank";bank.setAttribute("aria-label","Number bank; drag a card here to return it");
    const rows=document.createElement("div");rows.className="number-bank-rows";
    activity.innerHTML=`<p class="number-bank-directions">Drag each number from the bank to its landing pad. You can move it again.</p>`;
    activity.append(bank,rows);
    const save=()=>{
      if(mode==="before-after"){
        const next={before:[...(response?.before||[])],after:[...(response?.after||[])]};
        tasks.forEach((task,index)=>{next[task.side][task.row]=placements[index]});
        response=next;onChange(next);
      }else{const next=[...placements];response=next;onChange(next);}
    };
    const place=(index,value)=>{
      if(!numbers.includes(value))return;
      const old=placements.indexOf(value);
      if(old>=0)placements[old]=null;
      placements[index]=value;
      selected=null;save();draw();
    };
    const returnNumber=value=>{const index=placements.indexOf(value);if(index<0)return;placements[index]=null;selected=null;save();draw()};
    function draw(){
      const used=new Set(placements.filter(value=>value!==null));
      bank.innerHTML='<span class="number-bank-title">Number bank</span>'+numbers.filter(value=>!used.has(value)).map(card).join("");
      if(mode==="before-after"){
        rows.innerHTML=tasks.filter(task=>task.side==="before").map(task=>{
          const first=tasks.findIndex(item=>item.side==="before"&&item.row===task.row),last=tasks.findIndex(item=>item.side==="after"&&item.row===task.row);
          const pad=index=>{const item=tasks[index],value=placements[index];return `<div class="bank-pad${value!==null?' filled':''}" role="button" tabindex="0" data-index="${index}" data-label="${item.side==='before'?'Before':'After'}" data-assess-answer="${item.answer}" data-assess-label="${item.assessLabel}"${value!==null?` data-value="${value}"`:''}>${value!==null?card(value):'<span>Drop here</span>'}</div>`};
          return `<div class="number-bank-row">${pad(first)}<div class="number-bank-source">${task.number}</div>${pad(last)}</div>`;
        }).join("");
      }else{
        rows.innerHTML=tasks.map((task,index)=>{
          const placed=placements[index];
          const pad=`<div class="bank-pad${placed!==null?' filled':''}" role="button" tabindex="0" data-index="${index}" data-assess-answer="${task.answer}" data-assess-label="${task.assessLabel}"${placed!==null?` data-value="${placed}"`:''}>${placed!==null?card(placed):'<span>Drop here</span>'}</div>`;
          return `<div class="number-bank-row"><div class="number-bank-operation">${task.label}</div><div class="number-bank-source">${task.number}</div>${pad}</div>`;
        }).join("");
      }
      activity.querySelectorAll(".number-bank-card").forEach(element=>{
        element.addEventListener("click",event=>{event.stopPropagation();selected=Number(element.dataset.value);activity.querySelectorAll(".number-bank-card").forEach(item=>item.classList.toggle("selected",Number(item.dataset.value)===selected))});
        element.addEventListener("pointerdown",event=>{if(event.button!==0)return;pointerDrag={value:Number(element.dataset.value),startX:event.clientX,startY:event.clientY,element}});
        element.addEventListener("dragstart",event=>event.preventDefault());
      });
      activity.querySelectorAll(".bank-pad").forEach(pad=>{
        const index=Number(pad.dataset.index);
        pad.addEventListener("click",()=>{if(selected!==null)place(index,selected);else if(placements[index]!==null)returnNumber(placements[index])});
        pad.addEventListener("keydown",event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();pad.click()}});
        pad.addEventListener("dragover",event=>{event.preventDefault();pad.classList.add("over")});
        pad.addEventListener("dragleave",()=>pad.classList.remove("over"));
        pad.addEventListener("drop",event=>{event.preventDefault();place(index,Number(event.dataTransfer.getData("text/plain")))});
      });
    }
    bank.addEventListener("dragover",event=>event.preventDefault());
    bank.addEventListener("drop",event=>{event.preventDefault();bank.classList.remove("over");returnNumber(Number(event.dataTransfer.getData("text/plain")))});
    bank.addEventListener("click",event=>{if(selected!==null&&!event.target.closest(".number-bank-card"))returnNumber(selected)});
    document.addEventListener("pointermove",event=>{
      if(!pointerDrag)return;
      const distance=Math.hypot(event.clientX-pointerDrag.startX,event.clientY-pointerDrag.startY);
      if(distance<8&&!ghost)return;
      if(!ghost){ghost=pointerDrag.element.cloneNode(true);ghost.classList.add("drag-ghost");document.body.append(ghost)}
      ghost.style.left=event.clientX+"px";ghost.style.top=event.clientY+"px";
      if(event.cancelable)event.preventDefault();
    },{passive:false});
    document.addEventListener("pointerup",event=>{
      if(!pointerDrag)return;
      const moved=Math.hypot(event.clientX-pointerDrag.startX,event.clientY-pointerDrag.startY)>=8;
      const value=pointerDrag.value;
      ghost?.remove();ghost=null;pointerDrag=null;
      if(!moved)return;
      const target=document.elementFromPoint(event.clientX,event.clientY),pad=target?.closest(".bank-pad");
      if(pad&&activity.contains(pad))place(Number(pad.dataset.index),value);
      else if(target?.closest(".number-bank")===bank)returnNumber(value);
      suppressClick=true;setTimeout(()=>{suppressClick=false},0);
    });
    document.addEventListener("pointercancel",()=>{ghost?.remove();ghost=null;pointerDrag=null});
    activity.addEventListener("click",event=>{if(suppressClick){event.preventDefault();event.stopImmediatePropagation();suppressClick=false}},true);
    draw();
  }
  window.DreamBNumberBank={render};
})();
