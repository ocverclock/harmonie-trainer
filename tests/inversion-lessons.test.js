import test from "node:test";
import assert from "node:assert/strict";
import {chordTones} from "../src/voicing.js";
import {inversionStudies,inversionNames,gradeInversion} from "../src/inversion-lessons.js";
import {PIANO_START,PIANO_END,noteX} from "../src/piano-layout.js";
import {seedFromLegacy,withAttempt,progressByExercise,backupJSON,parseBackup} from "../src/progress-store.js";
import {lessons} from "../src/curriculum.js";

test("P07 six original seventh chords teach all four authentic bass degrees",()=>{
 assert.equal(inversionStudies.length,6);
 assert.deepEqual(inversionNames,["État fondamental","Premier renversement","Deuxième renversement","Troisième renversement"]);
 assert.equal(inversionStudies.reduce((n,s)=>n+s.exercises.length,0),24);
 assert.equal(new Set(inversionStudies.map(x=>x.id)).size,6);
 for(const s of inversionStudies){
  const formula=chordTones(s.symbol);
  assert.equal(formula.length,4);
  assert.equal(s.degrees.length,4);
  assert.equal(s.exercises.length,4);
  for(const [index,e] of s.exercises.entries()){
   assert.equal(e.number,index);
   assert.equal(e.role,["fondamentale","tierce","quinte","septième"][index]);
   assert.equal(e.bassPc,formula[index],s.symbol+" inversion "+index);
   assert.equal(e.reference.length,4);
   assert.ok(e.reference.every(m=>m>=PIANO_START&&m<=PIANO_END));
   assert.ok(e.reference.every(m=>Number.isFinite(noteX(m))));
   assert.deepEqual(e.reference,[...e.reference].sort((a,b)=>a-b));
   assert.equal(gradeInversion(s,index,e.reference).correct,true,s.symbol+" inversion "+index);
   assert.equal(gradeInversion(s,index,e.reference).playedBass,e.reference[0]);
  }
 }
});

test("P07 inversion does not require prescribed right-hand register or close position",()=>{
 const s=inversionStudies.find(x=>x.symbol==="Cmaj7");
 // E3 B3 G4 C5 : correct chord and first inversion in an open position.
 const open=gradeInversion(s,1,[72,67,52,59]);
 assert.equal(open.correct,true);
 assert.equal(open.harmonyCorrect,true);
 assert.equal(open.bassCorrect,true);
 assert.equal(open.playedBass,52);
 assert.match(open.explanation,/autres notes peuvent être réparties librement/);
});

test("P07 separate harmonic accuracy and bass function: right chord, wrong inversion",()=>{
 const s=inversionStudies.find(x=>x.symbol==="Cmaj7");
 const correctNotesWrongBass=gradeInversion(s,1,[60,64,67,71]);
 assert.equal(correctNotesWrongBass.harmonyCorrect,true);
 assert.equal(correctNotesWrongBass.bassCorrect,false);
 assert.equal(correctNotesWrongBass.correct,false);
 assert.equal(correctNotesWrongBass.expectedBassName,"Mi");
 assert.equal(correctNotesWrongBass.playedBass,60);
 assert.match(correctNotesWrongBass.explanation,/quatre notes de l’accord sont justes/);
 assert.match(correctNotesWrongBass.explanation,/note la plus grave/);
});

test("P07 correct bass with wrong chord must remain incorrect",()=>{
 const s=inversionStudies.find(x=>x.symbol==="Cmaj7");
 const result=gradeInversion(s,1,[52,55,59,73]); // E3 G3 B3 C#5
 assert.equal(result.bassCorrect,true);
 assert.equal(result.harmonyCorrect,false);
 assert.equal(result.correct,false);
 assert.ok(result.missing.includes(0));
 assert.ok(result.extra.includes(1));
 assert.match(result.explanation,/manquantes Do/);
});

test("P07 enharmonic spelling for major flat roots and half diminished seventh",()=>{
 const eb=inversionStudies.find(s=>s.symbol==="E♭maj7");
 const ab=inversionStudies.find(s=>s.symbol==="A♭maj7");
 const half=inversionStudies.find(s=>s.symbol==="Bm7♭5");
 assert.deepEqual(eb.degrees,["Mi♭","Sol","Si♭","Ré"]);
 assert.deepEqual(ab.degrees,["La♭","Do","Mi♭","Sol"]);
 assert.deepEqual(half.degrees,["Si","Ré","Fa","La"]);
 assert.equal(gradeInversion(ab,0,ab.exercises[0].reference).expectedBassName,"La♭");
 assert.equal(gradeInversion(half,3,half.exercises[3].reference).expectedBassName,"La");
});

test("P07 invalid inputs cannot count as correct, answers survive unchanged V2 JSON export",()=>{
 const s=inversionStudies[0];
 for(const invalid of [[48,52,55],[48,48,55,59],[48,52,55,91],[48,52,55,59.5]])
  assert.throws(()=>gradeInversion(s,0,invalid));
 assert.throws(()=>gradeInversion(s,8,[48,52,55,59]));
 const original=seedFromLegacy(lessons,{"tetrades:0":{correct:true,attempts:1}});
 const result=gradeInversion(s,1,s.exercises[1].reference);
 const file=withAttempt(original,{id:"jazzlab",exercises:[{
  id:"jazzlab:inversions:"+s.exercises[1].id,tonality:s.tonality
 }]},0,s.exercises[1].reference,result.correct,"2026-10-18T11:00:00.000Z","inversion-001");
 const records=progressByExercise(parseBackup(backupJSON(file)));
 assert.equal(records["jazzlab:inversions:cmaj7:1"].lastCorrect,true);
 assert.equal(records["tetrades:0"].mastered,true);
 assert.equal(file.events[0].midis[0],s.exercises[1].reference[0]);
});
