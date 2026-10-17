// All learner data stays in the browser. No account, server, or external service.
// V1 remains available throughout migration; new events use stable exercise IDs.
export const PROGRESS_KEY="harmonie-progress-v2";
export const LEGACY_KEY="harmonie-parcours-v1";
export const FORMAT="harmonie-trainer-progress";
export const SCHEMA_VERSION=2;
const MAX_EVENTS=3000;
const MAX_FILE_BYTES=2_000_000;
const validTime=(v)=>typeof v==="string"&&v.length<64&&!Number.isNaN(Date.parse(v));
const isObject=v=>v!==null&&typeof v==="object"&&!Array.isArray(v);
const blankObj=()=>Object.create(null);
export function stableExerciseId(lesson,index){
 const e=lesson.exercises[index];
 if(!e)throw new RangeError("Unknown exercise "+lesson.id+":"+index);
 return typeof e.id==="string"&&e.id?e.id:lesson.id+":"+index;
}
export function legacyKey(lesson,index){return lesson.id+":"+index}
export function parseLegacy(raw){
 if(raw===null||raw===undefined||raw==="")return {};
 let obj=typeof raw==="string"?JSON.parse(raw):raw;
 if(!isObject(obj))throw Error("Legacy progress is not an object");
 return obj;
}
export function seedFromLegacy(lessons,raw={},at=new Date().toISOString()){
 const old=parseLegacy(raw),baseline=blankObj();
 for(const lesson of lessons)for(let i=0;i<lesson.exercises.length;i++){
  const k=legacyKey(lesson,i),record=old[k];
  if(!isObject(record))continue;
  const n=Number(record.attempts);
  baseline[stableExerciseId(lesson,i)]={
   attempts:Number.isInteger(n)&&n>=0&&n<100000?n:0,
   mastered:record.correct===true,
   lastAt:validTime(record.at)?record.at:null,
   legacyKey:k
  };
 }
 return {format:FORMAT,schemaVersion:SCHEMA_VERSION,updatedAt:at,legacy:baseline,events:[],cursor:null};
}
export function validateArchive(archive){
 if(!isObject(archive)||archive.format!==FORMAT||archive.schemaVersion!==SCHEMA_VERSION||
  !isObject(archive.legacy)||!Array.isArray(archive.events)||archive.events.length>MAX_EVENTS||
  (archive.cursor!==null&&archive.cursor!==undefined&&!isObject(archive.cursor)))throw Error("Sauvegarde incompatible ou incomplète.");
 if(Object.keys(archive.legacy).length>10000)throw Error("Trop d'acquis dans ce fichier.");
 for(const [id,r] of Object.entries(archive.legacy)){
  if(id.length>180||!isObject(r)||!Number.isInteger(r.attempts)||r.attempts<0||
   r.attempts>100000||typeof r.mastered!=="boolean")throw Error("Acquis invalide : "+id);
 }
 const seen=new Set();
 for(const ev of archive.events){
  if(!isObject(ev)||typeof ev.id!=="string"||!ev.id||ev.id.length>140||
   seen.has(ev.id)||typeof ev.exerciseId!=="string"||ev.exerciseId.length>180||
   typeof ev.correct!=="boolean"||!validTime(ev.at)||
   !Array.isArray(ev.midis)||ev.midis.length>10||
   !ev.midis.every(n=>Number.isInteger(n)&&n>=48&&n<=83))throw Error("Tentative invalide.");
  seen.add(ev.id);
 }
 if(archive.cursor){
  const c=archive.cursor;
  if(typeof c.lessonId!=="string"||typeof c.exerciseId!=="string"||
   c.lessonId.length>180||c.exerciseId.length>180)throw Error("Position de reprise invalide.");
 }
 return true;
}
export function readArchive(storage,lessons,at=new Date().toISOString()){
 const raw=storage.getItem(PROGRESS_KEY);
 if(raw){
  if(raw.length>MAX_FILE_BYTES)throw Error("Suivi local trop volumineux.");
  let state=JSON.parse(raw);validateArchive(state);return state;
 }
 return seedFromLegacy(lessons,storage.getItem(LEGACY_KEY),at);
}
export function storeArchive(storage,archive){
 validateArchive(archive);
 storage.setItem(PROGRESS_KEY,JSON.stringify(archive));
 return true;
}
export function withCursor(archive,lesson,index,at=new Date().toISOString()){
 return {...archive,updatedAt:at,cursor:{lessonId:lesson.id,exerciseId:stableExerciseId(lesson,index),at}};
}
export function withAttempt(archive,lesson,index,midis,correct,at=new Date().toISOString(),eventId){
 const id=eventId||(typeof crypto!=="undefined"&&crypto.randomUUID?crypto.randomUUID():at+"-"+Math.random().toString(36).slice(2));
 const event={id,at,lessonId:lesson.id,exerciseId:stableExerciseId(lesson,index),
  tonality:lesson.exercises[index].tonality||"unspecified",correct:!!correct,
  midis:[...midis].sort((a,b)=>a-b)};
 const events=[...archive.events,event].slice(-MAX_EVENTS);
 const result=withCursor({...archive,events},lesson,index,at);
 validateArchive(result);return result;
}
export function progressByExercise(archive){
 const records=blankObj();
 for(const [id,r] of Object.entries(archive.legacy))records[id]={
  attempts:r.attempts,mastered:r.mastered,lastCorrect:r.mastered,lastAt:r.lastAt,
  correctCount:r.mastered?1:0,byTonality:blankObj(),importedFromV1:true
 };
 for(const ev of archive.events){
  const r=records[ev.exerciseId]||(records[ev.exerciseId]={
   attempts:0,mastered:false,lastCorrect:false,lastAt:null,correctCount:0,
   byTonality:blankObj(),importedFromV1:false
  });
  r.attempts++;r.mastered=r.mastered||ev.correct;r.correctCount+=Number(ev.correct);
  if(!r.lastAt||ev.at>=r.lastAt){r.lastCorrect=ev.correct;r.lastAt=ev.at}
  let t=r.byTonality[ev.tonality]||(r.byTonality[ev.tonality]={attempts:0,correctCount:0});
  t.attempts++;t.correctCount+=Number(ev.correct);
 }
 return records;
}
export function mergeArchives(current,incoming){
 validateArchive(current);validateArchive(incoming);
 const legacy=blankObj();
 for(const [id,r] of Object.entries(current.legacy))legacy[id]={...r};
 for(const [id,r] of Object.entries(incoming.legacy)){
  const previous=legacy[id];
  if(!previous){legacy[id]={...r};continue}
  legacy[id]={attempts:Math.max(previous.attempts,r.attempts),
   mastered:previous.mastered||r.mastered,
   lastAt:[previous.lastAt,r.lastAt].filter(Boolean).sort().at(-1)||null,
   legacyKey:previous.legacyKey||r.legacyKey};
 }
 const byId=new Map();
 for(const event of [...current.events,...incoming.events])if(!byId.has(event.id))byId.set(event.id,event);
 const events=[...byId.values()].sort((a,b)=>a.at.localeCompare(b.at)).slice(-MAX_EVENTS);
 const newer=(incoming.updatedAt||"")>(current.updatedAt||"");
 const result={format:FORMAT,schemaVersion:SCHEMA_VERSION,
  updatedAt:new Date().toISOString(),legacy,events,cursor:newer?incoming.cursor:current.cursor};
 validateArchive(result);return result;
}
export function parseBackup(raw){
 if(typeof raw!=="string"||raw.length>MAX_FILE_BYTES)throw Error("Fichier trop volumineux.");
 const incoming=JSON.parse(raw);
 validateArchive(incoming);return incoming;
}
export function backupJSON(archive){validateArchive(archive);return JSON.stringify(archive,null,2)}
export function restoreLegacyView(storage,lessons,archive){
 const current=parseLegacy(storage.getItem(LEGACY_KEY));
 const summary=progressByExercise(archive);
 let recovered=0;
 for(const lesson of lessons)for(let index=0;index<lesson.exercises.length;index++){
  const id=stableExerciseId(lesson,index),r=summary[id];
  if(!r)continue;
  const key=legacyKey(lesson,index),old=isObject(current[key])?current[key]:{};
  if(r.mastered&&!old.correct)recovered++;
  current[key]={correct:old.correct===true||r.mastered,
   attempts:Math.max(Number(old.attempts)||0,r.attempts),
   at:[old.at,r.lastAt].filter(validTime).sort().at(-1)||null};
 }
 storage.setItem(LEGACY_KEY,JSON.stringify(current));return recovered;
}
