const express = require('express')
const router = express.Router()
const modelPembimbing = require('../../model/modelPembimbing')
const modelPeserta = require('../../model/modelPeserta')
const {authPembimbing} = require('../../middleware/auth')

router.get('/dashboard', authPembimbing, async (req, res) => {
    try {
        const userId = req.session.userId

        const  user = await modelPembimbing.getPembimbingById(userId)

        const countPesertaProses = await modelPeserta.countPesertaProses()
        const countPesertaAKtif = await modelPeserta.countPesertaAktif()

        res.render('pembimbing/dashboard', { countPesertaProses, countPesertaAKtif, user })
    } catch(err) {
        console.log(err)
        req.flash('error', err.message)
        res.redirect('/')
    }
})

module.exports = router