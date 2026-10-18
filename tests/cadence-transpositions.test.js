import test from "node:test";
import assert from "node:assert/strict";
import {secondary} from "../src/music.js";
import {chordTones,evaluateVoicing} from "../src/voicing.js";
import {transposedVoiceStudies} from "../src/cadence-transpositions.js";
import {voiceStudies,analyzeVoiceLeading,closestValidVoicing} from "../src/jazz-lab.js";
import {guideToneStudies} from "../src/guide-tones.js";
import {seedFromLegacy,withAttempt,backupJSON,parseBackup,progressByExercise}
 from "../src/progress-store.js";
import {lessons} from "../src/curriculum.js";
import {PIANO_START,PIANO_END,noteX} from "../src/piano-layout.js";

const normalized=n=>(n+120)%12;
test("P06 adds exactly seven unique original transpositions without touching QCM and guide-tone IDs",()=>{
 assert.equal(secondary.length,5);
 assert.equal(guideToneStudies.length,5);
 assert.equal(transposedVoiceStudies.length,7);
 assert.equal(voiceStudies.length,12);
 assert.deepEqual(voiceStudies.slice(0,5).map(x=>x.id),secondary.map(x=>x.id));
 assert.deepEqual(voiceStudies.slice(5).map(x=>x.id),transposedVoiceStudies.map(x=>x.id));
 assert.equal(new Set(voiceStudies.map(x=>x.id)).size,12);
 assert.equal(new Set(voiceStudies.map(x=>x.tonality)).size,12);
 assert.equal(transposedVoiceStudies.filter(x=>x.mode==="mineur").length,2);
 assert.equal(transposedVoiceStudies.filter(x=>x.mode==="majeur").length,5);
 for(const s of transposedVoiceStudies){
  assert.ok(s.additional);
  assert.ok(s.explanation.length>=100,s.id);
  assert.equal(s.frames.length,3);
  assert.ok(s.frames.every(f=>f.example.length===4));
 }
});

test("P06 correct functional root intervals II to V to I and expected jazz qualities",()=>{
 for(const study of transposedVoiceStudies){
  const [ii,v,one]=study.frames.map(f=>chordTones(f.symbol));
  const tonic=one[0];
  assert.equal(ii[0],normalized(tonic+2),study.id);
  assert.equal(v[0],normalized(tonic+7),study.id);
  assert.equal(v[1],normalized(tonic-1),"V's third must be a semitone below I");
  assert.equal(study.frames[0].symbol.endsWith(study.mode==="mineur"?"m7♭5":"m7"),true,study.id);
  assert.equal(study.frames[1].symbol.endsWith("7"),true,study.id);
  assert.equal(study.frames[2].symbol.endsWith(study.mode==="mineur"?"m7":"maj7"),true,study.id);
  for(const frame of study.frames){
   assert.equal(evaluateVoicing(frame.symbol,frame.example).correct,true,study.id+" "+frame.symbol);
   assert.equal(new Set(frame.example).size,4);
   for(const m of frame.example){
    assert.ok(m>=PIANO_START&&m<=PIANO_END);
    assert.ok(Number.isFinite(noteX(m)));
   }
  }
 }
});

test("P06 adds real black-key cadences and major/minor chromatic tonic resolutions",()=>{
 const bb=transposedVoiceStudies.find(x=>x.id==="cad-bb");
 const db=transposedVoiceStudies.find(x=>x.id==="cad-db");
 const cm=transposedVoiceStudies.find(x=>x.id==="cad-cm");
 const fm=transposedVoiceStudies.find(x=>x.id==="cad-fm");
 assert.deepEqual(bb.frames.map(f=>f.symbol),["Cm7","F7","B♭maj7"]);
 assert.deepEqual(db.frames.map(f=>f.symbol),["E♭m7","A♭7","D♭maj7"]);
 assert.deepEqual(cm.frames.map(f=>f.symbol),["Dm7♭5","G7","Cm7"]);
 assert.deepEqual(fm.frames.map(f=>f.symbol),["Gm7♭5","C7","Fm7"]);
 assert.ok(transposedVoiceStudies.flatMap(s=>s.frames.flatMap(f=>f.example))
  .some(m=>[1,3,6,8,10].includes(m%12)));
 for(const study of transposedVoiceStudies){
  // The actual reference voicing is one legitimate disposition, not a mandatory answer.
  for(let i=1;i<3;i++){
   const previous=study.frames[i-1].example,next=study.frames[i].example;
   const observed=analyzeVoiceLeading(previous,next);
   const closer=closestValidVoicing(study.frames[i].symbol,previous);
   assert.ok(observed.total>=closer.motion.total,study.id);
   assert.equal(evaluateVoicing(study.frames[i].symbol,closer.midis).correct,true,study.id);
  }
 }
});

test("P06 new stable exercise IDs survive export/import without renaming existing ones",()=>{
 const study=transposedVoiceStudies.find(s=>s.id==="cad-db");
 const existing=seedFromLegacy(lessons,{"tetrades:0":{correct:true,attempts:1}});
 const itemId="jazzlab:voice:"+study.id+":1";
 const updated=withAttempt(existing,{id:"jazzlab",exercises:[{id:itemId,tonality:study.tonality}]},0,
  study.frames[1].example,true,"2026-10-18T11:30:00.000Z","new-db-1");
 const byId=progressByExercise(parseBackup(backupJSON(updated)));
 assert.equal(byId[itemId].lastCorrect,true);
 assert.equal(byId["tetrades:0"].mastered,true);
});
