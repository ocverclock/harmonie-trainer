import test from "node:test";
import assert from "node:assert/strict";
import {PIANO_WIDTH,PIANO_START,PIANO_END,noteX} from "../src/piano-layout.js";
import {voicePathModel,renderVoicePaths,renderVoicePathLegend} from "../src/voice-paths.js";

const a={symbol:"Am7",midis:[57,60,64,67],correct:true};
const b={symbol:"D7",midis:[57,60,62,66],correct:true};
const c={symbol:"Gmaj7",midis:[59,62,66,67],correct:true};

test("P04 draws exactly four voices, actual played positions and shared key geometry",()=>{
 const model=voicePathModel([a,b]);
 assert.equal(model.width,PIANO_WIDTH);
 assert.equal(model.rows.length,2);
 assert.equal(model.moves.length,4);
 assert.deepEqual(model.moves.map(m=>m.semitones),[0,0,-2,-1]);
 assert.equal(model.moves.filter(m=>m.held).length,2);
 for(const row of model.rows)
  for(const note of row.notes)assert.equal(note.x,noteX(note.midi));
 const svg=renderVoicePaths([a,b]);
 assert.equal((svg.match(/class="lab-path-line/g)||[]).length,4);
 assert.equal((svg.match(/class="lab-path-node"/g)||[]).length,8);
 assert.ok(svg.includes('data-from="57" data-to="57" data-motion="0"'));
 assert.ok(svg.includes('data-from="67" data-to="66" data-motion="-1"'));
 assert.equal(svg.includes('data-note="67"'),true);
 assert.equal(svg.includes('data-note="66"'),true);
 assert.ok(svg.includes('role="img"'));
 assert.ok(svg.includes("Am7"));
 assert.ok(svg.includes("D7"));
});

test("P04 complete cadence has three rows and eight connections, including chromatic motion",()=>{
 const model=voicePathModel([a,b,c]);
 assert.equal(model.rows.length,3);
 assert.equal(model.moves.length,8);
 assert.equal(model.moves.filter(m=>m.row===0).length,4);
 assert.equal(model.moves.filter(m=>m.row===1).length,4);
 assert.equal(model.total,8);
 const html=renderVoicePaths([a,b,c]);
 assert.equal((html.match(/class="lab-path-line/g)||[]).length,8);
 assert.equal((html.match(/class="lab-path-node"/g)||[]).length,12);
 assert.ok(html.includes('data-motion="0"'));
 assert.ok(html.includes('data-motion="-1"'));
 const accessible=renderVoicePathLegend([a,b,c]);
 assert.equal((accessible.match(/<li>/g)||[]).length,4);
 assert.ok(accessible.includes("grave vers l’aigu"));
 assert.ok(accessible.includes("pas les doigts"));
 assert.ok(accessible.includes("Voix 4"));
 assert.ok(accessible.includes("G4"));
});

test("P04 wrong chords are labelled as such without inserting an ideal voicing",()=>{
 const wrong={symbol:"D7",midis:[48,50,52,53],correct:false};
 const html=renderVoicePaths([a,wrong]);
 const model=voicePathModel([a,wrong]);
 assert.ok(html.includes("à revoir"));
 assert.equal(model.rows[1].correct,false);
 assert.ok(html.includes('data-note="48"'));
 assert.ok(!html.includes('data-note="66"'),"Corrected pitch must not be shown as if played");
 assert.ok(renderVoicePathLegend([a,wrong]).includes("même si un accord est faux"));
});

test("P04 rejects invalid chords, duplicate notes, out-of-range notes and HTML labels",()=>{
 for(const invalid of [
  [],[a],[a,b,c,a],[a,{symbol:"D7",midis:[57,60,60,66]}],
  [a,{symbol:"D7",midis:[57,60,62,PIANO_END+1]}],
  [a,{symbol:"D7",midis:[PIANO_START-1,60,62,66]}]
 ])assert.throws(()=>voicePathModel(invalid));
 const html=renderVoicePaths([a,{symbol:"<script>evil</script>",midis:b.midis}]);
 assert.ok(html.includes("&lt;script&gt;"));
 assert.ok(!html.includes("<script>"));
});
