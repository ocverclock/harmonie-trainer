import {names,exercises,degrees,grade,sessionFor,secondary,validateBank} from "./music.js?v=4";
import {PIANO_KEYS,PIANO_WIDTH,noteX} from "./piano-layout.js";
import {constructionLevels,constructionDifficulties,difficultyOf,levelOf,demonstrationMidis} from "./practice-random.js?v=4";
import {constructionSetupHTML} from "./construction-setup.js?v=1";

const app=document.getElementById("app");
if(!validateBank())throw new Error("Corpus musical invalide");
let screen="home",level=6,constructionDifficulty="standard",session=[],questionIndex=0,selected=new Set(),checked=null,score=0;
let secondaryIndex=0,choice=-1,revealed=false,activeFrame=0,isolated=-1,voiceModule=null,voiceError=false;
let audioCtx=null,resizeHandle=0,lessonScrollPos=null;
let voicingUI=null,courseUI=null,jazzLabUI=null;
const storage="harmonie-sessions-v2";
const constructionSettings="harmonie-construction-choice-v1";
try{
 const saved=JSON.parse(localStorage.getItem(constructionSettings)||"null");
 if(saved&&constructionLevels.some(x=>x.id===saved.level)&&constructionDifficulties[saved.difficulty]){
  level=saved.level;constructionDifficulty=saved.difficulty;
 }
}catch(e){}
function keepConstructionChoice(){
 try{localStorage.setItem(constructionSettings,JSON.stringify({level,difficulty:constructionDifficulty}))}catch(e){}
}
function returnToConstruction(){
 screen="home";render();
 app.querySelector("#constructionSettings")?.scrollIntoView({block:"start"});
}
function historicSessionLabel(s){
 if(s.familyId&&s.schemaVersion>=3){
  const family=constructionLevels.find(x=>x.id===s.level&&"level-"+x.id===s.familyId);
  if(family)return "Niveau "+s.level+" — "+family.label+" · "+(constructionDifficulties[s.difficulty]?.label||s.difficulty);
 }
 return "Ancienne session (famille non enregistrée) · "+s.score+"/100";
}
function escapeText(t){return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}
function readScores(){try{let a=JSON.parse(localStorage.getItem(storage)||"[]");return Array.isArray(a)?a:[]}catch(e){return []}}
function storeScores(a){try{localStorage.setItem(storage,JSON.stringify(a.slice(-100)));return true}catch(e){return false}}
function button(label,id,kind,disabled){return '<button id="'+id+'" class="btn '+(kind||'quiet')+'"'+(disabled?' disabled':'')+'>'+label+'</button>'}
function shell(body){
 app.innerHTML='<div class="wrap"><header class="top"><div class="brand"><span>♫</span> Harmonie Trainer</div><nav class="nav" aria-label="Navigation">'+
 ['home:Accueil','course:Parcours','jazz:Atelier jazz','secondary:II–V–I secondaires','voicings:Mes voicings','quiz:Accords','stats:Progression'].map(function(item){
  let parts=item.split(":");return '<button data-nav="'+parts[0]+'" class="'+(screen===parts[0]?'active':'')+'">'+parts[1]+'</button>';
 }).join("")+'</nav></header><main>'+body+'</main><footer class="footer">Prototype pédagogique — aucune donnée transmise. Les scores sont stockés sur cet appareil.</footer></div>';
 app.querySelectorAll("[data-nav]").forEach(function(b){b.onclick=function(){
  let n=b.dataset.nav;
  if(n==="quiz"){screen="home";render()}else if(n==="voicings"){beginVoicing()}else if(n==="course"){beginCourse()}else if(n==="jazz"){beginJazzLab()}else{screen=n;render()}
 }});
}
function piano(chosen,highlight,live,voices=[],embedded=false,solo=-1,selectionMode="pitchClass",voicePalette=[]){
 const visibleVoices=voices.filter(function(v){return solo===-1||solo===v.id});
 const byMidi=new Map(visibleVoices.map(function(v){return [v.midi,v]}));
 const white=[],black=[];
 PIANO_KEYS.forEach(function(key){
  const midi=key.midi,pc=key.pc,voice=byMidi.get(midi);
  const highlighted=voices.length?!!voice:highlight.includes(midi);
  const selected=selectionMode==="midi"?chosen.has(midi):chosen.has(pc);
  const note=names[pc]+(Math.floor(midi/12)-1);
  const label=key.black?names[pc]:(pc===0?'C'+(Math.floor(midi/12)-1):names[pc]);
  const color=voice?(voicePalette[voice.id]||(voiceModule?voiceModule.voiceColors[voice.id]:null)):null;
  const marker=color?'<span class="keyVoice" style="--voice-color:'+color+'" aria-hidden="true">'+(voice.id+1)+'</span>':'';
  const aria=' aria-label="'+escapeText(note+(voice?' — voix '+(voice.id+1):''))+'" aria-pressed="'+(selected?'true':'false')+'"';
  const click=live?' data-midi="'+midi+'"':' data-preview="'+midi+'"';
  const result='<button class="pianoKey '+(key.black?'black ':'white ')+(selected?'selected ':'')+(highlighted?'marked':'')+'" style="left:'+key.left+'px"'+aria+click+'><span class="keyText">'+label+'</span>'+marker+'</button>';
  (key.black?black:white).push(result);
 });
 const rack='<div class="piano-rack"><div class="piano" style="width:'+PIANO_WIDTH+'px">'+white.join('')+black.join('')+'</div></div>';
 return embedded?rack:'<div class="piano-scroll">'+rack+'</div>';
}
async function play(midis){
 try{
  let AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;
  audioCtx=audioCtx||new AC();
  if(audioCtx.state!=="running")await audioCtx.resume();
  const now=audioCtx.currentTime;
  midis.forEach(function(midi){
   let oscillator=audioCtx.createOscillator(),gain=audioCtx.createGain();
   oscillator.type="triangle";oscillator.frequency.value=440*Math.pow(2,(midi-69)/12);
   gain.gain.setValueAtTime(0.0001,now);gain.gain.exponentialRampToValueAtTime(0.065/Math.max(1,midis.length),now+.035);
   gain.gain.exponentialRampToValueAtTime(0.0001,now+.92);
   oscillator.connect(gain).connect(audioCtx.destination);oscillator.start(now);oscillator.stop(now+.96);
   oscillator.onended=function(){oscillator.disconnect();gain.disconnect()};
  });return true;
 }catch(err){return false}
}
function noteLabel(n){return names[n%12]}
function home(){
 let a=readScores();
 shell('<section class="card"><div class="eyebrow">Harmonie en pratique</div><h1>Comprendre les accords.<br>Voir comment les voix bougent.</h1><p class="muted">Réponds d’abord à une question pour trouver le II–V–I secondaire. Ensuite, découvre la solution en couleurs, avec les traits de déplacement au-dessus du clavier.</p>'+
 '<div class="row">'+button("Parcours complet d’harmonisation","openCourse","primary")+button("Identifier les II–V–I (QCM)","openSecondary","quiet")+button("Construire mes voicings","openVoicings","quiet")+button("Atelier jazz : voix, oreille, harmonisation","openJazzLab","quiet")+button("Construire les accords","openChords","quiet")+'</div></section>'+
 '<section class="card"><h2>Un vrai clavier interactif</h2><p class="muted">Touches blanches et noires superposées comme sur un piano. L’affichage s’adapte au téléphone et à la tablette.</p>'+
 piano(new Set(),[],false)+'</section>'+
 constructionSetupHTML(level,constructionDifficulty,a.length,escapeText));
 document.getElementById("openCourse").onclick=function(){beginCourse()};
 document.getElementById("openSecondary").onclick=function(){screen="secondary";secondaryIndex=0;choice=-1;revealed=false;activeFrame=0;isolated=-1;render()};
 document.getElementById("openChords").onclick=returnToConstruction;
 document.getElementById("openVoicings").onclick=function(){beginVoicing()};
 document.getElementById("openJazzLab").onclick=()=>beginJazzLab();
 app.querySelectorAll("[data-difficulty]").forEach(function(b){b.onclick=function(){constructionDifficulty=b.dataset.difficulty;keepConstructionChoice();returnToConstruction()}});
 app.querySelectorAll("[data-level]").forEach(function(b){b.onclick=function(){level=Number(b.dataset.level);keepConstructionChoice();returnToConstruction()}});
 document.getElementById("startConstruction").onclick=function(){start(level)};
 app.querySelectorAll("[data-preview]").forEach(function(b){b.onclick=function(){play([Number(b.dataset.preview)])}});
}
async function beginCourse(){
 screen="course";
 try{
  if(!courseUI){const mod=await import("./curriculum-ui.js?v=5");courseUI=mod.createCurriculumUI({
   app,shell,piano,play,escapeText,button,
   openVoicing:()=>beginVoicing(),
   openJazzLab:()=>beginJazzLab(),
   openSecondary:()=>{screen="secondary";secondaryIndex=0;choice=-1;revealed=false;activeFrame=0;isolated=-1;render()}
  });}
  if(screen==="course")courseUI.start();
 }catch(error){console.error("Parcours indisponible",error);screen="home";home();alert("Impossible de charger le parcours. Actualise la page.");}
}
async function beginJazzLab(mode="home"){
 screen="jazz";
 try{
  if(!jazzLabUI){const mod=await import("./jazz-lab-ui.js?v=1");jazzLabUI=mod.createJazzLabUI({
   app,shell,piano,play,escapeText,button,isActive:()=>screen==="jazz"
  });}
  if(screen==="jazz")jazzLabUI.start(mode);
 }catch(error){console.error("Atelier jazz indisponible",error);screen="home";home();alert("Impossible de charger l'atelier jazz. Actualise la page.");}
}
async function beginVoicing(index=null){
 screen="voicings";
 try{
  if(!voicingUI){const mod=await import("./voicing-ui.js?v=3");voicingUI=mod.createVoicingUI({app,shell,piano,play,escapeText,button});}
  if(screen==="voicings")voicingUI.start(index);
 }catch(error){console.error("Voicing mode could not load",error);screen="home";home();alert("Impossible de charger le module des voicings. Vérifie ta connexion puis actualise la page.");}
}
function start(l){level=l;keepConstructionChoice();session=sessionFor(level,Math.random,constructionDifficulty);questionIndex=0;selected=new Set();checked=null;score=0;screen="quiz";render()}
function quiz(){
 const ex=session[questionIndex];
 let body='<section class="card"><div class="row between"><span class="badge">Accords · Niveau '+level+' · '+escapeText(difficultyOf(constructionDifficulty).label)+'</span><span class="muted">Question '+(questionIndex+1)+'/10</span></div>'+
 '<p class="subtle">Niveau '+level+' — '+escapeText(levelOf(level).label)+' · '+escapeText(difficultyOf(constructionDifficulty).label)+'</p><p class="eyebrow" style="margin-top:20px">Construis l’accord</p><div class="symbol">'+escapeText(ex.symbol)+'</div>'+
 '<p class="muted">Appuie sur '+ex.expected.length+' notes distinctes. L’octave et l’ordre n’influencent pas la réponse.'+
 (ex.voicingExplanation?' Construis le voicing demandé sans ajouter les degrés omis.':'')+'</p>'+
 (constructionDifficulty==="guided"?'<div class="explain" role="note"><strong>Repère pour construire :</strong> degrés '+escapeText(degrees[ex.quality])+
   '. Commence par la fondamentale '+escapeText(ex.root.replaceAll("b","♭").replaceAll("#","♯"))+
   ', puis trouve les autres degrés.<div class="row" style="margin-top:10px">'+button("Écouter la fondamentale","hearRoot","quiet")+'</div></div>':'')+
 (constructionDifficulty!=="guided"?'<p class="subtle">'+escapeText(difficultyOf(constructionDifficulty).description)+'</p>':'')+
 piano(selected,[],true)+'<div class="row">'+button("Effacer","clear","quiet",!!checked)+button("Écouter mon choix","hear","quiet",!selected.size)+button("Valider ("+ex.expected.length+" notes)","validate","primary",!!checked||selected.size!==ex.expected.length)+button("Changer de niveau","backToLevels","quiet")+'</div>';
 if(checked){
  let missing=checked.missing.map(noteLabel).join(", "),extra=checked.extra.map(noteLabel).join(", ");
  body+='<div class="feedback '+(checked.correct?'correct':'')+'" role="status"><strong>'+(checked.correct?'Exact !':'Pas encore.')+'</strong>'+
  '<p>Notes de '+escapeText(ex.symbol)+' : <b>'+escapeText(ex.spelling)+'</b></p><p>Intervalles : '+degrees[ex.quality]+'</p>'+
  (ex.voicingExplanation?'<p>'+escapeText(ex.voicingExplanation)+'</p>':'')+
  (!checked.correct?'<p>'+(missing?'Manquantes : '+missing+'. ':'')+(extra?'En trop : '+extra+'.':'')+'</p>':'')+
  button("Écouter l’accord juste","correctSound","quiet")+button(questionIndex===9?"Voir mon bilan":"Question suivante","next","primary")+'</div>';
 }
 body+='</section>';shell(body);
 const scroll=app.querySelector(".piano-scroll");if(Number.isFinite(quiz.scrollX))scroll.scrollLeft=quiz.scrollX;
 app.querySelectorAll("[data-midi]").forEach(function(b){b.onclick=function(){
  if(checked)return;quiz.scrollX=scroll.scrollLeft;
  let pc=Number(b.dataset.midi)%12;selected.has(pc)?selected.delete(pc):selected.add(pc);quiz();
 }});
 document.getElementById("backToLevels").onclick=returnToConstruction;
 document.getElementById("hearRoot")?.addEventListener("click",function(){play([60+ex.expected[0]])});
 document.getElementById("clear").onclick=function(){selected.clear();quiz()};
 document.getElementById("hear").onclick=function(){play([...selected].map(function(x){return x+60}))};
 document.getElementById("validate").onclick=function(){if(!selected.size||checked||
  selected.size!==ex.expected.length)return;checked=grade(ex,[...selected]);if(checked.correct)score+=10;quiz()};
 if(checked){
  document.getElementById("correctSound").onclick=function(){play(demonstrationMidis(ex))};
  document.getElementById("next").onclick=function(){
   quiz.scrollX=0;
   if(questionIndex===9){let history=readScores();history.push({schemaVersion:3,level:level,familyId:"level-"+level,realizationId:level===6?"jazz-four":level===7?"jazz-five":level===8?"altered":"chord-tones",difficulty:constructionDifficulty,score:score,at:new Date().toISOString()});storeScores(history);screen="result";render();}
   else{questionIndex++;checked=null;selected=new Set();quiz()}
  };
 }
}
function results(){
 shell('<section class="card"><h2>Session terminée</h2><p class="muted">Niveau '+level+' — '+escapeText(levelOf(level).label)+' · '+escapeText(difficultyOf(constructionDifficulty).label)+'</p><p class="score">'+score+'/100</p><p>'+score/10+' réponses justes sur 10.</p><div class="row">'+button("Rejouer","again","primary")+button("Changer de difficulté","goLevels","quiet")+button("II–V–I secondaires","goSecondary","quiet")+'</div></section>');
 document.getElementById("again").onclick=function(){start(level)};
 document.getElementById("goLevels").onclick=returnToConstruction;
 document.getElementById("goSecondary").onclick=function(){screen="secondary";secondaryIndex=0;choice=-1;revealed=false;render()};
}
function preloadDiagram(){
 if(voiceModule||voiceError)return;
 import("./voices.js?v=4").then(function(mod){voiceModule=mod;if(screen==="secondary"&&revealed)render()})
 .catch(function(){voiceError=true;if(screen==="secondary")render()});
}
function secondaryView(){
 const q=secondary[secondaryIndex],frames=q.progression.frames;
 let body='<section class="card"><div class="row between"><span class="badge">II–V–I secondaire · '+(secondaryIndex+1)+'/'+secondary.length+'</span><span class="subtle">Réfléchis avant de regarder la solution</span></div>'+
 '<div class="eyebrow" style="margin-top:20px">Trouve la cadence</div><h2>'+escapeText(q.prompt)+'</h2><p class="muted">Choisis la progression adaptée à l’accord de destination, puis valide pour découvrir le mouvement des voix.</p>'+
 '<div class="choiceGrid">'+q.choices.map(function(c,i){
  return '<button class="choice '+(choice===i?'picked ':'')+(revealed&&i===q.answer?'answer ':'')+(revealed&&choice===i&&i!==q.answer?'wrong':'')+'" data-choice="'+i+'" '+(revealed?'disabled':'')+'>'+escapeText(c)+'</button>'
 }).join("")+'</div>';
 if(!revealed)body+='<div class="row">'+button("Effacer le choix","eraseChoice","quiet",choice===-1)+button("Vérifier la réponse","confirmChoice","primary",choice===-1)+'</div>';
 if(revealed){
  let f=frames[activeFrame];
  body+='<div class="explain" role="status"><strong>'+(choice===q.answer?'Bonne réponse.':'Voici la bonne réponse.')+'</strong><p><b>'+escapeText(q.choices[q.answer])+'</b></p><p>'+escapeText(q.explanation)+'</p></div>'+
  '<div class="row between"><h3>Explication par les glissements</h3>'+button("Écouter cet accord","hearFrame","quiet")+'</div>';
  if(voiceModule){
   body+='<p class="muted">Les trois rangées d’accords descendent vers le clavier. Chaque boule numérotée est à la verticale de sa touche ; le numéro et la couleur restent identiques jusqu’au clavier.</p>'+
    '<div class="piano-scroll aligned-scroll" role="region" aria-label="Glissements et piano, défilement horizontal commun" tabindex="0"><div class="aligned-lesson">'+
     voiceModule.diagram(q.progression,activeFrame,isolated)+
     piano(new Set(),f.voices.map(function(v){return v.midi}),false,f.voices,true,isolated)+
    '</div></div>'+
    '<p class="subtle">Fais glisser ce bloc horizontalement sur téléphone : le dessin et le clavier se déplacent ensemble.</p>'+
    '<div class="timeline">'+frames.map(function(fr,i){return '<button data-frame="'+i+'" class="btn '+(activeFrame===i?'active':'')+'">'+(i+1)+'. '+escapeText(fr.symbol)+'</button>'}).join("")+'</div>'+
    '<div class="legend">'+f.voices.map(function(v,i){return '<button data-voice="'+i+'" class="'+(isolated!==-1&&isolated!==i?'faded':'')+'"><span class="dot" style="background:'+voiceModule.voiceColors[i]+'"></span>Voix '+(i+1)+' · '+escapeText(v.note)+'</button>'}).join("")+'</div>'+
    '<p class="explain">'+escapeText(voiceModule.movementSummary(q.progression,activeFrame))+'</p>'+
    '<p class="muted">Accord actif : <b>'+escapeText(f.symbol)+'</b> ('+f.voices.map(function(v){return escapeText(v.note)}).join(' · ')+'). Les points du clavier conservent exactement les couleurs des voix au-dessus.</p>';
  }else body+='<p class="muted">'+(voiceError?'Visualisation momentanément indisponible. Actualise la page en ligne.':'Chargement de la visualisation…')+'</p>';
  body+='<div class="row">'+button("← Accord précédent","prevFrame","quiet",activeFrame===0)+button("Accord suivant →","nextFrame","primary",activeFrame===2)+'</div>';
 }
 body+='<div class="row between" style="margin-top:22px">'+button("Question précédente","prevQ","quiet",secondaryIndex===0)+button(secondaryIndex===secondary.length-1?"Recommencer le module":"Question suivante →","nextQ","primary")+'</div><div class="row" style="margin-top:12px">'+button("Construire moi-même les voicings de cette cadence","buildHere","quiet")+'</div></section>';
 shell(body);
 const aligned=app.querySelector(".aligned-scroll");
 if(aligned&&voiceModule){
  if(lessonScrollPos===null){
   const focus=voiceModule.frameCenter(q.progression,activeFrame)+12;
   aligned.scrollLeft=Math.max(0,focus-aligned.clientWidth/2);
  }else aligned.scrollLeft=lessonScrollPos;
  aligned.addEventListener("scroll",function(){lessonScrollPos=aligned.scrollLeft},{passive:true});
 }
 if(!revealed){
  app.querySelectorAll("[data-choice]").forEach(function(b){b.onclick=function(){choice=Number(b.dataset.choice);secondaryView()}});
  document.getElementById("eraseChoice").onclick=function(){choice=-1;secondaryView()};
  document.getElementById("confirmChoice").onclick=function(){
   if(choice<0)return;revealed=true;activeFrame=0;isolated=-1;lessonScrollPos=null;preloadDiagram();secondaryView();
  };
 }else{
  document.getElementById("hearFrame").onclick=function(){play(isolated===-1?frames[activeFrame].voices.map(function(v){return v.midi}):[frames[activeFrame].voices[isolated].midi])};
  app.querySelectorAll("[data-frame]").forEach(function(b){b.onclick=function(){activeFrame=Number(b.dataset.frame);lessonScrollPos=null;secondaryView()}});
  app.querySelectorAll("[data-voice]").forEach(function(b){b.onclick=function(){let n=Number(b.dataset.voice);isolated=isolated===n?-1:n;secondaryView()}});
  app.querySelectorAll("[data-preview]").forEach(function(b){b.onclick=function(){play([Number(b.dataset.preview)])}});
  document.getElementById("prevFrame").onclick=function(){if(activeFrame>0){activeFrame--;lessonScrollPos=null;secondaryView()}};
  document.getElementById("nextFrame").onclick=function(){if(activeFrame<2){activeFrame++;lessonScrollPos=null;secondaryView()}};
 }
 document.getElementById("prevQ").onclick=function(){if(secondaryIndex>0){secondaryIndex--;resetSecondary()}};
 document.getElementById("nextQ").onclick=function(){secondaryIndex=(secondaryIndex+1)%secondary.length;resetSecondary()};
 document.getElementById("buildHere").onclick=function(){beginVoicing(secondaryIndex)};
}
function resetSecondary(){choice=-1;revealed=false;activeFrame=0;isolated=-1;lessonScrollPos=null;secondaryView()}
function stats(){
 const a=readScores();let v=[];let c={mastered:0,total:"…"};try{const records=JSON.parse(localStorage.getItem("harmonie-voicing-results-v1")||"[]");v=Array.isArray(records)?records:[]}catch(e){}
 try{const mod=JSON.parse(localStorage.getItem("harmonie-parcours-v1")||"{}");c.mastered=Object.values(mod).filter(x=>x?.correct).length}catch(e){}
 shell('<section class="card"><h2>Ma progression</h2><p class="muted">Sessions enregistrées uniquement sur cet appareil.</p>'+
 '<h3>Parcours d’harmonisation</h3><p>'+c.mastered+' / <span id="stats-course-total">'+c.total+'</span> exercices maîtrisés</p>'+button('Ouvrir le parcours','goCourseFromStats','primary')+
 '<h3>Construction des accords</h3><p>'+a.length+' session(s)</p><p>'+(a.length?a.slice(-10).reverse().map(function(s){return historicSessionLabel(s)+(s.familyId?' : '+s.score+'/100':'')}).join(' · '):'Aucun résultat pour le moment.')+'</p>'+
 '<h3>Atelier jazz : conduites, oreille et réharmonisations</h3><p>La progression est conservée dans la sauvegarde JSON V2 du parcours.</p>'+button('Ouvrir l’atelier jazz','goJazzFromStats','quiet')+
 '<h3>II–V–I : mes voicings</h3><p>'+v.length+' cadence(s) terminée(s)</p><p>'+(v.length?v.slice(-10).reverse().map(function(s){return s.correct+'/3 accords justes'}).join(' · '):'Aucun résultat pour le moment.')+'</p>'+
 button("Effacer la progression","eraseHistory","quiet")+'</section>');
 document.getElementById("goCourseFromStats").onclick=beginCourse;
 document.getElementById("goJazzFromStats").onclick=()=>beginJazzLab();
 import("./curriculum.js").then(module=>{const x=app.querySelector("#stats-course-total");if(x)x.textContent=String(module.TOTAL_EXERCISES)}).catch(()=>{});
 document.getElementById("eraseHistory").onclick=function(){if(confirm("Effacer toute la progression locale, y compris les exercices d’atelier jazz ? Exporte d’abord une sauvegarde depuis Parcours si tu veux conserver ces données.")){storeScores([]);try{localStorage.removeItem("harmonie-voicing-results-v1");localStorage.removeItem("harmonie-parcours-v1");localStorage.removeItem("harmonie-progress-v2")}catch(e){}stats()}};
}
function render(){
 if(screen==="home")home();else if(screen==="quiz")quiz();else if(screen==="secondary")secondaryView();else if(screen==="voicings"){if(voicingUI)voicingUI.render();else beginVoicing();}else if(screen==="course"){if(courseUI)courseUI.render();else beginCourse();}else if(screen==="jazz"){if(jazzLabUI)jazzLabUI.render();else beginJazzLab();}else if(screen==="result")results();else stats();
}
window.addEventListener("resize",function(){clearTimeout(resizeHandle);resizeHandle=setTimeout(function(){if(screen==="secondary"&&revealed)secondaryView();else if(screen==="voicings"&&voicingUI)voicingUI.render()},140)});
render();
