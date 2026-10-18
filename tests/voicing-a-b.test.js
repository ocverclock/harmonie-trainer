import test from "node:test";
import assert from "node:assert/strict";
import {assessVoicingTransition} from "../src/voice-leading-feedback.js";
import {buildVoicingComparison,comparisonPlayback} from "../src/voicing-a-b.js";

const previous=[57,60,64,67]; // Am7: A3 C4 E4 G4
const efficient=[57,60,62,66]; // D7: A3 C4 D4 F#4, movement 3 semitones
const remote=[50,54,57,60]; // D7: D3 F#3 A3 C4, valid but large movement
test("P05 A/B retains harmonic correctness and compares actual movement in the played register",()=>{
 const assessed=assessVoicingTransition("D7",previous,remote,true);
 assert.equal(assessed.harmony.correct,true);
 assert.equal(assessed.motion.total,27);
 const comparison=buildVoicingComparison(previous,remote,assessed);
 assert.equal(comparison.available,true);
 assert.equal(comparison.correct,true);
 assert.equal(comparison.playedMotion,27);
 assert.equal(comparison.alternativeMotion,3);
 assert.equal(comparison.gain,24);
 assert.deepEqual(comparison.previous,previous);
 assert.deepEqual(comparison.played,remote);
 assert.deepEqual(comparison.alternative,efficient);
 assert.equal(comparison.movements.length,4);
 assert.deepEqual(comparison.movements[0],{
  voice:1,from:"A3",played:"D3",alternative:"A3",playedSemitones:-7,alternativeSemitones:0
 });
 assert.match(comparison.explanation,/deux accords sont justes/);
 assert.match(comparison.explanation,/pas une meilleure réponse harmonique/);
});

test("P05 playback A and B use the exact same preceding chord and deliberately paced arrivals",()=>{
 const comparison=buildVoicingComparison(previous,remote,assessVoicingTransition("D7",previous,remote,true));
 assert.deepEqual(comparisonPlayback(comparison,"A"),[
  {at:0,midis:previous,part:"source A"},{at:1050,midis:remote,part:"accord A"}
 ]);
 assert.deepEqual(comparisonPlayback(comparison,"B"),[
  {at:0,midis:previous,part:"source B"},{at:1050,midis:efficient,part:"accord B"}
 ]);
 const both=comparisonPlayback(comparison,"AB");
 assert.deepEqual(both.map(x=>x.at),[0,1050,2950,4000]);
 assert.deepEqual(both[0].midis,both[2].midis);
 assert.deepEqual(both[1].midis,remote);
 assert.deepEqual(both[3].midis,efficient);
 both[0].midis[0]=83;
 assert.deepEqual(comparison.previous,previous,"Playback must not mutate model or exercise state");
 assert.throws(()=>comparisonPlayback(comparison,"wrong"),/inconnu/);
});

test("P05 no spurious alternate for already efficient and valid inversions",()=>{
 const assessed=assessVoicingTransition("D7",previous,efficient,true);
 assert.equal(assessed.harmony.correct,true);
 const comparison=buildVoicingComparison(previous,efficient,assessed);
 assert.equal(comparison.available,false);
 assert.equal(comparison.correct,true);
 assert.equal(comparison.playedMotion,3);
 assert.match(comparison.reason,/déjà aussi économique/);
 assert.throws(()=>comparisonPlayback(comparison,"B"),/indisponible/);
});

test("P05 never offers a better movement for a wrong chord or incorrect previous chord",()=>{
 const wrong=buildVoicingComparison(previous,[50,52,55,60],assessVoicingTransition("D7",previous,[50,52,55,60],true));
 assert.equal(wrong.available,false);
 assert.equal(wrong.correct,false);
 assert.match(wrong.reason,/deux accords justes/);
 assert.throws(()=>comparisonPlayback(wrong,"A"),/indisponible/);
 const invalidContext=buildVoicingComparison(previous,remote,assessVoicingTransition("D7",previous,remote,false));
 assert.equal(invalidContext.available,false);
 assert.equal(invalidContext.correct,true);
 assert.match(invalidContext.reason,/deux accords justes/);
});

test("P05 reject invalid note arrays and any duplicate octave pitch",()=>{
 const assessed=assessVoicingTransition("D7",previous,remote,true);
 for(const bad of [
  [57,57,64,67],[57,60,67],[57,60,64,100],[57,60,64,67.5]
 ])assert.throws(()=>buildVoicingComparison(bad,remote,assessed));
 assert.throws(()=>buildVoicingComparison(previous,[50,54,60,60],assessed));
});
