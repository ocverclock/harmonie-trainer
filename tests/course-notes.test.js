import test from "node:test";
import assert from "node:assert/strict";
import {lessons,checkExercise,TOTAL_EXERCISES} from "../src/curriculum.js";
import {chapterCourses,lessonCourses,validateCourseNotes} from "../src/course-notes.js";
import {extraExercises,extraExerciseCount} from "../src/tonality-variants.js";

test("every one of 21 lessons and four chapters has a substantial introduction",()=>{
 assert.equal(lessons.length,21);
 assert.equal(Object.keys(chapterCourses).length,4);
 assert.equal(Object.keys(lessonCourses).length,21);
 assert.ok(validateCourseNotes(lessons));
 for(const lesson of lessons){
  const notes=lessonCourses[lesson.id];
  assert.ok(notes.why.length>20);
  assert.ok(notes.concept.length>45);
  assert.ok(notes.example.length>30);
  assert.ok(notes.question.length>20);
  assert.ok(notes.answer.length>2);
  assert.ok(notes.listen.every(m=>Number.isInteger(m)&&m>=48&&m<=83));
  assert.ok(notes.compare.every(m=>Number.isInteger(m)&&m>=48&&m<=83));
 }
});
test("new variants are appended without changing legacy progress keys or original answers",()=>{
 assert.equal(extraExerciseCount,37);
 assert.equal(TOTAL_EXERCISES,52+extraExerciseCount);
 const t=lessons.find(x=>x.id==="tetrades");
 assert.deepEqual(t.exercises[0].midis,[48,52,55,59]);
 assert.deepEqual(t.exercises[1].midis,[55,59,62,65]);
 assert.deepEqual(t.exercises[2].midis,[57,60,64,67]);
 const allNew=Object.values(extraExercises).flat();
 assert.equal(new Set(allNew.map(x=>x.id)).size,allNew.length);
 for(const lesson of lessons){
  const added=extraExercises[lesson.id]||[];
  assert.deepEqual(lesson.exercises.slice(-added.length),added);
  for(const exercise of added){
   assert.equal(checkExercise(exercise,exercise.midis).correct,true,exercise.id);
   assert.ok(exercise.tonality&&exercise.spelling);
   assert.equal(new Set(exercise.midis).size,exercise.midis.length);
   assert.ok(exercise.midis.every(m=>m>=48&&m<=83));
  }
 }
});
test("real tetrad inversions change the bass and fixed voicing layouts do not",()=>{
 const t=extraExercises.tetrades;
 const bass=Object.fromEntries(t.map(x=>[x.id,x.midis[0]]));
 assert.equal(bass["tetrades:c-inversion1:v1"],52);
 assert.equal(bass["tetrades:d-inversion1:v1"],54);
 assert.equal(bass["tetrades:c-inversion2:v1"],55);
 assert.equal(bass["tetrades:c-inversion3:v1"],59);
 const layout=extraExercises["position-1375"][0];
 assert.equal(layout.midis[0],50);
 assert.deepEqual(layout.midis,[50,54,61,69]);
 assert.equal(checkExercise(layout,[54,57,61,62]).correct,false);
});
test("black keys form a meaningful part of the additional practice",()=>{
 const notes=Object.values(extraExercises).flatMap(arr=>arr.flatMap(e=>e.midis));
 const black=new Set([1,3,6,8,10]);
 const blackCount=notes.filter(n=>black.has(n%12)).length;
 assert.ok(blackCount>=60,"Only "+blackCount+" black notes in variants");
 assert.ok(blackCount/notes.length>.4);
 assert.ok(Object.values(extraExercises).flat().some(e=>e.tonality==="F♯ majeur"));
 assert.ok(Object.values(extraExercises).flat().some(e=>e.tonality==="D♭ majeur"));
});
