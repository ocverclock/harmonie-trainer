// Pure random practice helpers: no score or curriculum ID is rewritten.
// All randomness is injected for reproducible tests.
import {PIANO_START,PIANO_END} from "./piano-layout.js";

const roots=[
 {name:"C",pc:0},{name:"D♭",pc:1},{name:"D",pc:2},{name:"E♭",pc:3},
 {name:"E",pc:4},{name:"F",pc:5},{name:"G♭",pc:6},{name:"G",pc:7},
 {name:"A♭",pc:8},{name:"A",pc:9},{name:"B♭",pc:10},{name:"B",pc:11}
];
const natural={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
const letters=["C","D","E","F","G","A","B"];
const suffix={M:"",m:"m",maj7:"maj7",m7:"m7",dom7:"7",dim:"dim",aug:"aug",halfDim:"m7♭5"};
const degreeStep={M:[0,2,4],m:[0,2,4],dim:[0,2,4],aug:[0,2,4],
 maj7:[0,2,4,6],m7:[0,2,4,6],dom7:[0,2,4,6],halfDim:[0,2,4,6]};
const normalized=n=>(n%12+12)%12;
export function shuffle(items,random=Math.random){
 const array=[...items];
 for(let i=array.length-1;i>0;i--){
  const j=Math.max(0,Math.min(i,Math.floor(random()*(i+1))));
  [array[i],array[j]]=[array[j],array[i]];
 }
 return array;
}
function spellTone(root,interval,degree){
 const letter=letters[(letters.indexOf(root.name[0])+degree)%7];
 const target=normalized(root.pc+interval);
 const change=normalized(target-natural[letter]+6)-6;
 if(Math.abs(change)>1)return null; // avoid theoretical double sharps/flats at this level
 return letter+(change===1?"♯":change===-1?"♭":"");
}
export function generatedChordPool(qualities){
 const result=[];
 for(const [quality,level] of [["M",1],["m",1],["maj7",2],["m7",2],["dom7",2],["dim",3],["aug",3],["halfDim",3]]){
  for(const root of roots){
   const intervals=qualities[quality];
   const spelled=intervals.map((n,i)=>spellTone(root,n,degreeStep[quality][i]));
   if(spelled.some(s=>!s))continue;
   const symbol=root.name+suffix[quality];
   result.push({id:"random-"+quality+"-"+root.pc,symbol,root:root.name,
    quality,level,spelling:spelled.join(" "),expected:intervals.map(n=>normalized(root.pc+n))});
  }
 }
 return result;
}
const BLACK=new Set([1,3,6,8,10]);
export function randomizedChordSession(level,bank,qualities,random=Math.random){
 const generated=generatedChordPool(qualities);
 const qualitiesByLevel={
  1:["M","m","M","m","M","m","M","m","M","m"],
  2:["maj7","m7","dom7","maj7","m7","dom7","maj7","m7","dom7","maj7"],
  3:["dim","aug","halfDim","dim","aug","halfDim","M","m7","dom7","maj7"]
 };
 const levels=qualitiesByLevel[level];
 if(!levels)throw new RangeError("Unknown quiz level: "+level);
 const schedule=shuffle(levels,random);
 const pool=[...bank,...generated];
 const used=new Set(),chosen=[];
 for(const type of schedule){
  const eligible=shuffle(pool.filter(e=>e.quality===type&&!used.has(e.symbol)),random);
  if(!eligible.length)throw Error("Not enough "+type+" construction exercises");
  const previous=chosen.at(-1);
  // Prefer changing both the tonic and the chord quality between two questions.
  const alternatives=eligible.filter(e=>!previous||e.root!==previous.root);
  const shortlist=alternatives.length?alternatives:eligible;
  const blackKeys=shortlist.filter(e=>e.expected.some(n=>BLACK.has(n)));
  const remaining=10-chosen.length;
  const needBlack=Math.max(0,5-chosen.filter(e=>e.expected.some(n=>BLACK.has(n))).length);
  const choices=needBlack>=remaining&&blackKeys.length?blackKeys:shortlist;
  const selected=choices[0];used.add(selected.symbol);chosen.push(selected);
 }
 return chosen;
}
export function shuffledLessonOrder(lesson,progress={},random=Math.random){
 const pool=shuffle(lesson.exercises.map((_,i)=>i),random);
 const pending=pool.filter(i=>!progress[lesson.id+":"+i]?.correct);
 const learned=pool.filter(i=>progress[lesson.id+":"+i]?.correct);
 const result=[];
 for(const group of [pending,learned]){
  const unused=[...group];
  while(unused.length){
   const last=lesson.exercises[result.at(-1)]?.tonality||null;
   const index=unused.findIndex(i=>!last||lesson.exercises[i].tonality!==last);
   result.push(unused.splice(index<0?0:index,1)[0]);
  }
 }
 return result;
}
export function nextCadenceIndex(current,count,random=Math.random){
 if(count<=1)return 0;
 // Every next cadence differs from the last, even with an edge-case RNG.
 const offset=1+Math.min(count-2,Math.max(0,Math.floor(random()*(count-1))));
 return ((current+offset)%count+count)%count;
}
export function randomCadenceIndex(count,random=Math.random){
 return count?Math.max(0,Math.min(count-1,Math.floor(random()*count))):0;
}
export function previousVoicingNotes(answers,step){
 if(!Array.isArray(answers)||step<=0||!Array.isArray(answers[step-1])||answers[step-1].length!==4)return [];
 const valid=answers[step-1].filter(n=>Number.isInteger(n)&&n>=PIANO_START&&n<=PIANO_END);
 return valid.length===4?[...new Set(valid)].sort((a,b)=>a-b):[];
}
