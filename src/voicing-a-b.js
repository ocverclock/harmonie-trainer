import {midiLabel} from "./voicing.js";

// A/B listening is educational: it never affects harmony correctness or
// the scores stored for a voicing. The same initial chord is played twice.
function pitches(notes){
 if(!Array.isArray(notes)||notes.length!==4||new Set(notes).size!==4||
  notes.some(n=>!Number.isInteger(n)||n<48||n>83))throw Error("Quatre touches MIDI distinctes requises");
 return [...notes].sort((a,b)=>a-b);
}
export function buildVoicingComparison(previous,current,assessment){
 const from=pitches(previous),played=pitches(current);
 if(!assessment?.harmony?.correct||!assessment.previousIsCorrect||!assessment.reference)
  return {available:false,reason:"La comparaison A/B exige deux accords justes validés. Corrige d’abord les notes.",correct:!!assessment?.harmony?.correct};
 const alternative=pitches(assessment.reference.midis);
 const playedMotion=assessment.motion.total,alternativeMotion=assessment.reference.motion.total;
 const gain=playedMotion-alternativeMotion;
 const different=alternative.some((n,i)=>n!==played[i]);
 if(gain<=0||!different)return {available:false,reason:
  "Ton voicing est déjà aussi économique que la disposition calculée dans ce registre. Aucun remplacement n’est nécessaire.",correct:true,
  playedMotion,alternativeMotion};
 const movements=from.map((n,i)=>({
  voice:i+1,from:midiLabel(n),played:midiLabel(played[i]),alternative:midiLabel(alternative[i]),
  playedSemitones:played[i]-n,alternativeSemitones:alternative[i]-n
 }));
 return {available:true,correct:true,previous:from,played,alternative,
  playedMotion,alternativeMotion,gain,movements,
  explanation:"Les deux accords sont justes. B réduit le total des déplacements de "+gain+
   " demi-ton"+(gain>1?"s":"")+" selon l’appariement grave → aigu. "+
   "Ce n’est pas une meilleure réponse harmonique ni une obligation de renversement."};
}
/** Musical sequence: same previous chord, then A or B, or both separated by a pause. */
export function comparisonPlayback(comparison,mode){
 if(!comparison?.available)throw Error("Comparaison indisponible pour cet accord");
 if(!["A","B","AB"].includes(mode))throw Error("Mode d’écoute inconnu");
 const a=[{at:0,midis:[...comparison.previous],part:"source A"},
  {at:1050,midis:[...comparison.played],part:"accord A"}];
 const b=[{at:0,midis:[...comparison.previous],part:"source B"},
  {at:1050,midis:[...comparison.alternative],part:"accord B"}];
 return (mode==="A"?a:mode==="B"?b:[
  ...a,...b.map(x=>({...x,at:x.at+2950}))
 ]).map(x=>({...x,midis:[...x.midis]}));
}
