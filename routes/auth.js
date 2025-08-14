const express = require('express')
const router = express.Router()
const modelPembimbing = require('../model/modelPembimbing')
const modelPeserta = require('../model/modelPeserta')
const bcrypt = require('bcryptjs')

router.get('/BCmTmDDTS0d1XqK', (req, res) => {
    res.render('auth/registerPembimbing', {
        flash: {
            error: req.flash('error'),
            success: req.flash('success')
        }
    })
})

router.post('/register-pembimbing', async (req, res) => {
    try {
        const { nama, email, kata_sandi, konfirmasi_kata_sandi } = req.body

        if (!nama) {
            req.flash('error', 'Nama tidak boleh kosong')
            return res.redirect('/BCmTmDDTS0d1XqK')
        }

        if (!email) {
            req.flash('error', 'Email tidak boleh kosong')
            return res.redirect('/BCmTmDDTS0d1XqK')
        }

        if (await modelPembimbing.checkEmail(email)) {
            req.flash('error', 'Email sudah terdaftar')
            return res.redirect('/BCmTmDDTS0d1XqK')
        }

        if (!kata_sandi) {
            req.flash('error', 'Password tidak boleh kosong')
            return res.redirect('/BCmTmDDTS0d1XqK')
        }

        if (!konfirmasi_kata_sandi) {
            req.flash('error', 'Konfirmasi Password tidak boleh kosong')
            return res.redirect('/BCmTmDDTS0d1XqK')
        }

        if (kata_sandi.length < 6) {
            req.flash('error', 'Password Minimal 6 karakter')
            return res.redirect('/BCmTmDDTS0d1XqK')
        }
        if (!/[A-Z]/.test(kata_sandi)) {
            req.flash('error', 'Password Minimal 1 Huruf Kapital')
            return res.redirect('/BCmTmDDTS0d1XqK')
        }
        if (!/[a-z]/.test(kata_sandi)) {
            req.flash('error', 'Password Minimal 1 Huruf Kecil')
            return res.redirect('/BCmTmDDTS0d1XqK')
        }
        if (!/\d/.test(kata_sandi)) {
            req.flash('error', 'Password Minimal 1 Angka')
            return res.redirect('/BCmTmDDTS0d1XqK')
        }

        if (kata_sandi != konfirmasi_kata_sandi) {
            req.flash('error', 'Password dan konfirmasi password tidak cocok')
            return res.redirect('/BCmTmDDTS0d1XqK')
        }

        const data = { nama, email, kata_sandi }

        await modelPembimbing.register(data)

        req.flash('success', 'Pendaftaran berhasil')
        res.redirect('/login')
    } catch (err) {
        console.log(err)
        req.flash('error', err.message)
        res.redirect('/')
    }
})

router.get('/register', (req, res) => {
    res.render('auth/registerPeserta', {
        flash: {
            error: req.flash('error'),
            success: req.flash('success')
        }
    });
});

router.post('/register-peserta', async (req, res) => {
    try {
        const { nama, email, kata_sandi, konfirmasi_kata_sandi } = req.body

        if (!nama) {
            req.flash('error', 'Nama tidak boleh kosong')
            return res.redirect('/register')
        }

        if (!email) {
            req.flash('error', 'Email tidak boleh kosong')
            return res.redirect('/register')
        }

        if (await modelPeserta.checkEmail(email)) {
            req.flash('error', 'Email sudah terdaftar')
            return res.redirect('/register')
        }

        if (!kata_sandi) {
            req.flash('error', 'Password tidak boleh kosong')
            return res.redirect('/register')
        }

        if (!konfirmasi_kata_sandi) {
            req.flash('error', 'Konfirmasi Password tidak boleh kosong')
            return res.redirect('/register')
        }

        if (kata_sandi.length < 6) {
            req.flash('error', 'Password Minimal 6 karakter')
            return res.redirect('/register')
        }
        if (!/[A-Z]/.test(kata_sandi)) {
            req.flash('error', 'Password Minimal 1 Huruf Kapital')
            return res.redirect('/register')
        }
        if (!/[a-z]/.test(kata_sandi)) {
            req.flash('error', 'Password Minimal 1 Huruf Kecil')
            return res.redirect('/register')
        }
        if (!/\d/.test(kata_sandi)) {
            req.flash('error', 'Password Minimal 1 Angka')
            return res.redirect('/register')
        }

        if (kata_sandi != konfirmasi_kata_sandi) {
            req.flash('error', 'Password dan konfirmasi password tidak cocok')
            return res.redirect('/register')
        }

        const data = { nama, email, kata_sandi }

        await modelPeserta.register(data)

        req.flash('success', 'Pendaftaran berhasil')
        res.redirect('/login')
    } catch (err) {
        req.flash('error', err.message)
        res.redirect('/')
    }
})

router.get('/login', (req, res) => {
    res.render('auth/login', { flash: { error: req.flash('error') }, oldInput: { email: '', kata_sandi: '' } } )
})


router.post('/log', async (req, res) => {
    try {
        const { email, kata_sandi } = req.body
        if (!email || !kata_sandi) {
        req.flash('error', 'Email dan kata sandi wajib diisi')
        return res.redirect('/login')
        }

        const pembimbing = await modelPembimbing.login({ email })
        const peserta = await modelPeserta.login({ email })

        if (!pembimbing && !peserta) {
        req.flash('error', 'Email yang anda masukkan salah')
        return res.redirect('/login')
        }

        if (pembimbing) {
        const validPassword = await bcrypt.compare(kata_sandi, pembimbing.katasandi)
        if (!validPassword) {
            req.flash('error', 'Kata sandi yang anda masukkan salah')
            return res.redirect('/login')
        }
        if (pembimbing.status !== 'Aktif') {
            req.flash('error', 'Status akun belum aktif, silakan hubungi admin')
            return res.redirect('/login')
        }

        req.session.userId = pembimbing.id
        req.session.role = pembimbing.peran

        if (pembimbing.peran === 'Pembimbing') return res.redirect('/pembimbing/dashboard')
        if (pembimbing.peran === 'Admin') return res.redirect('/admin/dashboard')
        }

        if (peserta) {
        const validPassword = await bcrypt.compare(kata_sandi, peserta.katasandi)
        if (!validPassword) {
            req.flash('error', 'Kata sandi yang anda masukkan salah')
            return res.redirect('/login')
        }
        if (peserta.status !== 'Aktif') {
            req.flash('error', 'Status akun belum aktif, silakan hubungi Pembimbing')
            return res.redirect('/login')
        }

        req.session.userId = peserta.id
        req.session.role = 'Peserta'

        return res.redirect('/peserta/presensi-laporan')
        }

    } catch (err) {
        console.error(err)
        req.flash('error', err.message)
        return res.redirect('/login')
    }
})

router.get('/logout', async(req, res) => {
    req.session.destroy(err => {
        if (err)  {
            req.flash('error', 'Gagal Logout')
        }
        res.redirect('/')
    }) 
})

module.exports = router