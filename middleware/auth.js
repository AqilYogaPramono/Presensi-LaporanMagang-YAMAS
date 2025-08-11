const modelPembimbing = require('../model/modelPembimbing')
const modelPeserta = require('../model/modelPeserta')

const authPeserta = async (req, res, next) => {
    try {
        if (req.session.role != 'Peserta') {
            req.flash('error', 'Silakan login sebagai peserta untuk mengakses halaman ini')
            return res.redirect('/login')
        }

        const peserta = await modelPeserta.getPesertaById(req.session.userId)
        if (!peserta || peserta.status != 'Aktif') {
            req.flash('error', 'Akun peserta tidak aktif')
            return res.redirect('/login')
        }

        next()
    } catch (err) {
        req.flash('error', 'Terjadi kesalahan saat validasi peserta')
        res.redirect('/login')
    }
}

const authPembimbing = async (req, res, next) => {
    try {
        if (req.session.role != 'Pembimbing') {
            req.flash('error', 'Anda tidak memiliki akses')
            return res.redirect('/login')
        }

        const pengurus = await modelPembimbing.getpembimbingById(req.session.userId)
        if (!pengurus || pengurus.status != 'Aktif') {
            req.flash('error', 'Akun Pembimbing tidak aktif')
            return res.redirect('/login')
        }
        

        next()
    } catch (err) {
        req.flash('error', 'Terjadi kesalahan saat validasi akses')
        res.redirect('/login')
    }
}

const authAdmin = async (req, res, next) => {
    try {
        if (req.session.role != 'Admin') {
            req.flash('error', 'Anda tidak memiliki akses')
            return res.redirect('/login')
        }

        const admin = await modelPembimbing.getpembimbingById(req.session.userId)
        if (!admin || admin.status != 'Aktif') {
            req.flash('error', 'Akun Admin tidak aktif')
            return res.redirect('/login')
        }

        next()
    } catch (err) {
        console.log(err)
        req.flash('error', 'Terjadi kesalahan saat validasi akses')
        res.redirect('/login')
    }
}

module.exports = { authPeserta, authPembimbing, authAdmin }
