// Générateur autonome : Tonal calcule les candidats ; nos règles choisissent les positions.
// Les assertions vérifient notes, tessitures, basse et transformation mineure I -> II.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {Voicing,Note}=require('tonal');
const out=path.resolve(__dirname,'../../samples/ii-v-i');
const checkOnly=process.argv.includes('--check');
// Le choix des positions reste identique ; seule leur octave de sortie est relevée.
const notationOctaveShift=1;
const dict={m7b5:['3m 5d 7m 10m','7m 10m 12d 14m'],'7b9':['3M 5P 7m 9m','7m 9m 10M 12P'],m69:['3m 5P 6M 9M','6M 9M 10m 12P']};
const chains=[
 [['C',-3,'Do'],['Bb',-5,'Si bémol'],['Ab',-7,'La bémol'],['F#',3,'Fa dièse'],['E',1,'Mi'],['D',-1,'Ré']],
 [['C#',4,'Do dièse'],['B',2,'Si'],['A',0,'La'],['G',-2,'Sol'],['F',-4,'Fa'],['Eb',-6,'Mi bémol']],
];
const midis=notes=>notes.map(Note.midi);
const motion=(a,b)=>a.reduce((sum,n,i)=>sum+Math.abs(n-b[i]),0);
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function bass(root,diminished=false){
 let low=36+Note.chroma(root);
 if(low>43)low-=12;
 const fifthDistance=diminished?6:7;
 const fifthPc=Note.transpose(root,diminished?'5d':'5P');
 const named=pc=>{
  const n=Note.get(pc),natural={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
  const target=pc===root?low:low+fifthDistance;
  const octave=(target-natural[n.letter]-n.alt)/12-1;
  assert(Number.isInteger(octave));
  return pc+octave;
 };
 const result=[named(root),named(fifthPc)];
 assert.deepEqual(midis(result),[low,low+fifthDistance]);
 return result;
}
function generateChain(keys,chainIndex){
 let prev=null;
 return keys.map(([tonic,fifths,french],index)=>{
  const roots=[Note.transpose(tonic,'2M'),Note.transpose(tonic,'5P'),tonic];
  const symbols=roots.map((r,j)=>r+['m7b5','7b9','m69'][j]);
  const lh=roots.map((root,j)=>bass(root,j===0));
  const candidates=symbols.map((s,j)=>Voicing.search(s,['B2','C5'],dict).filter(notes=>{
   const ns=midis(notes);return ns[0]>Note.midi(lh[j][1])&&ns[3]-ns[0]<=12;
  }));
  assert(candidates.every(c=>c.length));
  if(prev){
   assert.equal(Note.chroma(prev.tonic),Note.chroma(roots[0]));
   assert.equal(Note.midi(prev.lh[2][0]),Note.midi(lh[0][0]),'Fondamentale conservée');
   assert.equal(Note.midi(prev.lh[2][1])-1,Note.midi(lh[0][1]),'Quinte abaissée pour le II demi-diminué');
   // La construction de droite change : m6/9 contient 3m, 5P, 6M, 9M ;
   // m7b5 contient 3m, 5d, 7m, avec doublure. La transition est évaluée,
   // sans copier la règle des deux demi-tons du cycle majeur.
  }
  let best=null;
  const seed=chainIndex===0?[53,56,60,65]:[54,57,61,66];
  for(const a of candidates[0])for(const b of candidates[1])for(const c of candidates[2]){
   const aa=midis(a),bb=midis(b),cc=midis(c);
   const registerCost=[...aa,...bb,...cc].reduce((sum,n)=>sum+Math.abs(n-60),0)*0.12;
   const cost=motion(aa,bb)+motion(bb,cc)+(prev?0:0.4*motion(aa,seed))+registerCost;
   if(!best||cost<best.cost)best={cost,rh:[a,b,c]};
  }
  const expected=[[3,6,10],[4,7,10,1],[3,7,9,2]];
  best.rh.forEach((notes,j)=>{
   const ns=midis(notes),r=Note.chroma(roots[j]);
   assert.equal(ns.length,4);assert(ns.every((n,k)=>n>=47&&n<=72&&(k===0||n>ns[k-1])));
   assert.deepEqual(new Set(ns.map(n=>n%12)),new Set(expected[j].map(n=>(r+n)%12)));
   const all=[...midis(lh[j]),...ns];assert.equal(new Set(all).size,6);
   assert.equal(new Set(all.map(n=>n%12)).size,j===0?4:5);
   assert.equal((Note.chroma(lh[j][1])-r+12)%12,j===0?6:7);
  });
  const cycle={tonic,fifths,french,roots,symbols,lh,rh:best.rh,chain:chainIndex+1,index};
  prev=cycle;return cycle;
 });
}
const cycles=chains.flatMap(generateChain);
assert.equal(new Set(cycles.map(c=>Note.chroma(c.tonic))).size,12);
function pitch(name){const n=Note.get(name);return `<pitch><step>${n.letter}</step>${n.alt?`<alter>${n.alt}</alter>`:''}<octave>${n.oct+notationOctaveShift}</octave></pitch>`;}
function notes(names,staff){return names.map((n,i)=>`<note>${i?'<chord/>':''}${pitch(n)}<duration>16</duration><voice>${staff}</voice><type>whole</type><staff>${staff}</staff></note>`).join('');}
function harmony(c,j){
 const n=Note.get(c.roots[j]);
 const kind=['half-diminished','dominant','minor-sixth'][j];
 const text=['m7(b5)','7','m6'][j];
 const degree=j===0?'':`<degree><degree-value>9</degree-value><degree-alter>${j===1?-1:0}</degree-alter><degree-type>add</degree-type></degree>`;
 return `<harmony placement="above"><root><root-step>${n.letter}</root-step>${n.alt?`<root-alter>${n.alt}</root-alter>`:''}</root><kind text="${text}" use-symbols="no">${kind}</kind>${degree}<staff>1</staff></harmony>`;
}
function score(selected,title,name){
 const measures=[];
 selected.forEach((c,i)=>c.rh.forEach((rh,j)=>{
  const number=i*3+j+1,first=number===1;
  const attrs=first?`<attributes><divisions>4</divisions><key><fifths>${c.fifths}</fifths><mode>minor</mode></key><time><beats>4</beats><beat-type>4</beat-type></time><staves>2</staves><clef number="1"><sign>G</sign><line>2</line></clef><clef number="2"><sign>F</sign><line>4</line></clef></attributes>`:j===0?`<attributes><key><fifths>${c.fifths}</fifths><mode>minor</mode></key></attributes>`:'';
  const label=j===0?`<direction placement="above"><direction-type><words font-size="10">${esc((c.index===0?'Boucle '+c.chain+' : ': 'I devient II : ')+c.french+' mineur')}</words></direction-type><staff>1</staff></direction>`:'';
  const tempo=first?'<direction placement="above"><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>60</per-minute></metronome></direction-type><staff>1</staff><sound tempo="60"/></direction>':'';
  const end=j===2?`<barline location="right"><bar-style>${i===selected.length-1||c.index===5?'light-heavy':'light-light'}</bar-style></barline>`:'';
  measures.push(`<measure number="${number}" width="260">${j===0&&i>0?'<print new-system="yes"/>':''}${attrs}${label}${tempo}${harmony(c,j)}${notes(rh,1)}<backup><duration>16</duration></backup>${notes(c.lh[j],2)}${end}</measure>`);
 }));
 const s=`<?xml version="1.0" encoding="utf-8"?>
<score-partwise version="4.0"><work><work-title>${esc(title)}</work-title></work><identification><creator type="composer">Harmonie Trainer — exercices originaux</creator><encoding><software>Tonal ${require('tonal/package.json').version} + générateur Harmonie Trainer</software><encoding-date>2026-10-22</encoding-date><encoding-description>Cycle mineur : II demi-diminué, V7 bémol 9, I mineur 6/9. MG fondamentale et quinte diminuée sur II, quinte juste sur V et I ; MD quatre notes, avec doublure sur II et V. La fondamentale du I devient celle du II suivant. Deux boucles de six tonalités. Version de lecture : toutes les notes des deux mains sont transposées exactement une octave vers l’aigu ; intervalles, voicings, tonalités, rythmes et enchaînements conservés.</encoding-description></encoding></identification><defaults><scaling><millimeters>7</millimeters><tenths>40</tenths></scaling></defaults><part-list><score-part id="P1"><part-name>Piano</part-name><part-abbreviation>Pno.</part-abbreviation><score-instrument id="I1"><instrument-name>Piano</instrument-name></score-instrument><midi-instrument id="I1"><midi-channel>1</midi-channel><midi-program>1</midi-program></midi-instrument></score-part></part-list><part id="P1">${measures.join('\n')}</part></score-partwise>\n`;
 if(checkOnly)assert.equal(fs.readFileSync(path.join(out,name),'utf8'),s,`Partition non reproductible : ${name}`);
 else fs.writeFileSync(path.join(out,name),s);
 return {name,cadences:selected.length,measures:measures.length,notes:measures.length*6};
}
const files=[score(cycles.slice(0,3),'II-V-I mineurs - test court (+1 octave)','II-V-I_mineur_test_court.musicxml'),score(cycles,'II-V-I mineurs - 12 tonalités (+1 octave)','II-V-I_mineur_12_tonalites.musicxml')];
console.log(JSON.stringify({mode:checkOnly?'check':'generate',tonal:require('tonal/package.json').version,files},null,2));
