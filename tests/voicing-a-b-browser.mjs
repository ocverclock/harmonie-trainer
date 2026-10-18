import assert from "node:assert/strict";
import {chromium} from "playwright";
import {voiceStudies} from "../src/jazz-lab.js";
import {assessVoicingTransition} from "../src/voice-leading-feedback.js";
import {buildVoicingComparison} from "../src/voicing-a-b.js";

const hz=m=>440*Math.pow(2,(m-69)/12);
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
try{
 for(const viewport of [{width:375,height:812},{width:1024,height:768}]){
  const context=await browser.newContext({viewport});
  const page=await context.newPage(),errors=[];
  page.on("pageerror",err=>errors.push(err.message));
  await page.addInitScript(()=>{
   window.__tones=[];
   window.AudioContext=class{
    constructor(){this.state="running";this.currentTime=0;this.destination={}}
    createOscillator(){const o={type:"",frequency:{value:0},onended:null,
     connect(){return this},start(){window.__tones.push(this.frequency.value)},
     stop(){}};return o}
    createGain(){return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},
     connect(){return this}}}
    resume(){this.state="running";return Promise.resolve()}
   };
  });
  await page.goto("http://127.0.0.1:8765/",{waitUntil:"networkidle"});
  await page.getByRole("button",{name:"Atelier jazz : voix, oreille, harmonisation"}).click();
  await page.locator('[data-lab-mode="voice"]').waitFor({state:"visible"});
  await page.locator('[data-lab-mode="voice"]').click();
  const first=voiceStudies[0].frames[0];
  const previous=first.example,remote=[50,54,57,60];
  for(const midi of previous)await page.locator('[data-midi="'+midi+'"]').click();
  await page.locator("#labCheck").click();
  await page.locator("#labNext").click();
  for(const midi of remote)await page.locator('[data-midi="'+midi+'"]').click();
  await page.locator("#labCheck").click();
  const comparison=buildVoicingComparison(previous,remote,assessVoicingTransition("D7",previous,remote,true));
  assert.equal(comparison.available,true);
  assert.match(await page.locator(".feedback").innerText(),/Accord juste/);
  assert.equal(await page.locator(".lab-ab-card").count(),2);
  assert.equal(await page.locator("#labListenA").count(),1);
  assert.equal(await page.locator("#labListenB").count(),1);
  assert.equal(await page.locator("#labListenAB").count(),1);
  assert.match(await page.locator(".lab-ab").innerText(),/Ce n’est pas une meilleure réponse harmonique/);
  await page.locator("#labListenAB").click();
  await page.waitForFunction(()=>window.__tones.length===16,null,{timeout:8000});
  const tones=await page.evaluate(()=>window.__tones);
  const expected=[...previous,...remote,...previous,...comparison.alternative].map(hz);
  assert.equal(tones.length,expected.length);
  tones.forEach((frequency,i)=>assert.ok(Math.abs(frequency-expected[i])<.001,
   "Wrong pitch at A/B step "+i+": "+frequency+" vs "+expected[i]));
  // Fast navigation cancels the pending second chord of A.
  await page.locator("#labListenA").click();
  assert.equal((await page.evaluate(()=>window.__tones)).length,20);
  await page.locator("#labRetry").click();
  await page.waitForTimeout(1200);
  assert.equal((await page.evaluate(()=>window.__tones)).length,20,
   "No delayed playback after the learner navigates or retries");
  assert.equal(await page.locator(".lab-ab").count(),0);
  await page.locator("#labClear").click();
  for(const midi of voiceStudies[0].frames[1].example)
   await page.locator('[data-midi="'+midi+'"]').click();
  await page.locator("#labCheck").click();
  assert.match(await page.locator(".feedback").innerText(),/Accord juste/);
  assert.match(await page.locator(".feedback").innerText(),/déjà aussi économique/);
  assert.equal(await page.locator("#labListenAB").count(),0,
   "Do not invent a more efficient voicing if the pupil is already optimal");
  assert.deepEqual(errors,[]);
  console.log("P05 real audible A/B and cancellation OK "+viewport.width+"x"+viewport.height);
  await context.close();
 }
}finally{await browser.close()}
