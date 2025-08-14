const express = require('express')
const router = express.Router()
const modelPembimbing = require('../../model/modelPembimbing')
const {authAdmin} = require('../../middleware/auth')

router.get('/dashboard', authAdmin, async (req, res) => {
    try {
        const userId = req.session.userId

        const  user = await modelPembimbing.getPembimbingById(userId)

        const countPembimbingProses = await modelPembimbing.countPembimbingProses()
        const countPembimbingAKtif = await modelPembimbing.countPembimbingAktif()

        res.render('admin/dashboard', { countPembimbingProses,countPembimbingAKtif, user })
    } catch(err) {
        req.flash('error', err.message)
        res.redirect('/')
    }
})

module.exports = router