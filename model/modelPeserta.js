const connection = require('../config/db')
const bcrypt = require('bcryptjs')

class ModelPeserta {
    static async register(data) {
        try {
            const kata_sandi_hash = await bcrypt.hash(data.kata_sandi, 10)
            const waktu_buat = new Date()
            const dataRegister = {nama: data.nama,email: data.email, katasandi: kata_sandi_hash, waktu_buat: waktu_buat}
            const [result] = await connection.query('INSERT INTO peserta SET ?', dataRegister)
            return result
        } catch (err) {
            throw err
        }
    }

    static async checkEmail(email) {
        try {
            const [rows] = await connection.query('SELECT email FROM peserta WHERE email = ?', [email])
            return rows.length > 0
        } catch (err) {
            throw err
        }
    }

    static async login(data) {
        try {
            const [rows] = await connection.query('SELECT * FROM peserta WHERE email = ?', [data.email])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async delete(id) {
        try {
            const [result] = await connection.query('DELETE FROM peserta WHERE id = ?', [id])
            return result
        } catch (err) {
            throw err
        }
    }

    static async getAllPeserta() {
        try {
            const [rows] = await connection.query('SELECT id, nama, email, status FROM peserta')
            return rows
        } catch (err) {
            throw err
        }
    }

    static async getPesertaById(userId) {
        try {
            const [rows] = await connection.query('SELECT * FROM peserta WHERE id = ?', [userId])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async countPesertaProses() {
        try {
            const [rows] = await connection.query(`SELECT COUNT(id) as peserta_proses FROM peserta WHERE status = 'Proses'`)
            return rows
        } catch (err) {
            throw err
        }
    }

    static async countPesertaAktif() {
        try {
            const [rows] = await connection.query(`SELECT COUNT(id) as peserta_aktif FROM peserta WHERE status = 'Aktif'`)
            return rows
        } catch (err) {
            throw err
        }
    }

    static async updateStatus(data, id) {
        try {
            const [result] = await connection.query('UPDATE peserta SET ? WHERE id = ?', [data, id])
            return result
        } catch (err) {
            throw err
        }
    }
}

module.exports = ModelPeserta
