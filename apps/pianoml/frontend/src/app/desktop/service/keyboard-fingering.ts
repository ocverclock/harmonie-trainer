/** Read existing OSMD/MusicXML annotations at the cursor; never infer a fingering. */
export interface FingeredNote {
  isRest(): boolean;
  Pitch?: { getHalfTone(): number };
  Fingering?: { value: string };
  ParentStaff: { Id: number; ParentInstrument: { Staves: unknown[] } };
}
export interface KeyboardFingering { midi: number; finger: string; hand: 'rh' | 'lh' | 'unknown' }

export function keyboardFingerings(notes: readonly FingeredNote[]): KeyboardFingering[] {
  const result: KeyboardFingering[] = [];
  for (const note of notes) {
    const finger = note.Fingering?.value?.trim();
    if (note.isRest() || !note.Pitch || !finger || !/^[1-5]$/.test(finger)) continue;
    // OSMD's octave origin is C0; MIDI's is C-1.
    const midi = note.Pitch.getHalfTone() + 12;
    if (!Number.isInteger(midi) || midi < 0 || midi > 127) continue;
    const staff = note.ParentStaff;
    // A conventional piano grand staff. Other instrumentation stays unassigned.
    const hand = staff.ParentInstrument.Staves.length === 2
      ? staff.Id === 1 ? 'rh' : staff.Id === 2 ? 'lh' : 'unknown' : 'unknown';
    if (!result.some(x => x.midi === midi && x.finger === finger && x.hand === hand))
      result.push({ midi, finger, hand });
  }
  return result;
}

/** SVG coordinates follow the keyboard viewBox, including responsive resizing. */
export function renderKeyboardFingerings(container: HTMLElement, fingers: readonly KeyboardFingering[]): void {
  container.querySelector('.keyboard-fingerings')?.remove();
  const svg = container.querySelector('svg');
  if (!svg || fingers.length === 0) return;
  const doc = container.ownerDocument;
  const ns = 'http://www.w3.org/2000/svg';
  const group = doc.createElementNS(ns, 'g');
  group.setAttribute('class', 'keyboard-fingerings');
  group.setAttribute('pointer-events', 'none');
  const pitches = new Map<number, KeyboardFingering[]>();
  for (const f of fingers) pitches.set(f.midi, [...(pitches.get(f.midi) ?? []), f]);
  for (const [midi, labels] of pitches) {
    // PianoKeys uses C0 = 0, as OSMD does.
    const key = Array.from(svg.querySelectorAll('rect')).find(rect => rect.id === String(midi - 12));
    if (!key) continue;
    const x = Number(key.getAttribute('x'));
    const y = Number(key.getAttribute('y'));
    const width = Number(key.getAttribute('width'));
    const height = Number(key.getAttribute('height'));
    labels.forEach((f, i) => {
      const text = doc.createElementNS(ns, 'text');
      text.textContent = f.finger;
      text.setAttribute('x', String(x + width / 2));
      text.setAttribute('y', String(y + height - 6 - i * 15));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', String(Math.min(16, width * .75)));
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('fill', f.hand === 'lh' ? '#b9deff' : f.hand === 'rh' ? '#fff47a' : '#ffffff');
      text.setAttribute('stroke', '#111111');
      text.setAttribute('stroke-width', '3');
      text.setAttribute('paint-order', 'stroke');
      text.setAttribute('aria-label', `${f.hand === 'lh' ? 'Main gauche' : f.hand === 'rh' ? 'Main droite' : 'Main non précisée'}, doigt ${f.finger}`);
      text.setAttribute('data-midi', String(midi));
      group.appendChild(text);
    });
  }
  svg.appendChild(group);
}
