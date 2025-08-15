const express = require('express')
const router = express.Router()
const modelLaporan = require('../../model/modelLaporan')
const modelPeserta = require('../../model/modelPeserta')
const path = require('path')
const multer = require('multer')
const fs = require('fs')
const {authPeserta} = require('../../middleware/auth')
const scheduleCheck = require('../../middleware/scheduleCheck')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/file/laporan'))
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random()*1e9)
        cb(null, unique + path.extname(file.originalname))
    }
})

//instalisasi multer dengan konfigurasi storage dan filter ukuran file
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = /pdf/
        const ok = allowed.test(file.mimetype) && allowed.test(path.extname(file.originalname).toLowerCase())
        cb(ok ? null : new Error('Only PDF files are allowed'), ok)
    }
})

// Fungsi untuk menghapus file yang diupload
const deleteUploadedFile = (input) => {
    if (!input) return

    const files = Array.isArray(input) ? input : [input]

    for (const file of files) {
        if (!file || !file.filename) continue
        const filePath = path.join(__dirname, '../../public/file/laporan', file.filename)
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
    }
}

// Fungsi untuk menghapus foto lama saat update
const deleteOldPhoto = (oldPhoto) => {
    if (oldPhoto) {
        const filePath = path.join(__dirname, '../../public/file/laporan', oldPhoto)
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
}

router.get('/presensi-laporan', authPeserta, async (req, res) => {
    try {
        const userId = req.session.userId

        const user = await modelPeserta.getPesertaById(userId)

        const dataNow = await modelLaporan.getLaporanHariIni(userId)

        res.render('peserta/logBook', {dataNow, user})
    } catch (err) {
        console.log(err)
        req.flash('err', err.message)
        res.redirect('/')
    }
})

router.post('/presensi-masuk', authPeserta, async (req, res) => {
    try {
        const userId = req.session.userId

        if (await modelLaporan.checkPresensiMasuk(userId)) {
            req.flash('error', 'Anda sudah absen masuk hari ini')
            return res.redirect('/peserta/presensi-laporan')
        }

        await modelLaporan.presensiMasuk(userId)

        req.flash('success', 'Presensi masuk berhasil')
        res.redirect('/peserta/presensi-laporan')
    } catch (err) {
        console.log(err)
        req.flash('err', err.message)
        res.redirect('/')
    }
})

router.post('/presensi-keluar', authPeserta, async (req, res) => {
    try {
        const userId = req.session.userId

        if (await modelLaporan.checkPresensiKeluar(userId)) {
            req.flash('error', 'Anda sudah absen keluar hari ini')
            return res.redirect('/peserta/presensi-laporan')
        }

        await modelLaporan.presensiKeluar(userId)

        req.flash('success', 'Presensi keluar berhasil')
        res.redirect('/peserta/presensi-laporan')
    } catch (err) {
        req.flash('err', err.message)
        res.redirect('/peserta/presensi-laporan')
    }
})

router.post('/laporan-harian-upload', authPeserta, upload.single('laporan_pdf'), async (req, res) => {
    try {
        const userId = req.session.userId

        if (!req.file) {
        req.flash('error', 'Silakan pilih file PDF untuk diunggah')
        return res.redirect('/peserta/presensi-laporan')
        }

        const { mimetype, size } = req.file
        const maxSize = 5 * 1024 * 1024

        if (mimetype != 'application/pdf' && path.extname(req.file.originalname).toLowerCase() !== '.pdf') {
        deleteUploadedFile(req.file)
        req.flash('error', 'File harus berformat PDF')
        return res.redirect('/peserta/presensi-laporan')
        }

        if (size > maxSize) {
        deleteUploadedFile(req.file)
        req.flash('error', 'Ukuran file terlalu besar. Maksimal 5 MB')
        return res.redirect('/peserta/presensi-laporan')
        }

        if (await modelLaporan.checkPresensiKeluar(userId)) {
            deleteUploadedFile(req.file)
            req.flash('error', 'Anda sudah uploud laporan hari ini')
            return res.redirect('/peserta/presensi-laporan')
        }

        const laporan_pdf = req.file ? req.file.filename : null

        await modelLaporan.updateLaporanFile(userId, laporan_pdf)

        req.flash('success', 'Laporan harian PDF berhasil diupload')
        res.redirect('/peserta/presensi-laporan')
    } catch (error) {
        deleteUploadedFile(req.file)
        req.flash('error', error.message)
        res.redirect('/peserta/presensi-laporan')
    }
})

router.post('/laporan-harian-update', authPeserta, upload.single('laporan_pdf'), async (req, res) => {
    try {
        const userId = req.session.userId

        if (!req.file) {
        req.flash('error', 'Silakan pilih file PDF untuk diunggah')
        return res.redirect('/peserta/presensi-laporan')
        }

        const { mimetype, size } = req.file
        const maxSize = 5 * 1024 * 1024

        if (mimetype != 'application/pdf' && path.extname(req.file.originalname).toLowerCase() !== '.pdf') {
        deleteUploadedFile(req.file)
        req.flash('error', 'File harus berformat PDF')
        return res.redirect('/peserta/presensi-laporan')
        }

        if (size > maxSize) {
        deleteUploadedFile(req.file)
        req.flash('error', 'Ukuran file terlalu besar. Maksimal 5 MB')
        return res.redirect('/peserta/presensi-laporan')
        }

        const record = await modelLaporan.getAllById(userId)
        const oldFileName = record ? record[0].laporan_harian : null
        
        const laporan_pdf = req.file ? req.file.filename : null

        console.log(oldFileName)
        deleteOldPhoto(oldFileName)

        await modelLaporan.updateLaporanFile(userId, laporan_pdf)

        req.flash('success', 'Laporan harian PDF berhasil diupload')
        res.redirect('/peserta/presensi-laporan')
    } catch (error) {
        deleteUploadedFile(req.file)
        req.flash('error', error.message)
        res.redirect('/peserta/presensi-laporan')
    }
})

module.exports = router