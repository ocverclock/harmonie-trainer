import test from "node:test";
import assert from "node:assert/strict";
import {exercises,secondary,qualities,pitch,grade,sessionFor,validateBank} from "../src/music.js";

test("corpus de 28 accords et théorie",()=>{
 assert.equal(exercises.length,28);
 assert.equal(validateBank(),true);
 assert.equal(new Set(exercises.map(x=>x.id)).size,28);
 const e=exercises.find(x=>x.id==="Bm7b5");
 assert.deepEqual(e.expected,[11,2,5,9]);
});
test("équivalence octave et renversement",()=>{
 const c=exercises.find(x=>x.id==="Cmaj7");
 assert.equal(grade(c,[60,64,67,71]).correct,true);
 assert.equal(grade(c,[71,67,64,60,72]).correct,true);
 assert.deepEqual(grade(c,[60,64,67]).missing,[11]);
 assert.deepEqual(grade(c,[60,64,67,71,62]).extra,[2]);
});
test("sessions et révisions",()=>{
 for(const level of [1,2,3]){
  const questions=sessionFor(level,()=>.21);
  assert.equal(questions.length,10);
  assert.equal(new Set(questions.map(x=>x.id)).size,10);
  if(level===3)assert.equal(questions.filter(x=>x.level===3).length,6);
 }
});
test("secondaires: réponse, notes et identité des voix",()=>{
 assert.equal(secondary.length,5);
 for(const q of secondary){
  assert.ok(q.choices[q.answer]);
  assert.equal(q.progression.frames.length,3);
  for(const f of q.progression.frames){
   assert.deepEqual(f.voices.map(x=>x.id),[0,1,2,3]);
   for(let k=1;k<4;k++) assert.ok(f.voices[k-1].midi<f.voices[k].midi);
  }
 }
});
test("cadences mineures: sensibles correctement écrites",()=>{
 assert.equal(secondary.find(x=>x.id==="to-em").progression.frames[1].voices[3].note,"D#4");
 assert.equal(secondary.find(x=>x.id==="to-am").progression.frames[1].voices[3].note,"G#4");
 assert.equal(secondary.find(x=>x.id==="to-dm").progression.frames[1].voices[3].note,"C#4");
});

import {PIANO_KEYS,PIANO_WIDTH,WHITE_WIDTH,noteX} from "../src/piano-layout.js";
import {diagram,ROW_Y,voiceColors,frameCenter} from "../src/voices.js";

test("le schéma et le clavier partagent exactement les mêmes coordonnées",()=>{
 assert.equal(PIANO_KEYS.length,36);
 assert.equal(PIANO_WIDTH,21*WHITE_WIDTH);
 assert.equal(noteX(48),26); // C3: centre d'une touche blanche
 assert.equal(noteX(49),52); // C#3: centre de la noire entre C et D
 assert.equal(noteX(50),78); // D3
 assert.equal(noteX(54),208); // F#3
 const uniqueColors=new Set(voiceColors);
 assert.equal(uniqueColors.size,4);
 for(const q of secondary){
  const html=diagram(q.progression,1,-1);
  for(const [i,fr] of q.progression.frames.entries()){
   for(const v of fr.voices){
    assert.ok(html.includes('data-voice="'+v.id+'" data-midi="'+v.midi+'" cx="'+noteX(v.midi)+'" cy="'+ROW_Y[i]+'"'),q.id+' '+v.note);
    assert.ok(html.includes('fill="'+voiceColors[v.id]+'"'));
   }
  }
  const m=frameCenter(q.progression,1);
  assert.ok(m>=0&&m<=PIANO_WIDTH);
 }
});
test("les lignes du schéma suivent le temps verticalement",()=>{
 assert.deepEqual(ROW_Y,[87,177,267]);
 const p=secondary.find(q=>q.id==="to-g").progression;
 const html=diagram(p,0,-1);
 // A3 reste commun aux deux premiers accords : ligne verticale au-dessus de A3.
 assert.ok(html.includes('data-from="57" data-to="57"'));
 // Tous les segments suivent l'ordre temporel (deux mouvements par voix).
 assert.equal((html.match(/class="path"/g)||[]).length,8);
 // Le mode voix isolée affiche quatre points et deux segments.
 const solo=diagram(p,0,2);
 assert.equal((solo.match(/class="voice" /g)||[]).length,3);
 assert.equal((solo.match(/class="path"/g)||[]).length,2);
});
