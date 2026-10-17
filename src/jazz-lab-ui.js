import {voiceStudies,earQuestion,studioStudies,checkStudioChoice,checkJazzChord,
 analyzeVoiceLeading,closestValidVoicing,skillRecommendations,lessonGoals,motionSentence} from "./jazz-lab.js";
import {lessons} from "./curriculum.js";
import {readArchive,storeArchive,withAttempt,progressByExercise} from "./progress-store.js";
import {midiLabel} from "./voicing.js";
import {previousVoicingNotes} from "./practice-random.js";
import {noteX} from "./piano-layout.js";

export function createJazzLabUI({app,shell,piano,play,escapeText,button,isActive}){
 const e=escapeText;
 let mode="home",voiceStudyIndex=0,step=0,voiceAnswers=[[],[],[]],voiceGrades=[null,null,null],
     earIndex=0,earAnswer=null,studioIndex=0,studioAnswer=null,scrollPos=null,notice="";
 const archive=()=>{try{return readArchive(localStorage,lessons)}catch(error){notice="Suivi indisponible : "+error.message;return null}};
 function save(type,id,tonality,notes,correct){
  try{
   const state=archive();if(!state)return;
   const item={id:"jazzlab:"+type+":"+id,tonality};
   const next=withAttempt(state,{id:"jazzlab",exercises:[item]},0,notes,correct);
   storeArchive(localStorage,next);
  }catch(error){notice="Attention : ce résultat n’a pas été sauvegardé. "+error.message}
 }
 function heading(subtitle,title,intro){
  return '<section class="card lab-panel"><div class="row between"><span class="badge">Atelier jazz · '+e(subtitle)+'</span>'+
  button("Retour aux ateliers","labHome","quiet")+'</div><h1>'+e(title)+'</h1><p class="muted">'+e(intro)+'</p>';
 }
 function linkHome(){const el=document.getElementById("labHome");if(el)el.onclick=()=>start("home")}
 function chooseStudy(index){voiceStudyIndex=(index+voiceStudies.length)%voiceStudies.length;step=0;voiceAnswers=[[],[],[]];voiceGrades=[null,null,null];scrollPos=null;mode="voice";render()}
 function chooseEar(index){earIndex=Math.max(0,index);earAnswer=null;mode="ear";render()}
 function chooseStudio(index){studioIndex=(index+studioStudies.length)%studioStudies.length;studioAnswer=null;mode="studio";render()}
 function start(next="home"){
  mode=next;notice="";
  if(next==="voice"){chooseStudy(voiceStudyIndex);return}
  if(next==="ear"){chooseEar(earIndex);return}
  if(next==="studio"){chooseStudio(studioIndex);return}
  render();
 }
 function playSequence(sequence){
  sequence.forEach((notes,i)=>{
   if(i===0)play(notes);
   else setTimeout(()=>{if(isActive())play(notes)},i*940);
  });
 }
 function readStats(){
  const state=archive();if(!state)return {events:[],wrong:[]};
  const events=state.events.filter(x=>x.exerciseId.startsWith("jazzlab:"));
  return {events,wrong:skillRecommendations(state,5)};
 }
 function showHome(){
  const stats=readStats();
  let body='<section class="card"><div class="eyebrow">École Ocverclock · mise en pratique</div>'+
   '<h1>Atelier de jazz moderne</h1><p class="muted">Trois manières complémentaires d’apprendre : construire des cadences, reconnaître leurs couleurs à l’oreille et choisir une harmonisation fonctionnelle.</p>'+
   '<p class="lab-stat"><strong>'+stats.events.length+'</strong> tentatives enregistrées · <strong>'+stats.events.filter(x=>x.correct).length+'</strong> réussies</p>'+
   (notice?'<p role="alert" class="feedback">'+e(notice)+'</p>':'')+
   '<div class="lab-grid">'+[
    {id:"voice",title:"Conduite des voix",desc:lessonGoals.voicing},
    {id:"ear",title:"Éducation de l’oreille",desc:lessonGoals.ear},
    {id:"studio",title:"Réarmoniser une phrase",desc:lessonGoals.studio}
   ].map(item=>'<button class="lab-tile" data-lab-mode="'+item.id+'"><strong>'+e(item.title)+'</strong><span>'+e(item.desc)+'</span></button>').join("")+'</div></section>';
  if(stats.wrong.length){
   body+='<section class="card"><h2>À retravailler</h2><p class="muted">Ces exercices n’étaient pas corrects lors de ta dernière tentative. Un ancien succès reste enregistré : il n’est pas effacé.</p>'+
   '<div class="row">'+stats.wrong.map(item=>'<button class="btn quiet" data-retry="'+e(item.exerciseId)+'">'+
    e(item.exerciseId.replace("jazzlab:","").replaceAll(":"," · "))+'</button>').join("")+'</div></section>';
  }
  shell(body);
  app.querySelectorAll("[data-lab-mode]").forEach(b=>b.onclick=()=>start(b.dataset.labMode));
  app.querySelectorAll("[data-retry]").forEach(b=>b.onclick=()=>{
   const id=b.dataset.retry;
   if(id.startsWith("jazzlab:ear:ear-"))chooseEar(Number(id.slice("jazzlab:ear:ear-".length)));
   else if(id.startsWith("jazzlab:studio:"))chooseStudio(studioStudies.findIndex(s=>s.id===id.slice("jazzlab:studio:".length)));
   else if(id.startsWith("jazzlab:voice:")){
    const found=voiceStudies.findIndex(s=>id.startsWith("jazzlab:voice:"+s.id+":"));
    if(found>=0)chooseStudy(found);
   }
  });
 }
 function currentVoice(){
  const study=voiceStudies[voiceStudyIndex],frame=study.frames[step];
  const selected=new Set(voiceAnswers[step]),previous=previousVoicingNotes(voiceAnswers,step),grade=voiceGrades[step];
  const motion=grade&&previous.length===4?analyzeVoiceLeading(previous,voiceAnswers[step]):null;
  const suggestion=grade&&previous.length===4?closestValidVoicing(frame.symbol,previous):null;
  const last=step===2;
  let body=heading("Conduite des voix",study.title,
   "Construis les trois accords en gardant à l’esprit les déplacements depuis le précédent. Les anneaux en pointillés rappellent tes propres notes, pas la réponse.");
  body+='<div class="lab-steps">'+study.frames.map((f,i)=>'<button class="btn '+(step===i?"active":"quiet")+'" data-step="'+i+'">'+(i+1)+'. '+e(f.symbol)+(voiceGrades[i]?.correct?" ✓":"")+'</button>').join("")+'</div>'+
   '<div class="row between"><div><p class="eyebrow">Accord '+(step+1)+' / 3 · '+e(study.tonality)+'</p>'+
   '<div class="symbol lab-symbol">'+e(frame.symbol)+'</div></div>'+
   '<span class="badge">'+selected.size+' / 4 notes</span></div>'+
   '<p class="muted">La justesse des notes et la fluidité des voix sont évaluées séparément. Aucun renversement unique n’est obligatoire.</p>'+
   '<p>Ton accord : <strong>'+(selected.size?[...selected].sort((a,b)=>a-b).map(midiLabel).join(" · "):"aucune note sélectionnée")+'</strong></p>'+
   piano(selected,[],true,[],false,-1,"midi")+
   (previous.length?'<p class="previous-voicing-legend"> <span class="previous-voicing-symbol" aria-hidden="true"></span>'+
     'Notes du voicing précédent : '+previous.map(midiLabel).join(" · ")+'. Cherche les notes communes et les petits mouvements.</p>':'<p class="subtle">Premier accord : choisis quatre hauteurs. Les notes seront mémorisées visuellement pour le suivant.</p>')+
   '<div class="row">'+button("Effacer","labClear","quiet",!!grade||!selected.size)+
   button("Écouter mon accord","labHear","quiet",!selected.size)+
   button("Vérifier l’accord","labCheck","primary",!!grade||selected.size!==4)+'</div>';
  if(grade){
   const wrong=grade.extra.map(pc=>["Do","Ré♭","Ré","Mi♭","Mi","Fa","Fa♯","Sol","La♭","La","Si♭","Si"][pc]);
   const missing=grade.missing.map(pc=>["Do","Ré♭","Ré","Mi♭","Mi","Fa","Fa♯","Sol","La♭","La","Si♭","Si"][pc]);
   body+='<section class="feedback '+(grade.correct?"correct":"")+'" role="status"><h3>'+
    (grade.correct?"Accord juste.":"Accord à corriger.")+'</h3>'+
    (grade.correct?'<p>Les quatre classes de hauteurs sont présentes, indépendamment du renversement.</p>':
      '<p>'+(missing.length?'Manquantes : '+e(missing.join(", "))+'. ':'')+
      (wrong.length?'En trop : '+e(wrong.join(", "))+'. ':'')+
      (grade.duplicateCount?'Une note est doublée dans une autre octave.':'')+'</p>')+
    (motion?'<p><strong>Conduite des voix :</strong> '+motion.total+' demi-tons de déplacement au total, '+motion.held+' voix immobiles, '+motion.semitone+' déplacements d’un demi-ton et '+motion.leaps+' grands sauts.</p>'+
     '<p class="subtle">'+e(motionSentence(motion))+'</p>'+
     '<p><strong>Comparaison :</strong> une disposition proposée de '+e(frame.symbol)+' se déplace de '+suggestion.motion.total+' demi-tons depuis ton accord précédent.'+
     (suggestion.motion.total<motion.total?' Tu peux essayer de limiter les sauts, sans que ton accord soit considéré faux.':' Ta disposition est déjà aussi économe selon cette comparaison des voix grave–aigu.')+'</p>'+
     '<div class="row">'+button("Écouter une disposition proche","labSuggestion","quiet")+'</div>':
      '<p>Pour le premier accord, écoute son timbre et choisis un registre confortable. La comparaison commencera avec le suivant.</p>')+
    '<div class="row">'+button("Réessayer ce voicing","labRetry","quiet")+
    button(last?"Voir le bilan des 3 accords":"Construire l’accord suivant →","labNext","primary")+'</div></section>';
  }
  if(voiceGrades.every(Boolean)){
   body+='<div class="explain" role="status"><h3>Bilan de la cadence</h3>'+
    '<p>'+voiceGrades.filter(g=>g.correct).length+' / 3 accords justes. Les déplacements et leurs corrections sont détaillés à chaque étape.</p>'+
    '<div class="row">'+button("Écouter les trois accords saisis","labHearAll","quiet")+
    button("Autre cadence","labNextStudy","primary")+'</div></div>';
  }
  body+='</section>';shell(body);linkHome();
  const scroll=app.querySelector(".piano-scroll");
  if(scroll){
   if(scrollPos!==null)scroll.scrollLeft=scrollPos;
   else if(previous.length)scroll.scrollLeft=Math.max(0, (noteX(previous[0])+noteX(previous[3]))/2-scroll.clientWidth/2);
   scroll.addEventListener("scroll",()=>scrollPos=scroll.scrollLeft,{passive:true});
  }
  for(const midi of previous){
   const key=app.querySelector('.pianoKey[data-midi="'+midi+'"]');if(!key)continue;
   key.classList.add("previous-voicing");
   key.setAttribute("aria-label",(key.getAttribute("aria-label")||"")+" — touchée à l’accord précédent");
   key.title="Accord précédent : "+midiLabel(midi);
  }
  app.querySelectorAll("[data-step]").forEach(b=>b.onclick=()=>{step=Number(b.dataset.step);scrollPos=null;render()});
  if(!grade){
   app.querySelectorAll("[data-midi]").forEach(b=>b.onclick=()=>{
    const m=Number(b.dataset.midi),arr=voiceAnswers[step],position=arr.indexOf(m);
    scrollPos=scroll?.scrollLeft||0;
    if(position!==-1)arr.splice(position,1);else if(arr.length<4)arr.push(m);
    render();
   });
   document.getElementById("labClear").onclick=()=>{voiceAnswers[step]=[];render()};
   document.getElementById("labHear").onclick=()=>play(voiceAnswers[step]);
   document.getElementById("labCheck").onclick=()=>{
    if(voiceAnswers[step].length!==4)return;
    voiceGrades[step]=checkJazzChord(frame.symbol,voiceAnswers[step]);
    save("voice",study.id+":"+step,study.tonality,voiceAnswers[step],voiceGrades[step].correct);
    render();
   };
  }else{
   document.getElementById("labSuggestion")?.addEventListener("click",()=>play(suggestion.midis));
   document.getElementById("labRetry").onclick=()=>{voiceGrades[step]=null;render()};
   document.getElementById("labNext").onclick=()=>{
    if(!last){step++;scrollPos=null;render()}
    else{step=2;render();const x=document.querySelector(".explain[role='status']");x?.scrollIntoView({block:"nearest",behavior:"smooth"})}
   };
  }
  if(voiceGrades.every(Boolean)){
   document.getElementById("labHearAll").onclick=()=>playSequence(voiceAnswers);
   document.getElementById("labNextStudy").onclick=()=>chooseStudy(voiceStudyIndex+1);
  }
 }
 function showEar(){
  const exercise=earQuestion(earIndex);
  let body=heading("Écoute", "Reconnaître une couleur sans voir les notes",
   "Écoute d’abord, puis choisis la qualité de l’accord. La fondamentale change entre les questions : concentre-toi sur la tierce, la septième et la quinte.");
  body+='<p class="eyebrow">Question '+(earIndex+1)+' · tonalité de départ : '+e(exercise.tonality)+'</p>'+
   '<div class="row">'+button("Écouter l’accord","earPlay","primary")+
   button("Réécouter","earAgain","quiet")+'</div>'+
   '<fieldset class="lab-options"><legend>Quelle couleur entends-tu ?</legend>'+
   exercise.choices.map(option=>'<button class="lab-option '+(earAnswer===option.id?"picked":"")+
     '" data-ear="'+option.id+'" '+(earAnswer!==null?"disabled":"")+'>'+e(option.label)+'</button>').join("")+
   '</fieldset>';
  if(earAnswer!==null){
   const correct=earAnswer===exercise.quality;
   body+='<div class="feedback '+(correct?"correct":"")+'" role="status"><h3>'+
    (correct?"Tu as reconnu la couleur.":"Écoute la couleur correcte.")+'</h3>'+
    '<p>Réponse : <strong>'+e(exercise.answer)+'</strong>. '+e(exercise.why)+'</p>'+
    '<p>Notes jouées : '+exercise.midis.map(midiLabel).join(" · ")+'.</p>'+
    '<div class="row">'+button("Écouter encore","earReview","quiet")+
    button("Question suivante →","earNext","primary")+'</div></div>';
  }
  body+='</section>';shell(body);linkHome();
  document.getElementById("earPlay").onclick=()=>play(exercise.midis);
  document.getElementById("earAgain").onclick=()=>play(exercise.midis);
  if(earAnswer===null)app.querySelectorAll("[data-ear]").forEach(b=>b.onclick=()=>{
   earAnswer=b.dataset.ear;
   save("ear",exercise.id,exercise.tonality,exercise.midis,earAnswer===exercise.quality);
   render();
  });
  else{
   document.getElementById("earReview").onclick=()=>play(exercise.midis);
   document.getElementById("earNext").onclick=()=>chooseEar(earIndex+1);
  }
 }
 function showStudio(){
  const study=studioStudies[studioIndex],choice=studioAnswer===null?null:checkStudioChoice(study,studioAnswer);
  let body=heading("Réarmonisation",study.title,
   "Complète une progression originale de trois accords. Plusieurs réponses peuvent être musicalement justes : la correction explique leur fonction.");
  body+='<div class="lab-studio-line"><div><small>Départ</small><strong>'+e(study.before.symbol)+'</strong></div>'+
   '<span aria-hidden="true">→</span><div><small>À choisir</small><strong>?</strong></div><span aria-hidden="true">→</span>'+
   '<div><small>Destination</small><strong>'+e(study.target.symbol)+'</strong></div></div>'+
   '<p class="muted">Destination : '+e(study.tonality)+'. Cherche une dominante ou une substitution cohérente avec le mouvement vers la tonique.</p>'+
   '<fieldset class="lab-options"><legend>Quel accord place-tu entre les deux ?</legend>'+
   study.options.map((opt,i)=>'<button class="lab-option '+(i===studioAnswer?"picked":"")+
    '" data-studio="'+i+'" '+(studioAnswer!==null?"disabled":"")+'>'+e(opt.symbol)+'</button>').join("")+'</fieldset>';
  if(choice){
   const opt=choice.option;
   body+='<div class="feedback '+(choice.correct?"correct":"")+'" role="status"><h3>'+
    (choice.correct?"Ce choix fonctionne.":"Ce choix ne correspond pas à la fonction recherchée.")+'</h3>'+
    '<p>'+e(choice.why)+'</p>'+
    '<p class="subtle">Un accord théoriquement différent peut conduire à la même destination : compare sa couleur et sa basse, pas seulement ses notes.</p>'+
    '<div class="row">'+button("Écouter mon harmonisation","studioHear","quiet")+
    button("Comparer les autres solutions","studioAlternatives","quiet")+
    button("Autre phrase →","studioNext","primary")+'</div></div>';
  }
  body+='</section>';shell(body);linkHome();
  if(!choice)app.querySelectorAll("[data-studio]").forEach(b=>b.onclick=()=>{
   studioAnswer=Number(b.dataset.studio);
   const verdict=checkStudioChoice(study,studioAnswer);
   save("studio",study.id,study.tonality,verdict.option.midis,verdict.correct);
   render();
  });
  else{
   document.getElementById("studioHear").onclick=()=>playSequence([study.before.midis,choice.option.midis,study.target.midis]);
   document.getElementById("studioAlternatives").onclick=()=>{
    const other=study.options.find(x=>x.valid&&x!==choice.option);
    if(other){playSequence([study.before.midis,other.midis,study.target.midis]);
     notice="Autre solution valide : "+other.symbol+" — "+other.why;
     const status=app.querySelector(".feedback");if(status){
      const p=document.createElement("p");p.textContent=notice;status.appendChild(p);
     }
    }
   };
   document.getElementById("studioNext").onclick=()=>chooseStudio(studioIndex+1);
  }
 }
 function render(){if(mode==="voice")currentVoice();else if(mode==="ear")showEar();else if(mode==="studio")showStudio();else showHome()}
 return {start,render};
}
