import test from "node:test";
import assert from "node:assert/strict";
import {sessionFor,grade} from "../src/music.js";
import {challengeStats,constructionDifficulties,difficultyOf} from "../src/practice-random.js";

function seeded(seed){
 let value=seed>>>0;
 return ()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296};
}
const BLACK=new Set([1,3,6,8,10]);
const EASY=new Set([0,2,4,5,7,9,10]);
const names=["guided","standard","challenge"];

test("three difficulties can be selected in each of three existing chord families",()=>{
 assert.deepEqual(Object.keys(constructionDifficulties),names);
 for(const mode of names)assert.ok(difficultyOf(mode).label.length>3);
 assert.throws(()=>difficultyOf("unknown"));
 for(const level of [1,2,3])for(const mode of names){
  const session=sessionFor(level,seeded(110+level),mode);
  assert.equal(session.length,10);
  assert.equal(new Set(session.map(x=>x.symbol)).size,10);
  assert.ok(new Set(session.map(x=>x.expected[0])).size>=5);
  for(const ex of session){
   assert.equal(grade(ex,ex.expected).correct,true,level+" "+mode+" "+ex.symbol);
   assert.ok(ex.expected.every(n=>n>=0&&n<12));
  }
 }
});
test("guided construction prefers familiar roots with limited black keys",()=>{
 for(const level of [1,2,3])for(let seed=1;seed<=20;seed++){
  const session=sessionFor(level,seeded(seed+level*100),"guided");
  for(const ex of session){
   assert.ok(EASY.has(ex.expected[0]),"Guided root too difficult: "+ex.symbol);
   assert.ok(ex.expected.filter(n=>BLACK.has(n)).length<=2,"Too many black keys: "+ex.symbol);
  }
 }
});
test("expert construction systematically includes unfamiliar roots and many black keys",()=>{
 for(const level of [1,2,3])for(let seed=1;seed<=25;seed++){
  const session=sessionFor(level,seeded(seed*61+level),"challenge");
  const stats=challengeStats(session);
  assert.ok(stats.withBlack>=8,"Too few black-key exercises: "+JSON.stringify({level,seed,stats}));
  assert.ok(stats.rareRoots>=5,"Too few unusual tonalities: "+JSON.stringify({level,seed,stats}));
 }
});
test("default setting preserves previous standard session behavior",()=>{
 for(const level of [1,2,3]){
  const a=sessionFor(level,seeded(33));
  const b=sessionFor(level,seeded(33),"standard");
  assert.deepEqual(a,b);
  assert.equal(a.length,10);
 }
});

test("Défi is musically distinct: 6 has four notes, 9 has four, 13 has five",()=>{
 const formulas={
  1:new Set(["maj6","min6"]),
  2:new Set(["dom9","min9"]),
  3:new Set(["dom13"])
 };
 for(let level=1;level<=3;level++)for(let seed=1;seed<=30;seed++){
  const exerciseSet=sessionFor(level,seeded(seed*17+level),"challenge");
  assert.equal(exerciseSet.length,10);
  assert.equal(new Set(exerciseSet.map(e=>e.symbol)).size,10);
  for(const e of exerciseSet){
   assert.ok(formulas[level].has(e.quality),"Mauvaise famille Défi "+level+": "+e.symbol);
   assert.equal(e.expected.length,level===3?5:4,e.symbol);
   assert.equal(new Set(e.expected).size,e.expected.length,e.symbol);
   assert.equal(e.spelling.split(" ").length,e.expected.length,e.symbol);
   assert.ok(e.voicingExplanation?.length>20,e.symbol);
   assert.equal(grade(e,e.expected).correct,true);
  }
 }
});
test("A 9th voicing is deliberately without fifth; a 13th deliberately omits fifth and eleventh",()=>{
 const bank=sessionFor(2,seeded(9),"challenge");
 const nine=bank[0];
 const expectedIndex=new Set(nine.expected);
 const root=nine.expected[0];
 assert.ok(!expectedIndex.has((root+7)%12),"9 without fifth");
 const thirteen=sessionFor(3,seeded(9),"challenge")[0];
 assert.ok(!thirteen.expected.includes((thirteen.expected[0]+7)%12),"13 without fifth");
 assert.ok(!thirteen.expected.includes((thirteen.expected[0]+5)%12),"13 without 11th");
 assert.equal(thirteen.expected.length,5);
 assert.deepEqual(grade(thirteen,thirteen.expected).missing,[]);
});
test("C6, C9 and C13 distinguish accurate spellings and real jazz structures",()=>{
 const pool=sessionFor(3,seeded(15),"challenge");assert.ok(pool.every(e=>e.expected.length===5));
 // Chord construction pools include the exact C roots, even when C is not drawn in a challenge session.
 // The four-note C9 = C E B-flat D; five-note C13 = C E B-flat D A.
 const c9={expected:[0,4,10,2]},c13={expected:[0,4,10,2,9]};
 assert.equal(grade(c9,[60,64,70,74]).correct,true);
 assert.equal(grade(c9,[60,64,67,70,74]).correct,false,"Five notes are not the requested 4-note voicing");
 assert.equal(grade(c13,[60,64,70,74,81]).correct,true);
 assert.equal(grade(c13,[60,64,67,70,74,81]).correct,false,"Fifth is omitted in selected 13 voicing");
});
