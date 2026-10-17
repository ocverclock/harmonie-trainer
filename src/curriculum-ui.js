import {lessons,checkExercise,midiName,TOTAL_EXERCISES} from "./curriculum.js";

const STORE="harmonie-parcours-v1";
const PARTS={1:"Fondations et positions",2:"Conduite des voix",3:"Harmonie jazz et enrichissements",4:"Mise en pratique"};
function loadProgress(){
 try{const p=JSON.parse(localStorage.getItem(STORE)||"{}");return p&&typeof p==="object"&&!Array.isArray(p)?p:{}}catch{return {}}
}
function saveProgress(p){try{localStorage.setItem(STORE,JSON.stringify(p));return true}catch{return false}}
function keyFor(lesson,exercise){return lesson.id+":"+exercise}
export function courseStats(progress){
 let mastered=0,lessonsDone=0;
 for(const l of lessons){
  const correct=l.exercises.filter((e,i)=>progress[keyFor(l,i)]?.correct).length;
  mastered+=correct;if(correct===l.exercises.length)lessonsDone++;
 }
 return {mastered,lessonsDone,total:TOTAL_EXERCISES,lessons:lessons.length};
}
export function createCurriculumUI({app,shell,piano,play,escapeText,button,openVoicing,openSecondary}){
 let overview=true,lessonIdx=0,exerciseIdx=0,selected=[],result=null,scrollPos=0;
 let progress=loadProgress();
 const e=escapeText;
 function start(index=null){
  progress=loadProgress();
  if(index===null){overview=true}else{overview=false;lessonIdx=Math.max(0,Math.min(lessons.length-1,index));exerciseIdx=0}
  selected=[];result=null;scrollPos=0;render();
 }
 function pickLesson(n){start(n)}
 function titleBadge(lesson){return "Chapitre "+(lessonIdx+1)+"/"+lessons.length+" · "+PARTS[lesson.part]}
 function showOverview(){
  const stats=courseStats(progress);
  let body='<section class="card"><div class="eyebrow">École Ocverclock · cursus jazz</div><h1>Parcours d’harmonisation</h1>'+
   '<p class="muted">21 leçons progressives et 52 exercices actifs. Construis les notes sur le vrai clavier : aucun QCM ne peut deviner à ta place.</p>'+
   '<p class="course-count"><strong>'+stats.mastered+'/'+stats.total+'</strong> exercices maîtrisés · '+stats.lessonsDone+'/'+stats.lessons+' leçons complètes</p>'+
   '<div class="row">'+button("Reprendre mon travail","resumeCourse","primary")+
    button("QCM II–V–I","currSecondary","quiet")+button("Mes voicings","currVoicings","quiet")+'</div>'+
   '<p class="subtle" style="margin-top:12px">Parcours indépendant inspiré du sommaire public d’Étienne Guéreau (Piano Jazz Concept). Aucun cours payant n’est reproduit. Progression enregistrée sur cet appareil.</p></section>';
  for(const part of [1,2,3,4]){
   const indices=lessons.map((l,i)=>({l,i})).filter(x=>x.l.part===part);
   body+='<section class="card"><h2>'+e(PARTS[part])+'</h2><div class="course-grid">'+indices.map(({l,i})=>{
    const mastery=l.exercises.filter((x,j)=>progress[keyFor(l,j)]?.correct).length;
    return '<button class="course-lesson" data-course="'+i+'"><small>Leçon '+(i+1)+' · '+mastery+'/'+l.exercises.length+' maîtrisés</small>'+
     '<strong>'+e(l.title)+'</strong><span>'+e(l.summary)+'</span></button>';
   }).join("")+'</div></section>';
  }
  shell(body);
  app.querySelectorAll("[data-course]").forEach(b=>b.onclick=()=>pickLesson(Number(b.dataset.course)));
  document.getElementById("resumeCourse").onclick=()=>{
   const i=lessons.findIndex(l=>l.exercises.some((ex,j)=>!progress[keyFor(l,j)]?.correct));
   pickLesson(i===-1?0:i);
  };
  document.getElementById("currSecondary").onclick=openSecondary;
  document.getElementById("currVoicings").onclick=openVoicing;
 }
 function showLesson(){
  const lesson=lessons[lessonIdx],exercise=lesson.exercises[exerciseIdx];
  const grade=result,notes=selected.slice().sort((a,b)=>a-b);
  const done=lesson.exercises.filter((ex,i)=>progress[keyFor(lesson,i)]?.correct).length;
  let body='<section class="card"><div class="row between"><span class="badge">'+e(titleBadge(lesson))+'</span>'+
   '<span class="subtle">'+done+'/'+lesson.exercises.length+' maîtrisés</span></div>'+
   '<h2 style="margin-top:18px">'+e(lesson.title)+'</h2>'+
   '<p class="muted">'+e(lesson.summary)+'</p><div class="explain">'+e(lesson.principle)+'</div>'+
   '<div class="row course-navline">'+button("← Toutes les leçons","courseAll","quiet")+
   button("Leçon précédente","coursePrevLesson","quiet",lessonIdx===0)+
   button("Leçon suivante","courseNextLesson","quiet",lessonIdx===lessons.length-1)+'</div>'+
   '<div class="course-steps" aria-label="Exercices de la leçon">'+lesson.exercises.map((ex,i)=>{
    const ok=progress[keyFor(lesson,i)]?.correct;
    return '<button data-course-step="'+i+'" class="btn '+(exerciseIdx===i?'active':'')+'" aria-current="'+(exerciseIdx===i?'step':'false')+'">'+(i+1)+(ok?' ✓':'')+'</button>';
   }).join("")+'</div>'+
   '<p class="eyebrow">Exercice '+(exerciseIdx+1)+' / '+lesson.exercises.length+'</p><div class="symbol course-symbol">'+e(exercise.name)+'</div>'+
   '<p>'+e(exercise.task)+'</p>'+
   '<p class="muted">'+(exercise.mode==="free"?
      'Renversement libre : choisis '+exercise.midis.length+' notes distinctes, sans doubler une même note à l’octave.':
      'Position précise : reproduis les '+exercise.midis.length+' hauteurs dans le registre indiqué. Les octaves comptent.')+
   ' Fais défiler le clavier horizontalement pour atteindre les notes aiguës.</p>'+
   '<p class="subtle" aria-live="polite">Ton accord : <b>'+(notes.length?notes.map(midiName).join(' · '):'aucune note')+'</b> ('+notes.length+'/'+exercise.midis.length+')</p>'+
   '<div class="lesson-piano '+(grade?'show-correction':'')+'">'+piano(new Set(notes),[],!grade,[],false,-1,"midi")+'</div>'+
   '<div class="row">'+button("Effacer","courseClear","quiet",!!grade||!notes.length)+
   button("Écouter ma proposition","courseListen","quiet",!notes.length)+
   button("Vérifier","courseCheck","primary",!!grade||notes.length!==exercise.midis.length)+'</div>';
  if(grade){
   body+='<div class="feedback '+(grade.correct?'correct':'')+'" role="status"><h3>'+(grade.correct?'Accord exact.':'Correction de ton accord')+'</h3>'+
    '<p>'+e(exercise.why)+'</p>'+
    (!grade.correct?'<p>Attendu : <b>'+exercise.midis.map(midiName).join(' · ')+'</b>. '+
       (grade.missing.length?'Notes attendues entourées de rouge : '+grade.missing.map(midiName).join(', ')+'. ':'')+
       (grade.extra.length?'Notes à retirer marquées en rouge : '+grade.extra.map(midiName).join(', ')+'. ':'')+
       (grade.repeatedPitchClasses?'Une même note a été doublée à une autre octave.':'')+'</p>':'<p>Tu peux aussi écouter le modèle et comparer les timbres.</p>')+
    '<div class="row">'+button("Écouter la correction","courseHearCorrect","quiet")+
    button("Recommencer cet exercice","courseRetry","quiet")+
    button(exerciseIdx===lesson.exercises.length-1?"Voir les leçons":"Exercice suivant →","courseNext","primary")+
    '</div></div>';
  }
  body+='</section>';shell(body);
  const pianoScroll=app.querySelector(".lesson-piano .piano-scroll");
  if(pianoScroll){pianoScroll.scrollLeft=scrollPos;pianoScroll.addEventListener("scroll",()=>{scrollPos=pianoScroll.scrollLeft},{passive:true})}
  if(grade){
   // Ring only expected notes that are missing; another octave is valid in free mode.
   for(const midi of grade.missing){
    const key=app.querySelector(".lesson-piano .pianoKey[data-preview='"+midi+"']");
    if(key)key.classList.add("correction-expected");
   }
   for(const midi of grade.extra){
    const key=app.querySelector(".lesson-piano .pianoKey[data-preview='"+midi+"']");
    if(key)key.classList.add("correction-extra");
   }
  }
  app.querySelectorAll("[data-course-step]").forEach(b=>b.onclick=()=>{exerciseIdx=Number(b.dataset.courseStep);selected=[];result=null;scrollPos=0;render()});
  document.getElementById("courseAll").onclick=()=>{overview=true;render()};
  document.getElementById("coursePrevLesson").onclick=()=>pickLesson(lessonIdx-1);
  document.getElementById("courseNextLesson").onclick=()=>pickLesson(lessonIdx+1);
  document.getElementById("courseClear").onclick=()=>{selected=[];render()};
  document.getElementById("courseListen").onclick=()=>play(notes);
  document.getElementById("courseCheck").onclick=()=>{
   result=checkExercise(exercise,selected);
   const k=keyFor(lesson,exerciseIdx),before=progress[k]||{attempts:0,correct:false};
   progress[k]={correct:before.correct||result.correct,attempts:(before.attempts||0)+1,at:new Date().toISOString()};
   saveProgress(progress);render();
  };
  app.querySelectorAll("[data-midi]").forEach(b=>b.onclick=()=>{
   if(result)return;
   const midi=Number(b.dataset.midi),i=selected.indexOf(midi);
   if(i>=0)selected.splice(i,1);
   else if(selected.length<exercise.midis.length)selected.push(midi);
   render();
  });
  app.querySelectorAll("[data-preview]").forEach(b=>b.onclick=()=>play([Number(b.dataset.preview)]));
  if(grade){
   document.getElementById("courseHearCorrect").onclick=()=>play(exercise.midis);
   document.getElementById("courseRetry").onclick=()=>{result=null;selected=[];render()};
   document.getElementById("courseNext").onclick=()=>{
    if(exerciseIdx<lesson.exercises.length-1){exerciseIdx++;selected=[];result=null;scrollPos=0;render()}
    else{overview=true;selected=[];result=null;scrollPos=0;render()}
   };
  }
 }
 function render(){if(overview)showOverview();else showLesson()}
 return {start,render,showOverview,courseStats:()=>courseStats(loadProgress())};
}
