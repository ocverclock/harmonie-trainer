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
  // Optional learning resource opens an independent tab; no progress is shared.
  const resource=page.locator('a[href="https://ethanhein.com/scaledesigner.html"]');
  assert.equal(await resource.count(),1,"Scale Designer must be linked from home");
  assert.equal(await resource.getAttribute("target"),"_blank");
  assert.match(await resource.getAttribute("rel"),/noopener/);
  assert.match(await resource.getAttribute("rel"),/noreferrer/);
  assert.match(await resource.innerText(),/Scale Designer/);
  await page.getByRole("button",{name:"Atelier jazz : voix, oreille, harmonisation"}).click();
  await page.locator(".lab-tile").first().waitFor({state:"visible",timeout:12000}).catch(async error=>{
   throw Error("Lab failed to load: "+errors.join(" | ")+"; page="+(await page.locator("main").innerText()).slice(0,400)+"; "+error.message);
  });
  assert.equal(await page.locator(".lab-tile").count(),4,"Four workshops including II–V–I guide tones");
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
  await page.getByRole("button",{name:"Accueil",exact:true}).click();
  await page.locator("#constructionSettings").waitFor({state:"visible"});
  assert.equal(await page.locator('[data-level]').count(),8);
  assert.equal(await page.locator('[data-difficulty]').count(),3);
  assert.equal(await page.locator('[data-level="6"]').getAttribute("aria-pressed"),"true");
  assert.equal(await page.locator('[data-difficulty="standard"]').getAttribute("aria-pressed"),"true");
  for(const mode of ["guided","standard","challenge"]){
   await page.locator('[data-difficulty="'+mode+'"]').click();
   assert.equal(await page.locator('[data-level="6"]').getAttribute("aria-pressed"),"true",
     "Changing tonality must not change family");
   await page.locator("#startConstruction").click();
   assert.match(await page.locator(".symbol").innerText(),/9/);
   assert.equal(await page.locator("#validate").innerText(),"Valider (4 notes)");
   await page.locator("#backToLevels").click();
  }
  for(const [lev,number] of [[1,3],[2,3],[3,4],[4,4],[5,4],[6,4],[7,5],[8,4]]){
   await page.locator('[data-level="'+lev+'"]').click();
   await page.locator("#startConstruction").click();
   assert.match(await page.locator(".badge").first().innerText(),new RegExp("Niveau "+lev));
   assert.match(await page.locator("#validate").innerText(),new RegExp("Valider \\("+number+" notes\\)|Valider \\(5 notes\\)"));
   await page.locator("#backToLevels").click();
  }
  await page.locator('[data-level="6"]').click();
  await page.locator('[data-difficulty="standard"]').click();
  await page.locator("#startConstruction").click();
  for(let i=0;i<10;i++){
   assert.equal(await page.locator("#validate").isDisabled(),true);
   for(const midi of [48,50,52,53])await page.locator('[data-midi="'+midi+'"]').click();
   assert.equal(await page.locator("#validate").isDisabled(),false);
   await page.locator("#validate").click();
   assert.equal(await page.locator(".feedback").count(),1);
   await page.locator("#next").click();
  }
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem("harmonie-sessions-v2")||"[]"));
  const mostRecent=saved.at(-1);
  assert.equal(mostRecent.schemaVersion,3);
  assert.equal(mostRecent.level,6);
  assert.equal(mostRecent.familyId,"level-6");
  assert.equal(mostRecent.difficulty,"standard");
  assert.equal(await page.locator(".score").innerText().then(x=>x.endsWith("/100")),true);
  await page.locator("#goLevels").click();
  assert.equal(await page.locator('[data-level="6"]').getAttribute("aria-pressed"),"true");
  assert.deepEqual(errors,[],"No browser JS exceptions: "+errors.join("; "));
  console.log("Browser smoke passed at "+viewport.width+"x"+viewport.height+
   " (jazz voice movement, ear, melody, export, nav)");
  await context.close();
 }
}finally{await browser.close()}
