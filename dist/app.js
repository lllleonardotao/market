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
 document.querySelector('.a-market').dataset.session=session;
 document.querySelector('#session-status').textContent=activeTab.textContent;
 sessionTabs.forEach(tab=>{const active=tab===activeTab;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;document.getElementById(tab.getAttribute('aria-controls')).hidden=!active;});
}
sessionTabs.forEach((tab,index)=>{
 tab.addEventListener('click',()=>selectMarketSession(tab.dataset.session));
 tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%sessionTabs.length;else if(event.key==='ArrowLeft')next=(index+sessionTabs.length-1)%sessionTabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=sessionTabs.length-1;else return;event.preventDefault();selectMarketSession(sessionTabs[next].dataset.session);sessionTabs[next].focus();});
});
