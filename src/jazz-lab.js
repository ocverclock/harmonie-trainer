import {secondary} from "./music.js";
import {transposedVoiceStudies} from "./cadence-transpositions.js";
import {chordTones,evaluateVoicing,midiLabel} from "./voicing.js";
import {PIANO_START,PIANO_END} from "./piano-layout.js";

// Four real piano pitches per chord, sorted from low to high. We follow each
// register (bass/tenor/alto/soprano), not a claimed physical finger identity.
const uniqueSorted=midis=>[...new Set(midis)].sort((a,b)=>a-b);
const valid=notes=>Array.isArray(notes)&&notes.every(m=>Number.isInteger(m)&&m>=PIANO_START&&m<=PIANO_END);
export function analyzeVoiceLeading(previous,current){
 if(!valid(previous)||!valid(current)||previous.length!==4||current.length!==4||
    new Set(previous).size!==4||new Set(current).size!==4)throw Error("Four distinct piano pitches required for each chord");
 const from=uniqueSorted(previous),to=uniqueSorted(current);
 const moves=from.map((midi,i)=>({voice:i+1,from:midi,to:to[i],semitones:to[i]-midi,
  type:to[i]===midi?"commune":Math.abs(to[i]-midi)===1?"demi-ton":Math.abs(to[i]-midi)>7?"grand saut":"mouvement"}));
 return {moves,total:moves.reduce((n,m)=>n+Math.abs(m.semitones),0),
  held:moves.filter(m=>m.semitones===0).length,
  semitone:moves.filter(m=>Math.abs(m.semitones)===1).length,
  leaps:moves.filter(m=>Math.abs(m.semitones)>7).length,
  largest:Math.max(...moves.map(m=>Math.abs(m.semitones)))};
}
export function closestValidVoicing(symbol,previous){
 if(!valid(previous)||previous.length!==4||new Set(previous).size!==4)throw Error("Previous chord must have four distinct notes");
 const pitches=chordTones(symbol);
 const possibilities=pitches.map(pc=>{
  const p=[];for(let m=PIANO_START;m<=PIANO_END;m++)if(m%12===pc)p.push(m);
  return p;
 });
 let best=null,score=Infinity;
 function recurse(index,notes){
  if(index<pitches.length){for(const m of possibilities[index])recurse(index+1,[...notes,m]);return}
  if(new Set(notes).size!==4)return;
  const sorted=uniqueSorted(notes),motion=analyzeVoiceLeading(previous,sorted);
  const ranking=motion.total*10000+motion.leaps*100+motion.largest*10+(sorted[3]-sorted[0]);
  if(ranking<score){score=ranking;best=sorted}
 }
 recurse(0,[]);
 return {midis:best,motion:analyzeVoiceLeading(previous,best)};
}
export function checkJazzChord(symbol,midis){return evaluateVoicing(symbol,midis)}
export const voiceStudies=[
 ...secondary.map(question=>({
  id:question.id,tonality:question.target,title:question.progression.title,
  explanation:question.explanation,additional:false,mode:question.target.includes("mineur")?"mineur":"majeur",
  frames:question.progression.frames.map(frame=>({
   symbol:frame.symbol,example:frame.voices.map(v=>v.midi).sort((a,b)=>a-b)
  }))
 })),
 ...transposedVoiceStudies
];

const earTypes=[
 {id:"maj7",label:"majeur 7",formula:[0,4,7,11],why:"La tierce est majeure et la septième est majeure : une couleur stable et lumineuse."},
 {id:"m7",label:"mineur 7",formula:[0,3,7,10],why:"Tierce mineure et septième mineure : une couleur souple, fréquente sur les II."},
 {id:"7",label:"dominante 7",formula:[0,4,7,10],why:"Tierce majeure et septième mineure créent un triton qui appelle une résolution."},
 {id:"m7b5",label:"demi-diminué",formula:[0,3,6,10],why:"La quinte diminuée donne l'instabilité caractéristique du II mineur."},
 {id:"sus4",label:"7 sus4",formula:[0,5,7,10],why:"La quarte remplace temporairement la tierce : écoute l'attente de résolution."}
];
const roots=[
 {name:"Do",pc:0},{name:"Ré♭",pc:1},{name:"Ré",pc:2},
 {name:"Mi♭",pc:3},{name:"Mi",pc:4},{name:"Fa",pc:5},
 {name:"Fa♯",pc:6},{name:"Sol",pc:7},{name:"La♭",pc:8},
 {name:"La",pc:9},{name:"Si♭",pc:10},{name:"Si",pc:11}
];
export function earQuestion(index){
 if(!Number.isInteger(index)||index<0)throw Error("Invalid listening exercise index");
 const type=earTypes[(index*3+Math.floor(index/5))%earTypes.length];
 const root=roots[(index*5+Math.floor(index/5))%roots.length];
 const start=48+root.pc;
 const midis=type.formula.map(interval=>start+interval);
 return {id:"ear-"+index,tonality:root.name,quality:type.id,answer:type.label,
  midis,why:type.why,choices:earTypes.map(t=>({id:t.id,label:t.label}))};
}
export const earQualities=earTypes;
export const studioStudies=[
 {id:"dominante-secondaire",melody:[64,62,60],title:"La dominante secondaire vers La mineur",tonality:"La mineur",
  before:{symbol:"Cmaj7",midis:[48,52,55,59]},target:{symbol:"Am7",midis:[57,60,64,67]},
  options:[
   {symbol:"E7",midis:[52,56,59,62],valid:true,why:"E7 est V de Am : Sol♯ est la sensible qui monte à La."},
   {symbol:"B♭7",midis:[58,62,65,68],valid:true,why:"B♭7 peut remplacer E7 par substitution tritonique ; la basse Si♭ approche La chromatiquement."},
   {symbol:"A7",midis:[57,61,64,67],valid:false,why:"A7 est surtout V de Ré ; il ne tonicise pas directement La mineur."}
  ]},
 {id:"backdoor",melody:[68,65,64],title:"La résolution backdoor en Do",tonality:"Do majeur",
  before:{symbol:"Fm7",midis:[53,56,60,63]},target:{symbol:"Cmaj7",midis:[48,52,55,59]},
  options:[
   {symbol:"B♭7",midis:[58,62,65,68],valid:true,why:"Fm7 → B♭7 → Cmaj7 est une arrivée backdoor ; La♭ de B♭7 peut descendre vers Sol."},
   {symbol:"G7",midis:[55,59,62,65],valid:true,why:"G7 reste la dominante directe de C ; il remplace la couleur backdoor par une cadence authentique."},
   {symbol:"E7",midis:[52,56,59,62],valid:false,why:"E7 tonicise surtout Am ; il n'est pas la résolution directe demandée vers C."}
  ]},
 {id:"triton",melody:[65,65,64],title:"Remplacer la dominante par son triton",tonality:"Do majeur",
  before:{symbol:"Dm7",midis:[50,53,57,60]},target:{symbol:"Cmaj7",midis:[48,52,55,59]},
  options:[
   {symbol:"D♭7",midis:[49,53,56,59],valid:true,why:"D♭7 partage le triton Fa–Do♭ (Si) de G7 et descend par demi-ton vers C."},
   {symbol:"G7",midis:[55,59,62,65],valid:true,why:"G7 est la dominante classique ; comparer son mouvement à celui de D♭7."},
   {symbol:"D7",midis:[50,54,57,60],valid:false,why:"D7 tonicise plutôt Sol, pas directement Do dans ce contexte."}
  ]},
 {id:"mineur",melody:[67,67,65],title:"Préparer une tonique mineure",tonality:"Ré mineur",
  before:{symbol:"Em7♭5",midis:[52,55,58,62]},target:{symbol:"Dm7",midis:[50,53,57,60]},
  options:[
   {symbol:"A7",midis:[57,61,64,67],valid:true,why:"A7 prépare Dm : Do♯, tierce de la dominante, monte à Ré."},
   {symbol:"E♭7",midis:[51,55,58,61],valid:true,why:"E♭7 remplace A7 par le triton et descend chromatiquement vers Ré mineur."},
   {symbol:"D7",midis:[50,54,57,60],valid:false,why:"D7 tonicise Sol, pas le Dm demandé."}
  ]}
];
export function checkStudioChoice(study,optionIndex){
 const opt=study?.options?.[optionIndex];
 if(!opt)throw Error("Unknown reharmonization choice");
 const melodyFits=opt.midis.some(n=>n%12===study.melody[1]%12);
 return {correct:opt.valid&&melodyFits,why:opt.why,option:opt,melodyFits};
}
export function skillRecommendations(archive,limit=5){
 if(!archive||!Array.isArray(archive.events))return [];
 const grouped=new Map();
 for(const event of archive.events){
  if(!event.exerciseId.startsWith("jazzlab:"))continue;
  const old=grouped.get(event.exerciseId);
  if(!old||event.at>=old.at)grouped.set(event.exerciseId,event);
 }
 return [...grouped.values()].filter(e=>!e.correct).sort((a,b)=>b.at.localeCompare(a.at)).slice(0,limit);
}
export const lessonGoals={
 voicing:"Construire trois accords successifs, puis distinguer justesse harmonique et fluidité des quatre voix.",
 ear:"Identifier à l'oreille la couleur d'une tétrade sans lire les notes avant de répondre.",
 studio:"Choisir une harmonisation, expliquer sa fonction, puis écouter deux résolutions possibles."
};
export function motionSentence(motion){
 if(!motion)return "Première étape : prépare quatre notes.";
 const elements=motion.moves.map(m=>"voix "+m.voice+" : "+midiLabel(m.from)+" → "+midiLabel(m.to)+
  (m.semitones===0?" (commune)":" ("+(m.semitones>0?"+":"")+m.semitones+" demi-ton"+(Math.abs(m.semitones)>1?"s":"")+")"));
 return elements.join(" · ");
}


/** Spaced ear revision by chord quality and distinct keys, not just question index. */
export function earMastery(archive,now=new Date()){
 const records=new Map(earTypes.map(t=>[t.id,{id:t.id,label:t.label,
  attempts:0,successes:0,tonalities:new Set(),lastAt:null,lastCorrect:null}]));
 for(const ev of archive?.events||[]){
  const matched=/^jazzlab:ear:ear-(\d+)$/.exec(ev.exerciseId);
  if(!matched)continue;
  const q=earQuestion(Number(matched[1])),record=records.get(q.quality);
  record.attempts++;
  if(ev.correct){record.successes++;record.tonalities.add(q.tonality)}
  if(!record.lastAt||ev.at>=record.lastAt){
   record.lastAt=ev.at;record.lastCorrect=ev.correct;
  }
 }
 return [...records.values()].map(r=>{
  const mastered=r.successes>=2&&r.tonalities.size>=2&&r.lastCorrect===true;
  const days=r.successes>=5?21:r.successes>=2?7:1;
  const dueAt=r.lastAt&&r.lastCorrect?new Date(Date.parse(r.lastAt)+days*86400000).toISOString():null;
  return {...r,tonalities:[...r.tonalities],mastered,due:!dueAt||Date.parse(dueAt)<=now.getTime(),dueAt,
   needsReview:r.lastCorrect===false};
 });
}
/** Select next quality needing consolidation, then a tonic not already mastered. */
export function nextEarReview(archive,current=-1,now=new Date()){
 const goals=earMastery(archive,now);
 const ranked=[...goals].sort((a,b)=>
  Number(b.needsReview)-Number(a.needsReview)||
  Number(!b.mastered)-Number(!a.mastered)||
  Number(b.due)-Number(a.due)||
  a.successes-b.successes||
  a.attempts-b.attempts);
 const pool=Array.from({length:60},(_,i)=>earQuestion(i));
 for(const goal of ranked){
  const options=pool.filter(q=>q.quality===goal.id&&Number(q.id.slice(4))!==current);
  const novel=options.find(q=>!goal.tonalities.includes(q.tonality));
  if(novel)return Number(novel.id.slice(4));
  if(options.length)return Number(options[0].id.slice(4));
 }
 return current<0?0:(current+1)%60;
}
