// Visual-only feedback for pitch-class chord construction.
// Grading remains in music.js and does not depend on octave or keyboard display.
export function constructionKeyState(pc,selected,checked){
 if(!checked||checked.correct)return "";
 const pitchClass=((pc%12)+12)%12;
 if(checked.extra.includes(pitchClass))return "extra";
 if(checked.missing.includes(pitchClass))return "missing";
 if(selected.has(pitchClass))return "correct";
 return "";
}
