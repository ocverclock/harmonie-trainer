import test from "node:test";
import assert from "node:assert/strict";
import {secondary} from "../src/music.js";
import {chordTones,normalizeSymbol,evaluateVoicing,makeVoicingProgression,analyzeMotion,midiLabel} from "../src/voicing.js";
import {diagram,voiceColors} from "../src/voices.js";

test("each secondary cadence accepts its valid reference pitches and spelled chords",()=>{
 assert.equal(secondary.length,5);
 for(const question of secondary){
  for(const frame of question.progression.frames){
   const chosen=frame.voices.map(v=>v.midi);
   assert.equal(evaluateVoicing(frame.symbol,chosen).correct,true,frame.symbol);
   assert.equal(new Set(chordTones(frame.symbol)).size,4);
  }
 }
 assert.equal(normalizeSymbol("F♯m7♭5"),"F#m7b5");
});
test("four note free voicings permit inversion, octave choice and enharmonic equivalents",()=>{
 assert.equal(evaluateVoicing("Am7",[60,64,67,69]).correct,true);
 assert.equal(evaluateVoicing("Am7",[72,64,55,69]).correct,true);
 assert.equal(evaluateVoicing("D7",[60,66,69,74]).correct,true);
 assert.equal(evaluateVoicing("F♯m7♭5",[54,57,60,64]).correct,true);
 assert.equal(evaluateVoicing("A7",[57,61,64,67]).correct,true);
});
test("correction identifies missing, extra, doubled and out-of-range pitches",()=>{
 const duplicate=evaluateVoicing("Am7",[57,60,64,69]);
 assert.equal(duplicate.correct,false);
 assert.deepEqual(duplicate.missing,[7]);
 assert.equal(duplicate.duplicateCount,1);
 const incorrect=evaluateVoicing("Am7",[57,60,64,68]);
 assert.equal(incorrect.correct,false);
 assert.deepEqual(incorrect.missing,[7]);
 assert.deepEqual(incorrect.extra,[8]);
 assert.equal(evaluateVoicing("Am7",[57,60,64]).correct,false);
 assert.equal(evaluateVoicing("Am7",[57,60,64,88]).correct,false);
 assert.equal(evaluateVoicing("Am7",[57,60,64,64]).correct,false);
});
test("the user's own voicings generate four traceable MIDI voices",()=>{
 const q=secondary[0];
 const answers=[[60,64,67,69],[60,62,66,69],[59,62,66,67]];
 const model=makeVoicingProgression(q,answers);
 assert.ok(model);
 assert.equal(model.frames.length,3);
 assert.deepEqual(model.frames[0].voices.map(v=>v.midi),[60,64,67,69]);
 assert.deepEqual(model.frames[0].voices.map(v=>v.id),[0,1,2,3]);
 assert.equal(midiLabel(60),"C4");
 assert.equal(makeVoicingProgression(q,[answers[0],answers[1],[]]),null);
 const motion=analyzeMotion(model);
 assert.equal(typeof motion.total,"number");
 assert.ok(motion.stationary>=0&&motion.stationary<=8);
 assert.ok(motion.large>=0&&motion.large<=8);
 const graphic=diagram(model,0,-1);
 assert.equal((graphic.match(/class="path"/g)||[]).length,8);
 for(let id=0;id<4;id++) assert.ok(graphic.includes('fill="'+voiceColors[id]+'"'));
});
