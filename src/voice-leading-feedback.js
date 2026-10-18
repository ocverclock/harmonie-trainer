import {analyzeVoiceLeading,checkJazzChord,closestValidVoicing} from "./jazz-lab.js";
import {midiLabel} from "./voicing.js";

// The piano exercise captures note positions, not hand/finger identity.
// Both chords are classified from bass to soprano; the resulting movements
// are a register-by-register *comparison*, not a claim of tracked fingers.
export function assessVoicingTransition(symbol,previous,current,previousIsCorrect=true){
 const motion=analyzeVoiceLeading(previous,current);
 const harmony=checkJazzChord(symbol,current);
 const before=new Set(previous),after=new Set(current);
 const commonMidis=[...before].filter(n=>after.has(n)).sort((a,b)=>a-b);
 const previousPCs=new Set(previous.map(n=>n%12));
 const commonPitchClasses=[...new Set(current.map(n=>n%12))].filter(pc=>previousPCs.has(pc)).sort((a,b)=>a-b);
 const wholeTone=motion.moves.filter(m=>Math.abs(m.semitones)===2).length;
 // Compare only if both harmonies are correct. A wrong chord can be
 // physically closer than a valid voicing: it is not a useful optimum.
 const reference=previousIsCorrect&&harmony.correct?closestValidVoicing(symbol,previous):null;
 return {harmony,motion,commonMidis,commonPitchClasses,wholeTone,
  canCompare:!!reference,
  reference,
  gain:reference?motion.total-reference.motion.total:null,
  previousIsCorrect:!!previousIsCorrect};
}
export function describeVoicingTransition(analysis){
 const {harmony,motion,commonMidis,commonPitchClasses,wholeTone,reference,gain,previousIsCorrect}=analysis;
 const shared=commonMidis.length?
  "Touches communes conservées : "+commonMidis.map(midiLabel).join(", ")+".":"Aucune touche exactement conservée dans le même registre.";
 const members=commonPitchClasses.length?
  commonPitchClasses.length+" note(s) commune(s) par classe de hauteur (octave libre).":"Aucune note commune par nom de note.";
 const movement="Par comparaison des voix grave → aigu : "+motion.total+" demi-tons parcourus, "+
  motion.held+" voix au même rang immobiles, "+motion.semitone+" déplacement(s) d’un demi-ton, "+
  wholeTone+" d’un ton et "+motion.leaps+" saut(s) supérieur(s) à une quinte juste.";
 let advice;
 if(!harmony.correct)
  advice="Les déplacements décrivent ton jeu, mais l’accord comporte une erreur : corrige d’abord ses notes. Aucun jugement de fluidité ne peut remplacer la justesse.";
 else if(!previousIsCorrect)
  advice="Cet accord est juste, mais l’accord précédent n’a pas été validé comme juste. Les mouvements restent indicatifs et ne sont pas comparés à un voicing optimal.";
 else if(gain>0)
  advice="Ton accord est juste. Une autre disposition valide économise "+gain+" demi-ton(s) de déplacements dans ce registre ; elle est facultative, pas une correction de notes.";
 else if(motion.leaps>0)
  advice="Ton accord est juste. Certains sauts sont larges, sans constituer une erreur ; la comparaison par registre ne suit pas les doigtés.";
 else
  advice="Ton accord est juste et les mouvements sont déjà aussi économes que l’exemple calculé, selon la comparaison grave → aigu.";
 const comparison=reference?"Disposition alternative valide : "+reference.motion.total+" demi-tons de déplacements depuis l’accord précédent.":null;
 return {shared,members,movement,advice,comparison};
}
