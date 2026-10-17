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
