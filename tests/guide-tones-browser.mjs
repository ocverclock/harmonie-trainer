import assert from "node:assert/strict";
import {chromium} from "playwright";
import {guideToneStudies} from "../src/guide-tones.js";

const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
try{
 for(const viewport of [{width:375,height:812},{width:1024,height:768}]){
  const context=await browser.newContext({viewport});
  const page=await context.newPage();
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  await page.goto("http://127.0.0.1:8765/",{waitUntil:"networkidle"});
  await page.getByRole("button",{name:"Atelier jazz : voix, oreille, harmonisation"}).click();
  await page.locator('[data-lab-mode="guides"]').waitFor({state:"visible"});
  await page.locator('[data-lab-mode="guides"]').click();
  assert.equal(await page.locator('[data-guide-step]').count(),4);
  const study=guideToneStudies[0];
  for(const task of study.exercises){
   assert.equal(await page.locator(".lab-guide-route").count(),1);
   assert.equal(await page.locator(".lab-guide-keyboard .pianoKey.previous-voicing").count(),1);
   const midi=task.target.midi;
   if(task.index===1){
    const wrong=midi===48?49:midi-1;
    await page.locator('.lab-guide-keyboard [data-midi="'+wrong+'"]').click();
    await page.locator("#guideCheck").click();
    assert.match(await page.locator(".feedback").innerText(),/Résolution à corriger/);
    assert.equal(await page.locator(".lab-guide-keyboard .guide-error").count(),1);
    assert.equal(await page.locator(".lab-guide-keyboard .guide-expected").count(),1);
    await page.locator("#guideRetry").click();
    assert.equal(await page.locator(".feedback").count(),0);
   }
   await page.locator('.lab-guide-keyboard [data-midi="'+midi+'"]').click();
   assert.equal(await page.locator("#guideCheck").isDisabled(),false);
   await page.locator("#guideCheck").click();
   assert.match(await page.locator(".feedback").innerText(),/Bonne résolution/);
   assert.equal(await page.locator(".lab-guide-keyboard .guide-expected").count(),1);
   await page.locator("#guideHearCorrect").click();
   if(task.index===3)assert.match(await page.locator(".explain").innerText(),/4 \/ 4 résolutions réussies/);
   await page.locator("#guideNext").click();
  }
  assert.match(await page.locator(".lab-panel h1").innerText(),/mineur/i);
  const saved=JSON.parse(await page.evaluate(()=>localStorage.getItem("harmonie-progress-v2")));
  const guides=saved.events.filter(x=>x.exerciseId.startsWith("jazzlab:guides:"));
  assert.equal(guides.length,5,"Wrong attempt plus four correct guide-tone answers");
  assert.equal(guides.filter(x=>!x.correct).length,1);
  assert.deepEqual(errors,[]);
  console.log("P03 guide-tone browser smoke OK "+viewport.width+"x"+viewport.height);
  await context.close();
 }
}finally{await browser.close()}
