const express = require('express')
const router = express.Router()
const modelPeserta = require('../../model/modelPeserta')
const modelLaporan = require('../../model/modelLaporan')
const modelPembimbing = require('../../model/modelPembimbing')
const {authPembimbing} = require('../../middleware/auth')

router.get('/peserta', authPembimbing, async(req, res) => {
    try {
        const userId = req.session.userId

        const  user = await modelPembimbing.getPembimbingById(userId)

        const getAllpeserta = await modelPeserta.getAllPeserta()

        res.render('pembimbing/peserta/peserta', {getAllpeserta, user})
    } catch(err) {
        req.flash('error', err.message)
        res.redirect('/pembimbing/dashboard')
    }
})

router.post('/peserta/update/:id', authPembimbing, async (req, res) => {
    try {
        const {id} = req.params
        const {status} = req.body
        const data = {status}
        
        await modelPeserta.updateStatus(data, id)

        req.flash('success', 'peserta Behasil Diupdate')

        res.redirect('/pembimbing/peserta')
    } catch(err) {
        req.flash('error', err.message)
        res.redirect('/pembimbing/peserta')
    }
})

router.post('/peserta/delete/:id', authPembimbing, async (req, res) => {
    try {
        const {id} = req.params
        await modelPeserta.delete(id)

        req.flash('success', 'peserta berhasil dihapus')
        res.redirect('/pembimbing/peserta')
    } catch(err) {
        req.flash('error', err.message)
        res.redirect('/pembimbing/peserta')
    }
})

router.get('/laporan-logbook', authPembimbing, async (req, res) => {
    try {
        const userId = req.session.userId

        const  user = await modelPembimbing.getPembimbingById(userId)

        const rows = await modelLaporan.getAll()

        const opts = {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
        }

        const getAllLaporanPeserta = rows.map(r => {
        const masuk = r.waktu_absensi_masuk ? new Date(r.waktu_absensi_masuk) : null
        const keluar = r.waktu_absensi_keluar ? new Date(r.waktu_absensi_keluar) : null

        return {
            ...r,
            waktu_masuk_formatted: masuk ? masuk.toLocaleString('id-ID', opts) : '-',
            waktu_keluar_formatted: keluar ? keluar.toLocaleString('id-ID', opts) : '-',
            laporan_harian_url: r.laporan_harian ? ('/file/laporan/' + encodeURIComponent(r.laporan_harian)) : null
        }
        })

        res.render('pembimbing/peserta/detailLogBook', { getAllLaporanPeserta, user })
    } catch (err) {
        req.flash('error', err.message)
        res.redirect('/pembimbing/dashboard')
    }
})

module.exports = router