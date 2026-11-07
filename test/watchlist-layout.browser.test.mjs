import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
try{
 const page=await browser.newPage({viewport:{width:850,height:1000}});
 await page.goto(`${process.env.MARKET_TEST_URL || 'http://127.0.0.1:4173'}/?visualQA&session=live`);
 await page.waitForSelector('html[data-decks-ready=true]');
 await page.evaluate(()=>selectLayout('single'));
 const spacing=await page.evaluate(()=>[...document.querySelectorAll('.single-movements')].map(card=>({bottom:card.getBoundingClientRect().bottom-card.querySelector('li:last-child').getBoundingClientRect().bottom})));
 spacing.forEach(({bottom})=>assert.ok(Math.abs(bottom-25)<1,`Expected 24px bottom padding plus border, got ${bottom}`));
 for(const session of ['pre','live','post']){
  await page.evaluate(session=>{selectLayout('single');selectSession(session)},session);
  await page.evaluate(()=>document.fonts.ready);
  const quoteGaps=await page.evaluate(()=>[...document.querySelectorAll('.single-watchlist .single-product-link,.single-stock-list .single-product-link')].map(link=>{
   const quote=link.querySelector('strong');
   const range=document.createRange();range.selectNodeContents(quote);
   return link.querySelector('.ui-arrow').getBoundingClientRect().left-range.getBoundingClientRect().right;
  }));
  quoteGaps.forEach(gap=>assert.ok(Math.abs(gap-16)<1,`Single-card changes must align 16px before the arrow, got ${gap}`));
  await page.evaluate(session=>{selectLayout('folded');selectSession(session)},session);
  const result=await page.evaluate(()=>{
   const el=id=>document.querySelector(`[data-node-id="25435:${id}"]`);
   const edge=el('737').getBoundingClientRect().right;
   return ['749','750','758','759','767','768'].map(id=>{
    const range=document.createRange();range.selectNodeContents(el(id));
    return {id,gap:edge-range.getBoundingClientRect().right};
   });
  });
  result.forEach(({id,gap})=>assert.ok(Math.abs(gap)<1,`${id} must align with the right column edge, gap=${gap}`));
 }
}finally{await browser.close();}
