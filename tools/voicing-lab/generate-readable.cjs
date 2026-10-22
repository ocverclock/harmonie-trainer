// Versions de lecture : transposition uniforme de toutes les notes de +12 demi-tons.
// Aucune nouvelle sélection de voicing ; les sources musicales restent inchangées.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const directory = path.resolve(__dirname, '../../samples/ii-v-i');
const checkOnly = process.argv.includes('--check');
const sources = [
  'II-V-I_test_court.musicxml',
  'II-V-I_12_tonalites.musicxml',
  'II-V-I_mineur_test_court.musicxml',
  'II-V-I_mineur_12_tonalites.musicxml',
];

const results = sources.map(sourceName => {
  const source = fs.readFileSync(path.join(directory, sourceName), 'utf8');
  let pitchCount = 0;
  const raised = source.replace(/<pitch>([\s\S]*?)<\/pitch>/g, (pitch, content) => {
    const match = content.match(/<octave>([0-9])<\/octave>/);
    assert(match, 'Toute hauteur doit avoir une octave explicite');
    const octave = Number(match[1]) + 1;
    assert(octave <= 9, 'Octave MusicXML hors plage');
    pitchCount += 1;
    return pitch.replace(/<octave>[0-9]<\/octave>/, '<octave>' + octave + '</octave>');
  });
  assert.equal(pitchCount, (source.match(/<note>/g) || []).length);
  assert(pitchCount === 54 || pitchCount === 216);
  // Revenir exactement à la source prouve que seule l'octave des hauteurs a changé.
  const restored = raised.replace(/<pitch>([\s\S]*?)<\/pitch>/g, pitch =>
    pitch.replace(/<octave>([0-9])<\/octave>/, (_, octave) =>
      '<octave>' + (Number(octave) - 1) + '</octave>'));
  assert.equal(restored, source);

  const title = 'II-V-I ' + (sourceName.includes('mineur') ? 'mineurs' : 'majeurs')
    + (sourceName.includes('test_court') ? ' - test court' : ' - 12 tonalités')
    + ' (+1 octave)';
  const result = raised
    .replace(/<work-title>([\s\S]*?)<\/work-title>/,
      '<work-title>' + title + '</work-title>')
    .replace('</encoding-description>',
      ' Version de lecture : toutes les notes des deux mains sont transposées exactement une octave vers l’aigu ; intervalles, voicings, tonalités, rythmes et enchaînements conservés.</encoding-description>');
  const name = sourceName.replace('.musicxml', '_lecture.musicxml');
  if (checkOnly) {
    assert.equal(fs.readFileSync(path.join(directory, name), 'utf8'), result,
      'Partition de lecture non reproductible : ' + name);
  } else {
    fs.writeFileSync(path.join(directory, name), result);
  }
  return { name, notes: pitchCount, transpositionSemitones: 12 };
});
console.log(JSON.stringify({ mode: checkOnly ? 'check' : 'generate', files: results }, null, 2));

