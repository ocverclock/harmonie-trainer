// The eight levels describe WHAT to build. Difficulty only chooses roots and hints.
// The legacy function signature is kept so other curriculum modules stay untouched.
import {PIANO_START,PIANO_END} from "./piano-layout.js";

const roots=[
 {name:"C",pc:0},{name:"D♭",pc:1},{name:"D",pc:2},{name:"E♭",pc:3},
 {name:"E",pc:4},{name:"F",pc:5},{name:"G♭",pc:6},{name:"G",pc:7},
 {name:"A♭",pc:8},{name:"A",pc:9},{name:"B♭",pc:10},{name:"B",pc:11}
];
const natural={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
const letters=["C","D","E","F","G","A","B"];
const suffix={M:"",m:"m",dim:"dim",aug:"aug",sus4:"sus4",maj7:"maj7",m7:"m7",
 dom7:"7",halfDim:"m7♭5",dim7:"dim7",maj6:"6",min6:"m6",dom9:"9",min9:"m9",
 dom13:"13",maj13:"maj13",min13:"m13",dom7b9:"7♭9",dom7sharp9:"7♯9",dom7b13:"7♭13"};
const degreeStep={M:[0,2,4],m:[0,2,4],dim:[0,2,4],aug:[0,2,4],sus4:[0,3,4],
 maj7:[0,2,4,6],m7:[0,2,4,6],dom7:[0,2,4,6],halfDim:[0,2,4,6],dim7:[0,2,4,6],
 maj6:[0,2,4,5],min6:[0,2,4,5],dom9:[0,2,6,1],min9:[0,2,6,1],
 dom13:[0,2,6,1,5],maj13:[0,2,6,1,5],min13:[0,2,6,1,5],
 dom7b9:[0,2,6,1],dom7sharp9:[0,2,6,1],dom7b13:[0,2,6,1,5]};
const normalized=n=>(n%12+12)%12;
const BLACK=new Set([1,3,6,8,10]);
export const constructionLevels=[
 {id:1,label:"Triades majeures et mineures",summary:"3 notes · M / m",qualities:["M","m"],noteCounts:[3],description:"Fondamentale, tierce et quinte."},
 {id:2,label:"Triades particulières",summary:"3 notes · dim / aug / sus4",qualities:["dim","aug","sus4"],noteCounts:[3],description:"Quinte diminuée, quinte augmentée ou quarte suspendue."},
 {id:3,label:"Accords majeurs et mineurs de septième",summary:"4 notes · maj7 / m7",qualities:["maj7","m7"],noteCounts:[4],description:"Construire tierces et septièmes."},
 {id:4,label:"Dominantes et septièmes particulières",summary:"4 notes · 7 / m7♭5 / dim7",qualities:["dom7","halfDim","dim7"],noteCounts:[4],description:"Dominante, demi-diminué, septième diminuée."},
 {id:5,label:"Accords de sixte",summary:"4 notes · 6 / m6",qualities:["maj6","min6"],noteCounts:[4],description:"Sixte majeure sur triade majeure ou mineure."},
 {id:6,label:"Accords de neuvième",summary:"4 notes · 9 / m9",qualities:["dom9","min9"],noteCounts:[4],description:"Voicing jazz à quatre sons : quinte omise."},
 {id:7,label:"Accords de treizième",summary:"5 notes · 13 / maj13 / m13",qualities:["dom13","maj13","min13"],noteCounts:[5],description:"Voicing jazz à cinq sons : quinte et onzième omises."},
 {id:8,label:"Dominantes altérées",summary:"4–5 notes · 7♭9 / 7♯9 / 7♭13",
  qualities:["dom7b9","dom7sharp9","dom7b13"],noteCounts:[4,5],description:"Neuvièmes et treizièmes altérées."}
];
export const constructionDifficulties={
 guided:{label:"Facile",description:"Fondamentales familières, rappel des degrés et écoute de la fondamentale."},
 standard:{label:"Intermédiaire",description:"Fondamentales variées : Ré, La, Si♭, Mi♭, Mi, La♭. Sans indice."},
 challenge:{label:"Difficile",description:"Toutes les 12 fondamentales, y compris Ré♭, Sol♭ et Si. Sans indice."}
};
const ROOTS_BY_DIFFICULTY={
 guided:new Set([0,2,5,7,9,10]),          // C, D, F, G, A, B-flat
 standard:new Set([2,3,4,8,9,10]),        // D, E-flat, E, A-flat, A, B-flat
 challenge:new Set(roots.map(root=>root.pc))
};
export function difficultyOf(mode){
 if(!Object.prototype.hasOwnProperty.call(constructionDifficulties,mode))
  throw new RangeError("Difficulté inconnue : "+mode);
 return constructionDifficulties[mode];
}
export function levelOf(level){
 const found=constructionLevels.find(x=>x.id===Number(level));
 if(!found)throw new RangeError("Niveau inconnu : "+level);
 return found;
}
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
 if(Math.abs(change)>2)return null;
 return letter+(change===2?"♯♯":change===1?"♯":change===-1?"♭":change===-2?"♭♭":"");
}
export function generatedChordPool(qualities){
 const result=[];
 for(const level of constructionLevels)for(const quality of level.qualities){
  const intervals=qualities[quality];
  if(!intervals||intervals.length!==degreeStep[quality]?.length)throw Error("Formule manquante : "+quality);
  for(const root of roots){
   const spelled=intervals.map((interval,i)=>spellTone(root,interval,degreeStep[quality][i]));
   if(spelled.some(s=>s===null))continue;
   const omit5=["dom9","min9","dom13","maj13","min13","dom7b9","dom7sharp9","dom7b13"].includes(quality);
   const omit11=["dom13","maj13","min13","dom7b13"].includes(quality);
   const explanation=omit11?"Voicing jazz en cinq sons : quinte et onzième omises volontairement.":
    omit5?"Voicing jazz en quatre sons : quinte omise volontairement.":null;
   result.push({id:"random-"+quality+"-"+root.pc,symbol:root.name+suffix[quality],root:root.name,
    quality,level:level.id,familyId:"level-"+level.id,realizationId:omit11?"jazz-five":omit5?"jazz-four":"chord-tones",
    spelling:spelled.join(" "),expected:intervals.map(n=>normalized(root.pc+n)),
    voicingExplanation:explanation});
  }
 }
 return result;
}
export function randomizedChordSession(level,bank,qualities,random=Math.random,difficulty="standard"){
 const family=levelOf(level);
 difficultyOf(difficulty);
 const validRoots=ROOTS_BY_DIFFICULTY[difficulty];
 const pool=shuffle(generatedChordPool(qualities).filter(e=>
  e.familyId==="level-"+family.id&&validRoots.has(e.expected[0])),random);
 const counts=family.qualities.map((quality,i)=>Math.floor(10/family.qualities.length)+
  (i<10%family.qualities.length?1:0));
 const schedule=shuffle(family.qualities.flatMap((quality,i)=>Array(counts[i]).fill(quality)),random);
 const used=new Set(),chosen=[],usedRoots=new Set();
 for(const quality of schedule){
  let eligible=pool.filter(e=>e.quality===quality&&!used.has(e.id));
  if(!eligible.length)throw Error("Pas assez de questions "+quality+" en "+difficulty);
  const prev=chosen.at(-1);
  const otherRoots=eligible.filter(e=>!usedRoots.has(e.expected[0]));
  if(otherRoots.length)eligible=otherRoots;
  const notPrevious=eligible.filter(e=>!prev||e.expected[0]!==prev.expected[0]);
  if(notPrevious.length)eligible=notPrevious;
  // Hard mode tries uncommon roots early. This never changes chord structure.
  if(difficulty==="challenge"&&chosen.length<5){
   const uncommon=eligible.filter(e=>new Set([1,3,6,8,11]).has(e.expected[0]));
   if(uncommon.length)eligible=uncommon;
  }
  const selected=eligible[0];
  used.add(selected.id);usedRoots.add(selected.expected[0]);chosen.push(selected);
 }
 return chosen;
}
// Play a practical ascending register, rather than stacking 9ths/13ths in one octave.
export function demonstrationMidis(exercise){
 if(!exercise?.expected?.length)throw Error("Accord absent");
 const result=[];let midi=48+exercise.expected[0];
 for(const pc of exercise.expected){
  while(normalized(midi)!==pc)midi++;
  if(midi>PIANO_END)throw Error("Voicing au-delà du clavier");
  result.push(midi);midi++;
 }
 return result;
}
export function challengeStats(session){
 const rare=new Set([1,3,6,8,11]);
 return {withBlack:session.filter(e=>e.expected.some(n=>BLACK.has(n))).length,
  rareRoots:session.filter(e=>rare.has(e.expected[0])).length,
  distinctRoots:new Set(session.map(e=>e.expected[0])).size};
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
