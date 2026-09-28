/* InspireE answers are assessed afresh, never from saved scores. */
window.InspireEEngine=(()=>{
 const names=['Alison','Tony','Michael','Shelly','Ben','Alie','Julia','Vera'];
 const sets=[[4,6,7,8,8,9,10,12],[3,5,6,7,7,8,9,11],[6,7,8,9,9,10,11,12],[3,4,5,6,6,7,8,9],[8,9,9,10,10,10,12,12],[4,5,7,8,8,9,11,12],[3,4,6,7,7,8,9,12],[6,8,8,9,9,9,11,12],[3,4,5,6,6,6,8,10],[7,9,10,10,10,10,12,12]];
 const ids=['sports-cards','game-character-cards','team-sport','individual-sport','human','creature','team-new','team-worn','individual-new','individual-worn','human-new','human-worn','creature-new','creature-worn'];
 const labels=['Sports Cards','Game Character Cards','Team Sport','Individual Sport','Human','Creature','New','Worn','New','Worn','New','Worn','New','Worn'];
 const sum=v=>v.reduce((a,b)=>a+b,0),eq=(v,e)=>v!==undefined&&v!==null&&v!==''&&String(v)===String(e);
 function catExpected(v){const m=sum(v)/8,c={};v.forEach(x=>c[x]=(c[x]||0)+1);return {studentBars:Array(8).fill(m),meanAnswer:String(m),medianAnswer:String((v[3]+v[4])/2),modeAnswer:String(Object.keys(c).sort((a,b)=>c[b]-c[a]||a-b)[0]),atMeanAnswer:names.filter((_,i)=>v[i]===m),belowMeanAnswer:names.filter((_,i)=>v[i]<m),aboveMeanAnswer:names.filter((_,i)=>v[i]>m),lowEffectAnswer:'down',highEffectAnswer:'up',noticeAnswer:v.every(x=>Math.abs(x-m)<=1)?'allClose':Math.min(...v)<=m-3&&Math.max(...v)>=m+3?'spreadOut':'mostClose'};}
 function assess(a,s={}){
  const rows=[],add=(item,v,e,ok=eq(v,e))=>rows.push({page:a.number,activity:a.title,strand:a.strand,item,student:v===undefined||v===null||v===''?'Unanswered':String(v),expected:String(e),correct:!!ok});
  if(a.importId===1)sets.forEach((v,i)=>{const p=s.pages?.[i]||{},x=catExpected(v),pre='Exercise '+(i+1)+' · ';
   add(pre+'Mean',p.meanAnswer?`Bars: ${(p.studentBars||[]).join(', ')}; choice: ${p.meanAnswer}`:undefined,x.meanAnswer,eq(p.meanAnswer,x.meanAnswer)&&p.studentBars?.length===8&&p.studentBars.every(n=>eq(n,x.meanAnswer)));
   ['medianAnswer','modeAnswer'].forEach((k,j)=>add(pre+(j?'Mode':'Median (extension)'),p[k],x[k]));
   ['atMeanAnswer','belowMeanAnswer','aboveMeanAnswer'].forEach((k,j)=>add(pre+['At the mean','Below the mean','Above the mean'][j],p[k]?.join(', '),x[k].join(', '),p[k]?.length===x[k].length&&x[k].every(n=>p[k].includes(n))));
   ['lowEffectAnswer','highEffectAnswer','noticeAnswer'].forEach((k,j)=>add(pre+['Low score effect','High score effect','Notice about scores'][j],p[k],x[k]));
  });
  if(a.importId===2)[0,1,2,3].forEach(i=>add('Leaf sharing pad '+(i+1),s.values?.[i],10));
  if(a.importId===3){const v=s.values||[4,6,8,6];add('Mean / equal group amount',s.touched?v.join(', '):undefined,'6, 6, 6, 6',s.touched&&v.length===4&&v.every(n=>n===6));add('Food-bank can reserve',s.touched?s.reserve:undefined,0,s.touched&&s.reserve===0&&sum(v)===24);}
  if(a.importId===4)ids.forEach((id,i)=>{const placed=Object.keys(s.places||{}).find(k=>s.places[k]===id),label=labels[ids.indexOf(placed)];add('Tree pad: '+id,label,labels[i]);});
  if(a.importId===5)[['adventure','Adventure game cards',10],['sports','Sports game cards',6],['difference','Fantasy compared with Sports',5]].forEach(([k,l,n])=>add(l,s[k],n));
  if(a.importId===6)[['morning',8],['afternoon',12],['evening',10]].forEach(([k,n])=>add(k+' bar height',s[k],n));
  return rows;
 }
 function fill(a){switch(a.importId){case 1:return {pages:sets.map(catExpected),index:0};case 2:return {values:[10,10,10,10]};case 3:return {values:[6,6,6,6],reserve:0,touched:true};case 4:return {places:Object.fromEntries(ids.map(id=>[id,id]))};case 5:return {adventure:'10',sports:'6',difference:'5'};case 6:return {morning:'8',afternoon:'12',evening:'10'};}}
 return {assess,fill,sets};
})();
