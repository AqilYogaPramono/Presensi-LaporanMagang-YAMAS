const connection = require('../config/db')
const bcrypt = require('bcryptjs')

class modelPembimbing {
    static async login(data) {
        return new Promise((resolve, reject) => {
            connection.query(`select * from pembimbing where email = ?`, data.email, (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows[0])
                }
            })
        })
    }

    static async getPengurusById(data) {
        return new Promise((resolve, reject) => {
            connection.query(`select * from pengurus where id = ?`, [data.pebimbingId], (err, rows) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(rows[0])
                }
            })
        })
    }

    static async register(data) {
        const kata_sandi_hash = await bcrypt.hash(data.kata_sandi, 10)
        const dataRegister = {nama: data.nama, email: data.email, katasandi: kata_sandi_hash}
        return new Promise((resolve, reject) => {
            connection.query('insert into pembimbing set ?', dataRegister, (err, result) => {
                if(err) {
                    reject(err)
                } else{
                    resolve(result)
                }
            })
        })
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            connection.query(`delete from pembimbing where id = ?`, id, (err, result) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }

    static async checkEmail(email) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT email FROM pembimbing WHERE email = ?', [email], (err, rows) => {
            if (err) reject(err)
            else resolve(rows.length > 0)
        })
    })
}

    static async getAllPembimbing(){
        return new Promise((resolve, reject) => {
            connection.query(`select id, nama, email, status from pembimbing where peran = 'Pembimbing'`, (err, rows) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    static async countPembimbngProses(){
        return new Promise((resolve, reject) => {
            connection.query(`SELECT COUNT(id) as pembimbing_proses FROM pembimbing WHERE peran = 'Pembimbing' AND status = 'Proses'`, (err, rows) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    static async countPembimbngAKtif(){
        return new Promise((resolve, reject) => {
            connection.query(`SELECT COUNT(id) as pembimbing_aktif FROM pembimbing WHERE peran = 'Pembimbing' AND status = 'Aktif'`, (err, rows) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    static async updateStatus(data, id) {
        return new Promise((resolve, reject) => {
            connection.query(`update pembimbing set ? where id = ?`, [data, id], (err, result) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }

    static async getpembimbingById(idUser) {
        return new Promise((resolve, reject) => {
            connection.query(`select * from pembimbing where id = ?`, [idUser], (err, rows) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(rows[0])
                }
            })
        })
    }

    static async getPembimbingById(userId) {
        return new Promise((resolve, reject) => {
            connection.query(`select * from pembimbing where id = ?`, [userId], (err, rows) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(rows[0])
                }
            })
        })
    }
}

module.exports = modelPembimbing