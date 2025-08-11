const express = require('express')
const router = express.Router()
const modelPeserta = require('../../model/modelPeserta')
const modelLaporan = require('../../model/modelLaporan')
const {authPeserta} = require('../../middleware/auth')

router.get('/detail', authPeserta, async (req, res) => {
    try {

        const userId = req.session.userId

        const  user = await modelPeserta.getPesertaById(userId)

        const rows = await modelLaporan.getAllById(userId);

        const opts = {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
        };

        const getAllLaporanPeserta = rows.map(r => {
        const masuk = r.waktu_absensi_masuk ? new Date(r.waktu_absensi_masuk) : null;
        const keluar = r.waktu_absensi_keluar ? new Date(r.waktu_absensi_keluar) : null;

        return {
            ...r,
            waktu_masuk_formatted: masuk ? masuk.toLocaleString('id-ID', opts) : '-',
            waktu_keluar_formatted: keluar ? keluar.toLocaleString('id-ID', opts) : '-',
            laporan_harian_url: r.laporan_harian ? ('/file/laporan/' + encodeURIComponent(r.laporan_harian)) : null
        };
        });

        res.render('peserta/detailLogBook', { getAllLaporanPeserta, user });
    } catch (err) {
        console.log(err)
        req.flash('error', err.message );
        res.redirect('/peserta/detail')
    }
});


module.exports = router