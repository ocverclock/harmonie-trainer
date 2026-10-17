// Single geometric source of truth for the piano and the voice-leading graphic.
// The diagram is drawn at the keyboard's intrinsic pixel width, inside one shared scroller.
export const PIANO_START=48;
export const PIANO_END=83;
export const WHITE_WIDTH=52;
export const BLACK_WIDTH=36;
const blacks=new Set([1,3,6,8,10]);
let whites=0;
export const PIANO_KEYS=[];
for(let midi=PIANO_START;midi<=PIANO_END;midi++){
 const pc=midi%12;
 if(blacks.has(pc)){
  const left=whites*WHITE_WIDTH-BLACK_WIDTH/2;
  PIANO_KEYS.push({midi,pc,black:true,left,center:whites*WHITE_WIDTH});
 }else{
  const left=whites*WHITE_WIDTH;
  PIANO_KEYS.push({midi,pc,black:false,left,center:left+WHITE_WIDTH/2});
  whites++;
 }
}
export const PIANO_WIDTH=whites*WHITE_WIDTH;
const byMidi=new Map(PIANO_KEYS.map(key=>[key.midi,key]));
export function noteX(midi){
 const key=byMidi.get(midi);
 if(!key)throw new RangeError("Note outside visible keyboard: "+midi);
 return key.center;
}
