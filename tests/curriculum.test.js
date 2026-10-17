import test from "node:test";
import assert from "node:assert/strict";
import {lessons,TOTAL_EXERCISES,checkExercise,midiName} from "../src/curriculum.js";
import {suggestCorrections} from "../src/voicing.js";
import {diagram} from "../src/voices.js";
import {secondary} from "../src/music.js";

test("21 progressive lessons retain original exercises and add tonal variants",()=>{
 assert.equal(lessons.length,21);
 assert.equal(TOTAL_EXERCISES,89);
 const ids=new Set();
 for(const l of lessons){
  assert.ok(!ids.has(l.id));ids.add(l.id);
  assert.ok(l.exercises.length>=2);
  for(const ex of l.exercises){
   assert.ok(["exact","free"].includes(ex.mode));
   assert.ok(ex.midis.length>=2&&ex.midis.length<=7);
   assert.ok(ex.midis.every(m=>Number.isInteger(m)&&m>=48&&m<=83));
   assert.equal(new Set(ex.midis).size,ex.midis.length);
   assert.equal(checkExercise(ex,ex.midis).correct,true,l.id+" "+ex.name);
  }
 }
 assert.deepEqual([...new Set(lessons.map(l=>l.part))],[1,2,3,4]);
});

test("exact positions distinguish register; free construction accepts inversions",()=>{
 const c=lessons[0].exercises[0];
 assert.equal(checkExercise(c,[60,64,67,71]).correct,false);
 assert.equal(checkExercise(c,[48,52,55,59]).correct,true);
 const am=lessons[0].exercises[2];
 assert.equal(checkExercise(am,[60,64,67,69]).correct,true);
 assert.equal(checkExercise(am,[60,64,69,81]).correct,false); // A is repeated across octaves
 assert.equal(checkExercise(am,[60,64,67,68]).correct,false);
 const miss=checkExercise(am,[60,64,67,68]);
 assert.deepEqual(miss.missing,[57]);
 assert.deepEqual(miss.extra,[68]);
});

test("sixth, sus4 b9, 13ths, rootless and seven sound material are playable",()=>{
 for(const id of ["sixte","sus-b9","extensions-13","rootless","sept-sons"]){
  const l=lessons.find(x=>x.id===id);
  assert.ok(l,id);
  for(const ex of l.exercises)assert.equal(checkExercise(ex,ex.midis).correct,true,id+" "+ex.name);
 }
 assert.equal(lessons.find(l=>l.id==="sept-sons").exercises[0].midis.length,7);
 assert.equal(midiName(54),"F♯3");
});

test("red correction suggests a nearby physical replacement, no penalty for valid inversion",()=>{
 const miss=suggestCorrections("Gmaj7",[53,55,59,62],[55,59,62,66]);
 assert.equal(miss.correct,false);
 assert.deepEqual(miss.wrong,[53]);
 assert.deepEqual(miss.suggested,[{midi:54,replace:53}]);
 const valid=suggestCorrections("Gmaj7",[66,62,59,55],[55,59,62,66]);
 assert.equal(valid.correct,true);
 assert.deepEqual(valid.wrong,[]);
 assert.deepEqual(valid.suggested,[]);
});

test("red corrected pitches match the piano coordinates in the existing diagram",()=>{
 const q=secondary.find(q=>q.id==="to-g");
 const html=diagram(q.progression,2,-1,[{row:2,wrong:[65],suggested:[{midi:66,replace:65}]}]);
 assert.ok(html.includes('data-wrong-midi="65"'));
 assert.ok(html.includes('data-correct-midi="66"'));
 assert.ok(html.includes('stroke="#d51e2b"'));
 const original=diagram(q.progression,2,-1);
 assert.ok(!original.includes("data-correct-midi"));
});
