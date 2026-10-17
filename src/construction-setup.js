import {constructionLevels,constructionDifficulties,levelOf,difficultyOf} from "./practice-random.js?v=4";
// A two-choice setup: chord formula belongs to the level, root selection belongs to difficulty.
export function constructionSetupHTML(level,difficulty,sessionsCount,escapeText){
 const e=escapeText,selected=levelOf(level),mode=difficultyOf(difficulty);
 return '<section class="card" id="constructionSettings"><h2>Construire les accords</h2>'+
 '<p class="muted">Le <strong>niveau</strong> définit les notes à construire. La <strong>difficulté</strong> fait varier les fondamentales et les aides, sans modifier la structure.</p>'+
 '<h3>1 — Choisir un niveau</h3><div class="construction-level-grid" role="group" aria-label="Huit niveaux de construction">'+
 constructionLevels.map(x=>'<button type="button" data-level="'+x.id+'" class="construction-level-choice '+(x.id===level?'active':'')+
 '" aria-pressed="'+(x.id===level)+'"><strong>Niveau '+x.id+' — '+e(x.label)+'</strong><span>'+e(x.summary)+'</span></button>').join("")+'</div>'+
 '<h3>2 — Choisir les tonalités</h3><div class="difficulty-grid" role="group" aria-label="Difficulté des tonalités">'+
 Object.entries(constructionDifficulties).map(([id,x])=>'<button type="button" data-difficulty="'+id+
 '" class="difficulty-choice '+(id===difficulty?'active':'')+'" aria-pressed="'+(id===difficulty)+'"><strong>'+
 e(x.label)+'</strong><span>'+e(x.description)+'</span></button>').join("")+'</div>'+
 '<div class="construction-recap" role="status"><strong>Niveau '+level+' — '+e(selected.label)+'</strong>'+
 '<span>'+e(selected.summary)+' · '+e(mode.label)+' · 10 exercices aléatoires</span>'+
 '<p>'+e(selected.description)+'</p></div>'+
 '<div class="row"><button class="btn primary" id="startConstruction">Commencer les 10 exercices</button></div>'+
 '<p class="subtle">'+sessionsCount+' session(s) enregistrée(s) sur cet appareil. Les résultats anciens restent conservés.</p></section>';
}
