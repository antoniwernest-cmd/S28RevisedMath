window.STADIUM_PROJECT={"name":"InsireDataF","key":"insiredataf-session-v2"};
window.STADIUM_ACTIVITIES=window.STADIUM_ACTIVITIES.filter(a=>[5,10,15,20,25,30,35].includes(a.sourceNumber)).map((a,i)=>({...a,number:i+1}));
