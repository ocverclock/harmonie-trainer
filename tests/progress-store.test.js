import test from "node:test";
import assert from "node:assert/strict";
import {lessons} from "../src/curriculum.js";
import {FORMAT,SCHEMA_VERSION,PROGRESS_KEY,LEGACY_KEY,stableExerciseId,
 seedFromLegacy,readArchive,storeArchive,withCursor,withAttempt,progressByExercise,
 mergeArchives,parseBackup,backupJSON,restoreLegacyView,validateArchive} from "../src/progress-store.js";

function storage(initial={}){
 const values=new Map(Object.entries(initial));
 return {getItem:key=>values.has(key)?values.get(key):null,
  setItem:(key,value)=>{values.set(key,String(value))},values};
}
const now="2026-10-17T16:00:00.000Z";

test("migration imports historical mastery without rearranging exercise indexes",()=>{
 const legacy={ "tetrades:0":{correct:true,attempts:3,at:now},
   "tetrades:2":{correct:false,attempts:2,at:now},
   "position-1375:0":{correct:true,attempts:1,at:now}};
 const s=storage({[LEGACY_KEY]:JSON.stringify(legacy)});
 const archive=readArchive(s,lessons,now);
 assert.equal(archive.schemaVersion,2);
 assert.equal(archive.format,FORMAT);
 assert.equal(archive.legacy["tetrades:0"].mastered,true);
 assert.equal(archive.legacy["tetrades:0"].attempts,3);
 assert.equal(archive.legacy["tetrades:2"].mastered,false);
 assert.equal(archive.legacy["position-1375:0"].mastered,true);
 assert.equal(stableExerciseId(lessons[0],0),"tetrades:0");
 assert.equal(stableExerciseId(lessons[0],3),"tetrades:d-major:v1");
 assert.equal(s.getItem(LEGACY_KEY),JSON.stringify(legacy),"source v1 remains unchanged");
 assert.ok(!s.getItem(PROGRESS_KEY),"migration read alone does not write or delete storage");
 storeArchive(s,archive);
 assert.deepEqual(JSON.parse(JSON.stringify(readArchive(s,lessons,now))),JSON.parse(JSON.stringify(archive)));
 assert.equal(s.getItem(LEGACY_KEY),JSON.stringify(legacy));
});

test("last cursor and per-tonality attempts keep older success and recent mistake",()=>{
 let model=seedFromLegacy(lessons,{"tetrades:0":{correct:true,attempts:1,at:now}},now);
 model=withCursor(model,lessons[0],3,now);
 assert.deepEqual(model.cursor,{lessonId:"tetrades",exerciseId:"tetrades:d-major:v1",at:now});
 model=withAttempt(model,lessons[0],3,[50,54,57,61],true,now,"attempt-1");
 model=withAttempt(model,lessons[0],3,[50,54,57,60],false,"2026-10-17T17:00:00.000Z","attempt-2");
 assert.ok(validateArchive(model));
 const summary=progressByExercise(model);
 assert.equal(summary["tetrades:d-major:v1"].attempts,2);
 assert.equal(summary["tetrades:d-major:v1"].correctCount,1);
 assert.equal(summary["tetrades:d-major:v1"].mastered,true);
 assert.equal(summary["tetrades:d-major:v1"].lastCorrect,false);
 assert.equal(summary["tetrades:d-major:v1"].byTonality["D majeur"].attempts,2);
 assert.equal(summary["tetrades:0"].mastered,true);
});

test("portable JSON roundtrips and merges deduplicated events, keeping old grades",()=>{
 const user=seedFromLegacy(lessons,{"tetrades:0":{correct:true,attempts:2,at:now}},now);
 const newer=withAttempt(seedFromLegacy(lessons,{},now),lessons[0],3,[50,54,57,61],true,now,"shared-uuid");
 const imported=parseBackup(backupJSON(newer));
 assert.deepEqual(JSON.parse(JSON.stringify(imported)),JSON.parse(JSON.stringify(newer)));
 const merged=mergeArchives(user,imported);
 assert.equal(merged.events.length,1);
 assert.equal(merged.legacy["tetrades:0"].mastered,true);
 assert.equal(mergeArchives(merged,imported).events.length,1);
 const destination=storage({[LEGACY_KEY]:JSON.stringify({"tetrades:0":{correct:true,attempts:2,at:now}})});
 storeArchive(destination,merged);
 const revived=restoreLegacyView(destination,lessons,merged);
 assert.equal(revived,1);
 const legacy=JSON.parse(destination.getItem(LEGACY_KEY));
 assert.equal(legacy["tetrades:0"].correct,true);
 assert.equal(legacy["tetrades:0"].attempts>=2,true);
 assert.equal(legacy["tetrades:3"].correct,true);
});

test("corrupted imports and blocked storage do not overwrite existing records",()=>{
 for(const s of ["", "not json", "{}", '{"format":"harmonie-trainer-progress","schemaVersion":2}']){
  assert.throws(()=>parseBackup(s));
 }
 const s=storage({[LEGACY_KEY]:'{"tetrades:0":{"correct":true,"attempts":1}}'});
 assert.throws(()=>readArchive(storage({[PROGRESS_KEY]:"broken", [LEGACY_KEY]:s.getItem(LEGACY_KEY)}),lessons));
 const model=seedFromLegacy(lessons,{},now);
 model.events=[{id:"bad",at:now,lessonId:"tetrades",exerciseId:"tetrades:0",midis:[999],correct:true}];
 assert.throws(()=>validateArchive(model));
 let writes=0;
 assert.throws(()=>storeArchive({setItem:()=>{writes++;throw Error("Quota exceeded")}},seedFromLegacy(lessons,{},now)));
 assert.equal(writes,1);
 assert.ok(s.getItem(LEGACY_KEY).includes("tetrades:0"));
});
