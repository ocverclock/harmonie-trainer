import test from "node:test";
import assert from "node:assert/strict";
import {secondary} from "../src/music.js";
import {chordTones} from "../src/voicing.js";
import {PIANO_START,PIANO_END,noteX} from "../src/piano-layout.js";
import {voiceStudies,analyzeVoiceLeading,closestValidVoicing,checkJazzChord,earQuestion,
 earQualities,studioStudies,checkStudioChoice,skillRecommendations,motionSentence,earMastery,nextEarReview} from "../src/jazz-lab.js";
import {seedFromLegacy,withAttempt,progressByExercise,mergeArchives,validateArchive,backupJSON,parseBackup}
 from "../src/progress-store.js";
import {lessons} from "../src/curriculum.js";

const midiOk=notes=>notes.length===4&&new Set(notes).size===4&&notes.every(m=>m>=PIANO_START&&m<=PIANO_END);

test("register-wise analysis identifies held voices, semitones and big leaps",()=>{
 const motion=analyzeVoiceLeading([53,59,62,65],[52,60,62,73]);
 assert.equal(motion.total,10);
 assert.equal(motion.held,1);
 assert.equal(motion.semitone,2);
 assert.equal(motion.leaps,1);
 assert.equal(motion.moves[0].semitones,-1);
 assert.equal(motion.moves[1].semitones,1);
 assert.equal(motion.moves[2].type,"commune");
 assert.equal(motion.moves[3].type,"grand saut");
 assert.ok(motionSentence(motion).includes("voix 1"));
 assert.deepEqual(analyzeVoiceLeading([65,53,62,59],[73,62,52,60]),motion);
});
test("invalid or repeated MIDI values cannot influence voice analysis",()=>{
 for(const [a,b] of [[[48,48,52,55],[48,52,55,59]],
   [[48,52,55,59],[48,52,55,100]],[[48,52,55],[48,52,55,59]]]){
  assert.throws(()=>analyzeVoiceLeading(a,b));
 }
});
test("every secondary target can be built with correct chord tones and a closer alternative",()=>{
 assert.equal(voiceStudies.length,secondary.length);
 for(const study of voiceStudies){
  assert.equal(study.frames.length,3);
  for(let i=0;i<3;i++){
   const frame=study.frames[i];
   assert.ok(midiOk(frame.example),frame.symbol);
   assert.equal(checkJazzChord(frame.symbol,frame.example).correct,true,frame.symbol);
   if(i===0)continue;
   const previous=study.frames[i-1].example;
   const closer=closestValidVoicing(frame.symbol,previous);
   assert.ok(midiOk(closer.midis),frame.symbol);
   assert.equal(checkJazzChord(frame.symbol,closer.midis).correct,true,frame.symbol);
   const actual=analyzeVoiceLeading(previous,frame.example);
   assert.ok(closer.motion.total<=actual.total,"Alternative cannot exceed reference travel for "+frame.symbol);
   for(const midi of closer.midis)assert.ok(Number.isFinite(noteX(midi)),"Notes aligned with real keyboard");
  }
 }
});
test("reference and alternative can share pitch classes but different valid inversions",()=>{
 const previous=[55,59,62,66];
 const selected=[53,59,62,67];
 assert.equal(checkJazzChord("Cmaj7",selected).correct,false);
 const closer=closestValidVoicing("Cmaj7",previous);
 assert.equal(checkJazzChord("Cmaj7",closer.midis).correct,true);
 assert.deepEqual([...new Set(closer.midis.map(n=>n%12))].sort((a,b)=>a-b),
   [...new Set(chordTones("Cmaj7"))].sort((a,b)=>a-b));
 assert.ok(closer.motion.total>=0);
});
test("ear pedagogy spans all five qualities and chromatic roots without leaking correct answer",()=>{
 const questions=Array.from({length:60},(_,i)=>earQuestion(i));
 assert.equal(earQualities.length,5);
 assert.deepEqual([...new Set(questions.map(x=>x.quality))].sort(),earQualities.map(x=>x.id).sort());
 assert.ok(new Set(questions.map(x=>x.tonality)).size>=10);
 for(const ex of questions){
  assert.ok(midiOk(ex.midis));
  assert.equal(ex.choices.length,5);
  assert.equal(ex.choices.filter(x=>x.id===ex.quality).length,1);
  assert.ok(ex.why.length>30);
  assert.ok(ex.id.startsWith("ear-"));
 }
 assert.throws(()=>earQuestion(-1));
});
test("four original reharmonization studies accept several functions with honest feedback",()=>{
 assert.equal(studioStudies.length,4);
 for(const study of studioStudies){
  assert.equal(study.melody.length,3);
  assert.ok(study.melody.every(m=>m>=PIANO_START&&m<=PIANO_END));
  assert.ok(study.before.midis.some(m=>m%12===study.melody[0]%12));
  assert.ok(study.target.midis.some(m=>m%12===study.melody[2]%12));
  assert.ok(midiOk(study.before.midis));
  assert.ok(midiOk(study.target.midis));
  assert.equal(study.options.length,3);
  assert.equal(study.options.filter(opt=>opt.valid).length,2);
  assert.equal(study.options.filter(opt=>!opt.valid).length,1);
  for(const [index,opt] of study.options.entries()){
   assert.ok(midiOk(opt.midis));
   assert.equal(checkStudioChoice(study,index).correct,opt.valid);
   assert.equal(checkStudioChoice(study,index).melodyFits,opt.midis.some(m=>m%12===study.melody[1]%12));
   assert.ok(checkStudioChoice(study,index).why.length>=28);
  }
  assert.throws(()=>checkStudioChoice(study,10));
 }
});
test("jazz workshop attempts are preserved in the existing portable progress archive",()=>{
 const old=seedFromLegacy(lessons,{"tetrades:0":{correct:true,attempts:2}});
 const q=earQuestion(0);
 const lesson={id:"jazzlab",exercises:[{id:"jazzlab:ear:"+q.id,tonality:q.tonality}]};
 const correct=withAttempt(old,lesson,0,q.midis,true,"2026-10-17T19:00:00Z","jazz-1");
 const failed=withAttempt(correct,lesson,0,q.midis,false,"2026-10-17T19:05:00Z","jazz-2");
 assert.equal(validateArchive(failed),true);
 const progress=progressByExercise(failed);
 assert.equal(progress["tetrades:0"].mastered,true);
 assert.equal(progress["jazzlab:ear:ear-0"].correctCount,1);
 assert.equal(progress["jazzlab:ear:ear-0"].lastCorrect,false);
 assert.equal(progress["jazzlab:ear:ear-0"].byTonality[q.tonality].attempts,2);
 assert.equal(skillRecommendations(failed).length,1);
 const imported=parseBackup(backupJSON(failed));
 const merged=mergeArchives(failed,imported);
 assert.equal(merged.events.length,2);
 assert.equal(skillRecommendations(merged)[0].exerciseId,"jazzlab:ear:ear-0");
});

test("spaced practice recognizes mastery across two distinct tonalities",()=>{
 const empty=seedFromLegacy(lessons,{});
 const cases=Array.from({length:60},(_,i)=>earQuestion(i))
  .filter(q=>q.quality==="maj7");
 const first=cases[0],second=cases.find(q=>q.tonality!==first.tonality);
 assert.ok(second);
 const index=q=>Number(q.id.slice(4));
 function attempt(state,q,ok,time,id){
  return withAttempt(state,{id:"jazzlab",exercises:[{id:"jazzlab:ear:"+q.id,tonality:q.tonality}]},
   0,q.midis,ok,time,id);
 }
 let state=attempt(empty,first,true,"2026-10-17T08:00:00.000Z","ear-master-1");
 let status=earMastery(state,new Date("2026-10-17T12:00:00Z")).find(x=>x.id==="maj7");
 assert.equal(status.mastered,false);
 assert.equal(status.tonalities.length,1);
 state=attempt(state,second,true,"2026-10-17T11:00:00.000Z","ear-master-2");
 status=earMastery(state,new Date("2026-10-18T12:00:00Z")).find(x=>x.id==="maj7");
 assert.equal(status.mastered,true);
 assert.equal(status.due,false);
 assert.equal(status.tonalities.length,2);
 assert.ok(status.dueAt.startsWith("2026-10-24"));
 assert.ok(nextEarReview(state,index(first))!==index(first));
 state=attempt(state,second,false,"2026-10-19T11:00:00.000Z","ear-master-3");
 status=earMastery(state,new Date("2026-10-19T12:00:00Z")).find(x=>x.id==="maj7");
 assert.equal(status.mastered,false);
 assert.equal(status.needsReview,true);
 assert.equal(status.successes,2,"Failure must not erase prior successes");
});
test("ear workbench recommends new tonalities to avoid memorizing a single root",()=>{
 const archive=seedFromLegacy(lessons,{});
 const first=nextEarReview(archive,-1);
 const q=earQuestion(first);
 const next=withAttempt(archive,{id:"jazzlab",exercises:[{id:"jazzlab:ear:"+q.id,tonality:q.tonality}]},
 0,q.midis,true,"2026-10-17T08:00:00Z","first");
 const second=nextEarReview(next,first);
 assert.notEqual(second,first);
 assert.equal(earQuestion(second).quality,q.quality);
 assert.notEqual(earQuestion(second).tonality,q.tonality);
});
