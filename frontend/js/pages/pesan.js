import {$,$$,api,rp,esc,getS,toast,waLink,config} from '/js/api.js';
import {mountLayout} from '/js/layout.js';
mountLayout('pesan');
const st={games:[],dp:30,svc:null,tier:'standard',step:1,gi:0},key=crypto.randomUUID(),q=new URLSearchParams(location.search);
const price=()=>st.svc?Math.round(st.svc.basePrice*st.svc.tiers[st.tier]):0,dpAmt=()=>Math.floor(price()*st.dp/100);
const S=getS();
if(!S||S.user.role!=='CUSTOMER'){$('#guest').classList.remove('hidden');$('#glogin').href='/login.html?next='+encodeURIComponent(location.pathname+location.search)}
function tabs(){$('#tabs').innerHTML=st.games.map((g,i)=>`<button class="tab ${i===st.gi?'on':''}" data-i="${i}">${esc(g.gameName)}</button>`).join('');
 $('#lst').innerHTML=(st.games[st.gi]?.services||[]).map(s=>`<button data-s="${s.id}" class="glass hov rounded-2xl p-5 text-left ${st.svc?.id===s.id?'ring-2 ring-cy':''}"><h3 class="font-semibold mb-1">${esc(s.title)}</h3><p class="text-sm text-slate-400 mb-3">${esc(s.description)}</p><div class="flex justify-between items-center"><b class="grad-text font-display">${rp(s.basePrice)}</b><span class="text-xs text-slate-400">Est. ${s.estimatedHours} jam</span></div></button>`).join('')}
function sum(){const s=st.svc;if(!s)return $('#sum').innerHTML='Belum ada paket dipilih.';
 $('#sum').innerHTML=`<div class="text-white font-semibold mb-1">${esc(s.title)}</div><div class="mb-4">${esc(s.gameName)}</div>
 <div class="grid gap-1.5 mb-4"><label class="lbl">Kecepatan<select id="tier" class="field"><option value="standard" ${st.tier==='standard'?'selected':''}>Standar</option><option value="express" ${st.tier==='express'?'selected':''}>Express (prioritas)</option></select></label></div>
 <div class="flex justify-between"><span>Total</span><b class="text-white">${rp(price())}</b></div><div class="flex justify-between"><span>DP (${st.dp}%)</span><span>${rp(dpAmt())}</span></div>`;
 $('#tier').onchange=e=>{st.tier=e.target.value;sum();pay()}}
function pay(){$('#fullTxt').textContent=`Bayar ${rp(price())} sekarang.`;$('#dpTxt').textContent=`Bayar ${rp(dpAmt())} dulu, sisa ${rp(price()-dpAmt())} dilunasi sebelum masuk antrian.`}
function go(n){st.step=n;['p1','p2','p3'].forEach((id,i)=>$('#'+id).classList.toggle('hidden',i+1!==n));
 $$('#dots .step-dot').forEach((d,i)=>d.classList.toggle('on',i+1<=n));$('#back').classList.toggle('invisible',n===1);$('#next').textContent=n===3?'Buat Pesanan & Bayar':'Lanjut';if(n===3)pay()}
$('#tabs').onclick=e=>{if(e.target.dataset.i!=null){st.gi=+e.target.dataset.i;tabs()}};
$('#lst').onclick=e=>{const b=e.target.closest('[data-s]');if(!b)return;st.svc=st.games.flatMap(g=>g.services).find(s=>s.id===b.dataset.s);tabs();sum()};
$('#back').onclick=()=>go(st.step-1);
$('#next').onclick=async()=>{
 if(st.step===1){if(!st.svc)return toast('Pilih paket terlebih dahulu','err');return go(2)}
 if(st.step===2){if(!$('#f').reportValidity())return;return go(3)}
 const cur=getS();if(!cur||cur.user.role!=='CUSTOMER'){toast('Masuk sebagai pelanggan untuk memesan','err');return setTimeout(()=>location.href='/login.html?next='+encodeURIComponent('/pesan.html?service='+st.svc.id),900)}
 const b=Object.fromEntries(new FormData($('#f')));b.serviceId=st.svc.id;b.tier=st.tier;b.useBooking=document.querySelector('[name=pay]:checked').value==='dp';
 $('#next').disabled=true;
 try{const o=await api('/orders',{body:b,headers:{'Idempotency-Key':key}});const p=await api(`/orders/${o.id}/pay`,{method:'POST'});let paid=false;
  if(confirm(`Bayar ${rp(p.amount)} lewat gateway sandbox?`)){await api(`/orders/${o.id}/simulate-pay`,{method:'POST'});paid=true}
  done(o,paid)}catch(x){toast(x.message,'err')}finally{$('#next').disabled=false}};
async function done(o,paid){const c=await config().catch(()=>({brand:'Nadzz Joki'}));
 ['p1','p2','p3','nav'].forEach(id=>$('#'+id).classList.add('hidden'));$('#done').classList.remove('hidden');
 const wa=c.adminWhatsapp?waLink(c.adminWhatsapp,`Halo Admin ${c.brand}, saya baru membuat pesanan ${o.code} (${o.title}). Mohon konfirmasi.`):'/cs.html';
 $('#done').innerHTML=`<div class="text-5xl mb-3">${paid?'✅':'🕒'}</div><h2 class="text-2xl font-bold mb-2">${paid?'Pembayaran berhasil':'Pesanan dibuat'}</h2>
 <p class="text-slate-400 mb-4">${paid?'Pesananmu masuk proses.':'Belum dibayar — selesaikan dari Pesanan Saya.'}</p>
 <div class="inline-block glass rounded-xl px-6 py-3 mb-6"><div class="text-xs text-slate-400">Kode pesanan</div><b class="font-display text-xl grad-text">${esc(o.code)}</b></div>
 <div class="flex flex-wrap justify-center gap-3"><a target="_blank" rel="noopener" href="${wa}" class="btn-grad rounded-xl px-6 py-2.5">Konfirmasi via WhatsApp</a><a href="/app.html#/orders" class="btn-line rounded-xl px-6 py-2.5">Pesanan Saya</a><a href="/track.html?code=${encodeURIComponent(o.code)}" class="btn-line rounded-xl px-6 py-2.5">Cek Transaksi</a></div>`;
 setTimeout(()=>{window.__dp?.prompt();window.__dp=null},1200)}
(async()=>{try{const c=await api('/catalog');st.games=c.games;st.dp=c.dpPct;
 const pre=c.games.flatMap(g=>g.services).find(s=>s.id===q.get('service'));if(pre){st.svc=pre;st.gi=c.games.findIndex(g=>g.gameName===pre.gameName)}}
 catch{$('#lst').innerHTML='<p class="text-slate-400">Server belum tersambung.</p>'}
 tabs();sum();go(1)})();
