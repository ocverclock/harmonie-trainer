import assert from "node:assert/strict";
import {chromium} from "playwright";
import {inversionStudies} from "../src/inversion-lessons.js";

const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
try{
 for(const viewport of [{width:375,height:812},{width:1024,height:768}]){
  const context=await browser.newContext({viewport});
  const page=await context.newPage(),errors=[];
  page.on("pageerror",error=>errors.push(error.message));
  await page.goto("http://127.0.0.1:8765/",{waitUntil:"networkidle"});
  await page.getByRole("button",{name:"Atelier jazz : voix, oreille, harmonisation"}).click();
  assert.equal(await page.locator(".lab-tile").count(),5);
  await page.locator('[data-lab-mode="inversions"]').click();
  assert.match(await page.locator(".lab-panel h1").innerText(),/Cmaj7/);
  assert.equal(await page.locator(".lab-inversion-degrees > div").count(),4);
  assert.equal(await page.locator("[data-inversion-step]").count(),4);
  assert.equal(await page.locator("#inversionChord option").count(),inversionStudies.length);
  assert.equal(await page.locator(".inv-example").count(),0,"Do not reveal example before validation");
  const study=inversionStudies[0];
  // Complete the root-position lesson first.
  for(const midi of study.exercises[0].reference)
   await page.locator('.inv-input [data-midi="'+midi+'"]').click();
  await page.locator("#invCheck").click();
  assert.match(await page.locator(".feedback").innerText(),/Renversement correct/);
  await page.locator("#invNext").click();
  // First inversion includes a harmonic error (good bass, missing pitch).
  for(const midi of [52,55,59,73])await page.locator('.inv-input [data-midi="'+midi+'"]').click();
  assert.equal(await page.locator(".inv-played-bass").count(),1);
  assert.equal(await page.locator('.inv-played-bass[data-midi="52"]').count(),1);
  await page.locator("#invCheck").click();
  assert.match(await page.locator(".feedback").innerText(),/Notes de l’accord à corriger/);
  assert.equal(await page.locator(".inv-example").count(),1);
  assert.equal(await page.locator(".inv-expected-bass").count(),1);
  assert.equal(await page.locator(".pianoKey.inv-played-bass").count(),1);
  assert.equal(await page.locator(".inv-example .pianoKey").count(),36);
  await page.locator("#invRetry").click();
  assert.equal(await page.locator(".inv-example").count(),0);
  // Now play all chord tones, but wrong inversion: C on the bass instead of E.
  for(const midi of [60,64,67,71])await page.locator('.inv-input [data-midi="'+midi+'"]').click();
  await page.locator("#invCheck").click();
  assert.match(await page.locator(".feedback").innerText(),/Accord juste, mais basse incorrecte/);
  assert.equal(await page.locator(".inv-error-bass").count(),1);
  assert.equal(await page.locator(".inv-expected-bass").count(),1);
  assert.match(await page.locator(".feedback").innerText(),/Basse attendue : Mi/);
  await page.locator("#invRetry").click();
  for(const midi of study.exercises[1].reference)
   await page.locator('.inv-input [data-midi="'+midi+'"]').click();
  await page.locator("#invCheck").click();
  assert.match(await page.locator(".feedback").innerText(),/Renversement correct/);
  assert.equal(await page.locator(".inv-error-bass").count(),0);
  await page.locator("#invNext").click();
  assert.equal(await page.locator('.lab-steps .active').innerText().then(x=>x.includes("Troisième")),false);
  // Complete other inversions, including the seventh in bass.
  for(const step of [2,3]){
   for(const midi of study.exercises[step].reference)
    await page.locator('.inv-input [data-midi="'+midi+'"]').click();
   await page.locator("#invCheck").click();
   assert.match(await page.locator(".feedback").innerText(),/Renversement correct/);
   if(step===2)await page.locator("#invNext").click();
  }
  assert.match(await page.locator(".explain").innerText(),/4 \/ 4 renversements réussis/);
  const saved=JSON.parse(await page.evaluate(()=>localStorage.getItem("harmonie-progress-v2")));
  const records=saved.events.filter(ev=>ev.exerciseId.startsWith("jazzlab:inversions:cmaj7:"));
  assert.equal(records.length,6,"Two wrong attempts and four correct answers");
  assert.equal(records.filter(ev=>!ev.correct).length,2);
  assert.equal(records.filter(ev=>ev.correct).length,4);
  await page.locator("#inversionChord").selectOption("ebmaj7");
  assert.match(await page.locator(".lab-panel h1").innerText(),/E♭maj7/);
  assert.equal(await page.locator(".feedback").count(),0);
  assert.equal(await page.locator(".inv-example").count(),0);
  assert.deepEqual(errors,[]);
  console.log("P07 inversion and bass browser OK "+viewport.width+"x"+viewport.height);
  await context.close();
 }
}finally{await browser.close()}
