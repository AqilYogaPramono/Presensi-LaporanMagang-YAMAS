const connection = require('../config/db')
const bcrypt = require('bcryptjs')

class ModelPembimbing {
    static async login(data) {
        try {
            const [rows] = await connection.query('SELECT * FROM pembimbing WHERE email = ?', [data.email])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async getPengurusById(data) {
        try {
            const [rows] = await connection.query('SELECT * FROM pengurus WHERE id = ?', [data.pembimbingId])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async register(data) {
        try {
            const kata_sandi_hash = await bcrypt.hash(data.kata_sandi, 10)
            const dataRegister = { nama: data.nama, email: data.email, katasandi: kata_sandi_hash}
            const [result] = await connection.query('INSERT INTO pembimbing SET ?', dataRegister)
            return result
        } catch (err) {
            throw err
        }
    }

    static async delete(id) {
        try {
            const [result] = await connection.query('DELETE FROM pembimbing WHERE id = ?', [id])
            return result
        } catch (err) {
            throw err
        }
    }

    static async checkEmail(email) {
        try {
            const [rows] = await connection.query('SELECT email FROM pembimbing WHERE email = ?', [email])
            return rows.length > 0
        } catch (err) {
            throw err
        }
    }

    static async getAllPembimbing() {
        try {
            const [rows] = await connection.query(`SELECT id, nama, email, status FROM pembimbing WHERE peran = 'Pembimbing'`)
            return rows
        } catch (err) {
            throw err
        }
    }

    static async countPembimbingProses() {
        try {
            const [rows] = await connection.query(`SELECT COUNT(id) as pembimbing_proses FROM pembimbing WHERE peran = 'Pembimbing' AND status = 'Proses'`)
            return rows
        } catch (err) {
            throw err
        }
    }

    static async countPembimbingAktif() {
        try {
            const [rows] = await connection.query(`SELECT COUNT(id) as pembimbing_aktif FROM pembimbing WHERE peran = 'Pembimbing' AND status = 'Aktif'`)
            return rows
        } catch (err) {
            throw err
        }
    }

    static async updateStatus(data, id) {
        try {
            const [result] = await connection.query('UPDATE pembimbing SET ? WHERE id = ?', [data, id])
            return result
        } catch (err) {
            throw err
        }
    }

    static async getPembimbingById(userId) {
        try {
            const [rows] = await connection.query('SELECT * FROM pembimbing WHERE id = ?', [userId])
            return rows[0]
        } catch (err) {
            throw err
        }
    }
}

module.exports = ModelPembimbing
