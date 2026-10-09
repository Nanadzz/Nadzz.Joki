import {esc} from './api.js';
export const FAQ=[
 ['Bagaimana alur pemesanan?','Pilih paket di halaman Pesan, isi data akun, lalu bayar penuh atau DP. Setelah lunas, pesanan masuk antrian dan ditugaskan ke worker yang cocok dengan game dan kapasitasnya.'],
 ['Apa itu DP / booking?','Kamu bisa membayar uang muka (persentase ditentukan admin) untuk mereservasi slot. Sisanya dilunasi sebelum pesanan masuk antrian. DP yang tidak dilunasi sampai batas waktu reservasi bisa hangus sesuai aturan admin.'],
 ['Apakah akun game saya aman?','Kredensial dienkripsi di server, hanya worker yang mengerjakan yang bisa membukanya selama pesanan berjalan, dan dihapus otomatis saat pesanan selesai. Perlu diketahui: sebagian game melarang joki dalam ketentuan layanannya, sehingga selalu ada risiko terhadap akun. Pertimbangkan sendiri sebelum memesan.'],
 ['Bagaimana memantau progres?','Gunakan menu Cek Transaksi dengan kode pesanan, atau buka Pesanan Saya setelah masuk. Progres dan riwayat status diperbarui oleh worker.'],
 ['Kapan pesanan dianggap selesai?','Worker menandai selesai, lalu kamu konfirmasi. Jika tidak ada respons dalam batas waktu auto-confirm (bawaan 24 jam), pesanan otomatis terverifikasi dan bagi hasil dicatat.'],
 ['Pesanan bermasalah, bagaimana?','Ajukan sengketa dari Pesanan Saya saat statusnya selesai, atau hubungi Customer Service. Admin akan memutuskan verifikasi atau refund.'],
 ['Bagaimana menghubungi worker?','Buka halaman Worker untuk tombol WhatsApp worker yang bersedia menampilkannya. Nomor worker pesananmu juga muncul di Pesanan Saya selama pesanan berjalan.']];
export function renderFaq(el,list=FAQ){el.innerHTML=list.map(([q,a])=>`<details class="glass rounded-xl px-5 py-4"><summary class="flex justify-between gap-4 font-semibold">${esc(q)}<span class="chev text-cy transition">⌄</span></summary><p class="text-slate-400 text-sm mt-3 leading-relaxed">${esc(a)}</p></details>`).join('')||'<p class="text-slate-400">Tidak ada hasil.</p>'}
