import assert from "node:assert/strict";
import {chromium} from "playwright";
import {voiceStudies} from "../src/jazz-lab.js";

const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
try{
 for(const viewport of [{width:375,height:812},{width:1024,height:768}]){
  const context=await browser.newContext({viewport});
  const page=await context.newPage();
  const errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.goto("http://127.0.0.1:8765/",{waitUntil:"networkidle"});
  await page.getByRole("button",{name:"Atelier jazz : voix, oreille, harmonisation"}).click();
  await page.locator('[data-lab-mode="voice"]').waitFor({state:"visible"});
  await page.locator('[data-lab-mode="voice"]').click();
  const first=voiceStudies[0].frames[0],second=voiceStudies[0].frames[1];
  for(const midi of first.example)await page.locator('[data-midi="'+midi+'"]').click();
  await page.locator("#labCheck").click();
  assert.match(await page.locator(".feedback").innerText(),/Accord juste/);
  await page.locator("#labNext").click();
  for(const midi of [48,50,52,53])await page.locator('[data-midi="'+midi+'"]').click();
  await page.locator("#labCheck").click();
  const erroneous=await page.locator(".feedback").innerText();
  assert.match(erroneous,/Accord à corriger/);
  assert.match(erroneous,/Notes communes et mouvements/);
  assert.match(erroneous,/corrige d’abord ses notes/);
  assert.equal(await page.locator("#labSuggestion").count(),0,
   "A wrong chord must not be presented as an efficient voicing");
  await page.locator("#labRetry").click();
  await page.locator("#labClear").click();
  for(const midi of second.example)await page.locator('[data-midi="'+midi+'"]').click();
  await page.locator("#labCheck").click();
  const feedback=await page.locator(".feedback").innerText();
  assert.match(feedback,/Accord juste/);
  assert.match(feedback,/Touches communes conservées|Aucune touche exactement conservée/);
  assert.match(feedback,/grave → aigu/);
  assert.match(feedback,/Disposition alternative valide/);
  assert.equal(await page.locator("#labSuggestion").count(),1);
  assert.deepEqual(errors,[]);
  console.log("P02 voicing evaluation browser test OK "+viewport.width+"×"+viewport.height);
  await context.close();
 }
}finally{await browser.close()}
