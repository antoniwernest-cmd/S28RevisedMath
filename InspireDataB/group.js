window.STADIUM_PROJECT={"name":"InspireDataB","key":"inspiredatab-session-v2"};
window.STADIUM_ACTIVITIES=window.STADIUM_ACTIVITIES.filter(a=>[2,7,12,17,22,27,32].includes(a.sourceNumber)).map((a,i)=>({...a,number:i+1}));
