import test from "node:test";
import assert from "node:assert/strict";
import {sessionFor,grade,qualities} from "../src/music.js";
import {constructionLevels,constructionDifficulties,levelOf,difficultyOf,generatedChordPool,
 demonstrationMidis,challengeStats} from "../src/practice-random.js";
import {constructionSetupHTML} from "../src/construction-setup.js";

const easyRoots=new Set([0,2,5,7,9,10]);
const intermediateRoots=new Set([2,3,4,8,9,10]);
const allRoots=new Set(Array.from({length:12},(_,i)=>i));
function seeded(seed){let v=seed>>>0;return ()=>{v=(Math.imul(v,1664525)+1013904223)>>>0;return v/4294967296}};

test("eight stable families, each independent of tonal-difficulty choices",()=>{
 assert.equal(constructionLevels.length,8);
 assert.deepEqual(constructionLevels.map(l=>l.id),[1,2,3,4,5,6,7,8]);
 assert.deepEqual(Object.keys(constructionDifficulties),["guided","standard","challenge"]);
 assert.equal(levelOf(6).label,"Accords de neuvième");
 assert.equal(difficultyOf("standard").label,"Intermédiaire");
 for(const level of constructionLevels){
  for(const mode of Object.keys(constructionDifficulties)){
   for(let seed=1;seed<=18;seed++){
    const session=sessionFor(level.id,seeded(seed*57+level.id),mode);
    assert.equal(session.length,10);
    assert.equal(new Set(session.map(x=>x.symbol)).size,10,level.label+" "+mode);
    assert.ok(new Set(session.map(x=>x.expected[0])).size>=5,level.label+" "+mode);
    const allowed=mode==="guided"?easyRoots:mode==="standard"?intermediateRoots:allRoots;
    for(const ex of session){
     assert.ok(level.qualities.includes(ex.quality),ex.symbol+" wrong family");
     assert.ok(level.noteCounts.includes(ex.expected.length),ex.symbol+" wrong note count");
     assert.ok(allowed.has(ex.expected[0]),ex.symbol+" wrong root for "+mode);
     assert.equal(new Set(ex.expected).size,ex.expected.length,ex.symbol);
     assert.equal(ex.spelling.split(" ").length,ex.expected.length,ex.symbol);
     assert.equal(grade(ex,ex.expected).correct,true,ex.symbol);
    }
   }
  }
 }
 assert.throws(()=>levelOf(0));assert.throws(()=>levelOf(9));assert.throws(()=>difficultyOf("other"));
});

test("level 6 always has four-tone jazz ninths in all three difficulties",()=>{
 for(const difficulty of Object.keys(constructionDifficulties)){
  const questions=sessionFor(6,seeded(2026),difficulty);
  assert.ok(questions.every(q=>["dom9","min9"].includes(q.quality)));
  for(const chord of questions){
   assert.equal(chord.expected.length,4);
   assert.equal(chord.realizationId,"jazz-four");
   assert.equal(chord.expected.includes((chord.expected[0]+7)%12),false,"Fifth omitted");
  }
 }
});

test("level 7 always has five-tone 13 voicings while level 8 offers 4- and 5-tone altered dominants",()=>{
 for(const difficulty of Object.keys(constructionDifficulties)){
  const thirteen=sessionFor(7,seeded(44),difficulty);
  assert.ok(thirteen.every(q=>q.expected.length===5));
  for(const e of thirteen){
   assert.equal(e.realizationId,"jazz-five");
   assert.equal(e.expected.includes((e.expected[0]+7)%12),false);
   assert.equal(e.expected.includes((e.expected[0]+5)%12),false);
  }
  const altered=sessionFor(8,seeded(36),difficulty);
  assert.equal(altered.filter(q=>q.expected.length===4).length,7);
  assert.equal(altered.filter(q=>q.expected.length===5).length,3);
  assert.ok(altered.every(q=>["dom7b9","dom7sharp9","dom7b13"].includes(q.quality)));
 }
});

test("advanced theory spells real ♭9, ♯9 and diminished seventh, including unavoidable double flats",()=>{
 const pool=generatedChordPool(qualities);
 assert.ok(pool.length>180);
 for(const [symbol,spelling] of [
  ["C9","C E B♭ D"],["C13","C E B♭ D A"],["Cmaj13","C E B D A"],
  ["Cm13","C E♭ B♭ D A"],["C7♭9","C E B♭ D♭"],["C7♯9","C E B♭ D♯"],
  ["C7♭13","C E B♭ D A♭"],["Cdim7","C E♭ G♭ B♭♭"]]){
  const x=pool.find(q=>q.symbol===symbol);
  assert.ok(x,"Missing "+symbol);assert.equal(x.spelling,spelling);
 }
 for(const ex of pool){
  const mids=demonstrationMidis(ex);
  assert.equal(mids.length,ex.expected.length);
  assert.ok(mids.every(n=>n>=48&&n<=83));
  assert.deepEqual(mids.map(n=>n%12),ex.expected);
 }
});

test("hard difficulty changes the tonalities but not the chord formula",()=>{
 for(let level=1;level<=8;level++){
  const session=sessionFor(level,seeded(533+level),"challenge");
  const stats=challengeStats(session);
  assert.ok(stats.rareRoots>=4,JSON.stringify({level,stats}));
  assert.ok(stats.withBlack>=7,JSON.stringify({level,stats}));
 }
});

test("setup renders eight family cards, three independent difficulty choices, and the requested default",()=>{
 const escapeText=s=>String(s);
 const html=constructionSetupHTML(6,"standard",7,escapeText);
 assert.equal((html.match(/data-level="/g)||[]).length,8);
 assert.equal((html.match(/data-difficulty="/g)||[]).length,3);
 assert.ok(html.includes('data-level="6" class="construction-level-choice active"'));
 assert.ok(html.includes('data-difficulty="standard" class="difficulty-choice active"'));
 assert.ok(html.includes("Accords de neuvième"));
 assert.ok(html.includes("4 notes"));
 assert.ok(html.includes("Intermédiaire"));
 assert.ok(html.includes('id="startConstruction"'));
 assert.ok(constructionSetupHTML(1,"challenge",0,escapeText).includes("Triades majeures et mineures"),
  "Changing tonal difficulty cannot substitute the chosen chord family");
});
