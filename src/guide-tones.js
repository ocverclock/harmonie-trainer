// Guide-tone exercises in actual secondary II-V-I progressions.
// Notes are extracted from the authentic chord spellings and piano registers
// already authored in music.js, rather than invented MIDI constants.
import {secondary} from "./music.js";
import {chordTones,midiLabel} from "./voicing.js";

const roleNames={0:"fondamentale",1:"tierce",3:"septième"};
function tone(frame,degree){
 const pc=chordTones(frame.symbol)[degree];
 const note=frame.voices.find(v=>v.midi%12===pc);
 if(!note)throw Error("Note-guide introuvable pour "+frame.symbol+" degré "+degree);
 return {midi:note.midi,name:note.note,role:roleNames[degree]};
}
const transitions=[
 {from:0,to:1,fromDegree:1,toDegree:3,
  why:"La tierce du II est conservée : elle devient la septième du V. Aucun mouvement n’est nécessaire."},
 {from:0,to:1,fromDegree:3,toDegree:1,
  why:"La septième du II descend d’un demi-ton et devient la tierce de la dominante V."},
 {from:1,to:2,fromDegree:1,toDegree:0,
  why:"La tierce de la dominante est la sensible de la tonalité cible : elle monte d’un demi-ton vers la fondamentale du I."},
 {from:1,to:2,fromDegree:3,toDegree:1,
  why:"La septième de la dominante se résout sur la tierce du I. En majeur, elle descend généralement d’un demi-ton ; dans nos exemples mineurs, d’un ton."}
];
export const guideToneStudies=secondary.map(question=>{
 const frames=question.progression.frames;
 const exercises=transitions.map((t,index)=>{
  const source=tone(frames[t.from],t.fromDegree),target=tone(frames[t.to],t.toDegree);
  const semitones=target.midi-source.midi;
  // These deliberately authored voicings demonstrate four elementary motions.
  const expected=index===0?0:index===1?-1:index===2?1:
   question.target.includes("mineur")?-2:-1;
  if(semitones!==expected)
   throw Error("Guide-tone example inconsistent: "+question.id+" "+index+" "+semitones+" instead of "+expected);
  return {id:question.id+":"+index,sourceSymbol:frames[t.from].symbol,
   targetSymbol:frames[t.to].symbol,source,target,semitones,why:t.why,
   description:t.from===0?"Du II au V":"Du V au I",index};
 });
 return {id:question.id,tonality:question.target,title:question.progression.title,
  type:question.target.includes("mineur")?"mineur":"majeur",frames,exercises};
});
export function checkGuideTone(study,index,selectedMidi){
 const exercise=study?.exercises?.[index];
 if(!exercise||!Number.isInteger(selectedMidi)||selectedMidi<48||selectedMidi>83)
  throw Error("Note choisie hors clavier ou exercice inconnu");
 const correct=selectedMidi===exercise.target.midi;
 const diff=selectedMidi-exercise.target.midi;
 const explanation=correct?
  exercise.why:
  "Tu as joué "+midiLabel(selectedMidi)+" au lieu de "+exercise.target.name+
  ". La bonne résolution est "+exercise.source.name+" → "+exercise.target.name+
  " ("+describeSemitones(exercise.semitones)+"). "+exercise.why;
 return {correct,selectedMidi,diff,expected:exercise.target.midi,explanation};
}
export function describeSemitones(n){
 if(n===0)return "note commune, aucun déplacement";
 const amount=Math.abs(n);
 return (n>0?"monte":"descend")+(amount===1?" d’un demi-ton":amount===2?" d’un ton":" de "+amount+" demi-tons");
}
export function guideToneSummary(study,answers){
 if(!study||!Array.isArray(answers))throw Error("Bilan des notes-guides inconnu");
 return {total:study.exercises.length,attempted:answers.filter(Boolean).length,
  correct:answers.filter(a=>a?.correct).length,
  majorOrMinor:study.type};
}
