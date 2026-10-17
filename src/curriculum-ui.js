import {lessons,checkExercise,midiName,TOTAL_EXERCISES} from "./curriculum.js";
import {chapterCourses,lessonCourses,validateCourseNotes} from "./course-notes.js";
import {readArchive,storeArchive,withCursor,withAttempt,stableExerciseId,progressByExercise,
 mergeArchives,parseBackup,backupJSON,restoreLegacyView} from "./progress-store.js";
if(!validateCourseNotes(lessons))throw new Error("Cours théoriques incomplets : une leçon manque.");

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
 let archive=null,storageWarning="",backupNotice="";
 function refreshArchive(){
  try{archive=readArchive(localStorage,lessons);storageWarning="";return archive}
  catch(error){archive=null;storageWarning="Suivi V2 indisponible : "+error.message;return null}
 }
 function writeArchive(next){
  try{storeArchive(localStorage,next);archive=next;storageWarning="";return true}
  catch(error){storageWarning="Attention : la sauvegarde de progression a échoué. "+error.message;return false}
 }
 refreshArchive();
 let progress=loadProgress();
 const e=escapeText;
 function start(index=null){
  progress=loadProgress();refreshArchive();
  if(index===null){overview=true}else{overview=false;lessonIdx=Math.max(0,Math.min(lessons.length-1,index));exerciseIdx=0}
  selected=[];result=null;scrollPos=0;render();
 }
 function pickLesson(n){start(n)}
 function titleBadge(lesson){return "Chapitre "+(lessonIdx+1)+"/"+lessons.length+" · "+PARTS[lesson.part]}
 function showOverview(){
  const stats=courseStats(progress);
  const records=archive?progressByExercise(archive):{};
  const practicedTonality=new Set(Object.values(records).flatMap(r=>Object.keys(r.byTonality||{})).filter(k=>k!=="unspecified"));
  const needsReview=Object.values(records).filter(r=>r.lastCorrect===false&&r.attempts>0).length;
  let body='<section class="card"><div class="eyebrow">École Ocverclock · cursus jazz</div><h1>Parcours d’harmonisation</h1>'+
   '<p class="muted">21 leçons progressives et '+TOTAL_EXERCISES+' exercices actifs. Construis les notes sur le vrai clavier : aucun QCM ne peut deviner à ta place.</p>'+
   '<p class="course-count"><strong>'+stats.mastered+'/'+stats.total+'</strong> exercices maîtrisés · '+stats.lessonsDone+'/'+stats.lessons+' leçons complètes</p>'+
   '<p class="subtle">'+practicedTonality.size+' tonalité(s) étudiée(s) et '+needsReview+' compétence(s) à revoir selon la dernière tentative.</p>'+
   (storageWarning?'<p class="feedback" role="alert">'+e(storageWarning)+'</p>':'')+
   (backupNotice?'<p class="explain" role="status">'+e(backupNotice)+'</p>':'')+
   '<div class="row">'+button("Reprendre mon travail","resumeCourse","primary")+
    button("QCM II–V–I","currSecondary","quiet")+button("Mes voicings","currVoicings","quiet")+'</div>'+
   '<div class="course-backup"><h3>Conserver mes acquis</h3><p class="muted">Les résultats restent sur cet appareil. Exporte une sauvegarde JSON pour les retrouver sur un autre navigateur, iPhone ou ordinateur.</p>'+
   '<div class="row">'+button("Exporter mes progrès","courseExport","quiet")+button("Importer une sauvegarde","courseImport","quiet")+'</div>'+
   '<input id="courseImportFile" class="sr-only-input" type="file" accept=".json,application/json" aria-label="Choisir un fichier de sauvegarde JSON">'+
   '</div>'+
   '<p class="subtle" style="margin-top:12px">Parcours indépendant inspiré du sommaire public d’Étienne Guéreau (Piano Jazz Concept). Aucun cours payant n’est reproduit. Progression enregistrée sur cet appareil.</p></section>';
  for(const part of [1,2,3,4]){
   const indices=lessons.map((l,i)=>({l,i})).filter(x=>x.l.part===part);
   const theory=chapterCourses[part];
   body+='<section class="card"><p class="eyebrow">Cours du chapitre '+part+'</p><h2>'+e(PARTS[part])+'</h2>'+ 
   '<p class="course-why"><strong>Pourquoi l’étudier ?</strong> '+e(theory.why)+'</p>'+
   '<p class="course-lecture">'+e(theory.body)+'</p>'+
   '<p class="subtle"><strong>Objectif :</strong> '+e(theory.goal)+'</p>'+
   '<div class="course-grid">'+indices.map(({l,i})=>{
    const mastery=l.exercises.filter((x,j)=>progress[keyFor(l,j)]?.correct).length;
    return '<button class="course-lesson" data-course="'+i+'"><small>Leçon '+(i+1)+' · '+mastery+'/'+l.exercises.length+' maîtrisés</small>'+
     '<strong>'+e(l.title)+'</strong><span>'+e(l.summary)+'</span></button>';
   }).join("")+'</div></section>';
  }
  shell(body);
  app.querySelectorAll("[data-course]").forEach(b=>b.onclick=()=>pickLesson(Number(b.dataset.course)));
  document.getElementById("resumeCourse").onclick=()=>{
   const cursor=archive?.cursor;
   if(cursor){
    const i=lessons.findIndex(l=>l.id===cursor.lessonId);
    if(i>=0){
     const j=lessons[i].exercises.findIndex((x,index)=>stableExerciseId(lessons[i],index)===cursor.exerciseId);
     if(j>=0){overview=false;lessonIdx=i;exerciseIdx=j;selected=[];result=null;scrollPos=0;render();return}
    }
   }
   const i=lessons.findIndex(l=>l.exercises.some((ex,j)=>!progress[keyFor(l,j)]?.correct));
   pickLesson(i===-1?0:i);
  };
  document.getElementById("courseExport").onclick=()=>{
   try{
    const data=backupJSON(archive||readArchive(localStorage,lessons));
    const blob=new Blob([data],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const link=document.createElement("a");
    link.href=url;link.download="harmonie-progression-"+new Date().toISOString().slice(0,10)+".json";
    document.body.appendChild(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),5000);
    backupNotice="Sauvegarde préparée. Vérifie sa présence dans tes téléchargements ou l’app Fichiers.";
    showOverview();
   }catch(error){backupNotice="Export impossible : "+error.message;showOverview()}
  };
  document.getElementById("courseImport").onclick=()=>document.getElementById("courseImportFile").click();
  document.getElementById("courseImportFile").onchange=async ev=>{
   const file=ev.target.files?.[0];if(!file)return;
   try{
    if(file.size>2_000_000)throw Error("Fichier trop volumineux.");
    const incoming=parseBackup(await file.text());
    const current=archive||readArchive(localStorage,lessons);
    const merged=mergeArchives(current,incoming);
    const newEvents=merged.events.length-current.events.length;
    const oldCount=Object.keys(current.legacy).length;
    const newLegacy=Math.max(0,Object.keys(merged.legacy).length-oldCount);
    const prompt="Importer cette sauvegarde ? "+newEvents+" nouvelle(s) tentative(s), "+newLegacy+" acquis historiques supplémentaires. Les résultats actuels seront conservés.";
    if(!confirm(prompt))return;
    if(!writeArchive(merged))throw Error("Écriture du fichier de progression refusée.");
    const restored=restoreLegacyView(localStorage,lessons,merged);
    progress=loadProgress();
    backupNotice="Sauvegarde importée et fusionnée sans effacer les acquis : "+restored+" réussite(s) restaurée(s).";
    showOverview();
   }catch(error){backupNotice="Import refusé ou incomplet : "+error.message;showOverview()}
  };
  document.getElementById("currSecondary").onclick=openSecondary;
  document.getElementById("currVoicings").onclick=openVoicing;
 }
 function showLesson(){
  const lesson=lessons[lessonIdx],exercise=lesson.exercises[exerciseIdx],theory=lessonCourses[lesson.id];
  if(archive&&(archive.cursor?.lessonId!==lesson.id||archive.cursor?.exerciseId!==stableExerciseId(lesson,exerciseIdx))){
   writeArchive(withCursor(archive,lesson,exerciseIdx));
  }
  const grade=result,notes=selected.slice().sort((a,b)=>a-b);
  const done=lesson.exercises.filter((ex,i)=>progress[keyFor(lesson,i)]?.correct).length;
  let body='<section class="card"><div class="row between"><span class="badge">'+e(titleBadge(lesson))+'</span>'+
   '<span class="subtle">'+done+'/'+lesson.exercises.length+' maîtrisés</span></div>'+
   '<h2 style="margin-top:18px">'+e(lesson.title)+'</h2>'+
   '<p class="muted">'+e(lesson.summary)+'</p>'+
   (storageWarning?'<p class="feedback" role="alert">'+e(storageWarning)+'</p>':'')+
   '<section class="lesson-theory" aria-label="Cours préalable à l’exercice"><p class="eyebrow">Comprendre avant de jouer</p>'+
   '<h3>Pourquoi cette notion ?</h3><p>'+e(theory.why)+'</p>'+
   '<h3>Comment ça fonctionne</h3><p>'+e(theory.concept)+'</p>'+
   '<h3>Exemple guidé</h3><p>'+e(theory.example)+'</p>'+
   '<div class="row">'+button("Écouter l’exemple","lessonHearTheory","quiet")+button("Écouter la comparaison","lessonCompareTheory","quiet")+'</div>'+
   '<details class="course-check"><summary>Petite question avant l’exercice : '+e(theory.question)+'</summary><p>'+e(theory.answer)+'</p></details></section>'+
   '<div class="explain">'+e(lesson.principle)+'</div>'+
   '<div class="row course-navline">'+button("← Toutes les leçons","courseAll","quiet")+
   button("Leçon précédente","coursePrevLesson","quiet",lessonIdx===0)+
   button("Leçon suivante","courseNextLesson","quiet",lessonIdx===lessons.length-1)+'</div>'+
   '<div class="course-steps" aria-label="Exercices de la leçon">'+lesson.exercises.map((ex,i)=>{
    const ok=progress[keyFor(lesson,i)]?.correct;
    return '<button data-course-step="'+i+'" class="btn '+(exerciseIdx===i?'active':'')+'" aria-current="'+(exerciseIdx===i?'step':'false')+'">'+(i+1)+(ok?' ✓':'')+'</button>';
   }).join("")+'</div>'+
   '<p class="eyebrow">Exercice '+(exerciseIdx+1)+' / '+lesson.exercises.length+(exercise.tonality?' · Tonalité : '+e(exercise.tonality):'')+'</p><div class="symbol course-symbol">'+e(exercise.name)+'</div>'+
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
    (exercise.spelling?'<p>Orthographe attendue : <strong>'+e(exercise.spelling)+'</strong>.</p>':'')+
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
  document.getElementById("lessonHearTheory").onclick=()=>play(theory.listen);
  document.getElementById("lessonCompareTheory").onclick=()=>play(theory.compare);
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
   if(!saveProgress(progress))storageWarning="Attention : tes progrès n'ont pas été enregistrés dans le stockage local.";
   if(archive)writeArchive(withAttempt(archive,lesson,exerciseIdx,selected,result.correct));
   render();
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
