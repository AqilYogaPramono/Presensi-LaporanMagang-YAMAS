const express = require('express')
const router = express.Router()
const modelPembimbing = require('../../model/modelPembimbing')
const {authAdmin} = require('../../middleware/auth')

router.get('/dashboard', authAdmin, async (req, res) => {
    try {
        const userId = req.session.userId

        const  user = await modelPembimbing.getPembimbingById(userId)

        const countPembimbngProses = await modelPembimbing.countPembimbngProses()
        const countPembimbngAKtif = await modelPembimbing.countPembimbngAKtif()

        res.render('admin/dashboard', { countPembimbngProses,countPembimbngAKtif, user })
    } catch(err) {
        console.log(err)
        req.flash('error', err.message)
        res.redirect('/')
    }
})

module.exports = router