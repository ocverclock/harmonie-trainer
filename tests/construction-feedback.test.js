import test from "node:test";
import assert from "node:assert/strict";
import {grade} from "../src/music.js";
import {constructionKeyState} from "../src/construction-feedback.js";

test("diminished seventh correction shows played and missing pitch classes",()=>{
 const played=new Set([8,11,2,6]);
 const result=grade({expected:[8,11,2,5]},[...played]);
 assert.deepEqual(result.missing,[5]);
 assert.deepEqual(result.extra,[6]);
 for(const pc of [8,11,2])assert.equal(constructionKeyState(pc,played,result),"correct");
 assert.equal(constructionKeyState(6,played,result),"extra");
 assert.equal(constructionKeyState(5,played,result),"missing");
 assert.equal(constructionKeyState(18,played,result),"extra");
});

test("correct chord has no correction markings",()=>{
 const played=new Set([0,4,7,11]);
 const result=grade({expected:[0,4,7,11]},[...played]);
 assert.equal(result.correct,true);
 for(let pc=0;pc<12;pc++)assert.equal(constructionKeyState(pc,played,result),"");
 assert.equal(constructionKeyState(0,played,null),"");
});

test("multiple mistakes remain separate",()=>{
 const played=new Set([1,4,8,10]);
 const result=grade({expected:[0,4,7,10]},[...played]);
 for(const pc of [1,8])assert.equal(constructionKeyState(pc,played,result),"extra");
 for(const pc of [0,7])assert.equal(constructionKeyState(pc,played,result),"missing");
 for(const pc of [4,10])assert.equal(constructionKeyState(pc,played,result),"correct");
});

test("3, 4 and 5 note constructions use identical feedback logic",()=>{
 for(const expected of [[0,4,7],[0,4,7,11],[0,4,10,2,9]]){
  const played=new Set([...expected.slice(0,-1),1]);
  const result=grade({expected},[...played]);
  assert.equal(constructionKeyState(1,played,result),"extra");
  assert.equal(constructionKeyState(expected.at(-1),played,result),"missing");
  for(const pc of expected.slice(0,-1))assert.equal(constructionKeyState(pc,played,result),"correct");
 }
});
