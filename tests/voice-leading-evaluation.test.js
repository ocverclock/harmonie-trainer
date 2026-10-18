import test from "node:test";
import assert from "node:assert/strict";
import {assessVoiceLeading} from "../src/voice-leading-evaluation.js";
import {analyzeVoiceLeading} from "../src/jazz-lab.js";

test("correctness and economy are separate",()=>{
 const notes=[48,52,55,59];
 const motion=analyzeVoiceLeading(notes,notes);
 const assessment=assessVoiceLeading(notes,notes,{correct:false},motion,motion);
 assert.equal(assessment.harmonicCorrect,false);
 assert.equal(assessment.comparison,null);
 assert.deepEqual(assessment.sharedMidis,notes);
});
