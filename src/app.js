import {names,exercises,degrees,grade,sessionFor,secondary,validateBank} from "./music.js";

const app=document.getElementById("app");
if(!validateBank())throw new Error("Corpus musical invalide");
let screen="home",level=1,session=[],questionIndex=0,selected=new Set(),checked=null,score=0;
let secondaryIndex=0,choice=-1,revealed=false,activeFrame=0,isolated=-1,voiceModule=null,voiceError=false;
let audioCtx=null,resizeHandle=0;
const storage="harmonie-sessions-v2";
function escapeText(t){return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}
function readScores(){try{let a=JSON.parse(localStorage.getItem(storage)||"[]");return Array.isArray(a)?a:[]}catch(e){return []}}
function storeScores(a){try{localStorage.setItem(storage,JSON.stringify(a.slice(-100)));return true}catch(e){return false}}
function button(label,id,kind,disabled){return '<button id="'+id+'" class="btn '+(kind||'quiet')+'"'+(disabled?' disabled':'')+'>'+label+'</button>'}
function shell(body){
 app.innerHTML='<div class="wrap"><header class="top"><div class="brand"><span>♫</span> Harmonie Trainer</div><nav class="nav" aria-label="Navigation">'+
 ['home:Accueil','secondary:II–V–I secondaires','quiz:Accords','stats:Progression'].map(function(item){
  let parts=item.split(":");return '<button data-nav="'+parts[0]+'" class="'+(screen===parts[0]?'active':'')+'">'+parts[1]+'</button>';
 }).join("")+'</nav></header><main>'+body+'</main><footer class="footer">Prototype pédagogique — aucune donnée transmise. Les scores sont stockés sur cet appareil.</footer></div>';
 app.querySelectorAll("[data-nav]").forEach(function(b){b.onclick=function(){
  let n=b.dataset.nav;
  if(n==="quiz"){screen="home";render()}else{screen=n;render()}
 }});
}
function piano(chosen,highlight,live){
 const whiteW=52,blackW=36;let whites=[],blacks=[],count=0;
 for(let midi=48;midi<=83;midi++){
  let pc=midi%12,isBlack=[1,3,6,8,10].includes(pc),note=names[pc]+(Math.floor(midi/12)-1);
  let isSelected=chosen.has(pc),marked=highlight.includes(midi);
  let attributes=' aria-label="'+escapeText(note)+'" aria-pressed="'+(isSelected?'true':'false')+'" ';
  let click=live?'data-midi="'+midi+'"':'data-preview="'+midi+'"';
  if(!isBlack){
   let label=(pc===0?'C'+(Math.floor(midi/12)-1):names[pc]);
   whites.push('<button class="pianoKey white '+(isSelected?'selected ':'')+(marked?'marked':'')+'" style="left:'+(count*whiteW)+'px" '+attributes+click+'><span class="keyText">'+label+'</span></button>');
   count++;
  }else{
   let left=count*whiteW-blackW/2;
   blacks.push('<button class="pianoKey black '+(isSelected?'selected ':'')+(marked?'marked':'')+'" style="left:'+left+'px" '+attributes+click+'><span class="keyText">'+names[pc]+'</span></button>');
  }
 }
 return '<div class="piano-scroll"><div class="piano-rack"><div class="piano" style="width:'+(count*whiteW)+'px">'+whites.join("")+blacks.join("")+'</div></div></div>';
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
 '<div class="row">'+button("Travailler les II–V–I secondaires","openSecondary","primary")+button("Construire les accords","openChords","quiet")+'</div></section>'+
 '<section class="card"><h2>Un vrai clavier interactif</h2><p class="muted">Touches blanches et noires superposées comme sur un piano. L’affichage s’adapte au téléphone et à la tablette.</p>'+
 piano(new Set(),[],false)+'</section>'+
 '<section class="card"><h2>Choisir un niveau d’accords</h2><div class="grid">'+[
  ["Triades","Majeures et mineures"],["Accords de septième","maj7, m7 et dominantes"],["Accords avancés","Diminués et demi-diminués"]
 ].map(function(x,i){return '<button class="btn level" data-level="'+(i+1)+'"><strong>Niveau '+(i+1)+' — '+x[0]+'</strong><small>'+x[1]+'</small></button>'}).join("")+'</div><p class="subtle">'+a.length+' session(s) enregistrée(s) sur cet appareil.</p></section>');
 document.getElementById("openSecondary").onclick=function(){screen="secondary";secondaryIndex=0;choice=-1;revealed=false;activeFrame=0;isolated=-1;render()};
 document.getElementById("openChords").onclick=function(){start(level)};
 app.querySelectorAll("[data-level]").forEach(function(b){b.onclick=function(){start(Number(b.dataset.level))}});
 app.querySelectorAll("[data-preview]").forEach(function(b){b.onclick=function(){play([Number(b.dataset.preview)])}});
}
function start(l){level=l;session=sessionFor(level);questionIndex=0;selected=new Set();checked=null;score=0;screen="quiz";render()}
function quiz(){
 const ex=session[questionIndex];
 let body='<section class="card"><div class="row between"><span class="badge">Niveau '+level+'</span><span class="muted">Question '+(questionIndex+1)+'/10</span></div>'+
 '<p class="eyebrow" style="margin-top:20px">Construis l’accord</p><div class="symbol">'+escapeText(ex.symbol)+'</div><p class="muted">Appuie sur toutes ses notes. L’octave et l’ordre n’influencent pas la réponse.</p>'+
 piano(selected,[],true)+'<div class="row">'+button("Effacer","clear","quiet",!!checked)+button("Écouter mon choix","hear","quiet",!selected.size)+button("Valider","validate","primary",!!checked||!selected.size)+'</div>';
 if(checked){
  let missing=checked.missing.map(noteLabel).join(", "),extra=checked.extra.map(noteLabel).join(", ");
  body+='<div class="feedback '+(checked.correct?'correct':'')+'" role="status"><strong>'+(checked.correct?'Exact !':'Pas encore.')+'</strong>'+
  '<p>Notes de '+escapeText(ex.symbol)+' : <b>'+escapeText(ex.spelling)+'</b></p><p>Intervalles : '+degrees[ex.quality]+'</p>'+
  (!checked.correct?'<p>'+(missing?'Manquantes : '+missing+'. ':'')+(extra?'En trop : '+extra+'.':'')+'</p>':'')+
  button("Écouter l’accord juste","correctSound","quiet")+button(questionIndex===9?"Voir mon bilan":"Question suivante","next","primary")+'</div>';
 }
 body+='</section>';shell(body);
 const scroll=app.querySelector(".piano-scroll");if(Number.isFinite(quiz.scrollX))scroll.scrollLeft=quiz.scrollX;
 app.querySelectorAll("[data-midi]").forEach(function(b){b.onclick=function(){
  if(checked)return;quiz.scrollX=scroll.scrollLeft;
  let pc=Number(b.dataset.midi)%12;selected.has(pc)?selected.delete(pc):selected.add(pc);quiz();
 }});
 document.getElementById("clear").onclick=function(){selected.clear();quiz()};
 document.getElementById("hear").onclick=function(){play([...selected].map(function(x){return x+60}))};
 document.getElementById("validate").onclick=function(){if(!selected.size||checked)return;checked=grade(ex,[...selected]);if(checked.correct)score+=10;quiz()};
 if(checked){
  document.getElementById("correctSound").onclick=function(){play(ex.expected.map(function(n){return n+60}))};
  document.getElementById("next").onclick=function(){
   quiz.scrollX=0;
   if(questionIndex===9){let history=readScores();history.push({level:level,score:score,at:new Date().toISOString()});storeScores(history);screen="result";render();}
   else{questionIndex++;checked=null;selected=new Set();quiz()}
  };
 }
}
function results(){
 shell('<section class="card"><h2>Session terminée</h2><p class="score">'+score+'/100</p><p>'+score/10+' réponses justes sur 10.</p><div class="row">'+button("Rejouer","again","primary")+button("II–V–I secondaires","goSecondary","quiet")+'</div></section>');
 document.getElementById("again").onclick=function(){start(level)};
 document.getElementById("goSecondary").onclick=function(){screen="secondary";secondaryIndex=0;choice=-1;revealed=false;render()};
}
function preloadDiagram(){
 if(voiceModule||voiceError)return;
 import("./voices.js").then(function(mod){voiceModule=mod;if(screen==="secondary"&&revealed)render()})
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
   body+=voiceModule.diagram(q.progression,activeFrame,isolated,document.documentElement.clientWidth)+
    '<div class="timeline">'+frames.map(function(fr,i){return '<button data-frame="'+i+'" class="btn '+(activeFrame===i?'active':'')+'">'+(i+1)+'. '+escapeText(fr.symbol)+'</button>'}).join("")+'</div>'+
    '<div class="legend">'+f.voices.map(function(v,i){return '<button data-voice="'+i+'" class="'+(isolated!==-1&&isolated!==i?'faded':'')+'"><span class="dot" style="background:'+voiceModule.voiceColors[i]+'"></span>Voix '+(i+1)+' · '+escapeText(v.note)+'</button>'}).join("")+'</div>'+
    '<p class="explain">'+escapeText(voiceModule.movementSummary(q.progression,activeFrame))+'</p>';
  }else body+='<p class="muted">'+(voiceError?'Visualisation momentanément indisponible. Actualise la page en ligne.':'Chargement de la visualisation…')+'</p>';
  body+='<p class="muted">Le clavier ci-dessous montre uniquement les notes de l’accord actif : <b>'+escapeText(f.symbol)+'</b> ('+f.voices.map(function(v){return escapeText(v.note)}).join(' · ')+').</p>'+
  piano(new Set(),f.voices.map(function(v){return v.midi}),false)+
  '<div class="row">'+button("← Accord précédent","prevFrame","quiet",activeFrame===0)+button("Accord suivant →","nextFrame","primary",activeFrame===2)+'</div>';
 }
 body+='<div class="row between" style="margin-top:22px">'+button("Question précédente","prevQ","quiet",secondaryIndex===0)+button(secondaryIndex===secondary.length-1?"Recommencer le module":"Question suivante →","nextQ","primary")+'</div></section>';
 shell(body);
 if(!revealed){
  app.querySelectorAll("[data-choice]").forEach(function(b){b.onclick=function(){choice=Number(b.dataset.choice);secondaryView()}});
  document.getElementById("eraseChoice").onclick=function(){choice=-1;secondaryView()};
  document.getElementById("confirmChoice").onclick=function(){
   if(choice<0)return;revealed=true;activeFrame=0;isolated=-1;preloadDiagram();secondaryView();
  };
 }else{
  document.getElementById("hearFrame").onclick=function(){play(isolated===-1?frames[activeFrame].voices.map(function(v){return v.midi}):[frames[activeFrame].voices[isolated].midi])};
  app.querySelectorAll("[data-frame]").forEach(function(b){b.onclick=function(){activeFrame=Number(b.dataset.frame);secondaryView()}});
  app.querySelectorAll("[data-voice]").forEach(function(b){b.onclick=function(){let n=Number(b.dataset.voice);isolated=isolated===n?-1:n;secondaryView()}});
  app.querySelectorAll("[data-preview]").forEach(function(b){b.onclick=function(){play([Number(b.dataset.preview)])}});
  document.getElementById("prevFrame").onclick=function(){if(activeFrame>0){activeFrame--;secondaryView()}};
  document.getElementById("nextFrame").onclick=function(){if(activeFrame<2){activeFrame++;secondaryView()}};
 }
 document.getElementById("prevQ").onclick=function(){if(secondaryIndex>0){secondaryIndex--;resetSecondary()}};
 document.getElementById("nextQ").onclick=function(){secondaryIndex=(secondaryIndex+1)%secondary.length;resetSecondary()};
}
function resetSecondary(){choice=-1;revealed=false;activeFrame=0;isolated=-1;secondaryView()}
function stats(){
 const a=readScores();shell('<section class="card"><h2>Ma progression</h2><p class="muted">Sessions enregistrées uniquement sur cet appareil.</p>'+
 '<p>'+a.length+' session(s)</p><p>'+(a.length?a.slice(-10).reverse().map(function(s){return 'Niveau '+s.level+' : '+s.score+'/100'}).join(' · '):'Aucun résultat pour le moment.')+'</p>'+
 button("Effacer la progression","eraseHistory","quiet")+'</section>');
 document.getElementById("eraseHistory").onclick=function(){if(confirm("Effacer tous les scores enregistrés ?")){storeScores([]);stats()}};
}
function render(){
 if(screen==="home")home();else if(screen==="quiz")quiz();else if(screen==="secondary")secondaryView();else if(screen==="result")results();else stats();
}
window.addEventListener("resize",function(){clearTimeout(resizeHandle);resizeHandle=setTimeout(function(){if(screen==="secondary"&&revealed)secondaryView()},140)});
render();
