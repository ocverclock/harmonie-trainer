// P07: The inversion of a seventh chord is determined by the bass pitch
// class (root, third, fifth, seventh), NOT by a compulsory upper voicing or
// by matching one octave. The examples are pedagogical closed positions.
import {chordTones,evaluateVoicing,midiLabel} from "./voicing.js";
import {PIANO_START,PIANO_END} from "./piano-layout.js";

const configurations=[
 {id:"cmaj7",symbol:"Cmaj7",tonality:"Do majeur",degrees:["Do","Mi","Sol","Si"]},
 {id:"dm7",symbol:"Dm7",tonality:"Ré mineur",degrees:["Ré","Fa","La","Do"]},
 {id:"g7",symbol:"G7",tonality:"Sol dominante",degrees:["Sol","Si","Ré","Fa"]},
 {id:"bm7b5",symbol:"Bm7♭5",tonality:"Si demi-diminué",degrees:["Si","Ré","Fa","La"]},
 {id:"ebmaj7",symbol:"E♭maj7",tonality:"Mi♭ majeur",degrees:["Mi♭","Sol","Si♭","Ré"]},
 {id:"abmaj7",symbol:"A♭maj7",tonality:"La♭ majeur",degrees:["La♭","Do","Mi♭","Sol"]}
];
export const inversionNames=["État fondamental","Premier renversement","Deuxième renversement","Troisième renversement"];
const roleNames=["fondamentale","tierce","quinte","septième"];
function referencePosition(pcs,index){
 const order=[...pcs.slice(index),...pcs.slice(0,index)];
 const bass=Array.from({length:12},(_,i)=>PIANO_START+i).find(m=>m%12===order[0]);
 if(bass===undefined)throw Error("Basse indisponible");
 const midis=[bass];
 for(const pc of order.slice(1)){
  let n=midis[midis.length-1]+1;
  while(n%12!==pc)n++;
  if(n>PIANO_END)throw Error("Position exemple hors clavier");
  midis.push(n);
 }
 return midis;
}
export const inversionStudies=configurations.map(configuration=>{
 const pcs=chordTones(configuration.symbol);
 if(pcs.length!==4||configuration.degrees.length!==4)throw Error("Tétrade invalide");
 const exercises=inversionNames.map((name,index)=>({
  id:configuration.id+":"+index,number:index,name,role:roleNames[index],
  bassPc:pcs[index],bassName:configuration.degrees[index],
  reference:referencePosition(pcs,index)
 }));
 return {...configuration,exercises};
});
export function gradeInversion(study,index,midis){
 const ex=study?.exercises?.[index];
 if(!ex||!Array.isArray(midis)||midis.length!==4||midis.some(n=>!Number.isInteger(n)||n<PIANO_START||n>PIANO_END)||
    new Set(midis).size!==4)throw Error("Quatre touches distinctes du clavier requises");
 const played=[...midis].sort((a,b)=>a-b),bass=played[0];
 const harmony=evaluateVoicing(study.symbol,played);
 const bassCorrect=bass%12===ex.bassPc;
 const correct=harmony.correct&&bassCorrect;
 const chordText=harmony.correct?"Les quatre notes de l’accord sont justes.":
  "Notes de l’accord à corriger : "+
   (harmony.missing.length?"manquantes "+harmony.missing.map(pc=>study.degrees[chordTones(study.symbol).indexOf(pc)]).join(", ")+". ":"")+
   (harmony.extra.length?"en trop "+harmony.extra.map(pc=>midiLabel(played.find(n=>n%12===pc))).join(", ")+". ":"")+
   (harmony.duplicateCount?"Une même classe de hauteur est répétée dans plusieurs octaves.":"");
 const bassText=bassCorrect?
  "La basse "+midiLabel(bass)+" est bien la "+ex.role+" ("+ex.bassName+").":
  "Tu as placé "+midiLabel(bass)+" à la basse. Ce renversement exige "+
  ex.bassName+" ("+ex.role+") comme note la plus grave.";
 return {correct,harmonyCorrect:harmony.correct,bassCorrect,playedBass:bass,
  expectedBassPc:ex.bassPc,expectedBassName:ex.bassName,
  missing:harmony.missing,extra:harmony.extra,
  explanation:chordText+" "+bassText+
   " Les autres notes peuvent être réparties librement au-dessus de cette basse ; l’exemple affiché n’est pas un doigté imposé."};
}
