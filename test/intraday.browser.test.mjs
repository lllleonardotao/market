import assert from 'node:assert/strict';
// Run against npm run dev with Playwright available, or set PLAYWRIGHT_MODULE.
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
try {
 const page=await browser.newPage({viewport:{width:850,height:1000}});
 await page.goto(`${process.env.MARKET_TEST_URL || 'http://127.0.0.1:4173'}/?visualQA&session=live`);
 await page.waitForSelector('html[data-decks-ready=true]');
 for(const [gridId,lineId,fillId,dotId,axisId,progress,close] of [
  ['713','715','714','716','724',1,'15:00'],
  ['789','791','790','792','797',192/330,'16:00']
 ]) {
  const measure=()=>page.evaluate(ids=>{
   const el=id=>document.querySelector(`[data-node-id="25435:${id}"]`);
   const [grid,line,fill,dot]=ids.map(id=>el(id).getBoundingClientRect());
   return {progress:line.width/grid.width,fill:fill.width/grid.width,dot:(dot.left+dot.width/2-grid.left)/grid.width};
  },[gridId,lineId,fillId,dotId]);
  const live=await measure();
  assert.ok(Math.abs(live.progress-progress)<.01,`Curve must end at current trading minute: ${JSON.stringify(live)}`);
  assert.ok(Math.abs(live.fill-progress)<.01,'Fill must end with the curve');
  if(lineId==='791') assert.ok(Math.abs(live.dot-progress)<.01,'Dot must follow the current endpoint');
  assert.equal(await page.locator(`[data-node-id="25435:${axisId}"]`).textContent(),close);
 }
 for (const session of ['post','pre','live','post']) {
  await page.evaluate(session=>selectSession(session),session);
  const widths=await page.evaluate(()=>['715','791'].map(id=>document.querySelector(`[data-node-id="25435:${id}"]`).getBoundingClientRect().width));
  if(session!=='live') widths.forEach(width=>assert.ok(width>618,'Completed charts must restore full width'));
 }
 console.log('Verified intraday curve, fill, endpoint, full-day axes and session switching.');
} finally {await browser.close();}
