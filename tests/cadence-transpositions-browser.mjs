import assert from "node:assert/strict";
import {chromium} from "playwright";
import {transposedVoiceStudies} from "../src/cadence-transpositions.js";

const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
try{
 for(const viewport of [{width:375,height:812},{width:1024,height:768}]){
  const context=await browser.newContext({viewport});
  const page=await context.newPage(),errors=[];
  page.on("pageerror",err=>errors.push(err.message));
  await page.goto("http://127.0.0.1:8765/",{waitUntil:"networkidle"});
  await page.getByRole("button",{name:"Atelier jazz : voix, oreille, harmonisation"}).click();
  await page.locator('[data-lab-mode="voice"]').waitFor({state:"visible"});
  await page.locator('[data-lab-mode="voice"]').click();
  await page.locator("#cadenceTarget").waitFor({state:"visible"});
  assert.equal(await page.locator("#cadenceTarget option").count(),12);
  assert.equal(await page.locator("#cadenceTarget option:checked").getAttribute("value"),"to-g");
  assert.equal(await page.locator("#cadenceTarget optgroup").count(),2);
  const db=transposedVoiceStudies.find(s=>s.id==="cad-db");
  await page.locator("#cadenceTarget").selectOption(db.id);
  assert.match(await page.locator(".lab-panel h1").innerText(),/Ré♭ majeur/);
  assert.equal(await page.locator("#cadenceTarget").inputValue(),db.id);
  assert.equal(await page.locator(".lab-steps button").count(),3);
  assert.equal(await page.locator(".lab-panel").innerText().then(x=>x.includes("sensible de Ré♭")),false,
   "Theory explanation must not give away the answer before the learner plays");
  for(const [i,frame] of db.frames.entries()){
   assert.match(await page.locator(".lab-symbol").innerText(),new RegExp(frame.symbol.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")));
   for(const midi of frame.example)await page.locator('[data-midi="'+midi+'"]').click();
   assert.equal(await page.locator("#labCheck").isDisabled(),false);
   await page.locator("#labCheck").click();
   assert.match(await page.locator(".feedback").innerText(),/Accord juste/);
   if(i<2)await page.locator("#labNext").click();
  }
  assert.equal(await page.locator(".explain").count(),1);
  assert.match(await page.locator(".explain").innerText(),/Do naturel est la tierce/);
  assert.match(await page.locator(".explain").innerText(),/3 \/ 3 accords justes/);
  let saved=JSON.parse(await page.evaluate(()=>localStorage.getItem("harmonie-progress-v2")));
  const attempts=saved.events.filter(x=>x.exerciseId.startsWith("jazzlab:voice:cad-db:"));
  assert.deepEqual(attempts.map(x=>x.exerciseId),[
   "jazzlab:voice:cad-db:0","jazzlab:voice:cad-db:1","jazzlab:voice:cad-db:2"]);
  assert.ok(attempts.every(x=>x.correct===true));
  const cm=transposedVoiceStudies.find(s=>s.id==="cad-cm");
  await page.locator("#cadenceTarget").selectOption(cm.id);
  assert.match(await page.locator(".lab-panel h1").innerText(),/Do mineur/);
  assert.equal(await page.locator(".lab-steps button").count(),3);
  assert.equal(await page.locator(".lab-symbol").innerText(),cm.frames[0].symbol);
  assert.match(await page.locator(".lab-panel").innerText(),/12 cadences/);
  assert.deepEqual(errors,[]);
  console.log("P06 transposed II-V-I browser OK "+viewport.width+"x"+viewport.height);
  await context.close();
 }
}finally{await browser.close()}
