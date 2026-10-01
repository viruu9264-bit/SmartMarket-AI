const $=s=>document.querySelector(s),cats=[['📱','Mobiles'],['💻','Laptops'],['🎧','Electronics'],['👟','Fashion'],['🛋️','Furniture'],['🚲','Vehicles'],['📚','Books'],['🧊','Home Appliances'],['🏏','Sports'],['🎮','Gaming'],['📷','Cameras'],['📦','Other']];
const cols=['#dfe4ff','#ffe3d6','#d8f3e6','#f6e1ff','#fff2c6'];
let P=[['Apple iPhone 13 128GB Blue',32500,'Mobiles','Used – Good','Pune',4.8,'📱','Apple'],['Samsung Galaxy S21 128GB',24000,'Mobiles','Used – Good','Mumbai',4.5,'📱','Samsung'],['OnePlus 11 5G 256GB',38000,'Mobiles','New','Bengaluru',4.9,'📱','OnePlus'],
['Dell XPS 13 i7 16GB (coding ready)',52000,'Laptops','Used – Good','Pune',4.7,'💻','Dell'],['MacBook Air M1 8GB',54000,'Laptops','Used – Fair','Delhi',4.6,'💻','Apple'],['Lenovo ThinkPad T14 for developers',36000,'Laptops','Used – Good','Hyderabad',4.4,'💻','Lenovo'],
['Sony WH-1000XM4 Headphones',14000,'Electronics','Used – Good','Chennai',4.8,'🎧','Sony'],['Nike Air Max Sneakers',6500,'Fashion','New','Mumbai',4.2,'👟','Nike'],['Solid Wood Study Desk',5200,'Furniture','Used – Good','Pune',4.9,'🛋️','Local'],
['Hero Sprint Bicycle',7800,'Vehicles','Used – Fair','Pune',4.3,'🚲','Hero'],['PlayStation 5 Disc Edition',36000,'Gaming','Used – Good','Bengaluru',4.7,'🎮','Sony'],['Canon EOS 200D DSLR Kit',28000,'Cameras','Used – Good','Delhi',4.6,'📷','Canon'],['Samsung 253L Refrigerator',15000,'Home Appliances','Used – Good','Hyderabad',4.5,'🧊','Samsung'],['Yonex Badminton Racket Set',3200,'Sports','New','Chennai',4.8,'🏏','Yonex']]
.map((a,i)=>({id:i,t:a[0],p:a[1],c:a[2],k:a[3],l:a[4],r:a[5],e:a[6],b:a[7],bg:cols[i%5],d:14-i}));
let wish=new Set([3]),user=null,me=[{t:'Sony camera lens 50mm',p:9000,v:212,s:'Active',a:'Safe'},{t:'Study desk',p:5200,v:140,s:'Active',a:'Safe'},{t:'Old gaming keyboard',p:1800,v:38,s:'Under Review',a:'Review'},{t:'Vintage watch',p:9999,v:12,s:'Draft',a:'—'}];
let mod=[['Nike Shoes','Potential Counterfeit',87],['Rolex Watch','Potential Counterfeit',91],['Kitchen Knife Set','Possible Prohibited',64]],vsRes=null,cur=null;
const toast=m=>{const t=document.createElement('div');t.className='toast';t.textContent=m;$('#toasts').append(t);setTimeout(()=>t.remove(),2600)};
const inr=n=>'₹'+Number(n).toLocaleString('en-IN');
const nav=[['home','Home'],['browse','Browse'],['sell','Sell Item'],['msgs','Messages'],['wish','Wishlist'],['dash','Dashboard'],['admin','Admin']];
$('#links').innerHTML=nav.map(n=>`<button data-v="${n[0]}" onclick="go('${n[0]}')">${n[1]}</button>`).join('');
$('#bn').innerHTML=[['home','🏠','Home'],['browse','🔍','Search'],['sell','+','Sell'],['msgs','💬','Messages'],['dash','👤','Profile']].map(n=>`<button ${n[0]=='sell'?'class="sell"':''} onclick="go('${n[0]}')">${n[1]}${n[0]=='sell'?'':'<span>'+n[2]+'</span>'}</button>`).join('');
$('#th').onclick=()=>{const r=document.documentElement;r.dataset.theme=(r.dataset.theme||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'))=='dark'?'light':'dark'};
function go(v,q){document.querySelectorAll('.view').forEach(x=>x.classList.toggle('on',x.id==v));document.querySelectorAll('.links button').forEach(b=>b.classList.toggle('on',b.dataset.v==v));scrollTo(0,0);
 if(v=='browse'){if(q!==undefined)$('#q').value=q;vsRes=null;$('#vsn').innerHTML='';load()}
 if(v=='sell')sell(0);if(v=='wish')renderWish();if(v=='dash')dash();if(v=='admin')adm();if(v=='msgs')chatInit()}
function card(p,sim){return `<div class="card"><div class="img" style="background:${p.bg}" onclick="detail(${p.id})">${p.e}<button class="heart" aria-label="Save" onclick="event.stopPropagation();tw(${p.id})">${wish.has(p.id)?'❤️':'🤍'}</button></div>
<div class="cb" onclick="detail(${p.id})"><div class="pr">${inr(p.p)}</div><div>${p.t}</div><div class="mu">📍 ${p.l} · ${p.k} · ⭐ ${p.r}</div><span class="bd ok">AI screened</span>${sim?` <span class="bd">${sim}% visually similar</span>`:''}</div></div>`}
function tw(i){wish.has(i)?wish.delete(i):wish.add(i);toast(wish.has(i)?'Saved to wishlist':'Removed from wishlist');refresh()}
function refresh(){const v=document.querySelector('.view.on').id;if(v=='home')home();if(v=='browse')draw();if(v=='wish')renderWish()}
function home(){$('#cats').innerHTML=cats.map(c=>`<div class="card cat" onclick="$('#fc').value='${c[1]}';go('browse','');$('#fc').value='${c[1]}';draw()"><span>${c[0]}</span>${c[1]}<div class="mu">${P.filter(p=>p.c==c[1]).length} items</div></div>`).join('');
 $('#recW').textContent='Because you viewed laptops (change in Settings → Privacy: personalization on)';$('#rec').innerHTML=P.filter(p=>p.c=='Laptops').map(p=>card(p)).join('')}
$('#fc').innerHTML='<option value="">All categories</option>'+cats.map(c=>`<option>${c[1]}</option>`).join('');
$('#fl').innerHTML='<option value="">Any location</option>'+[...new Set(P.map(p=>p.l))].map(l=>`<option>${l}</option>`).join('');
['q','fc','fk','fl','fp','so'].forEach(i=>$('#'+i).addEventListener('input',draw));
function load(){$('#pl').innerHTML='<div class="sk"></div>'.repeat(4);setTimeout(draw,450)}
function draw(){let r=vsRes?vsRes.map(x=>P[x[0]]):P.slice();const q=$('#q').value.toLowerCase(),f=$('#fc').value,k=$('#fk').value,l=$('#fl').value,mp=+$('#fp').value,s=$('#so').value;
 r=r.filter(p=>(!q||(p.t+p.b+p.c).toLowerCase().includes(q))&&(!f||p.c==f)&&(!k||p.k==k)&&(!l||p.l==l)&&(!mp||p.p<=mp));
 if(s=='lo')r.sort((a,b)=>a.p-b.p);if(s=='hi')r.sort((a,b)=>b.p-a.p);if(s=='new')r.sort((a,b)=>a.d-b.d);
 $('#pl').innerHTML=r.length?r.map(p=>card(p,vsRes&&vsRes.find(x=>x[0]==p.id)[1])).join(''):'<div class="empty">'+(q?'No products found for “'+q+'”. Try fewer filters.':'No products match these filters.')+'</div>'}
function vs(){const f=document.createElement('input');f.type='file';f.accept='image/*';f.onchange=()=>{const x=f.files[0];if(!x||!/^image\/(jpeg|png|webp)$/.test(x.type))return toast('Unsupported file. Use JPG, PNG or WebP.');
 const h=[...x.name].reduce((a,c)=>a+c.charCodeAt(0),0);vsRes=P.map((p,i)=>[i,Math.max(52,97-((i*7+h)%40))]).sort((a,b)=>b[1]-a[1]).slice(0,6);go('browse');vsRes=vsRes;$('#vsn').innerHTML='<div class="panel"><b>Similar Products Found</b><div class="mu">Demo mode: similarity is a visual/attribute estimate, not a guarantee of exact identity.</div></div>';draw()};f.click()}
function detail(i){const p=P[i];$('#mb').innerHTML=`<div class="img" style="background:${p.bg};border-radius:14px;height:200px;font-size:90px">${p.e}</div><h3>${p.t}</h3><div class="pr">${inr(p.p)}</div><p><span class="bd ok">AI screened</span> <span class="bd">${p.k}</span></p>
<p class="mu">Brand: ${p.b} · Category: ${p.c} · Posted ${p.d} days ago · 📍 ${p.l}<br>Seller: Aarav (⭐ ${p.r}, 24 sales). AI screening is not proof of authenticity — inspect before paying.</p>
<button class="p" onclick="need(()=>{closeM();cur=${i};go('msgs')})">Chat with Seller</button> <button onclick="need(()=>{closeM();offer(${i})})">Make an Offer</button> <button onclick="tw(${i})">Save</button> <button onclick="toast('Report submitted')">Report Listing</button> <button onclick="closeM()">Close</button>`;$('#md').classList.add('on')}
const closeM=()=>$('#md').classList.remove('on');
function need(fn){user?fn():login(fn)}
function login(fn){$('#mb').innerHTML=`<h3>Log in or register</h3><input id="le" type="email" placeholder="Email" style="margin:6px 0"><input id="lp" type="password" placeholder="Password (min 8 chars)" style="margin:6px 0"><button class="p" id="lgo">Log in</button> <button onclick="toast('Google login needs a backend')">Google</button> <button onclick="toast('Reset link sent (demo)')">Forgot password</button> <button onclick="closeM()">Continue as guest</button>`;$('#md').classList.add('on');
 $('#lgo').onclick=()=>{if(!/^\S+@\S+\.\S+$/.test($('#le').value)||$('#lp').value.length<8)return toast('Enter a valid email and an 8+ character password.');user=$('#le').value;$('#lg').textContent='Aarav ▾';closeM();toast('Logged in');fn&&fn()}}
function renderWish(){$('#wl').innerHTML=wish.size?[...wish].map(i=>card(P[i])).join(''):'<div class="empty">Nothing saved yet. Tap 🤍 on any listing.</div>'}
function dash(){$('#stat').innerHTML=[['Active',me.filter(m=>m.s=='Active').length],['Views',402],['Likes',57],['Messages',9],['Sold',6],['Sales','₹1.2L']].map(s=>`<div class="card"><b>${s[1]}</b>${s[0]}</div>`).join('');
 const d=[30,52,41,70,64,90,78];$('#ch').innerHTML=d.map((v,i)=>`<rect x="${i*40+8}" y="${100-v}" width="26" height="${v}" rx="5" fill="var(--ac)"/>`).join('');
 $('#ml').innerHTML='<tr><th>Item<th>Price<th>Views<th>Status<th>AI<th></tr>'+me.map((m,i)=>`<tr><td>${m.t}<td>${inr(m.p)}<td>${m.v}<td><span class="bd ${m.s=='Active'?'ok':'wn'}">${m.s}</span><td>${m.a}<td><button onclick="toast('Edit opened')">Edit</button> <button onclick="delP(${i})">Delete</button></tr>`).join('')}
function adm(){$('#astat').innerHTML=[['Users','12,480'],['Listings','8,214'],['Active','5,930'],['Sold','2,051'],['Reported',41],['AI rejections',119],['Pending',mod.length]].map(s=>`<div class="card"><b>${s[1]}</b>${s[0]}</div>`).join('');
 $('#aq').innerHTML=mod.length?'<tr><th>Product<th>AI result<th>Conf.<th>Status<th></tr>'+mod.map((m,i)=>`<tr><td>${m[0]}<td>${m[1]}<td>${m[2]}%<td><span class="bd wn">Manual review</span><td><button onclick="mq(${i},'Approved')">Approve</button> <button onclick="mq(${i},'Rejected')">Reject</button> <button onclick="mq(${i},'More info requested')">Request info</button></tr>`).join(''):'<tr><td class="empty">Queue is clear 🎉</tr>'}
function mq(i,a){toast(mod[i][0]+': '+a);mod.splice(i,1);adm()}
function chatInit(){if(!$('#cw').children.length){add('Hi! Is the '+(cur!=null?P[cur].t:'item')+' still available?',0);add('Yes, it is. Happy to meet in a public place.',1)}}
function add(t,me){const d=document.createElement('div');d.className='m'+(me?'':' me');d.textContent=t;$('#cw').append(d);$('#cw').scrollTop=1e5}
function send(){const v=$('#ci').value.trim();if(!v)return;add(v,0);$('#ci').value='';setTimeout(()=>add('Thanks, will reply shortly.',1),700)}
function offer(i){add('Offer sent: '+inr(i!=null?Math.round(P[i].p*.9):28000),0);toast('Offer sent');if(i!=null)go('msgs')}
function ask(){const q=$('#ai_i').value.trim();if(!q)return;const b=$('#ac');b.insertAdjacentHTML('beforeend',`<div class="m me"></div>`);b.lastChild.textContent=q;$('#ai_i').value='';
 const n=(q.replace(/,/g,'').match(/(\d{4,6})/)||[])[1],w=q.toLowerCase();let r=P.filter(p=>(!n||p.p<=+n)&&(/phone|iphone/.test(w)?p.c=='Mobiles':/laptop|coding/.test(w)?p.c=='Laptops':w.split(/\W+/).some(x=>x.length>3&&p.t.toLowerCase().includes(x)))).slice(0,3);
 b.insertAdjacentHTML('beforeend',r.length?`<div class="m">Found ${r.length} match(es):${r.map(p=>`<div><a href="#" onclick="detail(${p.id});return false">${p.t} – ${inr(p.p)}</a></div>`).join('')}Tip: offer about 8–10% below asking.</div>`:'<div class="m">No products found. Try a different budget or category.</div>');b.scrollTop=1e5}
/* ---- Sell with AI (DEMO MODE: mock analysis, replace aiAnalyze with real API call via backend) ---- */
let S={};
function aiAnalyze(name){const n=name.toLowerCase(),h=[...n].reduce((a,c)=>a+c.charCodeAt(0),0);
 if(/knife|gun|weapon|drug/.test(n))return{status:'bad'};if(/fake|replica|copy/.test(n))return{status:'review',conf:.87,...P[7]};
 if(/blank|unknown|test/.test(n))return{status:'none'};const p=P[h%P.length];return{status:'ok',conf:.9,...p}}
function sell(step){const b=$('#sellBody');
 if(step==0){S={};b.innerHTML=`<div class="panel"><div class="mu" style="margin-bottom:8px">Demo AI mode: results are simulated. Connect a real vision API in <code>aiService</code> for production.</div><div class="drop" id="dz" tabindex="0"><div style="font-size:44px">📸</div><b>Upload a product photo</b><div class="mu">JPG, PNG or WebP · max 5 MB · drag & drop or tap</div></div></div>`;
  const dz=$('#dz');dz.onclick=()=>{const f=document.createElement('input');f.type='file';f.accept='image/*';f.capture='environment';f.onchange=()=>pick(f.files[0]);f.click()};dz.ondragover=e=>e.preventDefault();dz.ondrop=e=>{e.preventDefault();pick(e.dataTransfer.files[0])}}
 if(step==1)b.innerHTML=`<div class="panel"><img src="${S.url}" alt="Preview" style="max-width:100%;max-height:260px;border-radius:12px"><p><button class="p" onclick="scan()">Analyze with AI</button> <button onclick="sell(0)">Change photo</button></p></div>`;
 if(step==3)result()}
function pick(f){if(!f)return;if(!/^image\/(jpeg|png|webp)$/.test(f.type))return toast('Unsupported file. Upload a JPG, PNG or WebP image.');if(f.size>5e6)return toast('Image is over 5 MB. Choose a smaller photo.');S.f=f;S.url=URL.createObjectURL(f);sell(1)}
function scan(){const st=['Detecting object','Identifying category','Detecting brand','Detecting color','Estimating condition','Generating description','Checking marketplace safety','Calculating suggested price'];
 $('#sellBody').innerHTML=`<div class="panel"><b>SmartMarket AI is thinking…</b><div class="scan">🔍</div><div class="bar"><i id="pb"></i></div><ul class="steps" id="st">${st.map(s=>`<li>${s}</li>`).join('')}</ul></div>`;
 let i=0;const t=setInterval(()=>{document.querySelectorAll('#st li')[i]?.classList.add('done');i++;$('#pb').style.width=i/st.length*100+'%';if(i>=st.length){clearInterval(t);S.r=aiAnalyze(S.f.name);setTimeout(()=>sell(3),300)}},380)}
function result(){const r=S.r,b=$('#sellBody');
 if(r.status=='none'){b.innerHTML='<div class="panel"><b>Product not detected</b><p>We couldn\'t confidently identify this product. Try uploading a clearer image.</p><button class="p" onclick="sell(0)">Try another photo</button></div>';return}
 if(r.status=='bad'){b.innerHTML='<div class="panel"><span class="bd bd2">🔴 Listing Rejected</span><p>This listing cannot be published because the detected item appears to belong to a prohibited category.</p><button onclick="sell(0)">Start over</button></div>';return}
 const rev=r.status=='review';S.t=r.t;S.pr=Math.round(r.p*.97/100)*100;
 b.innerHTML=`<div class="panel"><span class="bd ${rev?'wn':'ok'}">${rev?'🟡 Manual Review Required':'🟢 Safe to List'}</span><p class="mu">${rev?'AI could not confidently verify this item. Manual verification is required.':'AI screening found no prohibited-category match.'} This is a screening, not a guarantee of authenticity.</p></div>
 <div class="row2"><div class="panel"><b>Detected product</b><p>Product: ${r.t}<br>Brand: ${r.b}<br>Category: ${r.c}<br>Condition: ${r.k}<br>Confidence: ${Math.round(r.conf*100)}%</p><div class="tags"><span class="bd">${r.b}</span><span class="bd">${r.c}</span><span class="bd">${r.k}</span></div></div>
 <div class="panel"><b>Edit your listing</b><label class="mu">Title</label><input id="et" value="${r.t}"><label class="mu">Description</label><textarea id="ed" rows="4">${r.b} ${r.t.replace(r.b,'').trim()} in ${r.k.toLowerCase()} condition. Photos show the actual item. Meet in a public place; inspect before paying.</textarea></div></div>
 <div class="panel"><b>AI suggested price</b><div class="pr">${inr(S.pr)}</div><div class="mu">Range ${inr(S.pr*.93)} – ${inr(S.pr*1.07)} · Demand: High · Condition adjustment −3% (estimates, not market quotes)</div><input id="ep" type="number" value="${S.pr}" style="max-width:200px;margin:8px 0"> <button onclick="$('#ep').value=${S.pr}">Use Suggested Price</button></div>
 <div class="panel"><b>Marketplace preview</b><div style="max-width:260px" class="grid"><div class="card"><div class="img" style="background:${r.bg}"><img src="${S.url}" alt="" style="width:100%;height:150px;object-fit:cover"></div><div class="cb"><div class="pr" id="pp">${inr(S.pr)}</div><div>${r.t}</div><div class="mu">📍 Pune · ${r.k}</div></div></div></div><p><button onclick="draft()">Save Draft</button> <button class="p" onclick="pub()" ${rev?'':''}>${rev?'Submit for review':'Publish Listing'}</button></p></div>`}
function draft(){me.unshift({t:$('#et').value,p:+$('#ep').value,v:0,s:'Draft',a:'—'});toast('Draft saved')}
function pub(){need(()=>{const t=$('#et').value.trim(),p=+$('#ep').value;if(!t||!(p>0))return toast('Add a title and a valid price.');const rev=S.r.status=='review';
 me.unshift({t,p,v:0,s:rev?'Under Review':'Active',a:rev?'Review':'Safe'});if(rev)mod.unshift([t,'Potential Counterfeit',87]);else P.push({...S.r,id:P.length,t,p,d:0,l:"Pune"});
 $('#sellBody').innerHTML=`<div class="panel empty"><div style="font-size:60px">✅</div><b>${rev?'Submitted for manual review':'Published'}</b><p>${rev?'An admin will approve or reject it.':'Your listing is now in the marketplace.'}</p><button class="p" onclick="go('${rev?'dash':'browse'}')">${rev?'Open dashboard':'View marketplace'}</button></div>`;toast(rev?'Submitted for review':'Published')})}
addEventListener('click',e=>{if(e.target.id=='md')closeM()});

let token=null;try{token=localStorage.getItem('sm_token')}catch(e){}
async function api(u,o={}){let r;try{r=await fetch(u,{method:o.method||'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:o.body&&JSON.stringify(o.body)})}catch(e){throw new Error('Network error. Check your connection and try again.')}
 const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Something went wrong.');return j}
function authUI(mode,note){const reg=mode=='register';$('#auth').classList.add('on');$('#auth').innerHTML=`<div class="panel"><div class="logo">SmartMarket <b>AI</b></div><h3>${reg?'Create your account':'Log in'}</h3><div class="mu">${note||(reg?'Create an account to start buying and selling.':'Welcome back.')}</div>
${reg?'<input id="rn" placeholder="Full name"><input id="rp" inputmode="numeric" maxlength="10" placeholder="Mobile (10 digits)"><input id="rl" placeholder="Location (city)">':''}<input id="re" type="email" placeholder="Email" value="${window._em||''}"><input id="rw" type="password" placeholder="Password (8+ characters)">
<button class="p" id="ago" style="width:100%;margin-top:8px">${reg?'Register':'Log in'}</button><p class="mu" style="text-align:center">${reg?'Already registered?':'New here?'} <a href="#" id="asw">${reg?'Log in':'Register'}</a></p></div>`;
 $('#asw').onclick=e=>{e.preventDefault();authUI(reg?'login':'register')};
 $('#ago').onclick=async()=>{const e=$('#re').value.trim().toLowerCase(),w=$('#rw').value;try{
  if(reg){const j=await api('/api/register',{method:'POST',body:{name:$('#rn').value,phone:$('#rp').value,location:$('#rl').value,email:e,password:w}});token=j.token;try{localStorage.setItem('sm_token',token)}catch(x){}user=j.user;toast('Welcome to SmartMarket AI!');await enter()}
  else{const j=await api('/api/login',{method:'POST',body:{email:e,password:w}});token=j.token;try{localStorage.setItem('sm_token',token)}catch(x){}user=j.user;await enter()}}catch(x){toast(x.message)}}}
function greet(){const h=new Date().getHours(),g=h<5?'Good night':h<12?'Good morning':h<17?'Good afternoon':h<21?'Good evening':'Good night';$('#gr').textContent=g+', '+user.name.split(' ')[0]+' 👋'}
async function loadP(){const rows=await api('/api/products');const em=Object.fromEntries(cats.map(c=>[c[1],c[0]]));
 P=rows.map((r,i)=>({id:i,dbId:r.id,t:r.title,p:r.price,c:r.category,k:r.condition,l:r.location,r:4.6,e:em[r.category]||'📦',b:r.brand||'',bg:cols[i%5],d:Math.max(0,Math.floor((Date.now()-new Date(r.created_at.replace(' ','T')+'Z'))/864e5)),own:r.seller_id==user.id,st:r.status}));
 me=P.filter(p=>p.own).map(p=>({t:p.t,p:p.p,v:0,s:p.st,a:'Safe',dbId:p.dbId}))}
function setCat(c){go('browse','');$('#fc').value=c;draw();document.querySelectorAll('#chips button').forEach(b=>b.classList.toggle('on',b.dataset.c==c))}
function chips(){$('#chips').innerHTML=['All',...cats.map(c=>c[1])].map(c=>`<button data-c="${c=='All'?'':c}" onclick="setCat('${c=='All'?'':c}')">${c}</button>`).join('')}
async function enter(){$('#auth').classList.remove('on');$('#lg').textContent='Log out';$('#lg').onclick=logout;greet();try{await loadP()}catch(e){toast(e.message)}chips();home();go('home')}
function logout(){token=null;user=null;try{localStorage.removeItem('sm_token')}catch(e){}$('#lg').textContent='Log in';$('#gr').textContent='';authUI('login','You are logged out.')}
async function delP(i){try{await api('/api/products/'+me[i].dbId,{method:'DELETE'});await loadP();dash();toast('Deleted')}catch(e){toast(e.message)}}
function payload(st){const r=S.r;return{title:$('#et').value.trim(),description:$('#ed').value,category:r.c,brand:r.b,price:+$('#ep').value,condition:r.k,location:user.location||'Pune',status:st}}
let pubBusy=false;const once=()=>{if(pubBusy)return false;pubBusy=true;setTimeout(()=>pubBusy=false,1500);return true};
async function draft(){if(!once())return;try{await api('/api/products',{method:'POST',body:payload('Draft')});await loadP();toast('Draft saved')}catch(e){toast(e.message)}}
async function pub(){if(!once())return;const rev=S.r.status=='review';if(!$('#et').value.trim()||!(+$('#ep').value>0))return toast('Add a title and a valid price.');
 try{await api('/api/products',{method:'POST',body:payload(rev?'Under Review':'Active')});await loadP();if(rev)mod.unshift([$('#et').value,'Potential Counterfeit',87]);
 $('#sellBody').innerHTML=`<div class="panel empty"><div style="font-size:60px">✅</div><b>${rev?'Submitted for manual review':'Published'}</b><p>${rev?'An admin will approve or reject it.':'Your listing is now visible to every logged-in user.'}</p><button class="p" onclick="go('${rev?'dash':'browse'}')">${rev?'Open dashboard':'View marketplace'}</button></div>`;toast(rev?'Submitted for review':'Published')}catch(e){toast(e.message)}}
(async()=>{if(token){try{user=(await api('/api/me')).user;return enter()}catch(e){token=null}}authUI('register')})();