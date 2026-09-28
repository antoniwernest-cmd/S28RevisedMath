window.STADIUM_PROJECT={"name":"InspireDataC","key":"inspiredatac-session-v2"};
window.STADIUM_ACTIVITIES=window.STADIUM_ACTIVITIES.filter(a=>[3,8,13,18,23,28,33].includes(a.sourceNumber)).map((a,i)=>({...a,number:i+1}));
