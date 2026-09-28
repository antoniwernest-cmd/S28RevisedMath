/* One current-answer model for screen, saving, override and assessment. */
window.Stadium = (()=>{
 const activities=window.STADIUM_ACTIVITIES;
 const counts=a=>a.categories.map(c=>a.records.filter(r=>r===c).length);
 const eq=(v,x)=>v!==undefined && v!==null && v!=='' && String(v)===String(x);
 const meanState=(a,s)=>s.shares||a.values;
 function assess(a,s={}){
  const rows=[];
  const add=(item,value,expected,correct)=>rows.push({page:a.number,activity:a.title,strand:a.strand,item,student:value===undefined||value===null||value===''?'Unanswered':String(value),expected:String(expected),correct:correct===undefined?eq(value,expected):!!correct});
  if(a.type==='sort'||a.type==='concrete')a.items.forEach(i=>add(i.label+' ['+i.id.toUpperCase()+']',s.placements?.[i.id]===undefined?undefined:(a.groups||a.categories)[s.placements[i.id]],(a.groups||a.categories)[i.target]));
  if(a.type==='tree')a.nodes.forEach((n,i)=>add('Level '+(i<2?1:i<6?2:3)+' · branch '+(i+1)+' ('+n[1]+')',s.nodes?.[i],n[0]));
  if(a.type==='frequency')counts(a).forEach((n,i)=>add(a.categories[i]+' frequency',s['count'+i],n));
  if(a.type==='bar'||a.type==='pictograph'){
   a.values.forEach((v,i)=>add(a.categories[i]+(a.type==='bar'?' bar height':' picture count'),s['value'+i],a.type==='bar'?v:v/a.unit));
   add('Graph title',s.title,a.graphTitle);add('Category-axis label',s.label,a.label);add('Data source',s.source,a.source);add(a.type==='bar'?'Scale interval':'Value of one picture',s.scale,a.unit);
   if(a.type==='bar')add('Vertical-axis label',s.yLabel,a.yLabel);
  }
  if(a.type==='mean'){
   const shares=meanState(a,s),reserve=a.values.reduce((x,y)=>x+y,0)-shares.reduce((x,y)=>x+y,0);
   add('Equal sharing of the entire collection',s.shared?shares.join(', ')+'; reserve '+reserve:undefined,'All '+a.values.length+' groups have '+a.mean+'; reserve 0',s.shared&&reserve===0&&shares.every(v=>v===a.mean));
   add('Mean ('+a.unit+')',s.mean,a.mean);
  }
  if(a.type==='mode'){
   const selected=s.modes||[];
   add('Complete set of modes',selected.length?selected.join(', '):undefined,a.modes.join(', '),selected.length===a.modes.length&&a.modes.every(x=>selected.map(String).includes(String(x))));
  }
  if(a.type==='collect2')a.rows.forEach((r,i)=>a.columns.forEach((c,j)=>add(r+' / '+c+' count',s['cell'+i+'_'+j],a.records.filter(v=>v[0]===i&&v[1]===j).length)));
  if(a.type==='lineplot')a.categories.forEach((c,i)=>add('X marks above '+c,s['value'+i],a.values[i]));
  if(a.type==='lineplot'||a.type==='concrete'){add('Graph title',s.title,a.graphTitle);add('Category / number-line label',s.label,a.label);add('Data source',s.source,a.source);add(a.type==='lineplot'?'Value of one X':'Value of one object',s.scale,1);}
  (a.questions||[]).forEach(q=>add(q.label,s[q.id],q.answer));
  return rows;
 }
 function fill(a){
  const s={};
  if(a.type==='sort'||a.type==='concrete')s.placements=Object.fromEntries(a.items.map(i=>[i.id,i.target]));
  if(a.type==='tree')s.nodes=Object.fromEntries(a.nodes.map((n,i)=>[i,n[0]]));
  if(a.type==='frequency'){s.revealed=a.records.length;counts(a).forEach((v,i)=>s['count'+i]=v)}
  if(a.type==='bar'||a.type==='pictograph'){a.values.forEach((v,i)=>s['value'+i]=a.type==='bar'?v:v/a.unit);Object.assign(s,{title:a.graphTitle,label:a.label,source:a.source,scale:a.unit});if(a.yLabel)s.yLabel=a.yLabel;}
  if(a.type==='mean')Object.assign(s,{shares:a.values.map(()=>a.mean),shared:true,mean:a.mean});
  if(a.type==='mode')s.modes=[...a.modes];
  if(a.type==='collect2'){s.revealed=a.records.length;a.rows.forEach((r,i)=>a.columns.forEach((c,j)=>s['cell'+i+'_'+j]=a.records.filter(v=>v[0]===i&&v[1]===j).length));}
  if(a.type==='lineplot')a.values.forEach((v,i)=>s['value'+i]=v);
  if(a.type==='lineplot'||a.type==='concrete')Object.assign(s,{title:a.graphTitle,label:a.label,source:a.source,scale:1});
  (a.questions||[]).forEach(q=>s[q.id]=q.answer);
  return s;
 }
 return {assess,fill,counts,meanState,allRows:state=>activities.flatMap(a=>assess(a,state.answers?.[a.number]||{}))};
})();
