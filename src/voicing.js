import {pitch,qualities,names} from "./music.js";
import {PIANO_START,PIANO_END} from "./piano-layout.js";

const chordPattern=/^([A-G](?:#|b)?)(maj7|m7b5|m7|7)$/;

export function normalizeSymbol(symbol){
 return symbol.replaceAll("♯","#").replaceAll("♭","b");
}
export function chordTones(symbol){
 const match=chordPattern.exec(normalizeSymbol(symbol));
 if(!match)throw new Error("Accord non pris en charge : "+symbol);
 const root=pitch[match[1]];
 if(root===undefined)throw new Error("Fondamentale inconnue : "+symbol);
 const quality={maj7:"maj7",m7:"m7",m7b5:"halfDim","7":"dom7"}[match[2]];
 return qualities[quality].map(interval=>(root+interval)%12);
}
export function midiLabel(midi){
 const text=names[midi%12];
 return text+(Math.floor(midi/12)-1);
}
export function evaluateVoicing(symbol,midis){
 const expected=chordTones(symbol),expectedSet=new Set(expected);
 const unique=[...new Set(midis.map(x=>x%12))];
 const chosen=new Set(unique);
 const missing=expected.filter(pc=>!chosen.has(pc));
 const extra=unique.filter(pc=>!expectedSet.has(pc));
 const validMidis=midis.length===4&&new Set(midis).size===4&&midis.every(n=>Number.isInteger(n)&&n>=PIANO_START&&n<=PIANO_END);
 return {
  correct:validMidis&&unique.length===4&&missing.length===0&&extra.length===0,
  missing,extra,duplicateCount:midis.length-unique.length,
  expected,notesCount:midis.length
 };
}
export function makeVoicingProgression(question,answers){
 if(!Array.isArray(answers)||answers.length!==3||answers.some(notes=>notes.length!==4))return null;
 return {
  id:question.id+"-user",
  title:"Mes voicings : "+question.progression.title,
  frames:question.progression.frames.map((frame,index)=>{
   const sorted=[...answers[index]].sort((a,b)=>a-b);
   return {symbol:frame.symbol,voices:sorted.map((midi,id)=>({id,midi,note:midiLabel(midi)}))};
  })
 };
}
export function analyzeMotion(progression){
 if(!progression)return null;
 let total=0,stationary=0,large=0;
 for(let frame=1;frame<progression.frames.length;frame++){
  const before=progression.frames[frame-1].voices,after=progression.frames[frame].voices;
  for(let id=0;id<4;id++){
   const change=Math.abs(after[id].midi-before[id].midi);
   total+=change;
   if(change===0)stationary++;
   if(change>7)large++;
  }
 }
 return {total,stationary,large};
}

/** Suggested correction in the played register, not a mandatory octave or inversion. */
export function suggestCorrections(symbol,midis,reference=[]){
 const grade=evaluateVoicing(symbol,midis);
 const expected=new Set(grade.expected),used=new Set(),wrong=[];
 for(const midi of [...midis].sort((a,b)=>a-b)){
  const pc=midi%12;
  if(!expected.has(pc)||used.has(pc))wrong.push(midi);
  else used.add(pc);
 }
 const suggested=grade.missing.map(pc=>{
  const anchor=wrong.shift();
  const ref=reference.find(n=>n%12===pc);
  const near=Number.isInteger(anchor)?anchor:Number.isInteger(ref)?ref:60+pc;
  const candidates=[];
  for(let n=PIANO_START;n<=PIANO_END;n++)if(n%12===pc)candidates.push(n);
  const midi=candidates.sort((a,b)=>Math.abs(a-near)-Math.abs(b-near))[0];
  return {midi,replace:Number.isInteger(anchor)?anchor:null};
 });
 return {correct:grade.correct,wrong:[...new Set(midis.filter(n=>!expected.has(n%12))) ,...suggested.filter(x=>x.replace!==null&&expected.has(x.replace%12)).map(x=>x.replace)],suggested};
}
