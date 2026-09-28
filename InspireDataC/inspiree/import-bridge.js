/* An imported activity only reads/writes its enclosing project's answer state. */
window.InspireMemory={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
window.InspireHost=(()=>{
 let initial={};try{initial=JSON.parse(decodeURIComponent(location.hash.slice(1)))}catch{}
 let api=null,busy=false;
 const send=(type,request)=>{if(!api||busy)return;parent.postMessage({type,token:initial.token,answer:api.get(),request},'*');};
 function emit(){send('INSPIRE_CHANGED');}
 function register(get,set,sync=()=>{}){api={get,set,sync};busy=true;set(initial.answer||{});busy=false;send('INSPIRE_READY');}
 addEventListener('message',e=>{if(e.source!==parent||e.data?.token!==initial.token)return;if(e.data.type==='INSPIRE_SNAPSHOT'){busy=true;api?.sync();busy=false;send('INSPIRE_SNAPSHOT_RESULT',e.data.request)}});
 return {initial,register,emit};
})();
