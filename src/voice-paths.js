import {PIANO_KEYS,PIANO_WIDTH,PIANO_START,PIANO_END,noteX} from "./piano-layout.js";
import {midiLabel} from "./voicing.js";
import {voiceColors} from "./voices.js?v=4";

const stepY=78,top=68;
const esc=s=>String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
function validFrame(frame){
 return frame&&typeof frame.symbol==="string"&&Array.isArray(frame.midis)&&frame.midis.length===4&&
  frame.midis.every(n=>Number.isInteger(n)&&n>=PIANO_START&&n<=PIANO_END)&&
  new Set(frame.midis).size===4;
}
/** Ascending-register comparison of what the pupil played (not fixed finger identities). */
export function voicePathModel(frames){
 if(!Array.isArray(frames)||frames.length<2||frames.length>3||!frames.every(validFrame))
  throw Error("Trajet : deux ou trois accords joués avec quatre notes MIDI distinctes sont nécessaires.");
 const rows=frames.map((f,row)=>({
  symbol:f.symbol,row,correct:f.correct===true,
  notes:[...f.midis].sort((a,b)=>a-b).map((midi,voice)=>({
   midi,voice,x:noteX(midi),y:top+stepY*row,label:midiLabel(midi)
  }))
 }));
 const moves=[];
 for(let row=0;row<rows.length-1;row++)
  for(let voice=0;voice<4;voice++){
   const from=rows[row].notes[voice],to=rows[row+1].notes[voice],delta=to.midi-from.midi;
   moves.push({row,voice,from,to,semitones:delta,held:delta===0,semitone:Math.abs(delta)===1,
    leap:Math.abs(delta)>7});
  }
 return {width:PIANO_WIDTH,height:top*2+stepY*(frames.length-1)-18,rows,moves,
  total:moves.reduce((sum,v)=>sum+Math.abs(v.semitones),0)};
}
function movement(m){
 if(m.semitones===0)return "note immobile";
 return (m.semitones>0?"monte de ":"descend de ")+Math.abs(m.semitones)+
  " demi-ton"+(Math.abs(m.semitones)>1?"s":"");
}
/** A noninteractive, keyboard-aligned diagram. Never includes ideal or missing notes. */
export function renderVoicePaths(frames){
 const data=voicePathModel(frames),last=data.rows.length-1;
 const desc=data.moves.map(m=>
  "Voix "+(m.voice+1)+" : "+m.from.label+" → "+m.to.label+", "+movement(m)).join("; ");
 let svg='<div class="viz viz-aligned lab-voice-paths" style="--path-height:'+data.height+'px">'+
  '<svg xmlns="http://www.w3.org/2000/svg" width="'+data.width+'" height="'+data.height+
  '" viewBox="0 0 '+data.width+' '+data.height+'" role="img" aria-label="'+esc(
   "Trajets de tes "+frames.length+" accords sur les vraies touches du piano. "+desc
  )+'">';
 for(const k of PIANO_KEYS.filter(k=>!k.black))
  svg+='<line class="lab-path-guide" x1="'+k.center+'" x2="'+k.center+'" y1="30" y2="'+(data.height-22)+'"/>';
 for(const row of data.rows){
  const y=top+row.row*stepY;
  svg+='<rect class="lab-path-row" x="0" y="'+(y-23)+'" width="'+data.width+'" height="46" rx="10"/>'+
   '<text class="lab-path-chord" x="8" y="'+(y-31)+'">'+esc(row.symbol)+
   (row.correct?' · juste':' · à revoir')+'</text>';
 }
 for(const m of data.moves){
  const x0=m.from.x,x1=m.to.x,y0=m.from.y,y1=m.to.y;
  const bend=(y1-y0)*.40,color=voiceColors[m.voice];
  svg+='<path class="lab-path-line '+(m.held?'lab-path-held':'')+
   '" data-voice="'+(m.voice+1)+'" data-from="'+m.from.midi+'" data-to="'+m.to.midi+
   '" data-motion="'+m.semitones+'" stroke="'+color+'" d="M '+x0+' '+y0+
   ' C '+x0+' '+(y0+bend)+' '+x1+' '+(y1-bend)+' '+x1+' '+y1+'"/>';
 }
 for(const row of data.rows)for(const note of row.notes){
  svg+='<circle class="lab-path-node" data-note="'+note.midi+'" data-voice="'+(note.voice+1)+
   '" cx="'+note.x+'" cy="'+note.y+'" r="13" fill="'+voiceColors[note.voice]+'"/>'+
   '<text class="lab-path-number" x="'+note.x+'" y="'+(note.y+4)+
   '" text-anchor="middle">'+(note.voice+1)+'</text>';
 }
 svg+='</svg></div>';
 // Written register-by-register summary makes motion accessible without relying on colors.
 const entries=data.moves.filter(m=>m.row===last-1);
 const legend='<div class="lab-path-description"><p class="subtle">Les quatre couleurs désignent les rangs de notes du grave vers l’aigu, <strong>pas les doigts</strong>. Les trajectoires montrent ton jeu réel, même si un accord est faux ; elles ne dévoilent aucune réponse avant validation.</p>'+
  '<ol>'+entries.map(m=>'<li><span class="lab-path-swatch" style="--path-color:'+
   voiceColors[m.voice]+'"></span><strong>Voix '+(m.voice+1)+'</strong> : '+esc(m.from.label)+
   ' → '+esc(m.to.label)+' — '+movement(m)+'</li>').join("")+'</ol></div>';
 return svg+legend;
}
