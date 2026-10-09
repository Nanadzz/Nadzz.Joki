import {$,api,rp,esc,config} from '/js/api.js';
import {mountLayout} from '/js/layout.js';
import {workerCard} from '/js/components.js';
import {renderFaq,FAQ} from '/js/faq.js';
mountLayout('home');
$('#steps').innerHTML=[['Pilih paket','Telusuri layanan per game dan pilih kecepatan.'],['Isi data akun','UID, server, dan target pengerjaan.'],['Bayar','Lunas atau DP untuk reservasi slot.'],['Pantau & konfirmasi','Lacak progres, lalu konfirmasi saat selesai.']]
 .map(([t,d],i)=>`<div class="glass rounded-2xl p-6"><div class="step-dot on mb-4">${i+1}</div><h3 class="font-semibold mb-1">${t}</h3><p class="text-sm text-slate-400">${d}</p></div>`).join('');
renderFaq($('#faqs'),FAQ.slice(0,5));
(async()=>{
 let cat={games:[],dpPct:30},wk=[],c={brand:'Nadzz Joki'};
 try{[cat,wk,c]=await Promise.all([api('/catalog'),api('/workers'),config()])}catch{$('#lst').innerHTML='<p class="text-slate-400">Server belum tersambung.</p>'}
 const n=cat.games.reduce((a,g)=>a+g.services.length,0);
 $('#stats').innerHTML=[[n,'Paket layanan'],[wk.length,'Worker aktif'],[cat.dpPct+'%','DP minimum']].map(([v,l])=>`<div><b class="font-display text-2xl grad-text">${v}</b><div class="text-xs text-slate-400">${l}</div></div>`).join('');
 const show=i=>{[...$('#tabs').children].forEach((b,j)=>b.classList.toggle('on',i===j));
  $('#lst').innerHTML=(cat.games[i]?.services||[]).map(s=>`<article class="glass hov rounded-2xl p-5 flex flex-col"><h3 class="font-semibold mb-1">${esc(s.title)}</h3><p class="text-sm text-slate-400 flex-1">${esc(s.description)}</p>
   <div class="font-display text-xl grad-text my-3">${rp(s.basePrice)}</div><div class="flex items-center justify-between text-xs text-slate-400 mb-4"><span>Est. ${s.estimatedHours} jam</span><span>Express ${rp(Math.round(s.basePrice*s.tiers.express))}</span></div>
   <a href="/pesan.html?service=${s.id}" class="btn-grad rounded-xl py-2.5 text-sm">Pesan</a></article>`).join('')};
 $('#tabs').innerHTML=cat.games.map((g,i)=>`<button class="tab" data-i="${i}">${esc(g.gameName)}</button>`).join('');
 $('#tabs').onclick=e=>e.target.dataset.i&&show(+e.target.dataset.i);show(0);
 $('#wk').innerHTML=wk.slice(0,3).map(w=>workerCard(w,c)).join('')||'<p class="text-slate-400">Belum ada worker.</p>';
})();
