function fit(){document.documentElement.style.setProperty('--scale',new URLSearchParams(location.search).has('visualQA')?1:Math.min(innerWidth/750,.5));}fit();addEventListener('resize',fit);

const node=id=>document.querySelector(`[data-node-id="${id}"]`);
const decks=[];
const initialParams=new URLSearchParams(location.search);
let readingLayout=['folded','flat','single'].includes(initialParams.get('layout'))?initialParams.get('layout'):'folded';
let activeSession=['pre','live','post'].includes(initialParams.get('session'))?initialParams.get('session'):'pre';
function updatePageHeight(){
 const related=node('25435:679'),community=node('25435:498');
 const market=node('25435:640');
 related.style.top=(activeSession==='pre'?1756:market.offsetTop+market.offsetHeight+48)+'px';
 const top=related.offsetTop+related.offsetHeight;
 community.style.top=top+'px';
 const height=top+community.offsetHeight+160;
 document.querySelector('#canvas').style.height=height+'px';
 node('25435:425').style.height=height+'px';
}
function wireDeck({key,groupId,triggerId,extra,shadowIds,baseHeight,extraHeight}){
 const group=node(groupId),trigger=node(triggerId);
 extra.id=key+'-extra';extra.hidden=true;
 trigger.before(extra);
 group.dataset.deck=key;trigger.dataset.deckToggle=key;
 trigger.setAttribute('role','button');trigger.tabIndex=0;
 trigger.setAttribute('aria-controls',extra.id);trigger.setAttribute('aria-expanded','false');
 const arrow=trigger.lastElementChild;arrow.classList.add('deck-chevron');arrow.setAttribute('aria-hidden','true');
 const label=key==='movements'?'自选异动':'订阅机会';
 const deck={expanded:false,growth:extraHeight-28,group,trigger,extra,shadowIds,baseHeight,label};decks.push(deck);
 deck.render=()=>{
  const expanded=readingLayout==='flat'||(readingLayout==='folded'&&deck.expanded);
  deck.visibleExpanded=expanded;extra.hidden=!expanded;
  group.style.height=(baseHeight+(expanded?deck.growth:0))+'px';
  shadowIds.forEach(id=>node(id).hidden=expanded||readingLayout==='single');
  trigger.hidden=readingLayout==='flat'||readingLayout==='single';
  trigger.setAttribute('aria-expanded',String(expanded));
  trigger.querySelector('[data-node-id="25435:728"], [data-node-id="25435:864"]').textContent=readingLayout==='single'?(key==='movements'?'查看全部2条异动':'查看全部3类订阅'):(key==='movements'?'共2条异动':'共3类订阅');
  if(readingLayout!=='single'&&key==='movements')group.style.height=trigger.parentElement.offsetHeight+'px';
  if(readingLayout==='single'&&key==='movements'){const single=group.querySelector('.single-movements');if(single)group.style.height=single.offsetHeight+'px';}
  if(key==='subscriptions'){
   const signal=node('25435:807');
   if(readingLayout==='single'){
    signal.setAttribute('role','button');signal.tabIndex=0;signal.setAttribute('aria-label','查看机构信号：创业板指');
    group.style.height=trigger.parentElement.offsetHeight+'px';
   }else{signal.removeAttribute('role');signal.removeAttribute('tabindex');signal.removeAttribute('aria-label');}
  }
  trigger.setAttribute('aria-label',readingLayout==='single'?'查看全部'+label:(expanded?'收起':'展开')+label+'卡组');
 };
 function toggle(){
  if(readingLayout==='single'){showDeck(deck);return;}
  const closing=deck.expanded;
  deck.expanded=!closing;deck.render();updatePageHeight();
  if(closing&&trigger.getBoundingClientRect().bottom<0)group.scrollIntoView({block:'start',behavior:'instant'});
 }
 trigger.setAttribute('aria-label','展开'+label+'卡组');
 trigger.addEventListener('click',toggle);
 trigger.addEventListener('keydown',event=>{
  if(event.key==='Enter'||event.key===' '){event.preventDefault();toggle();}
 });
}
async function initDecks(){
 const response=await fetch('movement-expanded.html');
 if(!response.ok)throw new Error('Unable to load expanded movement card');
 const template=document.createElement('template');template.innerHTML=await response.text();
 wireDeck({key:'movements',groupId:'25435:693',triggerId:'25435:726',extra:template.content.firstElementChild,shadowIds:['25435:694','25435:695'],baseHeight:626.016,extraHeight:390});

 // The supplied expanded Figma frame leaves subscriptions collapsed. These
 // two records reuse the original repository's subscription data and card style.
 const subscriptions=document.createElement('div');subscriptions.className='subscription-tail';
 subscriptions.innerHTML=`<article class="subscription-extra" aria-label="投资机会：半导体需求观察"><header><h3>投资机会：半导体需求观察</h3><time>盘前更新</time></header><p>持续跟进需求、订单和业绩三条线索。板块价格变化先反映预期，机会是否得到验证，仍需后续经营信息支持。</p><div class="subscription-facts"><div><span>关注方向</span><strong>半导体 / 算力</strong></div><div><span>下一步</span><strong>订单与业绩验证</strong></div></div></article><article class="subscription-extra" aria-label="大事件：企业业绩与公告窗口"><header><h3>大事件：企业业绩与公告窗口</h3><time>盘前更新</time></header><p>留意自选公司业绩、订单与重要公告。事件公布后，再看实际结果与市场预期的差异，以及关联自选的表现。</p><div class="subscription-facts"><div><span>事件类型</span><strong>业绩 / 公司公告</strong></div><div><span>下一步</span><strong>等待披露结果</strong></div></div></article>`;
 const parent=node('25435:862').parentElement;
 parent.insertBefore(subscriptions,node('25435:862'));
 const subscriptionHeight=subscriptions.offsetHeight;
 wireDeck({key:'subscriptions',groupId:'25435:800',triggerId:'25435:862',extra:subscriptions,shadowIds:['25435:801','25435:802'],baseHeight:785,extraHeight:subscriptionHeight});
 const links=document.createElement('div');links.className='single-subscription-links';
 links.innerHTML='<button type="button" data-subscription-detail="opportunity"><strong>热门机会</strong><span>半导体需求与订单观察</span><span class="ui-arrow ui-arrow-right" aria-hidden="true"><img src="assets/arrow-right-small.svg" alt=""></span></button><button type="button" data-subscription-detail="event"><strong>投资大事件</strong><span>企业业绩与公告窗口</span><span class="ui-arrow ui-arrow-right" aria-hidden="true"><img src="assets/arrow-right-small.svg" alt=""></span></button>';
 node('25435:862').before(links);
 links.querySelectorAll('button').forEach(button=>button.onclick=()=>showSubscriptionDetail(button.dataset.subscriptionDetail));
 const signal=node('25435:807');
 signal.addEventListener('click',()=>{if(readingLayout==='single')showSubscriptionDetail('signal');});
 signal.addEventListener('keydown',event=>{if(readingLayout==='single'&&(event.key==='Enter'||event.key===' ')){event.preventDefault();showSubscriptionDetail('signal');}});

 const singleResponse=await fetch('single-movements.html');
 if(!singleResponse.ok)throw new Error('Unable to load single movement card');
 const singleTemplate=document.createElement('template');singleTemplate.innerHTML=await singleResponse.text();
 node('25435:693').append(singleTemplate.content.firstElementChild);

 const stockResponse=await fetch('single-stocks.html');
 if(!stockResponse.ok)throw new Error('Unable to load single stock card');
 const stockTemplate=document.createElement('template');stockTemplate.innerHTML=await stockResponse.text();
 node('25435:771').append(stockTemplate.content.firstElementChild);
 const movementPrompt=document.querySelector('.single-movements:not(.single-stock) .single-watchlist-link');
 movementPrompt.dataset.discussionKind='movements';movementPrompt.classList.add('discussion-prompt');
 node('25435:726').before(movementPrompt);
 const stockPrompt=document.querySelector('.single-stock .single-watchlist-link');
 stockPrompt.dataset.discussionKind='stocks';stockPrompt.classList.add('discussion-prompt');
 node('25435:772').append(stockPrompt);


 document.documentElement.dataset.decksReady='true';
 selectLayout(readingLayout);selectSession(activeSession);
}
initDecks().catch(error=>{console.error(error);});
addEventListener('resize',updatePageHeight);

const detailDialog=document.createElement('dialog');
detailDialog.className='deck-dialog';
detailDialog.innerHTML='<header><h2></h2><button aria-label="关闭全部卡片">关闭 ×</button></header><div class="deck-dialog-content"></div>';
document.body.append(detailDialog);
detailDialog.querySelector('button').onclick=()=>detailDialog.close();
detailDialog.addEventListener('click',event=>{if(event.target===detailDialog){const r=detailDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)detailDialog.close();}});
function showSubscriptionDetail(kind){
 const source=kind==='signal'?node('25435:807'):document.querySelectorAll('.subscription-tail>.subscription-extra')[kind==='opportunity'?0:1];
 const detail=source.cloneNode(true);
 detail.removeAttribute('role');detail.removeAttribute('tabindex');detail.removeAttribute('aria-label');
 detailDialog.querySelector('h2').textContent=({signal:'机构信号：创业板指',opportunity:'热门机会',event:'投资大事件'})[kind];
 detailDialog.querySelector('.deck-dialog-content').replaceChildren(detail);
 detailDialog.showModal();detailDialog.scrollTop=0;
}
function showDeck(deck){
 detailDialog.querySelector('h2').textContent=deck.label;
 const front=deck.group.querySelector(':scope > [data-name="Container"]').cloneNode(true);
 front.querySelectorAll('[data-deck-toggle],#movements-extra,.subscription-tail').forEach(el=>el.remove());
 front.classList.add('dialog-front');
 const extra=deck.extra.cloneNode(true);extra.hidden=false;
 [front,extra].forEach(root=>{root.removeAttribute('id');root.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));});
 detailDialog.querySelector('.deck-dialog-content').replaceChildren(front,extra);
 detailDialog.showModal();detailDialog.scrollTop=0;
}
function selectLayout(layout){
 readingLayout=layout;document.documentElement.dataset.layout=layout;
 document.querySelectorAll('button[data-layout]').forEach(button=>{const active=button.dataset.layout===layout;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});
 document.querySelector('#canvas').setAttribute('role','tabpanel');
 document.querySelector('#canvas').setAttribute('aria-labelledby','version-'+layout);
 decks.forEach(deck=>deck.render());updatePageHeight();
}
const layoutTabs=[...document.querySelectorAll('button[data-layout]')];
layoutTabs.forEach((button,index)=>{
 button.onclick=()=>selectLayout(button.dataset.layout);
 button.onkeydown=event=>{let next;if(event.key==='ArrowRight')next=(index+1)%layoutTabs.length;else if(event.key==='ArrowLeft')next=(index+layoutTabs.length-1)%layoutTabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=layoutTabs.length-1;else return;event.preventDefault();layoutTabs[next].click();layoutTabs[next].focus();};
});
// Each preview uses the same original cards and selected trading session.
const sessionCopy={
 pre:['A股早报','隔夜美股科技回落，关注 A 股开盘承接','昨日上证收盘','3893.13','+0.12%','今日关注','科技板块开盘能否企稳','其他成长板块能否接力','今日关注','芯片开盘后的承接力度、成长基金的修复表现，以及订阅机构信号和重要公告的新进展。','隔夜海外芯片回落，可能影响今日开盘情绪','昨日上涨1.92%','近5个交易日走势','昨日值 / 日涨跌','3256.80','−1.36%','3893.13','+0.12%','腾讯｜游戏与广告业务进展受到市场关注','+1.28%','昨日涨跌','昨日走势'],
 live:['A股盘中','大盘午后回升，关注科技板块持续性','上证当前 · 13:42','3905.19','+0.31%','盘中关注','科技方向午后资金回流','成长基金跌幅能否收窄','盘中变化','芯片ETF午后回升，成长基金估算跌幅收窄，关注尾盘成交与板块强度。','科技买盘午后回流，芯片ETF重新走高','当前上涨1.24%','今日盘中价格走势','当前值 / 日涨跌','3234.11','−0.70%','3905.19','+0.31%','腾讯｜午后买盘回流，关注尾盘承接','+0.86%','实时涨跌','今日实时走势'],
 post:['A股收评','科技板块走强，收盘关注后续持续性','上证今日收盘','3912.58','+0.50%','收盘回顾','芯片板块保持强势','成长方向表现仍有分化','收盘回顾','芯片ETF领涨收盘，成长基金收盘估算仍为负；后续关注正式净值、板块成交及重要公告。','科技板块买盘延续，芯片ETF领涨收盘','今日收涨1.92%','今日全天价格走势','收盘值 / 日涨跌','3221.95','−1.07%','3912.58','+0.50%','腾讯｜游戏与广告业务受到关注，收涨','+1.28%','收盘涨跌','今日全天走势']
};
const sessionNodes=['643','649','652','653','654','658','661','664','686','687','703','719','725','741','758','759','767','768','779','784','785','798'];
function selectSession(session){
 activeSession=session;document.documentElement.dataset.session=session;
 sessionNodes.forEach((id,index)=>{const el=node('25435:'+id);if(el)el.textContent=sessionCopy[session][index];});
 const axis=session==='pre'?['前4日','前3日','前2日','前1日','昨日']:['09:30','10:30','11:30/13:00','14:00','15:00'];
 const stockAxis=session==='pre'?axis:['09:30','10:30','12:00/13:00','14:30','16:00'];
 ['720','721','722','723','724'].forEach((id,i)=>node('25435:'+id).textContent=axis[i]);
 ['793','794','795','796','797'].forEach((id,i)=>node('25435:'+id).textContent=stockAxis[i]);
 // Demo quotes are sampled at 13:42. Keep the full trading day visible,
 // excluding each market's lunch break when locating the latest point.
 for(const [lineId,fillId,dotId,elapsed,total] of [
  ['715','714','716',162,240], // A shares: 09:30–11:30, 13:00–15:00.
  ['791','790','792',192,330]  // Tencent: 09:30–12:00, 13:00–16:00.
 ]){
  const progress=session==='live'?elapsed/total:1;
  for(const id of [lineId,fillId]){
   node('25435:'+id).style.transformOrigin='left center';
   node('25435:'+id).style.transform=`scaleX(${progress})`;
  }
  const dot=node('25435:'+dotId);
  dot.style.left=session==='live'?`${0.5+97.35*progress}%`:'';
  dot.style.right=session==='live'?'auto':'';
  dot.style.width=session==='live'?'1.65%':'';
 }
 document.querySelectorAll('button[data-session]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.session===session)));
 const single=document.querySelector('.single-movements');
 if(single){
  single.querySelector('.single-summary').textContent=({pre:'隔夜科技回落，关注自选开盘承接',live:'科技买盘午后回流，芯片ETF重新走高',post:'科技领涨、午后回升，上证收涨 0.50%'})[session];
  (document.querySelector('[data-discussion-kind=movements] [data-discussion-topic]')||single.querySelector('[data-discussion-topic]')).textContent=({pre:'隔夜科技回落，芯片开盘能稳住吗？',live:'芯片ETF午后走高，这波回升能持续吗？',post:'科技领涨收盘，芯片行情还能延续吗？'})[session];
  single.querySelector('.single-feature-change').textContent=({pre:'+1.92%',live:'+1.24%',post:'+1.92%'})[session];
  single.querySelector('[data-single-etf-change]').textContent=({pre:'+1.92%',live:'+1.24%',post:'+1.92%'})[session];
  single.querySelector('[data-single-sector-change]').textContent=({pre:'−1.36%',live:'−0.70%',post:'−1.07%'})[session];
  single.querySelector('[data-single-index-change]').textContent=({pre:'+0.12%',live:'+0.31%',post:'+0.50%'})[session];
  if(readingLayout==='single')decks.find(deck=>deck.group.dataset.deck==='movements')?.render();
  updatePageHeight();
 }
 const stock=document.querySelector('.single-stock');
 if(stock){
  (document.querySelector('[data-discussion-kind=stocks] [data-discussion-topic]')||stock.querySelector('[data-discussion-topic]')).textContent=({pre:'隔夜科技回落，关注的个股会受多大影响？',live:'科技板块午后回升，哪些个股更有后劲？',post:'科技领涨收盘，关注的个股谁更有后劲？'})[session];
  stock.querySelector('.single-summary').textContent=({pre:'隔夜科技回落，关注个股开盘承接',live:'科技领涨、午后回升，关注个股表现',post:'科技领涨、午后回升，上证收涨 0.50%'})[session];
 }
 document.querySelectorAll('.single-product-link').forEach(link=>{
  const stock=link.dataset.detailKind==='stock';
  const name=stock?link.querySelector('.single-stock-name').firstChild.textContent.trim():link.querySelector(':scope > span').textContent;
  const change=link.querySelector('strong').textContent;
  const price=stock?link.querySelector('.single-stock-row-price').textContent:'';
  const tag=link.querySelector('.single-tag')?.textContent||'';
  const params=new URLSearchParams({id:link.dataset.detailId,name,change,price,tag,kind:link.dataset.detailKind,session});
  link.href='detail.html?'+params;
 });
 document.querySelectorAll('.subscription-extra time').forEach(el=>el.textContent=({pre:'盘前更新',live:'盘中更新',post:'盘后更新'})[session]);
 updatePageHeight();
}
document.querySelectorAll('button[data-session]').forEach(button=>button.onclick=()=>selectSession(button.dataset.session));
selectSession(activeSession);
