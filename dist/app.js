const phone=document.querySelector('.phone');
function fit(){document.documentElement.style.setProperty('--scale',Math.min(document.documentElement.clientWidth/750,.5));}
fit();window.addEventListener('resize',fit);
const markets=[['道琼斯','38554.80','−0.36%',51,334,false],['英国富时','10804.80','+0.26%',289,333,true],['日经225','65269.33','−0.17%',548,333,false],['纳斯达克','26506.80','+1.92%',129,449,true],['创业板指','3359.80','+0.20%',338,449,true],['上证指数','3960.80','+0.27%',485,449,true],['标普500','7718.80','−0.38%',51,564,false],['深证成指','13703.80','+1.92%',289,568,true],['恒生指数','25317.80','−0.10%',548,564,false]];
const indices=document.querySelector('#indices');
function renderMarkets(){indices.replaceChildren(...markets.map(([name,value,change,x,y,up])=>{const el=document.createElement('div');el.className='market-index';el.style.left=x+'px';el.style.top=y+'px';el.innerHTML=`<div class="label">${name}</div><div class="value ${up?'up':'down'}">${value}</div><div class="change ${up?'up':'down'}">${change}</div>`;return el;}));}
renderMarkets();
// Controls restored from the original header.
const headerDialog=document.createElement('dialog');
headerDialog.className='header-dialog';
headerDialog.innerHTML='<button class="header-dialog-close" aria-label="关闭">×</button><h2></h2><p></p>';
phone.append(headerDialog);
function headerInfo(title,body){headerDialog.querySelector('h2').textContent=title;headerDialog.querySelector('p').textContent=body;headerDialog.showModal();}
headerDialog.querySelector('button').onclick=()=>headerDialog.close();
headerDialog.addEventListener('click',e=>{if(e.target===headerDialog){const r=headerDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)headerDialog.close();}});
document.querySelector('.menu').onclick=()=>headerInfo('财小通','行情日报 · A股盘中走势 · 自选追踪');
document.querySelector('.mini-app').onclick=()=>headerInfo('财小通行情日报','此页面为设计预览，行情数字为原稿中的示例数据。');
document.querySelector('.all-sectors').onclick=()=>headerInfo('热门板块','存储 +8.67%\n有色金属 +4.21%\n医疗服务 +1.52%\n大农业 -0.26%');
document.querySelector('.next-index').onclick=()=>{const positions=markets.map(m=>[m[3],m[4]]);markets.push(markets.shift());markets.forEach((m,i)=>{m[3]=positions[i][0];m[4]=positions[i][1];});renderMarkets();};
document.querySelector('.play').onclick=function(){const playing=this.getAttribute('aria-pressed')==='true';if('speechSynthesis' in window){speechSynthesis.cancel();if(!playing){const message=new SpeechSynthesisUtterance('行情日报。'+markets.map(m=>m[0]+m[1]+'，涨跌幅'+m[2]).join('。'));message.lang='zh-CN';message.onend=()=>{this.setAttribute('aria-pressed','false');this.setAttribute('aria-label','播放行情日报');};speechSynthesis.speak(message);}}else{headerInfo('行情日报',markets.map(m=>m[0]+' '+m[1]+' '+m[2]).join('\n'));return;}this.setAttribute('aria-pressed',String(!playing));this.setAttribute('aria-label',playing?'播放行情日报':'暂停行情日报');};

const sessionTabs=[...document.querySelectorAll('.session-tabs [role="tab"]')];
function selectMarketSession(session){
 const activeTab=sessionTabs.find(tab=>tab.dataset.session===session);
 if(!activeTab)return;
 renderRelatedSession(session);
 document.querySelector('.a-market').dataset.session=session;
 document.querySelector('#session-status').textContent=activeTab.textContent;
 sessionTabs.forEach(tab=>{const active=tab===activeTab;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;document.getElementById(tab.getAttribute('aria-controls')).hidden=!active;});
}
sessionTabs.forEach((tab,index)=>{
 tab.addEventListener('click',()=>selectMarketSession(tab.dataset.session));
 tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%sessionTabs.length;else if(event.key==='ArrowLeft')next=(index+sessionTabs.length-1)%sessionTabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=sessionTabs.length-1;else return;event.preventDefault();selectMarketSession(sessionTabs[next].dataset.session);sessionTabs[next].focus();});
});

// Illustrative content changes with the selected trading session.
const relatedSessions={
 pre:{label:'盘前 · 08:45',context:'2 个产品待关注',axis:['前4日','前3日','前2日','前1日','昨日'],cards:[
  {meta:'汇添富外延增长主题股票A · 昨日净值',title:'你的自选基金昨日',change:'下跌了 0.25%',down:true,summary:'昨日回落，今天关注成长板块能否企稳。',caption:'近 5 个交易日净值走势',quote:'昨日 −0.25%',reason:'为什么今天要关注？',body:'昨日成长股调整拖累基金净值。隔夜科技股情绪回暖，今天开盘可观察成长板块能否获得承接，盘前尚无今日涨跌。',points:[113,103,141,51,128]},
  {meta:'华夏国证半导体芯片ETF · 昨日收盘',title:'你的自选芯片ETF昨日',change:'上涨了 1.92%',summary:'隔夜科技股回暖，关注今日高开后的承接。',caption:'近 5 个交易日价格走势',quote:'昨日 +1.92%',reason:'开盘看什么？',body:'AI算力需求预期推动芯片板块昨日走强，隔夜科技股回暖有望影响开盘情绪。关注开盘成交与板块同步性，昨日上涨不代表今日已经上涨。',points:[135,112,132,91,30]}],stocks:[
 ['昨日 +3.26%','昨日光模块走强，开盘观察买盘能否延续','算力需求预期带动昨日股价上涨。盘前重点观察隔夜科技情绪能否传导至光模块板块，今日尚未交易。'],
 ['昨日 −1.18%','昨日冲高回落，关注消费电子能否企稳','昨日板块走弱与获利回吐形成压力。今天先看开盘后的承接与板块表现，盘前暂无新的日涨跌。']]},
 live:{label:'盘中 · 13:42',context:'2 个产品正在变化',axis:['09:30','10:30','11:30','13:00','13:42'],cards:[
  {meta:'汇添富外延增长主题股票A · 13:42 估算',title:'你的自选基金当前',change:'估算下跌 0.18%',down:true,summary:'午后跌幅收窄，成长股回升带来一定修复。',caption:'今日盘中估算走势',quote:'当前估算 −0.18%',reason:'为什么跌幅收窄？',body:'早盘部分成长股回落，拖累基金估算表现；午后科技板块资金回流，带动估算跌幅缩小。该数值为盘中估算，实际涨跌以公布净值为准。',points:[90,130,145,118,103]},
  {meta:'华夏国证半导体芯片ETF · 截至 13:42',title:'你的自选芯片ETF当前',change:'上涨了 1.24%',summary:'午后重新走高，芯片板块成为上涨主力。',caption:'今日盘中价格走势',quote:'截至 13:42 +1.24%',reason:'为什么午后走强？',body:'资金午后回流半导体方向，推动ETF跟踪的芯片股回升，涨幅随之扩大。当前反映盘中交易变化，仍需观察尾盘能否保持。',points:[143,88,115,76,42]}],stocks:[
 ['+2.18%','午后涨幅扩大，光模块板块同步回升','算力需求预期带动板块买盘回流，新易盛午后上行。截至13:42上涨2.18%，关注尾盘成交与板块强度。'],
 ['−0.64%','早盘冲高后回落，午后跌幅略有收窄','消费电子方向买盘偏弱，前期获利资金兑现形成压力。截至13:42下跌0.64%，午后承接有所改善。']]},
 post:{label:'盘后 · 15:00',context:'2 个产品收盘回顾',axis:['09:30','10:30','11:30','14:00','15:00'],cards:[
  {meta:'汇添富外延增长主题股票A · 收盘估算',title:'你的自选基金今日',change:'估算下跌 0.25%',down:true,summary:'午后修复未能扭转全天跌势，正式净值待公布。',caption:'今日估算走势 · 待净值确认',quote:'收盘估算 −0.25%',reason:'为什么仍然回落？',body:'科技方向午后回升，但基金配置的其他成长股表现偏弱，抵消了部分修复。收盘估算下跌0.25%，最终涨跌以基金公司公布的净值为准。',points:[90,130,145,103,123]},
  {meta:'华夏国证半导体芯片ETF · 15:00 收盘',title:'你的自选芯片ETF今日',change:'收涨 1.92%',summary:'尾盘延续上涨，全天表现强于上证指数。',caption:'今日全天价格走势',quote:'收盘 +1.92%',reason:'全天上涨由什么推动？',body:'AI算力需求预期与半导体板块资金回流共同推动芯片股上涨，ETF尾盘保持强势。明日关注板块成交能否延续，以及需求预期是否得到订单验证。',points:[143,88,115,55,25]}],stocks:[
 ['+3.26%','收盘涨幅扩大，光模块全天表现活跃','午后资金回流延续至尾盘，新易盛收涨3.26%。上涨主要受到板块情绪与需求预期推动，明日关注持续性。'],
 ['−1.18%','全天冲高回落，收盘仍然承压','消费电子板块偏弱，获利回吐使早盘涨幅未能保留，最终收跌1.18%。明日关注买盘能否恢复。']]}
};
function renderRelatedSession(session){
 const data=relatedSessions[session];
 const section=document.querySelector('.watchlist');
 section.dataset.session=session;
 section.querySelector('.watchlist-title>span').textContent=data.context;
 document.querySelectorAll('.movement-card').forEach((card,index)=>{
  const item=data.cards[index];
  card.querySelector('.movement-meta').textContent=item.meta;
  const heading=card.querySelector('h3');
  const change=document.createElement('span');change.className=item.down?'down':'up';change.textContent=item.change;
  heading.replaceChildren(document.createTextNode(item.title),change);
  card.querySelector('.movement-summary').textContent=item.summary;
  const figure=card.querySelector('figure');
  const tone=item.down?'#43a047':'#ed5454';
  const xs=[12,156,300,444,586];
  const path=item.points.map((y,i)=>`${i?'L':'M'}${xs[i]} ${y}`).join(' ');
  figure.querySelector('svg').innerHTML=`<title>${item.caption}，${item.quote}</title><path class="movement-grid" d="M12 24H586 M12 64H586 M12 104H586 M12 144H586"/><path fill="${tone}" fill-opacity=".08" d="${path}V166H12Z"/><path fill="none" stroke="${tone}" stroke-width="3" stroke-linejoin="round" d="${path}"/>${item.points.map((y,i)=>`<circle cx="${xs[i]}" cy="${y}" r="6" fill="${tone}" stroke="white" stroke-width="4"/>`).join('')}<g class="movement-axis">${data.axis.map((label,i)=>`<text x="${xs[i]}" y="198" text-anchor="${i===0?'start':i===4?'end':'middle'}">${label}</text>`).join('')}</g>`;
  figure.querySelector('svg').removeAttribute('aria-labelledby');
  figure.querySelector('svg').setAttribute('aria-label',`${item.caption}，${item.quote}`);
  const quote=document.createElement('span');quote.className=item.down?'down':'up';quote.textContent=item.quote;
  figure.querySelector('figcaption').replaceChildren(document.createTextNode(item.caption),quote);
  const reason=document.createElement('strong');reason.textContent=item.reason;
  card.querySelector('.movement-reason').replaceChildren(reason,document.createTextNode(item.body));
 });
 const quotes={pre:[['1.6820','−0.25%'],['1.2225','+1.92%'],['3893.13','+0.12%'],['4519.91','+0.08%'],['1.8572','−0.18%']],live:[['1.6820','−0.25%'],['1.2377','+1.24%'],['3905.20','+0.31%'],['4512.68','−0.16%'],['1.8572','−0.18%']],post:[['1.6820','−0.25%'],['1.2460','+1.92%'],['3912.64','+0.50%'],['4528.95','+0.20%'],['1.8572','−0.18%']]}[session];
 document.querySelectorAll('.saved-list-row').forEach((row,i)=>{
  const cells=row.querySelectorAll('.saved-list-quote span');
  cells[0].textContent=quotes[i][0];cells[1].textContent=quotes[i][1];
  cells[1].className='number '+(quotes[i][1].startsWith('−')?'down':'up');
 });
 document.querySelector('.saved-list-row p').textContent='基金 · 000925 · 最新净值';
 document.querySelector('.saved-list-row:last-child p').textContent='基金 · 110020 · 最新净值';
 document.querySelector('.saved-list-labels span:last-child').textContent=session==='pre'?'昨日值 / 日涨跌':session==='post'?'收盘值 / 日涨跌':'最新值 / 日涨跌';
 document.querySelector('.reading-note').textContent='场外基金展示最近公布的净值及对应涨跌，盘中与收盘估算不替代正式净值；ETF和指数展示所选时段行情。以上数据与原因均为设计示例。';
 document.querySelector('.stock-movements .watchlist-title>span').textContent=data.label;
 document.querySelectorAll('.stock-reading-item').forEach((row,i)=>{
  row.querySelector('header>span').textContent=data.stocks[i][0];
  row.querySelector('h4').textContent=data.stocks[i][1];
  row.querySelector('p').textContent=data.stocks[i][2];
 });
}
selectMarketSession('live');
