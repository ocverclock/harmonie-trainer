// Pilot: source harmony is imported; functions and teaching choices are explicit.
// The melody is analyzed separately and is not reproduced in these practice scores.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { Note, Voicing } = require('tonal');
const out = path.resolve(__dirname, '../../samples/standards/blue-bossa');
const analysis = JSON.parse(fs.readFileSync(path.join(out, 'analysis.json'), 'utf8'));
const check = process.argv.includes('--check');
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const midi = names => names.map(Note.midi);
const dictionary = {
  m69: ['3m 5P 6M 9M', '6M 9M 10m 12P'],
  m9: ['3m 5P 7m 9M', '7m 9M 10m 12P'],
  m7b5: ['3m 5d 7m 10m', '7m 10m 12d 14m'],
  '7#9': ['3M 5P 7m 9A', '7m 9A 10M 12P'],
  '13': ['3M 6M 7m 9M', '7m 9M 10M 13M'],
  maj9: ['3M 5P 7M 9M', '7M 9M 10M 12P'],
  '7': ['3M 5P 7m 10M', '7m 10M 12P 14m'],
};
const shells = {
  m6: ['3m 6M', '6M 10m'],
  m7: ['3m 7m', '7m 10m'],
  m7b5: ['3m 7m', '7m 10m'],
  '7#9': ['3M 7m', '7m 10M'],
  '7': ['3M 7m', '7m 10M'],
  maj7: ['3M 7M', '7M 10M'],
};
const kindSuffix = { 'minor-sixth': 'm6', 'minor-seventh': 'm7',
  'half-diminished': 'm7b5', 'major-seventh': 'maj7', dominant: '7' };
const enriched = { m6: ['m69', 'minor-sixth', 'm6/9', [[9, 0]]],
  m7: ['m9', 'minor-ninth', 'm9', []], m7b5: ['m7b5', 'half-diminished', 'm7(b5)', []],
  '7#9': ['7#9', 'dominant', '7(#9)', [[9, 1]]],
  maj7: ['maj9', 'major-ninth', 'maj9', []],
  '7': ['13', 'dominant-13th', '13', []] };

function prepare(e, shell) {
  const suffix = e.kind === 'dominant' && e.degrees.some(d => d.value === 9 && d.alter === 1)
    ? '7#9' : kindSuffix[e.kind];
  assert(suffix, 'Unsupported source harmony');
  let spec = shell ? [suffix, e.kind, e.text, e.degrees.map(d => [d.value, d.alter])] : enriched[suffix];
  // Preserve the plain G7 at the final turnaround; do not add a thirteenth.
  if (!shell && suffix === '7' && e.root === 'G') spec = ['7', 'dominant', '7', []];
  const [type, kind, text, degrees] = spec;
  let rootMidi = 48 + Note.chroma(e.root);
  if (rootMidi > 54) rootMidi -= 12;
  const root = Note.get(e.root);
  const natural = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const octave = (rootMidi - natural[root.letter] - root.alt) / 12 - 1;
  const low = e.root + octave;
  const lh = shell ? [low] : [low, Note.transpose(low, suffix === 'm7b5' ? '5d' : '5P')];
  const range = shell ? ['B3', 'D5'] : ['B3', 'G5'];
  const dict = shell ? shells : dictionary;
  const candidates = Voicing.search(e.root + type, range, dict).filter(notes => {
    const ns = midi(notes);
    return ns.length === (shell ? 2 : 4) && ns.at(-1) - ns[0] <= 12
      && ns[0] > Note.midi(lh.at(-1)) && new Set([...midi(lh), ...ns]).size === lh.length + ns.length;
  });
  assert(candidates.length, 'No candidate for ' + e.root + type);
  return { ...e, type, kind, text, degrees, lh, candidates };
}

function ledger(name, staff) {
  const n = Note.get(name), position = n.oct * 7 + 'CDEFGAB'.indexOf(n.letter);
  const [lo, hi] = staff === 1 ? [30, 38] : [18, 26];
  return Math.max(0, Math.floor((lo - position) / 2), Math.floor((position - hi) / 2));
}

function arrange(events, shell) {
  const prepared = events.map(e => prepare(e, shell));
  let states = [{ cost: 0, previous: null, path: [] }];
  for (const e of prepared) {
    states = e.candidates.map(notes => {
      const ns = midi(notes);
      const register = ns.reduce((s, n) => s + Math.abs(n - 69), 0) * 0.08
        + notes.reduce((s, n) => s + ledger(n, 1), 0) * 2;
      let best;
      for (const s of states) {
        const movement = s.previous ? ns.reduce((sum, n, i) => sum + Math.abs(n - s.previous[i]), 0) : 0;
        const cost = s.cost + movement + register;
        if (!best || cost < best.cost) best = { cost, previous: ns, path: [...s.path, { ...e, rh: notes }] };
      }
      return best;
    });
  }
  return states.reduce((a, b) => a.cost < b.cost ? a : b).path;
}

function pitch(name) {
  // Bb is more readable than A# in this C-minor context; sounding pitch is unchanged.
  if (name.startsWith('A#')) name = 'Bb' + Note.get(name).oct;
  const n = Note.get(name);
  return `<pitch><step>${n.letter}</step>${n.alt ? `<alter>${n.alt}</alter>` : ''}<octave>${n.oct}</octave></pitch>`;
}

function notes(names, staff, duration) {
  const type = { 4: 'whole', 3: 'half', 1: 'quarter' }[duration];
  assert(type, 'Unsupported duration');
  return names.map((name, i) => `<note>${i ? '<chord/>' : ''}${pitch(name)}<duration>${duration * 4}</duration><voice>${staff}</voice><type>${type}</type>${duration === 3 ? '<dot/>' : ''}<staff>${staff}</staff></note>`).join('');
}

function harmony(e) {
  const n = Note.get(e.root);
  return `<harmony placement="above"><root><root-step>${n.letter}</root-step>${n.alt ? `<root-alter>${n.alt}</root-alter>` : ''}</root><kind text="${esc(e.text)}" use-symbols="no">${e.kind}</kind>${e.degrees.map(([value, alter]) => `<degree><degree-value>${value}</degree-value><degree-alter>${alter}</degree-alter><degree-type>add</degree-type></degree>`).join('')}<staff>1</staff></harmony>`;
}

function score(events, name, title, shell, isolated = false) {
  const arranged = arrange(events, shell);
  const measureCount = Math.max(...events.map(e => e.headMeasure));
  const measures = [];
  for (let measure = 1; measure <= measureCount; measure++) {
    const group = arranged.filter(e => e.headMeasure === measure);
    assert.equal(group.reduce((s, e) => s + e.durationQuarters, 0), 4);
    const first = measure === 1;
    const key = isolated && measure >= 5 ? [-5, 'major'] : [-3, 'minor'];
    const attrs = first ? `<attributes><divisions>4</divisions><key><fifths>${key[0]}</fifths><mode>${key[1]}</mode></key><time><beats>4</beats><beat-type>4</beat-type></time><staves>2</staves><clef number="1"><sign>G</sign><line>2</line></clef><clef number="2"><sign>F</sign><line>4</line></clef></attributes>`
      : isolated && measure === 5 ? '<attributes><key><fifths>-5</fifths><mode>major</mode></key></attributes>' : '';
    const text = isolated ? ({ 1: 'II-V-I mineur : mesures 5-8', 5: 'II-V-I majeur : mesures 9-12' }[measure])
      : ({ 1: 'Do mineur', 5: 'II-V-I mineur', 9: 'II-V-I vers Ré bémol', 13: 'Retour en Do mineur', 16: 'G7 au 4e temps' }[measure]);
    const direction = text ? `<direction placement="above"><direction-type><words font-size="10">${text}</words></direction-type><staff>1</staff></direction>` : '';
    const tempo = first ? '<direction><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>60</per-minute></metronome></direction-type><sound tempo="60"/></direction>' : '';
    measures.push(`<measure number="${measure}">${attrs}${direction}${tempo}${group.map(e => harmony(e) + notes(e.rh, 1, e.durationQuarters)).join('')}<backup><duration>16</duration></backup>${group.map(e => notes(e.lh, 2, e.durationQuarters)).join('')}${measure === measureCount ? '<barline location="right"><bar-style>light-heavy</bar-style></barline>' : ''}</measure>`);
  }
  const description = shell
    ? 'Étude originale : basse seule et notes-guides. Sur la tonique mineure : tierce et sixte. Les tensions et la quinte diminuée ne sont pas toutes jouées à ce stade.'
    : 'Étude originale de voicings : deux notes de basse et quatre notes à droite. Enrichissements pédagogiques annoncés ; la mélodie du standard n’est pas reproduite. Le mode cadence extrait les mesures 5 à 12 du thème, avec leurs durées harmoniques.';
  const xml = `<?xml version="1.0" encoding="utf-8"?>\n<score-partwise version="4.0"><work><work-title>${esc(title)}</work-title></work><identification><creator type="composer">Harmonie Trainer — étude de voicings</creator><encoding><software>Tonal 6.5.1 + Harmonie Trainer</software><encoding-date>2026-10-22</encoding-date><encoding-description>${esc(description)}</encoding-description></encoding><source>Grille : Blue Bossa, Kenny Dorham ; MusicXML du projet CLaMP. Voir la fiche pédagogique pour la source et les adaptations.</source></identification><defaults><scaling><millimeters>7</millimeters><tenths>40</tenths></scaling></defaults><part-list><score-part id="P1"><part-name>Piano</part-name><part-abbreviation>Pno.</part-abbreviation><score-instrument id="I1"><instrument-name>Piano</instrument-name></score-instrument><midi-instrument id="I1"><midi-channel>1</midi-channel><midi-program>1</midi-program></midi-instrument></score-part></part-list><part id="P1">${measures.join('\n')}</part></score-partwise>\n`;
  if (check) assert.equal(fs.readFileSync(path.join(out, name), 'utf8'), xml);
  else fs.writeFileSync(path.join(out, name), xml);
  return { name, measures: measureCount, events: arranged.map(e => ({ measure: e.headMeasure, beat: e.beat,
    sourceMeasure: e.sourceMeasure, chord: e.root + e.text, left: e.lh,
    right: e.rh.map(n => n.startsWith('A#') ? 'Bb' + Note.get(n).oct : n), duration: e.durationQuarters })),
    maxLedgerLines: Math.max(...arranged.flatMap(e => [...e.rh.map(n => ledger(n, 1)), ...e.lh.map(n => ledger(n, 2))])) };
}

assert.equal(analysis.selection.headMeasures, 16);
assert.equal(analysis.timeline.length, 17);
const cadenceIndices = [5, 6, 7, 8, 9, 10, 11, 12];
const cadence = cadenceIndices.map((n, i) => ({ ...analysis.timeline.find(e => e.headMeasure === n),
  headMeasure: i + 1, beat: 1, durationQuarters: 4 }));
const generated = [
  score(analysis.timeline, 'Blue_Bossa_01_notes_guides.musicxml', 'Blue Bossa - 1 : notes-guides', true),
  score(analysis.timeline, 'Blue_Bossa_02_voicings.musicxml', 'Blue Bossa - 2 : voicings avec basses', false),
  score(cadence, 'Blue_Bossa_03_cadences.musicxml', 'Blue Bossa - 3 : cadences ciblées', false, true),
];
const report = JSON.stringify({ generated, melodyIncluded: false,
  analysisStatus: 'Harmonic functions and teaching objectives are human-validated pilot annotations, not automatic Tonal analysis.' }, null, 2) + '\n';
if (check) assert.equal(fs.readFileSync(path.join(out, 'voicings.json'), 'utf8'), report);
else fs.writeFileSync(path.join(out, 'voicings.json'), report);
console.log(JSON.stringify({ mode: check ? 'check' : 'generate', files: generated.map(({ name, measures, maxLedgerLines }) => ({ name, measures, maxLedgerLines })) }, null, 2));
