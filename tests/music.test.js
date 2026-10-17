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
