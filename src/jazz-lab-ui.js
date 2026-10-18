import {voiceStudies,earQuestion,studioStudies,checkStudioChoice,checkJazzChord,
 analyzeVoiceLeading,closestValidVoicing,skillRecommendations,lessonGoals,motionSentence,earMastery,nextEarReview} from "./jazz-lab.js";
import {lessons} from "./curriculum.js";
import {readArchive,storeArchive,withAttempt,progressByExercise} from "./progress-store.js";
import {midiLabel} from "./voicing.js";
import {previousVoicingNotes} from "./practice-random.js";
import {noteX} from "./piano-layout.js";
import {guideToneStudies,checkGuideTone,describeSemitones,guideToneSummary} from "./guide-tones.js";
import {assessVoicingTransition,describeVoicingTransition} from "./voice-leading-feedback.js";

export function createJazzLabUI({app,shell,piano,play,escapeText,button,isActive}){
 const e=escapeText;
 let mode="home",voiceStudyIndex=0,step=0,voiceAnswers=[[],[],[]],voiceGrades=[null,null,null],
     earIndex=0,earAnswer=null,studioIndex=0,studioAnswer=null,guideStudyIndex=0,guideStep=0,guideSelected=null,
     guideResults=[null,null,null,null],scrollPos=null,notice="";
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
 function chooseGuides(index=0){guideStudyIndex=(index+guideToneStudies.length)%guideToneStudies.length;
  guideStep=0;guideSelected=null;guideResults=[null,null,null,null];mode="guides";render()}
 function chooseStudio(index){studioIndex=(index+studioStudies.length)%studioStudies.length;studioAnswer=null;mode="studio";render()}
 function start(next="home"){
  mode=next;notice="";
  if(next==="voice"){chooseStudy(voiceStudyIndex);return}
  if(next==="ear"){chooseEar(earIndex);return}
  if(next==="guides"){chooseGuides(guideStudyIndex);return}
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
  const state=archive();if(!state)return {events:[],wrong:[],ear:[]};
  const events=state.events.filter(x=>x.exerciseId.startsWith("jazzlab:"));
  return {events,wrong:skillRecommendations(state,5),ear:earMastery(state)};
 }
 function showHome(){
  const stats=readStats();
  let body='<section class="card"><div class="eyebrow">École Ocverclock · mise en pratique</div>'+
   '<h1>Atelier de jazz moderne</h1><p class="muted">Quatre manières complémentaires d’apprendre : construire des cadences, suivre les notes-guides, reconnaître les accords à l’oreille et harmoniser.</p>'+
   '<p class="lab-stat"><strong>'+stats.events.length+'</strong> tentatives enregistrées · <strong>'+stats.events.filter(x=>x.correct).length+'</strong> réussies</p>'+
   (notice?'<p role="alert" class="feedback">'+e(notice)+'</p>':'')+
   '<div class="lab-grid">'+[
    {id:"voice",title:"Conduite des voix",desc:lessonGoals.voicing},
    {id:"guides",title:"Notes-guides II–V–I",desc:"Résoudre les tierces et septièmes sur le clavier, dans les cadences majeures et mineures."},
    {id:"ear",title:"Éducation de l’oreille",desc:lessonGoals.ear},
    {id:"studio",title:"Réarmoniser une phrase",desc:lessonGoals.studio}
   ].map(item=>'<button class="lab-tile" data-lab-mode="'+item.id+'"><strong>'+e(item.title)+'</strong><span>'+e(item.desc)+'</span></button>').join("")+'</div>'+
   '<section class="lab-mastery"><h2>Écoute : maîtrise des cinq couleurs</h2>'+
   '<p class="muted">Une couleur devient acquise après deux réussites dans deux tonalités différentes. Une erreur récente déclenche une révision.</p>'+
   '<div class="lab-master-grid">'+stats.ear.map(g=>
     '<div class="lab-master-item"><strong>'+e(g.label)+'</strong>'+
     '<span>'+g.successes+' réussite(s) · '+g.tonalities.length+' tonalité(s) · '+
     (g.mastered?'acquis':g.needsReview?'à revoir':g.due?'à pratiquer':'révision plus tard')+'</span></div>'
   ).join("")+'</div>'+
   '<div class="row">'+button("Entraînement de l’oreille adapté à mon niveau","labTargetEar","primary")+'</div></section>'+
   '</section>';
  if(stats.wrong.length){
   body+='<section class="card"><h2>À retravailler</h2><p class="muted">Ces exercices n’étaient pas corrects lors de ta dernière tentative. Un ancien succès reste enregistré : il n’est pas effacé.</p>'+
   '<div class="row">'+stats.wrong.map(item=>'<button class="btn quiet" data-retry="'+e(item.exerciseId)+'">'+
    e(item.exerciseId.replace("jazzlab:","").replaceAll(":"," · "))+'</button>').join("")+'</div></section>';
  }
  shell(body);
  app.querySelectorAll("[data-lab-mode]").forEach(b=>b.onclick=()=>start(b.dataset.labMode));
  document.getElementById("labTargetEar").onclick=()=>chooseEar(nextEarReview(archive(),-1));
  app.querySelectorAll("[data-retry]").forEach(b=>b.onclick=()=>{
   const id=b.dataset.retry;
   if(id.startsWith("jazzlab:guides:")){
    const match=/^jazzlab:guides:(.+):(\d+)$/.exec(id);
    if(match){const index=guideToneStudies.findIndex(s=>s.id===match[1]);
     if(index>=0){chooseGuides(index);guideStep=Number(match[2]);render()}}
   }
   else if(id.startsWith("jazzlab:ear:ear-"))chooseEar(Number(id.slice("jazzlab:ear:ear-".length)));
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
  const assessment=grade&&previous.length===4?
   assessVoicingTransition(frame.symbol,previous,voiceAnswers[step],voiceGrades[step-1]?.correct===true):null;
  const motion=assessment?.motion||null;
  const guidance=assessment?describeVoicingTransition(assessment):null;
  const suggestion=assessment?.reference||null;
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
    (guidance?'<div class="lab-transition" aria-label="Analyse des déplacements"><h4>Notes communes et mouvements</h4>'+
     '<p>'+e(guidance.members)+' '+e(guidance.shared)+'</p>'+
     '<p>'+e(guidance.movement)+'</p>'+
     '<p class="subtle">'+e(motionSentence(motion))+'</p>'+
     '<p><strong>Conseil pédagogique :</strong> '+e(guidance.advice)+'</p>'+
     (guidance.comparison?'<p>'+e(guidance.comparison)+'</p><div class="row">'+
      button("Écouter une autre disposition juste","labSuggestion","quiet")+'</div>':'')+
     '<p class="subtle">Les voix sont rapprochées dans l’ordre grave → aigu ; les doigtés et croisements réels ne sont pas détectés.</p></div>':
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
   if(suggestion)document.getElementById("labSuggestion")?.addEventListener("click",()=>play(suggestion.midis));
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
 function showGuides(){
  const study=guideToneStudies[guideStudyIndex],exercise=study.exercises[guideStep];
  const response=guideResults[guideStep],chosen=new Set(guideSelected===null?[]:[guideSelected]);
  let body=heading("Notes-guides",study.title,
   "Dans les cadences II–V–I, suis la tierce et la septième d’un accord vers le suivant. Clique la touche de résolution dans l’octave indiquée par l’exemple.");
  body+='<div class="lab-steps" aria-label="Quatre déplacements de notes-guides">'+
    study.exercises.map((task,i)=>'<button class="btn '+(i===guideStep?'active':'quiet')+
     '" data-guide-step="'+i+'">'+(i+1)+'. '+e(task.description)+(guideResults[i]?.correct?' ✓':'')+'</button>').join("")+'</div>'+
   '<p class="eyebrow">'+e(study.tonality)+' · étape '+(guideStep+1)+' / 4</p>'+
   '<div class="lab-guide-route"><div><small>Accord de départ</small><strong>'+e(exercise.sourceSymbol)+'</strong>'+
   '<span>'+e(exercise.source.role)+' : '+e(exercise.source.name)+'</span></div>'+
   '<span aria-hidden="true">→</span>'+
   '<div><small>Accord d’arrivée</small><strong>'+e(exercise.targetSymbol)+'</strong>'+
   '<span>'+e(exercise.target.role)+' : ?</span></div></div>'+
   '<p><strong>À toi :</strong> trouve sur le clavier la '+e(exercise.target.role)+
   ' de '+e(exercise.targetSymbol)+' qui résout '+e(exercise.source.name)+
   '. La pastille en pointillés rappelle la note de départ ; la correction arrive après validation.</p>'+
   '<div class="lab-guide-keyboard">'+piano(chosen,[],true,[],false,-1,"midi")+'</div>'+
   '<p class="previous-voicing-legend"><span class="previous-voicing-symbol" aria-hidden="true"></span> Source : '+
   e(exercise.source.name)+' · Sélection : '+(guideSelected===null?'aucune':e(midiLabel(guideSelected)))+'</p>'+
   '<div class="row">'+button("Écouter la source","guideHearSource","quiet")+
   button("Valider ma résolution","guideCheck","primary",guideSelected===null||!!response)+'</div>';
  if(response){
   body+='<section class="feedback '+(response.correct?'correct':'')+'" role="status">'+
    '<h3>'+(response.correct?'Bonne résolution.':'Résolution à corriger.')+'</h3>'+
    '<p>'+e(response.explanation)+'</p>'+
    '<p><strong>'+e(exercise.source.name)+' → '+e(exercise.target.name)+'</strong> : '+
    e(describeSemitones(exercise.semitones))+'.</p>'+
    '<p class="subtle">La septième de dominante mène ici à la tierce de la tonique : compare les résolutions en majeur et en mineur.</p>'+
    '<div class="row">'+button("Écouter la bonne résolution","guideHearCorrect","quiet")+
    (!response.correct?button("Réessayer","guideRetry","quiet"):"")+
    button(guideStep===3?"Cadence suivante →":"Déplacement suivant →","guideNext","primary")+'</div></section>';
  }
  if(guideResults.every(Boolean)){
   const stats=guideToneSummary(study,guideResults);
   body+='<div class="explain" role="status"><h3>Bilan notes-guides</h3><p>'+
     stats.correct+' / '+stats.total+' résolutions réussies vers '+e(study.tonality)+
     '. Reviens sur une étape pour réécouter et comprendre chaque mouvement.</p></div>';
  }
  body+='</section>';shell(body);linkHome();
  const scroller=app.querySelector(".lab-guide-keyboard .piano-scroll");
  if(scroller){
   const midpoint=(noteX(exercise.source.midi)+noteX(exercise.target.midi))/2;
   scroller.scrollLeft=Math.max(0,midpoint-scroller.clientWidth/2);
  }
  const src=app.querySelector('.lab-guide-keyboard .pianoKey[data-midi="'+exercise.source.midi+'"]');
  if(src){
   src.classList.add("previous-voicing");
   src.setAttribute("aria-label",(src.getAttribute("aria-label")||"")+" — note-guide de départ");
  }
  if(response){
   const correctKey=app.querySelector('.lab-guide-keyboard .pianoKey[data-midi="'+exercise.target.midi+'"]');
   if(correctKey){
    correctKey.classList.add("guide-expected");
    correctKey.setAttribute("aria-label",(correctKey.getAttribute("aria-label")||"")+" — résolution attendue");
   }
   if(!response.correct){
    const wrongKey=app.querySelector('.lab-guide-keyboard .pianoKey[data-midi="'+response.selectedMidi+'"]');
    if(wrongKey){
     wrongKey.classList.add("guide-error");
     wrongKey.setAttribute("aria-label",(wrongKey.getAttribute("aria-label")||"")+" — ta réponse incorrecte");
    }
   }
  }else{
   app.querySelectorAll('.lab-guide-keyboard [data-midi]').forEach(key=>key.onclick=()=>{
    guideSelected=Number(key.dataset.midi);render();
   });
  }
  app.querySelectorAll("[data-guide-step]").forEach(b=>b.onclick=()=>{
   guideStep=Number(b.dataset.guideStep);
   guideSelected=guideResults[guideStep]?.selectedMidi??null;
   render();
  });
  document.getElementById("guideHearSource").onclick=()=>play([exercise.source.midi]);
  if(!response)document.getElementById("guideCheck").onclick=()=>{
   if(guideSelected===null)return;
   guideResults[guideStep]=checkGuideTone(study,guideStep,guideSelected);
   save("guides",study.id+":"+guideStep,study.tonality,
    [exercise.source.midi,guideSelected],guideResults[guideStep].correct);
   render();
  };
  else{
   document.getElementById("guideHearCorrect").onclick=()=>playSequence([[exercise.source.midi],[exercise.target.midi]]);
   if(!response.correct)document.getElementById("guideRetry").onclick=()=>{
    guideResults[guideStep]=null;guideSelected=null;render();
   };
   document.getElementById("guideNext").onclick=()=>{
    if(guideStep===3)chooseGuides(guideStudyIndex+1);
    else{guideStep++;guideSelected=guideResults[guideStep]?.selectedMidi??null;render()}
   };
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
   document.getElementById("earNext").onclick=()=>chooseEar(nextEarReview(archive(),earIndex));
  }
 }
 function showStudio(){
  const study=studioStudies[studioIndex],choice=studioAnswer===null?null:checkStudioChoice(study,studioAnswer);
  let body=heading("Réarmonisation",study.title,
   "Complète une progression originale de trois accords. Plusieurs réponses peuvent être musicalement justes : la correction explique leur fonction.");
  body+='<div class="lab-studio-line"><div><small>Départ</small><strong>'+e(study.before.symbol)+'</strong></div>'+
   '<span aria-hidden="true">→</span><div><small>À choisir</small><strong>?</strong></div><span aria-hidden="true">→</span>'+
   '<div><small>Destination</small><strong>'+e(study.target.symbol)+'</strong></div></div>'+
   '<div class="lab-melody"><p class="eyebrow">Petite mélodie originale</p><div class="lab-melody-notes">'+study.melody.map((m,i)=>'<span><small>'+(i+1)+'</small><strong>'+e(midiLabel(m))+'</strong></span>').join('<span aria-hidden="true">→</span>')+'</div>'+
   '<p class="subtle">La note centrale doit appartenir aux notes de l’accord choisi dans ce premier atelier. Les tensions mélodiques seront étudiées ensuite.</p>'+
   button("Écouter la mélodie","studioMelody","quiet")+'</div>'+
   '<p class="muted">Destination : '+e(study.tonality)+'. Cherche une dominante ou une substitution cohérente avec la mélodie et le mouvement vers la tonique.</p>'+
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
  document.getElementById("studioMelody").onclick=()=>playSequence(study.melody.map(m=>[m]));
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
 function render(){if(mode==="voice")currentVoice();else if(mode==="guides")showGuides();else if(mode==="ear")showEar();else if(mode==="studio")showStudio();else showHome()}
 return {start,render};
}
