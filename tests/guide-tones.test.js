import test from "node:test";
import assert from "node:assert/strict";
import {secondary} from "../src/music.js";
import {chordTones} from "../src/voicing.js";
import {guideToneStudies,checkGuideTone,describeSemitones,guideToneSummary} from "../src/guide-tones.js";
import {seedFromLegacy,withAttempt,progressByExercise,backupJSON,parseBackup} from "../src/progress-store.js";
import {lessons} from "../src/curriculum.js";

test("P03 builds twenty consistent guide-tone exercises from original five II-V-I progressions",()=>{
 assert.equal(guideToneStudies.length,secondary.length);
 assert.equal(guideToneStudies.flatMap(s=>s.exercises).length,20);
 assert.equal(guideToneStudies.filter(s=>s.type==="majeur").length,2);
 assert.equal(guideToneStudies.filter(s=>s.type==="mineur").length,3);
 for(const study of guideToneStudies){
  assert.equal(study.exercises.length,4);
  assert.deepEqual(study.exercises.map(x=>x.semitones),[0,-1,1,study.type==="mineur"?-2:-1]);
  for(const step of study.exercises){
   assert.ok(step.source.midi>=48&&step.source.midi<=83);
   assert.ok(step.target.midi>=48&&step.target.midi<=83);
   assert.equal(step.source.midi+step.semitones,step.target.midi);
   const sourcePC=step.source.midi%12,targetPC=step.target.midi%12;
   assert.ok(chordTones(step.sourceSymbol).includes(sourcePC),step.sourceSymbol);
   assert.ok(chordTones(step.targetSymbol).includes(targetPC),step.targetSymbol);
   assert.ok(step.why.length>50);
   assert.equal(checkGuideTone(study,step.index,step.target.midi).correct,true);
  }
 }
});

test("P03 specifically distinguishes major and minor seventh resolution",()=>{
 const major=guideToneStudies.find(s=>s.id==="to-g");
 const minor=guideToneStudies.find(s=>s.id==="to-dm");
 assert.deepEqual(major.exercises.map(x=>[x.source.name,x.target.name]),[
  ["C4","C4"],["G4","F#4"],["F#4","G4"],["C4","B3"]]);
 assert.deepEqual(minor.exercises.map(x=>[x.source.name,x.target.name]),[
  ["G3","G3"],["D4","C#4"],["C#4","D4"],["G3","F3"]]);
 assert.equal(describeSemitones(0),"note commune, aucun déplacement");
 assert.equal(describeSemitones(-1),"descend d’un demi-ton");
 assert.equal(describeSemitones(1),"monte d’un demi-ton");
 assert.equal(describeSemitones(-2),"descend d’un ton");
});

test("P03 wrong note feedback gives spelled correction and never confuses an octave",()=>{
 const study=guideToneStudies.find(s=>s.id==="to-am");
 const exercise=study.exercises[2];
 const correct=checkGuideTone(study,2,exercise.target.midi);
 assert.equal(correct.correct,true);
 const wrong=checkGuideTone(study,2,exercise.source.midi);
 assert.equal(wrong.correct,false);
 assert.equal(wrong.expected,exercise.target.midi);
 assert.match(wrong.explanation,/La bonne résolution/);
 assert.match(wrong.explanation,/G#4 → A4/);
 assert.equal(checkGuideTone(study,2,exercise.target.midi-12).correct,false,"Same pitch class in a wrong octave cannot satisfy a semitone resolution");
 assert.throws(()=>checkGuideTone(study,2,0),/hors clavier/);
});

test("P03 completes four steps and preserves results in the existing portable archive",()=>{
 const study=guideToneStudies[0];
 const archive=seedFromLegacy(lessons,{"tetrades:0":{correct:true,attempts:1}});
 let current=archive;
 const answers=[];
 for(const item of study.exercises){
  const grade=checkGuideTone(study,item.index,item.target.midi);
  answers.push(grade);
  current=withAttempt(current,{id:"jazzlab",exercises:[{id:"jazzlab:guides:"+item.id,tonality:study.tonality}]},
   0,[item.source.midi,item.target.midi],grade.correct,"2026-10-18T10:00:00.000Z","guide-"+item.index);
 }
 assert.equal(guideToneSummary(study,answers).correct,4);
 assert.equal(guideToneSummary(study,[answers[0],null,null,null]).attempted,1);
 const restored=parseBackup(backupJSON(current));
 const byExercise=progressByExercise(restored);
 assert.equal(Object.values(byExercise).filter(x=>x.lastCorrect).length,5);
 assert.ok(byExercise["jazzlab:guides:to-g:0"]?.lastCorrect);
 assert.ok(byExercise["tetrades:0"]?.mastered);
});
