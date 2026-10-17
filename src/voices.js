import {PIANO_WIDTH,PIANO_KEYS,noteX} from "./piano-layout.js";

export const voiceColors=["#3b82f6","#22a06b","#e7a61e","#9654d7"];
export const ROW_Y=[87,177,267];
export const DIAGRAM_HEIGHT=318;

// Time runs vertically from top to bottom. Pitch runs horizontally at the exact
// X coordinate of the piano key. Notes held across chords therefore form a
// perfectly vertical segment; altered notes move left or right.
export function diagram(progress,active,solo,annotations=[]){
 const W=PIANO_WIDTH,H=DIAGRAM_HEIGHT;
 let svg='<div class="viz viz-aligned"><svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Trois accords superposés verticalement, chaque point aligné avec une touche du piano : '+progress.title+'">';
 const centers=PIANO_KEYS.filter(k=>!k.black).map(k=>k.center);
 for(const x of centers)svg+='<line class="pitchGuide" x1="'+x+'" x2="'+x+'" y1="38" y2="296"/>';
 progress.frames.forEach(function(f,i){
  const y=ROW_Y[i],activeRow=i===active;
  svg+='<rect x="0" y="'+(y-29)+'" width="'+W+'" height="58" rx="13" class="chordRow '+(activeRow?'chordRowActive':'')+'"/>';
  svg+='<text class="chordRowLabel" x="11" y="'+(y-39)+'">'+(i+1)+'. '+f.symbol+'</text>';
 });
 for(let voice=0;voice<4;voice++){
  if(solo!==-1&&solo!==voice)continue;
  const color=voiceColors[voice];
  for(let row=0;row<progress.frames.length-1;row++){
   const a=progress.frames[row].voices[voice];
   const b=progress.frames[row+1].voices[voice];
   const x0=noteX(a.midi),x1=noteX(b.midi),y0=ROW_Y[row],y1=ROW_Y[row+1];
   const dy=(y1-y0)*0.38;
   svg+='<path class="path" data-voice="'+voice+'" data-from="'+a.midi+'" data-to="'+b.midi+'" stroke="'+color+'" d="M '+x0+' '+y0+' C '+x0+' '+(y0+dy)+', '+x1+' '+(y1-dy)+', '+x1+' '+y1+'"/>';
  }
  progress.frames.forEach(function(f,i){
   const v=f.voices[voice],x=noteX(v.midi),y=ROW_Y[i];
   svg+='<circle class="voice" data-voice="'+voice+'" data-midi="'+v.midi+'" cx="'+x+'" cy="'+y+'" r="15" fill="'+color+'"/>';
   svg+='<text class="voiceIndex" text-anchor="middle" x="'+x+'" y="'+(y+5)+'">'+(voice+1)+'</text>';
   svg+='<text class="voicePitch" x="'+(x+18)+'" y="'+(y-16)+'">'+v.note+'</text>';
  });
 }
 // Red corrections overlay the user's colored voices; time and pitch alignment stay unchanged.
 for(const correction of annotations){
  const row=correction.row;
  if(!Number.isInteger(row)||row<0||row>=ROW_Y.length)continue;
  const y=ROW_Y[row];
  for(const midi of correction.wrong||[]){
   const x=noteX(midi);
   svg+='<circle class="correctionWrong" data-wrong-midi="'+midi+'" cx="'+x+'" cy="'+y+'" r="22" fill="none" stroke="#d51e2b" stroke-width="4"/>';
  }
  for(const item of correction.suggested||[]){
   const midi=item.midi,x=noteX(midi),name=["C","C♯","D","E♭","E","F","F♯","G","A♭","A","B♭","B"][midi%12]+(Math.floor(midi/12)-1);
   svg+='<circle class="correctionRight" data-correct-midi="'+midi+'" cx="'+x+'" cy="'+y+'" r="16" fill="#fff" stroke="#d51e2b" stroke-width="4"/>'+
        '<text class="correctionName" x="'+(x+15)+'" y="'+(y-19)+'" fill="#b91c1c" font-size="13" font-weight="850">'+name+'</text>';
  }
 }
 return svg+'</svg></div>';
}

export function movementSummary(progress,frame){
 if(frame===0)return "Observe les quatre voix du premier accord. Les points des trois rangées sont alignés sur les vraies touches du piano juste au-dessous.";
 const a=progress.frames[frame-1],b=progress.frames[frame];
 return a.voices.map(function(v,i){
  const next=b.voices[i],difference=next.midi-v.midi;
  return "Voix "+(i+1)+" : "+v.note+" → "+next.note+" ("+(difference===0?"note commune":difference>0?"+"+difference+" demi-ton"+(difference>1?"s":""):difference+" demi-ton"+(difference < -1?"s":""))+")";
 }).join(" · ");
}

export function frameCenter(progress,frame){
 const notes=progress.frames[frame].voices;
 return (Math.min(...notes.map(v=>noteX(v.midi)))+Math.max(...notes.map(v=>noteX(v.midi))))/2;
}
