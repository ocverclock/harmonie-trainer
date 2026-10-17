export const voiceColors=["#3b82f6","#22a06b","#e7a61e","#9654d7"];
export function movementSummary(progress,frame){
 if(frame===0)return "Observe les quatre notes de départ. Avance d’un accord pour voir quelles voix restent immobiles et lesquelles se déplacent.";
 const a=progress.frames[frame-1],b=progress.frames[frame];
 return a.voices.map(function(v,i){
  const next=b.voices[i],difference=next.midi-v.midi;
  return "Voix "+(i+1)+" : "+v.note+" → "+next.note+" ("+(difference===0?"note commune":difference>0?"+"+difference+" demi-ton"+(difference>1?"s":""):difference+" demi-ton"+(difference < -1?"s":""))+")";
 }).join(" · ");
}
export function diagram(progress,active,solo,width){
 const compact=width<600,medium=width<1000;
 let visible;
 if(compact)visible=active<progress.frames.length-1?[active,active+1]:[active-1,active];
 else if(medium)visible=active<progress.frames.length-1?[active,active+1]:[active-1,active];
 else visible=progress.frames.map(function(f,i){return i});
 const W=compact?620:920,H=282;
 const xs=visible.length===2?[W*.25,W*.75]:visible.length===1?[W*.5]:[W*.16,W*.5,W*.84];
 const Y=function(midi){return 252-(midi-48)*8.1};
 let svg='<div class="viz"><svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Conduite des voix pour '+progress.title+'">';
 for(let midi of [52,55,59,62,65,69,72]) svg+='<path class="guide" d="M 35 '+Y(midi)+' H '+(W-35)+'"/>';
 visible.forEach(function(frameIndex,i){
  let x=xs[i],frame=progress.frames[frameIndex];
  svg+='<rect x="'+(x-75)+'" y="43" width="150" height="202" rx="18" fill="'+(frameIndex===active?'#dceafe':'#ffffff88')+'"/>';
  svg+='<text class="title" x="'+x+'" y="27" text-anchor="middle">'+frame.symbol+'</text>';
 });
 for(let voice=0;voice<4;voice++){
  if(solo!==-1&&solo!==voice)continue;
  const col=voiceColors[voice];
  for(let k=0;k<visible.length-1;k++){
   if(visible[k+1]!==visible[k]+1)continue;
   const a=progress.frames[visible[k]].voices[voice],b=progress.frames[visible[k+1]].voices[voice];
   const x0=xs[k],x1=xs[k+1],y0=Y(a.midi),y1=Y(b.midi),diff=x1-x0;
   svg+='<path class="path" stroke="'+col+'" d="M '+x0+' '+y0+' C '+(x0+diff*.34)+' '+y0+', '+(x0+diff*.66)+' '+y1+', '+x1+' '+y1+'"/>';
  }
  visible.forEach(function(frameIndex,k){
   const v=progress.frames[frameIndex].voices[voice],x=xs[k],y=Y(v.midi);
   svg+='<circle class="voice" cx="'+x+'" cy="'+y+'" r="15" fill="'+col+'"/>';
   svg+='<text class="pitch" x="'+(x+20)+'" y="'+(y+5)+'">'+v.note+'</text>';
  });
 }
 return svg+'</svg></div>';
}
