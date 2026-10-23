import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from '../../frontend/node_modules/jsdom/lib/api.js';
import { keyboardFingerings, renderKeyboardFingerings } from '../../frontend/src/app/desktop/service/keyboard-fingering.ts';
const note = (midi, finger, staff = 1) => ({
  Pitch: { getHalfTone: () => midi - 12 }, Fingering: finger ? { value: finger } : undefined,
  isRest: () => false, ParentStaff: { Id: staff, ParentInstrument: { Staves: [{}, {}] } },
});
test('chord, both hands, absent and ambiguous fingerings', () => {
  assert.deepEqual(keyboardFingerings([note(60,'1'),note(64,'3'),note(48,'5',2),note(67),note(70,'1-2')]), [
    {midi:60,finger:'1',hand:'rh'}, {midi:64,finger:'3',hand:'rh'}, {midi:48,finger:'5',hand:'lh'},
  ]);
  assert.deepEqual(keyboardFingerings([{...note(60,'1'),isRest:()=>true}]),[]);
  const single = note(60,'2'); single.ParentStaff.ParentInstrument.Staves = [{}];
  assert.equal(keyboardFingerings([single])[0].hand,'unknown');
});
test('SVG white/black keys, repeated pitch with changed fingering, clear, resize coordinates', () => {
  const doc = new JSDOM('<div><svg viewBox="0 0 100 100"><rect id="48" x="0" y="0" width="20" height="100"/><rect id="49" x="15" y="0" width="10" height="60"/></svg></div>').window.document;
  const container = doc.querySelector('div');
  renderKeyboardFingerings(container, keyboardFingerings([note(60,'1'),note(61,'2')]));
  assert.equal(container.querySelectorAll('text').length,2);
  assert.deepEqual([...container.querySelectorAll('text')].map(t=>t.getAttribute('y')),['94','54']);
  assert.equal(container.querySelector('g').getAttribute('pointer-events'),'none');
  renderKeyboardFingerings(container, keyboardFingerings([note(60,'4')]));
  assert.equal(container.querySelectorAll('text').length,1);
  assert.equal(container.querySelector('text').textContent,'4');
  renderKeyboardFingerings(container, []);
  assert.equal(container.querySelectorAll('text').length,0);
  renderKeyboardFingerings(container, keyboardFingerings([note(120,'1')]));
  assert.equal(container.querySelectorAll('text').length,0);
});

test('real MusicXML parser retains per-note chord fingerings and staff identity', async () => {
  const dom = new JSDOM('<div id="score"></div>', {pretendToBeVisual:true});
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.Node = dom.window.Node;
  globalThis.DOMParser = dom.window.DOMParser;
  const { createRequire } = await import('node:module');
  const require = createRequire(import.meta.url);
  const { OpenSheetMusicDisplay } = require('../../frontend/node_modules/opensheetmusicdisplay');
  const osmd = new OpenSheetMusicDisplay(document.querySelector('#score'), {autoResize:false,backend:'svg'});
  const xml = `<?xml version="1.0"?><score-partwise version="3.1"><part-list><score-part id="P1"><part-name>Piano</part-name></score-part></part-list><part id="P1"><measure number="1"><attributes><divisions>1</divisions><time><beats>4</beats><beat-type>4</beat-type></time><staves>2</staves><clef number="1"><sign>G</sign><line>2</line></clef><clef number="2"><sign>F</sign><line>4</line></clef></attributes><note><pitch><step>C</step><octave>4</octave></pitch><duration>4</duration><voice>1</voice><type>whole</type><staff>1</staff><notations><technical><fingering>1</fingering></technical></notations></note><note><chord/><pitch><step>E</step><octave>4</octave></pitch><duration>4</duration><voice>1</voice><type>whole</type><staff>1</staff><notations><technical><fingering>3</fingering></technical></notations></note><backup><duration>4</duration></backup><note><pitch><step>C</step><octave>3</octave></pitch><duration>4</duration><voice>2</voice><type>whole</type><staff>2</staff><notations><technical><fingering>5</fingering></technical></notations></note></measure></part></score-partwise>`;
  await osmd.load(xml);
  const notes = osmd.Sheet.SourceMeasures.flatMap(m => m.VerticalSourceStaffEntryContainers.flatMap(c => c.StaffEntries.flatMap(s => s ? s.VoiceEntries.flatMap(v => v.Notes) : [])));
  assert.deepEqual(keyboardFingerings(notes).sort((a,b)=>a.midi-b.midi),[
    {midi:48,finger:'5',hand:'lh'}, {midi:60,finger:'1',hand:'rh'}, {midi:64,finger:'3',hand:'rh'},
  ]);
  dom.window.close();
});
