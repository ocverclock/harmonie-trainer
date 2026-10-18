import assert from "node:assert/strict";
import {chromium} from "playwright";
import {voiceStudies} from "../src/jazz-lab.js";

const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
try{
 for(const viewport of [{width:375,height:812},{width:1024,height:768}]){
  const context=await browser.newContext({viewport});
  const page=await context.newPage(),errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.goto("http://127.0.0.1:8765/",{waitUntil:"networkidle"});
  await page.getByRole("button",{name:"Atelier jazz : voix, oreille, harmonisation"}).click();
  await page.locator('[data-lab-mode="voice"]').waitFor({state:"visible"});
  await page.locator('[data-lab-mode="voice"]').click();
  const [first,second,third]=voiceStudies[0].frames;
  assert.equal(await page.locator(".lab-voice-paths").count(),0,"Never reveal a diagram before checking notes");
  for(const midi of first.example)await page.locator('[data-midi="'+midi+'"]').click();
  await page.locator("#labCheck").click();
  assert.equal(await page.locator(".lab-voice-paths").count(),0,"First chord alone has no trajectories");
  await page.locator("#labNext").click();
  assert.equal(await page.locator(".lab-voice-paths").count(),0,"No answer hint before submitting second chord");
  for(const midi of [48,50,52,53])await page.locator('[data-midi="'+midi+'"]').click();
  assert.equal(await page.locator(".lab-voice-paths").count(),0,"Current ungraded pitches never appear on diagram");
  await page.locator("#labCheck").click();
  assert.match(await page.locator(".feedback").innerText(),/Accord à corriger/);
  assert.equal(await page.locator(".lab-path-line").count(),4);
  assert.equal(await page.locator(".lab-path-node").count(),8);
  assert.equal(await page.locator('.lab-path-node[data-note="48"]').count(),1);
  assert.equal(await page.locator(".lab-path-chord").count(),2);
  assert.match(await page.locator(".lab-path-chord").last().innerText(),/à revoir/);
  assert.equal(await page.locator(".lab-motion-scroll").count(),1);
  assert.equal(await page.locator(".piano-scroll").count(),1,"Diagram and piano must share one scroller");
  assert.equal(await page.locator(".pianoKey").count(),36,"Piano keys must remain unchanged");
  const align=await page.evaluate(()=>{
   const note=document.querySelector('.lab-path-node[data-note="57"]');
   const key=document.querySelector('.pianoKey[data-midi="57"]');
   const circle=note.getBoundingClientRect(),piano=key.getBoundingClientRect();
   const scroller=document.querySelector(".lab-motion-scroll");
   return {diff:Math.abs(circle.left+circle.width/2-(piano.left+piano.width/2)),
    overflow:scroller.scrollWidth>scroller.clientWidth,
    scrollFocus:scroller.getAttribute("tabindex")};
  });
  assert.ok(align.diff<1.5,"SVG and piano must align under same MIDI key: "+JSON.stringify(align));
  if(viewport.width===375)assert.equal(align.overflow,true,"Phone must scroll both together");
  assert.equal(align.scrollFocus,"0");
  await page.locator("#labRetry").click();
  assert.equal(await page.locator(".lab-voice-paths").count(),0,"Retry hides old trajectory");
  await page.locator("#labClear").click();
  for(const midi of second.example)await page.locator('[data-midi="'+midi+'"]').click();
  await page.locator("#labCheck").click();
  assert.equal(await page.locator(".lab-path-line").count(),4);
  await page.locator("#labNext").click();
  assert.equal(await page.locator(".lab-path-line").count(),0,"Third chord must remain unrevealed until checked");
  for(const midi of third.example)await page.locator('[data-midi="'+midi+'"]').click();
  await page.locator("#labCheck").click();
  assert.equal(await page.locator(".lab-path-line").count(),8,"Complete cadence must show 8 links");
  assert.equal(await page.locator(".lab-path-node").count(),12);
  assert.equal(await page.locator(".lab-path-chord").count(),3);
  assert.match(await page.locator(".lab-motion-panel h3").innerText(),/trois accords/);
  assert.match(await page.locator(".lab-path-description").innerText(),/grave vers l’aigu/);
  assert.deepEqual(errors,[]);
  console.log("P04 real-voicing trajectory browser OK "+viewport.width+"x"+viewport.height);
  await context.close();
 }
}finally{await browser.close()}
