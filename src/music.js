export const names = ["C","C♯","D","E♭","E","F","F♯","G","A♭","A","B♭","B"];
export const pitch = {C:0,"C#":1,Db:1,D:2,"D#":3,Eb:3,E:4,F:5,"F#":6,Gb:6,"G#":8,Ab:8,G:7,A:9,"A#":10,Bb:10,B:11};
export const qualities = {M:[0,4,7],m:[0,3,7],dim:[0,3,6],aug:[0,4,8],maj7:[0,4,7,11],m7:[0,3,7,10],dom7:[0,4,7,10],halfDim:[0,3,6,10]};
const definition=[
 ["C","M","C E G",1],["F","M","F A C",1],["G","M","G B D",1],["D","M","D F# A",1],["Bb","M","Bb D F",1],
 ["Am","m","A C E",1],["Dm","m","D F A",1],["Em","m","E G B",1],["Gm","m","G Bb D",1],["Cm","m","C Eb G",1],
 ["Cmaj7","maj7","C E G B",2],["Fmaj7","maj7","F A C E",2],["Gmaj7","maj7","G B D F#",2],["Bbmaj7","maj7","Bb D F A",2],
 ["Am7","m7","A C E G",2],["Dm7","m7","D F A C",2],["Em7","m7","E G B D",2],["Gm7","m7","G Bb D F",2],
 ["G7","dom7","G B D F",2],["C7","dom7","C E G Bb",2],["D7","dom7","D F# A C",2],["F7","dom7","F A C Eb",2],
 ["Bdim","dim","B D F",3],["Ddim","dim","D F Ab",3],["Caug","aug","C E G#",3],["Faug","aug","F A C#",3],["Bm7b5","halfDim","B D F A",3],["Em7b5","halfDim","E G Bb D",3]
];
export const exercises=definition.map(function(row){
 const root=row[0].match(/^[A-G](?:#|b)?/)[0];
 return {id:row[0],symbol:row[0],root:root,quality:row[1],level:row[3],
  spelling:row[2],expected:row[2].split(" ").map(function(note){return pitch[note]})};
});
export const degrees={M:"1 · 3 · 5",m:"1 · ♭3 · 5",dim:"1 · ♭3 · ♭5",aug:"1 · 3 · ♯5",maj7:"1 · 3 · 5 · 7",m7:"1 · ♭3 · 5 · ♭7",dom7:"1 · 3 · 5 · ♭7",halfDim:"1 · ♭3 · ♭5 · ♭7"};
export function grade(exercise,selected) {
 const wanted=new Set(exercise.expected), actual=new Set(selected.map(function(n){return (n%12+12)%12}));
 const missing=[...wanted].filter(function(n){return !actual.has(n)});
 const extra=[...actual].filter(function(n){return !wanted.has(n)});
 return {correct:missing.length===0&&extra.length===0,missing:missing,extra:extra};
}
export function sessionFor(level,random=Math.random){
 let pool=exercises.filter(function(x){return x.level===level});
 function shuffle(items){let a=[...items];for(let i=a.length-1;i>0;i--){let j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
 if(level===3) return shuffle([...pool,...shuffle(exercises.filter(function(x){return x.level<3})).slice(0,4)]);
 return shuffle(pool).slice(0,10);
}
function progression(id,title,items) {
 return {id:id,title:title,frames:items.map(function(row){
 return {symbol:row[0],voices:row[1].map(function(note,id){
 const match=/^([A-G](?:#|b)?)(-?\d+)$/.exec(note);
 if(!match) throw new Error("Incorrect spelled note: "+note);
 return {id:id,note:note,midi:(Number(match[2])+1)*12+pitch[match[1]]};
 })};
 })};
}
export const secondary=[
 {id:"to-g",target:"G majeur",prompt:"En Do majeur, quelle progression II–V–I permet de toniciser G majeur ?",
  choices:["Dm7 → G7 → Cmaj7","Am7 → D7 → Gmaj7","Em7 → A7 → Dmaj7","Bm7♭5 → E7 → Am7"],answer:1,
  explanation:"Pour atteindre G, cherche le II de G majeur : Am7. Sa dominante est D7, puis on résout vers Gmaj7. D7 contient F♯, qui attire vers G.",
  progression:progression("g","Résolution vers G majeur",[["Am7",["A3","C4","E4","G4"]],["D7",["A3","C4","D4","F#4"]],["Gmaj7",["B3","D4","F#4","G4"]]])},
 {id:"to-dm",target:"D mineur",prompt:"Quel II–V–I secondaire convient pour résoudre vers D mineur ?",
  choices:["Am7 → D7 → Gmaj7","Gm7 → C7 → Fmaj7","Em7♭5 → A7 → Dm7","F♯m7♭5 → B7 → Em7"],answer:2,
  explanation:"En mineur, le II est souvent demi-diminué : Em7♭5. La dominante A7 contient C♯, sensible de D, puis elle résout sur Dm7.",
  progression:progression("dm","Résolution vers D mineur",[["Em7♭5",["E3","G3","Bb3","D4"]],["A7",["E3","G3","A3","C#4"]],["Dm7",["F3","A3","C4","D4"]]])},
 {id:"to-em",target:"E mineur",prompt:"Tu veux rejoindre Em7 : quel II–V–I secondaire choisis-tu ?",
  choices:["F♯m7♭5 → B7 → Em7","Em7 → A7 → Dmaj7","Am7 → D7 → Gmaj7","Cm7 → F7 → B♭maj7"],answer:0,
  explanation:"E mineur se prépare par F♯m7♭5 puis B7. La tierce D♯ de B7 agit comme sensible et conduit vers E.",
  progression:progression("em","Résolution vers E mineur",[["F♯m7♭5",["F#3","A3","C4","E4"]],["B7",["F#3","A3","B3","D#4"]],["Em7",["G3","B3","D4","E4"]]])},
 {id:"to-am",target:"A mineur",prompt:"Pour revenir sur Am7, quel II–V–I secondaire faut-il construire ?",
  choices:["Gm7 → C7 → Fmaj7","Dm7 → G7 → Cmaj7","Bm7♭5 → E7 → Am7","Am7 → D7 → Gmaj7"],answer:2,
  explanation:"Le II d’A mineur est Bm7♭5. Sa dominante E7 apporte G♯, sensible qui veut monter vers A.",
  progression:progression("am","Résolution vers A mineur",[["Bm7♭5",["B3","D4","F4","A4"]],["E7",["B3","D4","E4","G#4"]],["Am7",["C4","E4","G4","A4"]]])},
 {id:"to-f",target:"F majeur",prompt:"Quelle cadence II–V–I secondaire peut toniciser F majeur ?",
  choices:["Gm7 → C7 → Fmaj7","Am7 → D7 → Gmaj7","Bm7♭5 → E7 → Am7","Em7♭5 → A7 → Dm7"],answer:0,
  explanation:"Gm7 est le II de F. C7 prépare sa résolution sur Fmaj7 ; la septième B♭ de C7 descend naturellement vers A.",
  progression:progression("f","Résolution vers F majeur",[["Gm7",["G3","Bb3","D4","F4"]],["C7",["G3","Bb3","C4","E4"]],["Fmaj7",["A3","C4","E4","F4"]]])}
];
export function validateBank(){
 if(exercises.length!==28||new Set(exercises.map(x=>x.id)).size!==28) return false;
 for(const e of exercises){if(e.expected.some(x=>x===undefined))return false;
  const expected=qualities[e.quality].map(x=>(x+pitch[e.root])%12);
  if(expected.length!==e.expected.length||expected.some((x,i)=>x!==e.expected[i]))return false;
 }
 return secondary.every(function(q){
  return q.answer>=0&&q.answer<q.choices.length&&q.progression.frames.length===3&&q.progression.frames.every(function(f){
   return f.voices.length===4&&f.voices.every(function(v,i){return v.id===i&&v.midi>=48&&v.midi<=83});
  });
 });
}
