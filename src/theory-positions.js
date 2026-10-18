// P08 — Positions serrées/ouvertes et voicings sans fondamentale.
// La note de basse définit le renversement ; l'espacement définit la position.
// Un voicing rootless omet volontairement la fondamentale, sans devenir un renversement.
import {chordTones,midiLabel} from "./voicing.js";
import {PIANO_START,PIANO_END} from "./piano-layout.js";

const raw=[
 {id:"cmaj7-close",symbol:"Cmaj7",kind:"close",tonality:"Do majeur",reference:[60,64,67,71],
  explanation:"Do–Mi–Sol–Si dans une octave : quatre sons en position serrée. La basse Do indique séparément l'état fondamental."},
 {id:"cmaj7-open",symbol:"Cmaj7",kind:"open",tonality:"Do majeur",reference:[48,55,64,71],
  explanation:"Do–Sol–Mi–Si s'étend sur presque deux octaves : position ouverte, mais toujours état fondamental car Do est à la basse."},
 {id:"dm7-close",symbol:"Dm7",kind:"close",tonality:"Ré mineur",reference:[62,65,69,72],
  explanation:"Ré–Fa–La–Do reste dans une octave. Changer seulement l'écartement ne change pas la qualité mineure septième."},
 {id:"dm7-open",symbol:"Dm7",kind:"open",tonality:"Ré mineur",reference:[50,57,65,72],
  explanation:"Ré–La–Fa–Do : les notes restent celles de Dm7, mais leur espacement dépasse une octave."},
 {id:"g9-rootless",symbol:"G9",kind:"rootless",tonality:"Sol dominante",reference:[59,65,69,74],
  pcs:[11,5,9,2],omitted:"Sol (fondamentale)",degrees:"tierce Si, septième Fa, neuvième La, quinte Ré",
  explanation:"G9 sans Sol : Si et Fa conservent la fonction dominante ; La ajoute la neuvième. Ré complète ici le voicing. La fondamentale est sous-entendue par le contexte harmonique."},
 {id:"dm9-rootless",symbol:"Dm9",kind:"rootless",tonality:"Ré mineur",reference:[53,60,64,69],
  pcs:[5,0,4,9],omitted:"Ré (fondamentale)",degrees:"tierce Fa, septième Do, neuvième Mi, quinte La",
  explanation:"Dm9 sans Ré : Fa et Do définissent la couleur mineure septième, Mi apporte la neuvième. L'absence de Ré ne constitue pas un renversement."}
];
export const positionStudies=raw.map(s=>Object.freeze({...s,
 expectedPcs:Object.freeze(s.pcs??chordTones(s.symbol)),
 reference:Object.freeze(s.reference)
}));
export function gradePosition(study,midis){
 if(!study||!Array.isArray(midis)||midis.length!==4||
    new Set(midis).size!==4||midis.some(n=>!Number.isInteger(n)||n<PIANO_START||n>PIANO_END))
  throw new Error("Quatre touches MIDI distinctes entre 48 et 83 sont requises.");
 const notes=[...midis].sort((a,b)=>a-b),actual=new Set(notes.map(n=>n%12)),expected=new Set(study.expectedPcs);
 const missing=[...expected].filter(pc=>!actual.has(pc)),extra=[...actual].filter(pc=>!expected.has(pc));
 const harmonyCorrect=missing.length===0&&extra.length===0&&actual.size===4;
 const span=notes[3]-notes[0];
 const positionCorrect=study.kind==="rootless"?true:study.kind==="close"?span<=12:span>12;
 const correct=harmonyCorrect&&positionCorrect;
 const why=!harmonyCorrect?"Il manque des notes constitutives ou une classe de hauteur est doublée.":
  !positionCorrect?"Les notes sont justes, mais leur écartement ne correspond pas à la position demandée.":
  study.kind==="rootless"?"Les quatre notes de couleur sont présentes sans la fondamentale.":"Les notes et leur espacement correspondent à la consigne.";
 return {correct,harmonyCorrect,positionCorrect,span,missing,extra,
  bass:notes[0],notes,explanation:why+" "+study.explanation,
  played:notes.map(midiLabel)};
}
