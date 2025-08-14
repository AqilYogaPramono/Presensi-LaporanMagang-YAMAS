const express = require('express')
const modelPembimbing = require('../../model/modelPembimbing')
const router = express.Router()
const {authAdmin} = require('../../middleware/auth')

router.get('/pembimbing', authAdmin, async(req, res) => {
    try {
        const userId = req.session.userId

        const  user = await modelPembimbing.getPembimbingById(userId)

        const getAllPembimbing = await modelPembimbing.getAllPembimbing()

        res.render('admin/pembimbing', {getAllPembimbing, user})
    } catch(err) {
        req.flash('error', err.message)
        res.redirect('/admin/dashborad')
    }
})

router.post('/pembimbing/update/:id', authAdmin, async (req, res) => {
    try {
        const {id} = req.params
        const {status} = req.body
        const data = {status}
        
        await modelPembimbing.updateStatus(data, id)

        req.flash('success', 'Pembimbing Behasil Diupdate')

        res.redirect('/admin/pembimbing')
    } catch(err) {
        req.flash('error', err.message)
        res.redirect('/admin/pembimbing')
    }
})

router.post('/pembimbing/delete/:id', authAdmin, async (req, res) => {
    try {
        const {id} = req.params
        await modelPembimbing.delete(id)

        req.flash('success', 'Pembimbing berhasil dihapus')
        res.redirect('/admin/pembimbing')
    } catch(err) {
        req.flash('error', err.message)
        res.redirect('/admin/pembimbing')
    }
})


module.exports = router