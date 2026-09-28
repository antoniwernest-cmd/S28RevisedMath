/* Original activities aligned with Ontario Mathematics 2020, Grade 3 D1.1-D1.5. */
window.STADIUM_CURRICULUM = {
 'D1.1':'Sort sets of data about people or things according to two and three attributes, using tables and logic diagrams, including Venn, Carroll, and tree diagrams, as appropriate.',
 'D1.2':'Collect data through observations, experiments, and interviews to answer questions of interest that focus on qualitative and quantitative data, and organize the data using frequency tables.',
 'D1.3':'Display sets of data, using many-to-one correspondence, in pictographs and bar graphs with proper sources, titles, and labels, and appropriate scales.',
 'D1.4':'Determine the mean and identify the mode(s), if any, for various data sets involving whole numbers, and explain what each of these measures indicates about the data.',
 'D1.5':'Analyse different sets of data presented in various ways, including in frequency tables and in graphs with different scales, by asking and answering questions about the data and drawing conclusions, then make convincing arguments and informed decisions.'
};
(() => {
 const q=(id,label,answer,options,control='select')=>({id,label,answer,options,control});
 const nums=n=>Array.from({length:n+1},(_,i)=>i);
 const item=(id,label,emoji,target)=>({id,label,emoji,target});
 window.STADIUM_ACTIVITIES=[
 {title:'Apple orchard sorting',strand:'D1.1',type:'sort',layout:'table',icon:'🍎',prompt:'Sort each apple by two attributes: colour and size. Read the words on each card.',groups:['Red · Small','Red · Large','Green · Small','Green · Large'],items:[item('a','Red, small apple','🍎',0),item('b','Green, large apple','🍏',3),item('c','Red, large apple','🍎',1),item('d','Green, small apple','🍏',2),item('e','Red, small apple','🍎',0),item('f','Green, large apple','🍏',3),item('g','Red, large apple','🍎',1),item('h','Green, small apple','🍏',2)]},
 {title:'Halloween button Carroll diagram',strand:'D1.1',type:'sort',layout:'carroll',icon:'⭐',prompt:'Place the buttons using both colour and shape. A card can be moved again.',columns:['Orange','Not orange'],rows:['Star','Not a star'],groups:['Orange star','Star, not orange','Orange, not a star','Not orange, not a star'],items:[item('a','Orange star','★',0),item('b','Purple heart','♥',3),item('c','Orange circle','●',2),item('d','Blue star','★',1),item('e','Green triangle','▲',3),item('f','Purple star','★',1),item('g','Orange heart','♥',2),item('h','Orange star','★',0)]},
 {title:'Fall parade Venn diagram',strand:'D1.1',type:'sort',layout:'venn',icon:'🚚',prompt:'Sort the toy vehicles. Put a red truck in the overlap. Use the outside box for neither attribute.',attributes:['Red','Truck'],groups:['Red only','Red AND truck','Truck only','Neither'],items:[item('a','Red car','🚗',0),item('b','Red truck','🚚',1),item('c','Blue truck','🚚',2),item('d','Yellow car','🚗',3),item('e','Red bus','🚌',0),item('f','Green truck','🚚',2),item('g','Blue bus','🚌',3),item('h','Red truck','🚚',1)]},
 {title:'Leaf detectives: three attributes',strand:'D1.1',type:'sort',layout:'table3',icon:'🍂',prompt:'Use three attributes: colour, size, and edge. Each leaf belongs in one row of this sorting table.',groups:['Red · Small · Smooth','Red · Small · Jagged','Red · Large · Smooth','Red · Large · Jagged','Yellow · Small · Smooth','Yellow · Small · Jagged','Yellow · Large · Smooth','Yellow · Large · Jagged'],items:[item('a','Yellow · Large · Jagged','🍂',7),item('b','Red · Small · Smooth','🍁',0),item('c','Yellow · Small · Jagged','🍂',5),item('d','Red · Large · Smooth','🍁',2),item('e','Red · Small · Jagged','🍁',1),item('f','Yellow · Large · Smooth','🍂',6),item('g','Red · Large · Jagged','🍁',3),item('h','Yellow · Small · Smooth','🍂',4)]},
 {title:'Trading-card tree',strand:'D1.1',type:'tree',icon:'🃏',prompt:'Build a horizontal tree using the characteristic cards. Read each branch clue. Level 3 is card condition.',levels:['Type of card','Category','Condition'],nodes:[['Sports cards','Sport'],['Game character cards','Game'],['Team sport','Team'],['Individual sport','Individual'],['Human','Person'],['Creature','Creature'],['New','Unused'],['Worn','Used'],['New','Unused'],['Worn','Used'],['New','Unused'],['Worn','Used'],['New','Unused'],['Worn','Used']]},
 {title:'Pumpkin delivery tree',strand:'D1.1',type:'sort',layout:'treeSort',icon:'🎃',prompt:'Follow the tree: vehicle type → colour → load. Place each delivery card at its final branch.',groups:['Car · Red · Full','Car · Red · Empty','Car · Blue · Full','Car · Blue · Empty','Truck · Red · Full','Truck · Red · Empty','Truck · Blue · Full','Truck · Blue · Empty'],items:[item('a','Truck · Blue · Empty','🚚',7),item('b','Car · Red · Full','🚗',0),item('c','Truck · Red · Empty','🚚',5),item('d','Car · Blue · Full','🚗',2),item('e','Car · Red · Empty','🚗',1),item('f','Truck · Blue · Full','🚚',6),item('g','Car · Blue · Empty','🚗',3),item('h','Truck · Red · Full','🚚',4)]},
 {title:'Watch the fall traffic',strand:'D1.2',type:'frequency',method:'observation',icon:'🚗',prompt:'Observe every toy vehicle passing the school. Press “Observe next”, then record each count in the frequency table.',categories:['Car','Truck','Bus'],records:['Car','Truck','Car','Bus','Car','Truck','Bus','Car','Truck','Car','Car','Truck'],emoji:{Car:'🚗',Truck:'🚚',Bus:'🚌'},questions:[q('kind','What kind of data are vehicle types?','Qualitative',['Qualitative','Quantitative']),q('method','How did we collect these data?','Observation',['Interview','Observation','Experiment'])]},
 {title:'Interview at the apple farm',strand:'D1.2',type:'frequency',method:'interview',icon:'🍎',prompt:'Ask each visitor: “Which apple do you prefer?” Reveal their answers and complete the frequency table.',categories:['Gala','McIntosh','Honeycrisp'],records:['Gala','Honeycrisp','McIntosh','Gala','Honeycrisp','Honeycrisp','Gala','McIntosh','Honeycrisp','Gala'],questions:[q('kind','Apple preference is…','Qualitative',['Quantitative','Qualitative']),q('method','Asking visitors is an…','Interview',['Experiment','Interview','Observation'])]},
 {title:'Lego ramp experiment',strand:'D1.2',type:'frequency',method:'experiment',icon:'🧱',prompt:'Release the same toy car from the marked line. Run all 9 trials. Record how many floor tiles it travels each time.',categories:['2 tiles','3 tiles','4 tiles'],records:['3 tiles','2 tiles','4 tiles','3 tiles','3 tiles','2 tiles','4 tiles','3 tiles','2 tiles'],questions:[q('kind','Distance in floor tiles is…','Quantitative',['Qualitative','Quantitative']),q('fair','What must stay the same for a fair comparison?','Car and starting line',['Car and starting line','Change the car every trial','Push harder each trial'])]},
 {title:'Count the Lego tower heights',strand:'D1.2',type:'frequency',method:'observation',icon:'🧱',prompt:'Observe the towers at the October building competition. Count their heights in bricks and complete the frequency table.',categories:['4 bricks','6 bricks','8 bricks'],records:['6 bricks','4 bricks','8 bricks','6 bricks','4 bricks','6 bricks','8 bricks','4 bricks','6 bricks','6 bricks'],questions:[q('kind','Height measured in bricks is…','Quantitative',['Quantitative','Qualitative']),q('total','How many towers were observed?',10,nums(15))]},
 {title:'Halloween costume interviews',strand:'D1.2',type:'frequency',method:'interview',icon:'🎃',prompt:'Ask all 12 children which costume they chose. Count each answer once.',categories:['Robot','Witch','Astronaut','Cat'],records:['Robot','Cat','Witch','Robot','Astronaut','Cat','Robot','Witch','Robot','Cat','Astronaut','Robot'],questions:[q('question','Which question matches these data?','Which costume did you choose?',['How tall are you?','Which costume did you choose?','How many apples did you pick?']),q('most','Which costume has the highest frequency?','Robot',['Robot','Witch','Astronaut','Cat'])]},
 {title:'Paper-leaf flight lab',strand:'D1.2',type:'frequency',method:'experiment',icon:'🍂',prompt:'Test the same paper leaf from the same height. Count the whole floor squares travelled in each of 10 trials.',categories:['1 square','2 squares','3 squares'],records:['2 squares','3 squares','1 square','2 squares','2 squares','3 squares','2 squares','1 square','3 squares','2 squares'],questions:[q('kind','The number of squares is…','Quantitative',['Qualitative','Quantitative']),q('method','Testing and recording each flight is an…','Experiment',['Experiment','Interview','Observation'])]},
 {title:'Apple-picking pictograph',strand:'D1.3',type:'pictograph',icon:'🍎',prompt:'Make a pictograph from the table. Each apple picture represents 2 apples. A half picture represents 1 apple.',categories:['Gala','McIntosh','Honeycrisp'],values:[10,6,11],unit:2,emoji:'🍎',source:'Orchard picking record, October 8',graphTitle:'Apples picked on October 8',label:'Apple variety'},
 {title:'Halloween game-card collection',strand:'D1.3',type:'pictograph',icon:'🃏',prompt:'Create the collection pictograph. Each card picture represents 5 game cards.',categories:['Hero','Creature','Magic'],values:[20,15,30],unit:5,emoji:'🃏',source:'Class card count, October 14',graphTitle:'Our game-card collection',label:'Card type'},
 {title:'Pumpkin-farm deliveries',strand:'D1.3',type:'pictograph',icon:'🎃',prompt:'Show the delivery counts. Each pumpkin picture represents 10 pumpkins.',categories:['Monday','Tuesday','Wednesday'],values:[40,60,30],unit:10,emoji:'🎃',source:'Farm delivery log, October 19–21',graphTitle:'Pumpkins delivered',label:'Day'},
 {title:'Panda exhibit on Monday',strand:'D1.3',type:'bar',icon:'🐼',prompt:'Use the drop-downs to set the bars. Each grid interval represents 2 visitors. Bars start at zero.',categories:['Morning','Afternoon','Evening'],values:[11,12,10],unit:2,max:14,control:'select',source:'Panda gate tally, Monday in October',graphTitle:'Monday visits to the panda exhibit',label:'Time of day',yLabel:'Number of visitors'},
 {title:'Lego competition visitors',strand:'D1.3',type:'bar',icon:'🧱',prompt:'Move the sliders to build the bars. The vertical scale counts by 5 visitors.',categories:['Friday','Saturday','Sunday'],values:[15,30,25],unit:5,max:40,control:'slider',source:'Lego competition entry count, October 23–25',graphTitle:'Visitors to the Lego competition',label:'Day',yLabel:'Number of visitors'},
 {title:'October toy-vehicle drive',strand:'D1.3',type:'bar',icon:'🚚',prompt:'Use the + and − buttons to build the graph. The scale counts by 10 toys.',categories:['Cars','Trucks','Buses'],values:[30,50,20],unit:10,max:60,control:'stepper',source:'School toy-drive count, October 28',graphTitle:'Toy vehicles donated',label:'Vehicle type',yLabel:'Number of toys'},
 {title:'Share the Lego bricks fairly',strand:'D1.4',type:'mean',icon:'🧱',prompt:'Move bricks through the reserve until all four towers are equal. Then give the mean height.',values:[4,6,8,10],unit:'bricks',mean:7,questions:[q('meaning','What does the mean of 7 tell us?','Each tower would have 7 bricks if shared equally.',['Every original tower was 7 bricks tall.','Each tower would have 7 bricks if shared equally.','There are 7 towers.'])]},
 {title:'Fair shares at the apple farm',strand:'D1.4',type:'mean',icon:'🍎',prompt:'Share all 30 apples equally among the five baskets using the reserve. Record the mean.',values:[2,4,6,8,10],unit:'apples',mean:6,questions:[q('meaning','Why is the mean 6?','30 apples shared among 5 baskets gives 6 each.',['6 is the tallest basket.','30 apples shared among 5 baskets gives 6 each.','There are 6 baskets.'])]},
 {title:'The most common tower height',strand:'D1.4',type:'mode',icon:'🧱',prompt:'Study the heights. Select every mode, then explain what it tells you.',values:[4,6,6,8,6,10],modes:[6],options:[4,6,8,10,'No mode'],questions:[q('meaning','The mode tells us…','6 bricks is the most frequent tower height.',['Every tower is 6 bricks tall.','6 bricks is the most frequent tower height.','The total is 6 bricks.'])]},
 {title:'Two popular pumpkin masses',strand:'D1.4',type:'mode',icon:'🎃',prompt:'The pumpkin masses are in kilograms. A data set can have more than one mode. Select every mode.',values:[2,2,4,4,6,8],modes:[2,4],options:[2,4,6,8,'No mode'],questions:[q('meaning','Why are there two modes?','2 and 4 each occur twice, more than the other values.',['2 and 4 are the smallest numbers.','2 and 4 each occur twice, more than the other values.','There must always be two modes.'])]},
 {title:'Different lengths, no mode',strand:'D1.4',type:'mode',icon:'🍂',prompt:'These paper leaves measure 3, 4, 5, 6, and 7 centimetres. Select the mode, or select “No mode”.',values:[3,4,5,6,7],modes:['No mode'],options:[3,4,5,6,7,'No mode'],questions:[q('meaning','Why is there no mode?','Every length occurs just once.',['Every length occurs just once.','There are no measurements.','The mean cannot be found.']),q('mean','What is the mean length in centimetres?',5,nums(10))]},
 {title:'Mean and mode at the Lego finals',strand:'D1.4',type:'analyse',icon:'🏆',prompt:'The five tower heights are shown below. Find the mean and mode and interpret them.',display:'numbers',values:[4,4,6,8,8],questions:[q('sum','Total height in bricks',30,nums(40)),q('mean','Mean height in bricks',6,nums(12)),q('modes','Select the complete set of modes.','4 and 8',['4 only','6 only','8 only','4 and 8','No mode']),q('meaning','Which statement is supported?','A fair share is 6 bricks; 4 and 8 are the most common heights.',['All towers are 6 bricks tall.','A fair share is 6 bricks; 4 and 8 are the most common heights.','The tallest tower is 30 bricks.'])]},
 {title:'Choose apples for the fall fair',strand:'D1.5',type:'analyse',icon:'🍎',prompt:'Use the frequency table to decide which apples to order for the fair.',display:'table',categories:['Gala','McIntosh','Honeycrisp'],values:[8,5,11],source:'24 visitor interviews, October fair',questions:[q('total','How many visitors answered?',24,nums(30)),q('difference','How many more chose Honeycrisp than McIntosh?',6,nums(15)),q('decision','Which variety should we order most of?','Honeycrisp',['Gala','McIntosh','Honeycrisp']),q('evidence','Which evidence supports that choice?','Honeycrisp has the highest frequency: 11.',['Honeycrisp has the highest frequency: 11.','McIntosh has 5 votes.','Gala comes first in the table.'])]},
 {title:'Same data, different scales',strand:'D1.5',type:'analyse',icon:'📊',prompt:'Both graphs show the same costume counts. Graph A counts by 2; Graph B counts by 5. Read the numbers on the axes.',display:'compare',categories:['Robot','Cat','Witch'],values:[10,20,10],scales:[2,5],maxima:[20,40],source:'Class costume count, October 30',questions:[q('cat','How many cats are shown in Graph B?',20,nums(30)),q('same','Are the counts the same in both graphs?','Yes',['Yes','No']),q('reason','Why is the cat bar shorter on Graph B?','Graph B uses a larger maximum on its axis.',['There are fewer cats in Graph B.','Graph B uses a larger maximum on its axis.','The graph has no zero.']),q('total','How many costumes are counted?',40,nums(50))]},
 {title:'Read the half-picture clue',strand:'D1.5',type:'analyse',icon:'🎃',prompt:'Read the pumpkin pictograph. One full picture means 2 pumpkins; one half means 1.',display:'picture',categories:['Patch A','Patch B','Patch C'],values:[9,6,11],unit:2,emoji:'🎃',source:'Pumpkin harvest log, October 20',questions:[q('half','How many pumpkins does a half picture show?',1,[1,2,4]),q('c','How many pumpkins came from Patch C?',11,nums(15)),q('diff','How many more came from Patch C than Patch B?',5,nums(15)),q('total','How many pumpkins were harvested?',26,nums(35))]},
 {title:'Plan the toy-truck parking area',strand:'D1.5',type:'analyse',icon:'🚚',prompt:'Read the vehicle counts and choose a parking plan supported by the data.',display:'bar',categories:['Cars','Trucks','Buses'],values:[20,30,10],unit:10,max:40,source:'Toy parade entry list, October 26',questions:[q('trucks','How many trucks need spaces?',30,nums(60)),q('total','Total spaces needed',60,nums(70)),q('decision','Which vehicle type needs the most spaces?','Trucks',['Cars','Trucks','Buses']),q('evidence','Which plan fits the evidence?','30 truck spaces, 20 car spaces, and 10 bus spaces.',['20 spaces for every type.','30 truck spaces, 20 car spaces, and 10 bus spaces.','10 spaces for every type.'])]},
 {title:'Compare two Lego clubs',strand:'D1.5',type:'analyse',icon:'🧱',prompt:'Each club built four towers. Use the table to compare their mean heights and variation.',display:'datasets',sets:[{name:'Maple Club',values:[4,6,8,10]},{name:'Pumpkin Club',values:[7,7,7,7]}],source:'October Lego club measurement record',questions:[q('a','Maple Club mean height',7,nums(12)),q('b','Pumpkin Club mean height',7,nums(12)),q('same','Does the same mean prove the tower heights are identical?','No',['Yes','No']),q('evidence','Which statement matches the data?','The means are equal, but only Pumpkin Club has all equal heights.',['All eight towers are 7 bricks tall.','The means are equal, but only Pumpkin Club has all equal heights.','Maple Club has fewer towers.'])]},
 {title:'Make a fall-festival decision',strand:'D1.5',type:'analyse',icon:'🍁',prompt:'Read the interview table and bar graph together. Make a decision using both records.',display:'decision',categories:['Apple picking','Lego building','Costume parade'],values:[12,18,10],secondValues:[10,20,10],unit:5,max:20,source:'Grade 3 interviews and last October’s attendance',questions:[q('fav','Which activity is requested most this year?','Lego building',['Apple picking','Lego building','Costume parade']),q('diff','How many more request Lego building than the costume parade?',8,nums(20)),q('same','How many attended the costume parade last October?',10,nums(30)),q('decision','Which choice is supported by both records?','Give Lego building the largest activity area.',['Give Lego building the largest activity area.','Cancel apple picking because nobody chose it.','Give the costume parade all the space.']),q('evidence','Choose the strongest evidence.','Lego leads this year’s requests (18) and last year’s attendance (20).',['Lego is my favourite.','Lego leads this year’s requests (18) and last year’s attendance (20).','Costumes are colourful.'])]}
 ];
 window.STADIUM_ACTIVITIES.forEach((a,i)=>a.number=i+1);
})();

window.STADIUM_ACTIVITIES.forEach(a=>{a.sourceNumber=a.number;a.file="DreamStadium"+a.number+".html"});
window.STADIUM_ACTIVITIES.push(...[
  {
    "title": "CatMean · ten mean exercises",
    "strand": "D1.4",
    "icon": "📊",
    "prompt": "Find the mean for each of ten data sets. Use the exercise selector inside the activity. Median is retained as an extension beyond Grade 3.",
    "type": "embedded",
    "importId": 1,
    "number": 31,
    "sourceNumber": 31,
    "file": "DreamE1.html"
  },
  {
    "title": "Share 40 leaves · find the mean",
    "strand": "D1.4",
    "icon": "🍃",
    "prompt": "Share 40 leaves equally among four groups. The equal group size is the mean.",
    "type": "embedded",
    "importId": 2,
    "number": 32,
    "sourceNumber": 32,
    "file": "DreamE2.html"
  },
  {
    "title": "Food-bank cans · find the mean",
    "strand": "D1.4",
    "icon": "🥫",
    "prompt": "Redistribute 24 cans among four children. Find the mean by making all four groups equal.",
    "type": "embedded",
    "importId": 3,
    "number": 33,
    "sourceNumber": 33,
    "file": "DreamE3.html"
  },
  {
    "title": "Card classification tree",
    "strand": "D1.1",
    "icon": "🌳",
    "prompt": "Sort by card type, category and condition. Every placed card can be moved again.",
    "type": "embedded",
    "importId": 4,
    "number": 34,
    "sourceNumber": 34,
    "file": "DreamE4.html"
  },
  {
    "title": "Game card collection",
    "strand": "D1.5",
    "icon": "🎮",
    "prompt": "Read the pictograph and answer the three questions. Each whole picture represents two cards.",
    "type": "embedded",
    "importId": 5,
    "number": 35,
    "sourceNumber": 35,
    "file": "DreamE5.html"
  },
  {
    "title": "Panda exhibit on Monday",
    "strand": "D1.3",
    "icon": "🐼",
    "prompt": "Use the tally chart to set the three bar heights. The scale increases by two.",
    "type": "embedded",
    "importId": 6,
    "number": 36,
    "sourceNumber": 36,
    "file": "DreamE6.html"
  }
]);
