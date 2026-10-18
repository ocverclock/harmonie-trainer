import test from "node:test";
import assert from "node:assert/strict";
import {assessVoicingTransition,describeVoicingTransition} from "../src/voice-leading-feedback.js";

const cmaj=[48,52,55,59];
const g7=[55,59,62,65];

test("P02 distinguishes pitch classes shared by chords from stationary rank-wise voices",()=>{
 const report=assessVoicingTransition("G7",cmaj,g7,true);
 assert.equal(report.harmony.correct,true);
 assert.deepEqual(report.commonPitchClasses,[7,11],"G and B shared by pitch class");
 assert.deepEqual(report.commonMidis,[55,59],"G3 and B3 held as physical pitches");
 assert.equal(report.motion.held,0,"The bass-to-soprano rank changes, even for shared physical keys");
 assert.equal(report.motion.total,27);
 assert.equal(report.canCompare,true);
 assert.ok(report.reference);
 assert.equal(report.reference.midis.length,4);
 const text=describeVoicingTransition(report);
 assert.match(text.members,/2 note\(s\) commune/);
 assert.match(text.shared,/Sol3/);
 assert.match(text.shared,/Si3/);
 assert.match(text.movement,/grave → aigu/);
 assert.ok(text.comparison?.includes("Disposition alternative valide"));
});

test("P02 never praises a wrong chord because its physical movement is short",()=>{
 const wrong=assessVoicingTransition("G7",cmaj,[55,59,62,66],true);
 assert.equal(wrong.harmony.correct,false,"F-sharp is not the seventh of G7");
 assert.equal(wrong.canCompare,false);
 assert.equal(wrong.reference,null);
 assert.equal(wrong.gain,null);
 const text=describeVoicingTransition(wrong);
 assert.match(text.advice,/corrige d’abord ses notes/);
 assert.equal(text.comparison,null);
});

test("P02 refuses an optimal comparison when previous harmony was unvalidated",()=>{
 const report=assessVoicingTransition("G7",cmaj,g7,false);
 assert.equal(report.harmony.correct,true);
 assert.equal(report.canCompare,false);
 assert.equal(report.reference,null);
 const text=describeVoicingTransition(report);
 assert.match(text.advice,/précédent n’a pas été validé/);
});

test("P02 retains perfect voicings and valid inversions without deductions",()=>{
 const unchanged=assessVoicingTransition("Cmaj7",cmaj,cmaj,true);
 assert.equal(unchanged.harmony.correct,true);
 assert.equal(unchanged.motion.total,0);
 assert.equal(unchanged.motion.held,4);
 assert.deepEqual(unchanged.commonMidis,cmaj);
 assert.equal(unchanged.gain,0);
 assert.match(describeVoicingTransition(unchanged).advice,/aussi économes/);
 const inverted=assessVoicingTransition("G7",cmaj,[53,55,59,62],true);
 assert.equal(inverted.harmony.correct,true);
 assert.ok(inverted.reference);
});

test("P02 explains semitone, tone and leaps without claiming to track fingers",()=>{
 const report=assessVoicingTransition("Cmaj7",[52,55,59,64],[52,55,59,72],true);
 assert.equal(report.harmony.correct,true);
 assert.equal(report.motion.leaps,1);
 assert.equal(report.motion.held,3);
 const message=describeVoicingTransition(report);
 assert.match(message.movement,/saut\(s\) supérieur\(s\)/);
 assert.ok(message.shared.includes("Mi3"));
 assert.throws(()=>assessVoicingTransition("G7",[48,48,55,59],g7));
 assert.throws(()=>assessVoicingTransition("G7",cmaj,[48,52,55,100]));
});
