import {secondary,names} from "./music.js";
import {evaluateVoicing,makeVoicingProgression,analyzeMotion,midiLabel} from "./voicing.js";
import {diagram,voiceColors,frameCenter,movementSummary} from "./voices.js?v=3";

export function createVoicingUI({app,shell,piano,play,escapeText,button}){
 let question=0,step=0,answers=[[],[],[]],revealed=false,display="mine",scrollPos=null;
 function start(index=0){question=index;step=0;answers=[[],[],[]];revealed=false;display="mine";scrollPos=null;render()}
 function saveScore(data){
  try{
   const key="harmonie-voicing-results-v1";
   const a=JSON.parse(localStorage.getItem(key)||"[]");
   const list=Array.isArray(a)?a:[];
   list.push(data);localStorage.setItem(key,JSON.stringify(list.slice(-100)));
  }catch(e){/* local score storage optional */}
 }
 function nextQuestion(){start((question+1)%secondary.length)}
 function referenceLabel(frame,pc){
  const match=frame.voices.find(v=>v.midi%12===pc);
  return match?match.note.replace(/-?\d+$/,""):names[pc];
 }
 function render(){
  const q=secondary[question],frames=q.progression.frames;
  const frame=frames[step],chosen=new Set(answers[step]);
  let body='<section class="card"><div class="row between"><span class="badge">Mes voicings · cadence '+(question+1)+'/'+secondary.length+'</span><span class="subtle">Sans QCM · 3 accords</span></div>'+
   '<div class="eyebrow" style="margin-top:20px">Destination : '+escapeText(q.target)+'</div>'+
   '<h2>Construis tes propres voicings</h2><p class="muted">Les accords sont indiqués pour travailler leur construction. Choisis quatre hauteurs sur le clavier, librement dans les octaves proposées. Tu verras la correction après les trois accords, sans être obligé de copier le renversement de l’exemple.</p>';
  if(!revealed){
   body+='<div class="timeline">'+frames.map((f,i)=>'<button data-v-step="'+i+'" class="btn '+(i===step?'active':'')+'">'+(i+1)+'. '+escapeText(f.symbol)+(answers[i].length===4?' ✓':'')+'</button>').join("")+'</div>'+
    '<div class="row between"><div><p class="eyebrow">Accord '+(step+1)+' / 3</p><div class="symbol">'+escapeText(frame.symbol)+'</div></div><span class="badge">'+chosen.size+' / 4 notes</span></div>'+
    '<p class="muted">Ton jeu : <b>'+(chosen.size?[...chosen].sort((a,b)=>a-b).map(midiLabel).join(' · '):'Aucune note sélectionnée')+'</b></p>'+
    piano(chosen,[],true,[],false,-1,"midi")+
    '<p class="subtle">Toucher une note permet de l’ajouter ou l’enlever. Les octaves sont conservées : C3 et C4 sont deux touches différentes.</p>'+
    '<div class="row">'+button("Effacer","eraseVoicing","quiet",chosen.size===0)+button("Écouter mon accord","listenVoicing","quiet",chosen.size===0)+'</div>'+
    '<div class="row between" style="margin-top:18px">'+button("← Précédent","prevVoicing","quiet",step===0)+button(step===2?"Corriger mes trois accords":"Accord suivant →","nextVoicing","primary",chosen.size!==4)+'</div>';
  }else{
   const grades=frames.map((f,i)=>evaluateVoicing(f.symbol,answers[i]));
   const correct=grades.filter(g=>g.correct).length;
   const mine=makeVoicingProgression(q,answers);
   const progress=display==="mine"?mine:q.progression;
   const active=progress.frames[step];
   const motion=analyzeMotion(progress);
   body+='<div class="feedback '+(correct===3?'correct':'')+'" role="status"><strong>'+correct+' / 3 accords exacts</strong><p>Les renversements et changements d’octave sont acceptés. Les accords sont vérifiés sur leurs quatre notes constitutives, puis le mouvement des voix est analysé à part.</p></div>'+
    '<div class="voicing-corrections">'+frames.map((fr,i)=>{
     const g=grades[i],notes=[...answers[i]].sort((a,b)=>a-b).map(midiLabel).join(' · ');
     const missing=g.missing.map(pc=>referenceLabel(fr,pc)).join(', ');
     const extra=g.extra.map(pc=>names[pc]).join(', ');
     return '<div class="voicing-check '+(g.correct?'passed':'failed')+'"><strong>'+(g.correct?'✓ ':'À revoir : ')+escapeText(fr.symbol)+'</strong>'+
      '<p>Ton accord : '+escapeText(notes)+'</p>'+
      (g.correct?'<p>Quatre notes correctes, indépendamment du registre.</p>':'<p>'+(missing?'Manquantes : '+escapeText(missing)+'. ':'')+(extra?'En trop : '+escapeText(extra)+'. ':'')+(g.duplicateCount?'Une note a été doublée dans une autre octave.':'')+'</p>')+
      '<p class="subtle">Exemple valide : '+escapeText(fr.voices.map(v=>v.note).join(' · '))+'</p></div>';
    }).join('')+'</div>'+
    '<h3>Comparer les glissements</h3><div class="row">'+button("Mon voicing","mineVoicings",display==="mine"?"primary":"quiet")+button("Exemple corrigé","referenceVoicings",display==="reference"?"primary":"quiet")+button("Écouter","playVoicing","quiet")+'</div>'+
    '<div class="timeline">'+frames.map((fr,i)=>'<button data-v-step="'+i+'" class="btn '+(i===step?'active':'')+'">'+(i+1)+'. '+escapeText(fr.symbol)+'</button>').join("")+'</div>'+
    '<p class="muted">'+(display==="mine"?'Ton propre voicing est représenté, même si une note est incorrecte. Les voix sont numérotées du grave vers l’aigu à chaque accord.':'Voici un exemple de conduite de voix, mais d’autres répartitions peuvent être parfaitement correctes.')+'</p>'+
    '<div class="piano-scroll aligned-scroll" role="region" tabindex="0" aria-label="Voicings et clavier synchronisés"><div class="aligned-lesson">'+diagram(progress,step,-1)+
    piano(new Set(),active.voices.map(v=>v.midi),false,active.voices,true,-1,"pitchClass",voiceColors)+
    '</div></div>'+
    '<p class="subtle">Les couleurs et numéros correspondent exactement entre les boules, les courbes et les touches. Fais défiler cet ensemble horizontalement sur iPhone.</p>'+
    '<p class="explain">Mouvement total : <b>'+motion.total+' demi-tons</b> sur huit déplacements ; '+motion.stationary+' voix immobiles sur une transition.'+
    (motion.large?' '+motion.large+' saut(s) dépassent sept demi-tons : essaie aussi des renversements plus proches.':'')+
    ' Le mouvement ne fait pas perdre de points à un accord juste.</p>'+
    '<div class="row">'+button("Rejouer cette cadence","retryVoicing","quiet")+button(question===secondary.length-1?"Recommencer le parcours":"Cadence suivante →","nextVoicingQuestion","primary")+'</div>';
  }
  body+='</section>';
  shell(body);
  const scroll=app.querySelector(".piano-scroll");
  if(scroll){
   if(scrollPos===null&&revealed)scroll.scrollLeft=Math.max(0,frameCenter(display==="mine"?makeVoicingProgression(q,answers):q.progression,step)+12-scroll.clientWidth/2);
   else if(scrollPos!==null)scroll.scrollLeft=scrollPos;
   scroll.addEventListener("scroll",()=>{scrollPos=scroll.scrollLeft},{passive:true});
  }
  app.querySelectorAll("[data-v-step]").forEach(b=>b.onclick=()=>{step=Number(b.dataset.vStep);if(revealed)scrollPos=null;render()});
  if(!revealed){
   app.querySelectorAll("[data-midi]").forEach(b=>b.onclick=()=>{
    const n=Number(b.dataset.midi),arr=answers[step];scrollPos=scroll?.scrollLeft||0;
    const pos=arr.indexOf(n);
    if(pos!==-1)arr.splice(pos,1);
    else if(arr.length<4)arr.push(n);
    render();
   });
   document.getElementById("eraseVoicing").onclick=()=>{answers[step]=[];render()};
   document.getElementById("listenVoicing").onclick=()=>play(answers[step]);
   document.getElementById("prevVoicing").onclick=()=>{if(step>0){step--;render()}};
   document.getElementById("nextVoicing").onclick=()=>{
    if(answers[step].length!==4)return;
    if(step<2){step++;render();return}
    if(answers.some(a=>a.length!==4))return;
    const grades=frames.map((f,i)=>evaluateVoicing(f.symbol,answers[i]));
    saveScore({id:q.id,correct:grades.filter(g=>g.correct).length,at:new Date().toISOString()});
    revealed=true;display="mine";step=0;scrollPos=null;render();
   };
  }else{
   document.getElementById("mineVoicings").onclick=()=>{display="mine";scrollPos=null;render()};
   document.getElementById("referenceVoicings").onclick=()=>{display="reference";scrollPos=null;render()};
   document.getElementById("playVoicing").onclick=()=>{
    const p=display==="mine"?makeVoicingProgression(q,answers):q.progression;
    play(p.frames[step].voices.map(v=>v.midi));
   };
   document.getElementById("retryVoicing").onclick=()=>start(question);
   document.getElementById("nextVoicingQuestion").onclick=nextQuestion;
  }
 }
 return {start,render};
}
