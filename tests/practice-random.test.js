import test from "node:test";
import assert from "node:assert/strict";
import {exercises,qualities,sessionFor,secondary,grade} from "../src/music.js";
import {lessons} from "../src/curriculum.js";
import {generatedChordPool,randomizedChordSession,shuffledLessonOrder,
 nextCadenceIndex,randomCadenceIndex,previousVoicingNotes} from "../src/practice-random.js";

function seeded(seed){
 let value=seed>>>0;
 return ()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296};
}
test("generate new chord constructions with correct enharmonic notes",()=>{
 const pool=generatedChordPool(qualities);
 assert.ok(pool.length>=75, "Enough generated harmonies");
 assert.equal(new Set(pool.map(c=>c.id)).size,pool.length);
 const d=pool.find(c=>c.symbol==="D♭maj7");
 assert.deepEqual(d.expected,[1,5,8,0]);
 assert.equal(d.spelling,"D♭ F A♭ C");
 assert.equal(grade(d,d.expected).correct,true);
 const fsharp=pool.find(c=>c.symbol==="G♭maj7");
 assert.ok(fsharp);
 assert.equal(fsharp.spelling,"G♭ B♭ D♭ F");
 for(const chord of pool){
  assert.equal(grade(chord,chord.expected).correct,true,chord.symbol);
  assert.ok(chord.spelling.split(" ").length===chord.expected.length);
  assert.ok(!chord.spelling.includes("undefined"));
 }
});
test("every constructed quiz gets 10 distinct playable chords, varied roots and black keys",()=>{
 const BLACK=new Set([1,3,6,8,10]);
 for(let level=1;level<=8;level++){
  const signatures=new Set();
  for(let seed=1;seed<=16;seed++){
   const session=sessionFor(level,seeded(seed));
   assert.equal(session.length,10);
   assert.equal(new Set(session.map(c=>c.symbol)).size,10);
   assert.ok(new Set(session.map(c=>c.root)).size>=5);
   assert.ok(session.filter(c=>c.expected.some(n=>BLACK.has(n))).length>=5);
   for(const c of session)assert.equal(grade(c,c.expected).correct,true);
   signatures.add(session.map(c=>c.symbol).join("|"));
  }
  assert.ok(signatures.size>=12,"Session order should vary in level "+level);
 }
});
test("randomized lessons never reorder the actual exercise data or history keys",()=>{
 const lesson=lessons.find(l=>l.id==="tetrades");
 const originals=lesson.exercises.map(ex=>ex.name);
 const progress=Object.fromEntries([0,1,2].map(i=>["tetrades:"+i,{correct:true}]));
 const order=shuffledLessonOrder(lesson,progress,seeded(19));
 assert.deepEqual([...order].sort((a,b)=>a-b),lesson.exercises.map((_,i)=>i));
 assert.ok(order.slice(0,lesson.exercises.length-3).every(i=>i>2),
  "Unmastered construction exercises come first");
 assert.deepEqual(lesson.exercises.map(ex=>ex.name),originals);
 const again=shuffledLessonOrder(lesson,progress,seeded(42));
 assert.notDeepEqual(order,again);
});
test("next secondary cadence never repeats current and explicit QCM targets remain supported",()=>{
 for(let current=0;current<secondary.length;current++){
  for(const rnd of [()=>0,()=>0.25,()=>0.999999]){
   const next=nextCadenceIndex(current,secondary.length,rnd);
   assert.ok(next>=0&&next<secondary.length);
   assert.notEqual(next,current);
  }
 }
 assert.equal(randomCadenceIndex(secondary.length,()=>0),0);
 assert.equal(randomCadenceIndex(secondary.length,()=>0.9999),secondary.length-1);
 assert.equal(nextCadenceIndex(0,1),0);
});
test("previous-key ghosting follows last played MIDI positions, not example/reference or pitch classes",()=>{
 assert.deepEqual(previousVoicingNotes([[],[],[]],0),[]);
 assert.deepEqual(previousVoicingNotes([[57,60,64,67],[],[]],1),[57,60,64,67]);
 assert.deepEqual(previousVoicingNotes([[57,60,64,67],[57,60,62,66],[]],2),[57,60,62,66]);
 assert.deepEqual(previousVoicingNotes([[57,60,64,67],[57,60,62],[]],2),[]);
 assert.deepEqual(previousVoicingNotes([[57,60,64,67],[57,60,62,99],[]],2),[]);
 // C3 and C4 are distinct piano positions; the ghost is the previous octave.
 assert.deepEqual(previousVoicingNotes([[48,60,64,67],[],[]],1),[48,60,64,67]);
});
