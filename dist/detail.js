const params=new URLSearchParams(location.search);
const field=id=>document.getElementById(id);
const name=params.get('name')||'自选产品';
const session=['pre','live','post'].includes(params.get('session'))?params.get('session'):'pre';
const stock=params.get('kind')==='stock';
const fund=!stock&&!name.includes('指数');
const fundDate=params.get('date')||'2027-06-14';
const period=fund?fundDate+' · T-1 完整行情':{pre:'盘前 · 昨日行情',live:'盘中行情',post:'盘后 · 收盘行情'}[session];
document.title=name+' · 财小通';
field('name').textContent=name;
field('category').textContent=stock?'股票详情':'自选详情';
field('session').textContent=period;field('period').textContent=period;
field('type').textContent=stock?'股票':name.includes('指数')?'板块 / 指数':'基金 / ETF';
field('change').textContent=params.get('change')||'—';
field('change').style.color=(params.get('change')||'').startsWith('+')?'#ed5454':'#43a047';
for(const id of ['price','tag']){const value=params.get(id);if(value){field(id).textContent=value;field(id).hidden=false;}}
field('back').href='./?layout=single&session='+session;
