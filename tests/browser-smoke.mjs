import assert from "node:assert/strict";
import {chromium} from "playwright";
import {voiceStudies,studioStudies} from "../src/jazz-lab.js";

const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
let failures=0;
try{
 for(const viewport of [{width:375,height:812},{width:1024,height:768}]){
  const context=await browser.newContext({viewport,acceptDownloads:true});
  const page=await context.newPage();
  const errors=[];page.on("pageerror",error=>errors.push(error.message));
  await page.goto("http://127.0.0.1:8765/",{waitUntil:"networkidle"});
  assert.equal(await page.locator(".brand").count(),1,"Home must load");
  await page.getByRole("button",{name:"Atelier jazz : voix, oreille, harmonisation"}).click();
  await page.locator(".lab-tile").first().waitFor({state:"visible",timeout:12000}).catch(async error=>{
   throw Error("Lab failed to load: "+errors.join(" | ")+"; page="+(await page.locator("main").innerText()).slice(0,400)+"; "+error.message);
  });
  assert.equal(await page.locator(".lab-tile").count(),3);
  await page.locator('[data-lab-mode="voice"]').click();
  assert.ok((await page.locator(".lab-panel h1").innerText()).length>4);
  for(const midi of voiceStudies[0].frames[0].example){
   await page.locator('[data-midi="'+midi+'"]').click();
  }
  await page.locator("#labCheck").click();
  assert.match(await page.locator(".feedback").innerText(),/Accord juste/);
  await page.locator("#labNext").click();
  assert.equal(await page.locator(".pianoKey.previous-voicing").count(),4,
   "Next chord must show four previously played physical keys");
  const prev=voiceStudies[0].frames[0].example;
  for(const midi of prev)assert.equal(await page.locator('[data-midi="'+midi+'"].previous-voicing').count(),1);
  await page.locator("#labHome").click();

  await page.locator('[data-lab-mode="ear"]').click();
  await page.locator("#earPlay").click();
  await page.locator('[data-ear="maj7"]').click();
  assert.ok((await page.locator(".feedback").innerText()).includes("Réponse"));
  await page.locator("#earNext").click();
  assert.equal(await page.locator(".lab-options .lab-option").count(),5);
  await page.locator("#labHome").click();

  await page.locator('[data-lab-mode="studio"]').click();
  assert.equal(await page.locator(".lab-melody-notes strong").count(),3);
  await page.locator("#studioMelody").click();
  await page.locator('[data-studio="0"]').click();
  assert.match(await page.locator(".feedback").innerText(),/Ce choix fonctionne/);
  await page.locator("#studioHear").click();
  await page.locator("#labHome").click();

  await page.getByRole("button",{name:"Parcours"}).click();
  await page.locator("#courseExport").waitFor({state:"visible",timeout:10000});
  await page.locator("#courseExport").click();
  const archiveRaw=await page.evaluate(()=>localStorage.getItem("harmonie-progress-v2"));
  const archive=JSON.parse(archiveRaw);
  assert.equal(archive.schemaVersion,2);
  assert.ok(archive.events.some(x=>x.exerciseId.startsWith("jazzlab:")));
  assert.equal(await page.locator("#currJazzLab").count(),1);
  assert.deepEqual(errors,[],"No browser JS exceptions: "+errors.join("; "));
  console.log("Browser smoke passed at "+viewport.width+"x"+viewport.height+
   " (jazz voice movement, ear, melody, export, nav)");
  await context.close();
 }
}finally{await browser.close()}
