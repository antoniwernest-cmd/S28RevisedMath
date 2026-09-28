window.STADIUM_PROJECT={"name":"InspireDataA","key":"inspiredataa-session-v2"};
window.STADIUM_ACTIVITIES=window.STADIUM_ACTIVITIES.filter(a=>[1,6,11,16,21,26,31,36].includes(a.sourceNumber)).map((a,i)=>({...a,number:i+1}));
