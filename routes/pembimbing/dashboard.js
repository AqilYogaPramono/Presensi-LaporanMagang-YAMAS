const express = require('express')
const router = express.Router()
const modelPembimbing = require('../../model/modelPembimbing')
const modelPeserta = require('../../model/modelPeserta')
const {authPembimbing} = require('../../middleware/auth')

router.get('/dashboard', authPembimbing, async (req, res) => {
    try {
        const userId = req.session.userId
        role = req.session.role
        console.log(role)

        const  user = await modelPembimbing.getPembimbingById(userId)

        const countPesertaProses = await modelPeserta.countPesertaProses()
        const countPesertaAKtif = await modelPeserta.countPesertaAKtif()

        res.render('pembimbing/dashboard', { countPesertaProses, countPesertaAKtif, user })
    } catch(err) {
        req.flash('error', err.message)
        res.redirect('/')
    }
})

module.exports = router