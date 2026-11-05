const phone=document.querySelector('.phone');
function fit(){document.documentElement.style.setProperty('--scale',Math.min(window.innerWidth/750,.5));}
fit();window.addEventListener('resize',fit);
const markets=[['道琼斯','38554.80','−0.36%',51,334,false],['英国富时','10804.80','+0.26%',289,333,true],['日经225','65269.33','−0.17%',548,333,false],['纳斯达克','26506.80','+1.92%',129,449,true],['创业板指','3359.80','+0.20%',338,449,true],['上证指数','3960.80','+0.27%',485,449,true],['标普500','7718.80','−0.38%',51,564,false],['深证成指','13703.80','+1.92%',289,568,true],['恒生指数','25317.80','−0.10%',548,564,false]];
const indices=document.querySelector('#indices');
function renderMarkets(){indices.replaceChildren(...markets.map(([name,value,change,x,y,up])=>{const el=document.createElement('div');el.className='market-index';el.style.left=x+'px';el.style.top=y+'px';el.innerHTML=`<div class="label">${name}</div><div class="value ${up?'up':'down'}">${value}</div><div class="change ${up?'up':'down'}">${change}</div>`;return el;}));}
renderMarkets();
