// P06 — Original transposed II–V–I practice, without modifying the five
// historical QCM/guide-tone cadences or their persisted exercise IDs.
import {chordTones,evaluateVoicing} from "./voicing.js";
import {PIANO_START,PIANO_END} from "./piano-layout.js";

const specs=[
 {id:"cad-bb",tonality:"Si♭ majeur",title:"Résolution vers Si♭ majeur",tonicPc:10,mode:"majeur",
  explanation:"En Si♭ majeur, le II est Cm7, le V est F7 et la tonique est Si♭maj7. La tierce La de F7 mène vers Si♭, tandis que sa septième Mi♭ descend vers Ré.",
  notes:[
   ["Cm7",[55,58,60,63]],  // Sol3 Si♭3 Do4 Mi♭4
   ["F7",[53,57,60,63]],   // Fa3 La3 Do4 Mi♭4
   ["B♭maj7",[53,57,58,62]]]}, // Fa3 La3 Si♭3 Ré4
 {id:"cad-eb",tonality:"Mi♭ majeur",title:"Résolution vers Mi♭ majeur",tonicPc:3,mode:"majeur",
  explanation:"Fm7 prépare Si♭7, puis Mi♭maj7. La tierce Ré de Si♭7 monte vers Mi♭ ; sa septième La♭ descend vers Sol. Les deux autres voix peuvent rester proches.",
  notes:[
   ["Fm7",[56,60,63,65]],
   ["B♭7",[56,58,62,65]],
   ["E♭maj7",[55,58,62,63]]]},
 {id:"cad-ab",tonality:"La♭ majeur",title:"Résolution vers La♭ majeur",tonicPc:8,mode:"majeur",
  explanation:"Si♭m7 – Mi♭7 – La♭maj7 : le Ré♭, septième du V, descend vers Do, tierce de la tonique. Sol, tierce de Mi♭7, monte d’un demi-ton vers La♭.",
  notes:[
   ["B♭m7",[56,58,61,65]],
   ["E♭7",[55,58,61,63]],
   ["A♭maj7",[55,56,60,63]]]},
 {id:"cad-db",tonality:"Ré♭ majeur",title:"Résolution vers Ré♭ majeur",tonicPc:1,mode:"majeur",
  explanation:"En Ré♭ majeur, Mi♭m7 mène à La♭7 puis Ré♭maj7. Le Do naturel est la tierce de la dominante, sensible de Ré♭ ; Sol♭, septième de La♭7, descend vers Fa.",
  notes:[
   ["E♭m7",[54,58,61,63]],
   ["A♭7",[54,56,60,63]],
   ["D♭maj7",[53,56,60,61]]]},
 {id:"cad-e",tonality:"Mi majeur",title:"Résolution vers Mi majeur",tonicPc:4,mode:"majeur",
  explanation:"Fa♯m7 – Si7 – Mimaj7 : la tierce Ré♯ de Si7 est attirée vers Mi. La, septième de Si7, descend vers Sol♯, tierce de Mi majeur. Compare les demi-tons dans une tonalité à quatre dièses.",
  notes:[
   ["F♯m7",[54,57,61,64]],
   ["B7",[54,57,59,63]],
   ["Emaj7",[56,59,63,64]]]},
 {id:"cad-cm",tonality:"Do mineur",title:"Résolution vers Do mineur",tonicPc:0,mode:"mineur",
  explanation:"Ré m7♭5 – Sol7 – Dom7 : le II est demi-diminué, tandis que Sol7 introduit Si naturel, sensible empruntée au mineur harmonique. Si monte vers Do ; Fa descend d’un ton vers Mi♭.",
  notes:[
   ["Dm7♭5",[53,56,60,62]],
   ["G7",[53,55,59,62]],
   ["Cm7",[51,55,58,60]]]},
 {id:"cad-fm",tonality:"Fa mineur",title:"Résolution vers Fa mineur",tonicPc:5,mode:"mineur",
  explanation:"Sol m7♭5 – Do7 – Fam7 : le II demi-diminué mène à une dominante majeure portant Mi naturel, sensible de Fa mineur. Si♭, septième de Do7, descend d’un ton vers La♭.",
  notes:[
   ["Gm7♭5",[53,58,61,67]],
   ["C7",[52,58,60,67]],
   ["Fm7",[53,56,60,63]]]}
];
const normalize=pc=>(pc%12+12)%12;
function requireValid(spec,study){
 if(study.frames.length!==3||!["majeur","mineur"].includes(spec.mode))
  throw Error("Cadence transposée invalide : "+spec.id);
 const [ii,v,one]=study.frames.map(f=>chordTones(f.symbol));
 const expected=[normalize(spec.tonicPc+2),normalize(spec.tonicPc+7),spec.tonicPc];
 if(ii[0]!==expected[0]||v[0]!==expected[1]||one[0]!==expected[2])
  throw Error("Fondamentales II–V–I incorrectes : "+spec.id);
 if(spec.mode==="majeur"&&!(study.frames[0].symbol.endsWith("m7")&&
  study.frames[2].symbol.endsWith("maj7")))
  throw Error("Qualités majeures incorrectes : "+spec.id);
 if(spec.mode==="mineur"&&!(study.frames[0].symbol.endsWith("m7♭5")&&
  study.frames[2].symbol.endsWith("m7")))
  throw Error("Qualités mineures incorrectes : "+spec.id);
 for(const frame of study.frames){
  if(frame.example.length!==4||new Set(frame.example).size!==4||
   frame.example.some(n=>!Number.isInteger(n)||n<PIANO_START||n>PIANO_END)||
   !evaluateVoicing(frame.symbol,frame.example).correct)
   throw Error("Voicing de référence invalide : "+spec.id+" "+frame.symbol);
 }
 const tonic=one[0],leading=normalize(tonic-1);
 if(!v.includes(leading))throw Error("Dominante sans sensible : "+spec.id);
 return true;
}
export const transposedVoiceStudies=specs.map(spec=>{
 const study={id:spec.id,tonality:spec.tonality,title:spec.title,
  explanation:spec.explanation,mode:spec.mode,additional:true,
  frames:spec.notes.map(([symbol,example])=>({symbol,example:[...example]}))};
 requireValid(spec,study);
 return study;
});
