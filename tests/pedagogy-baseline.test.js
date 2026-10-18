import test from "node:test";
import assert from "node:assert/strict";
import {lessons,TOTAL_EXERCISES,checkExercise} from "../src/curriculum.js";
import {chapterCourses,lessonCourses,validateCourseNotes} from "../src/course-notes.js";
import {extraExercises,extraExerciseCount} from "../src/tonality-variants.js";
import {constructionLevels,constructionDifficulties,generatedChordPool,demonstrationMidis}
 from "../src/practice-random.js";
import {qualities,grade,sessionFor,secondary} from "../src/music.js";
import {voiceStudies,checkJazzChord,analyzeVoiceLeading,earQuestion,studioStudies,checkStudioChoice}
 from "../src/jazz-lab.js";
import {seedFromLegacy,validateArchive,backupJSON,parseBackup,progressByExercise}
 from "../src/progress-store.js";

// P01 is a non-destructive acceptance baseline before extending the curriculum.
// Never replace existing curriculum answers, IDs or progress keys to make it pass.
const MIDI_LOW=48,MIDI_HIGH=83;
const isPlayable=m=>Number.isInteger(m)&&m>=MIDI_LOW&&m<=MIDI_HIGH;
function seeded(seed){let n=seed>>>0;return ()=>{n=(Math.imul(1664525,n)+1013904223)>>>0;return n/4294967296}}

test("P01 — the entire published course and its legacy indices remain stable",()=>{
 assert.equal(lessons.length,21);
 assert.equal(TOTAL_EXERCISES,89);
 assert.equal(extraExerciseCount,37);
 assert.equal(Object.keys(chapterCourses).length,4);
 assert.equal(Object.keys(lessonCourses).length,21);
 assert.ok(validateCourseNotes(lessons));
 assert.deepEqual(lessons.map(x=>x.part).filter((n,i,all)=>i===0||n!==all[i-1]),[1,2,3,4]);
 const ids=new Set(),legacyKeys=new Set();
 let legacyCount=0,extraCount=0;
 for(const lesson of lessons){
  assert.ok(lesson.id&&lesson.summary.length&&lesson.principle.length);
  assert.ok(lessonCourses[lesson.id]?.concept.length>40,lesson.id);
  assert.ok(chapterCourses[lesson.part]?.goal.length>20,lesson.id);
  for(const [index,exercise] of lesson.exercises.entries()){
   assert.ok(["exact","free"].includes(exercise.mode),lesson.id+":"+index);
   assert.ok(exercise.task?.length>10,lesson.id+":"+index);
   assert.ok(exercise.why?.length>8,lesson.id+":"+index);
   assert.ok(exercise.midis.length>0&&exercise.midis.every(isPlayable),lesson.id+":"+index);
   assert.equal(new Set(exercise.midis).size,exercise.midis.length,"Duplicate MIDI note in "+lesson.id+":"+index);
   assert.equal(checkExercise(exercise,exercise.midis).correct,true,lesson.id+":"+index);
   const key=exercise.id||lesson.id+":"+index;
   assert.ok(!ids.has(key),"Duplicate stable exercise ID "+key);ids.add(key);
   if(exercise.id){extraCount++;assert.equal(exercise.id.split(":")[0],lesson.id)}
   else{legacyCount++;legacyKeys.add(key)}
  }
 }
 assert.equal(legacyCount,52);
 assert.equal(extraCount,37);
 assert.equal(legacyKeys.size,52);
 assert.equal(ids.size,89);
 assert.equal(lessons[0].id,"tetrades");
 assert.deepEqual(lessons[0].exercises[0].midis,[48,52,55,59]);
});

test("P01 — construction chord structure stays stable across eight levels and key difficulties",()=>{
 assert.equal(constructionLevels.length,8);
 assert.equal(Object.keys(constructionDifficulties).length,3);
 const pool=generatedChordPool(qualities);
 assert.ok(pool.length>=180);
 for(const family of constructionLevels){
  for(const difficulty of Object.keys(constructionDifficulties)){
   for(let seed=1;seed<=6;seed++){
    const exerciseSet=sessionFor(family.id,seeded(seed*101+family.id),difficulty);
    assert.equal(exerciseSet.length,10,family.label+"/"+difficulty);
    for(const chord of exerciseSet){
     assert.ok(family.qualities.includes(chord.quality),family.label+"/"+chord.symbol);
     assert.ok(family.noteCounts.includes(chord.expected.length),chord.symbol);
     assert.equal(new Set(chord.expected).size,chord.expected.length,chord.symbol);
     assert.equal(grade(chord,chord.expected).correct,true,chord.symbol);
     assert.ok(demonstrationMidis(chord).every(isPlayable),chord.symbol);
    }
   }
  }
 }
 assert.deepEqual(constructionLevels[5].noteCounts,[4],"9th voicings must remain four tones");
 assert.deepEqual(constructionLevels[6].noteCounts,[5],"13th voicings must remain five tones");
});

test("P01 — exact position and free chord construction are assessed differently",()=>{
 const root=lessons.find(x=>x.id==="tetrades");
 const exact=root.exercises[0];
 assert.equal(exact.mode,"exact");
 assert.equal(checkExercise(exact,[52,55,59,60]).correct,false,"An inversion changes exact MIDI pitches");
 const free=root.exercises[2];
 assert.equal(free.mode,"free");
 assert.equal(checkExercise(free,[69,72,76,79]).correct,true,"A free voicing may change octave");
 assert.equal(checkExercise(free,[57,60,64,76]).correct,false,"Pitch-class duplication cannot replace the seventh");
 const ninth=extraExercises["extensions-9"][0];
 assert.equal(checkExercise(ninth,ninth.midis).correct,true);
 assert.equal(checkExercise(ninth,ninth.midis.slice(0,-1)).correct,false);
});

test("P01 — five II–V–I studies preserve three playable harmonic frames",()=>{
 assert.equal(secondary.length,5);
 assert.equal(voiceStudies.length,secondary.length);
 for(const study of voiceStudies){
  assert.equal(study.frames.length,3);
  for(let i=0;i<3;i++){
   const frame=study.frames[i];
   assert.ok(frame.example.length===4&&frame.example.every(isPlayable),frame.symbol);
   assert.equal(checkJazzChord(frame.symbol,frame.example).correct,true,frame.symbol);
   if(i>0){
    const moves=analyzeVoiceLeading(study.frames[i-1].example,frame.example);
    assert.equal(moves.moves.length,4);
    assert.ok(moves.total>=0);
    assert.equal(moves.total,moves.moves.reduce((n,m)=>n+Math.abs(m.semitones),0));
   }
  }
 }
});

test("P01 — existing ear and reharmonization questions have playable and explained answers",()=>{
 const qualitiesSeen=new Set(),tonalitiesSeen=new Set();
 for(let index=0;index<60;index++){
  const question=earQuestion(index);
  assert.equal(question.midis.length,4);
  assert.ok(question.midis.every(isPlayable));
  assert.equal(question.choices.filter(x=>x.id===question.quality).length,1);
  assert.ok(question.why.length>20);
  qualitiesSeen.add(question.quality);tonalitiesSeen.add(question.tonality);
 }
 assert.equal(qualitiesSeen.size,5);
 assert.ok(tonalitiesSeen.size>=10);
 assert.equal(studioStudies.length,4);
 for(const study of studioStudies){
  assert.equal(study.melody.length,3);
  assert.ok(study.melody.every(isPlayable));
  assert.equal(study.options.length,3);
  assert.equal(study.options.filter(x=>x.valid).length,2);
  for(let i=0;i<3;i++){
   const verdict=checkStudioChoice(study,i);
   assert.equal(verdict.correct,study.options[i].valid,
    "Musical correctness must be checked with melody: "+study.id+"/"+i);
   assert.ok(verdict.why.length>20);
  }
 }
});

test("P01 — legacy progress persists through portable JSON without inventing historical scores",()=>{
 const history={"tetrades:0":{correct:true,attempts:4,at:"2026-10-17T12:00:00.000Z"},
  "position-1375:0":{correct:false,attempts:2,at:"2026-10-17T13:00:00.000Z"}};
 const archive=seedFromLegacy(lessons,history,"2026-10-18T04:25:00.000Z");
 assert.equal(validateArchive(archive),true);
 const recovered=parseBackup(backupJSON(archive));
 assert.equal(recovered.schemaVersion,2);
 assert.equal(recovered.legacy["tetrades:0"].attempts,4);
 assert.equal(recovered.legacy["position-1375:0"].mastered,false);
 assert.equal(progressByExercise(recovered)["tetrades:0"].mastered,true);
 assert.equal(recovered.events.length,0,"Historical V1 records must not fabricate attempts");
});
