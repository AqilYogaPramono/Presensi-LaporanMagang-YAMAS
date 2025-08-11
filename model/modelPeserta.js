const connection = require('../config/db')
const bcrypt = require('bcryptjs')

class modelPeserta {
    static async register(data) {
        const kata_sandi_hash = await bcrypt.hash(data.kata_sandi, 10);
        const waktu_buat = new Date()
        const dataRegister = {nama: data.nama, email: data.email, katasandi: kata_sandi_hash, waktu_buat: waktu_buat};

        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO peserta SET ?', dataRegister, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }



    static async checkEmail(email) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT email FROM peserta WHERE email = ?', [email], (err, rows) => {
                if (err) reject(err)
                else resolve(rows.length > 0)
            })
        })
    }

    static async login(data) {
        return new Promise((resolve, reject) => {
            connection.query(`select * from peserta where email = ?`, data.email, (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows[0])
                }
            })
        })
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            connection.query(`delete from peserta where id = ?`, id, (err, result) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }

    static async getAllPeserta(){
        return new Promise((resolve, reject) => {
            connection.query(`select id, nama, email, status from peserta`, (err, rows) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    static async getPesertaById(userId) {
        return new Promise((resolve, reject) => {
            connection.query(`select * from peserta where id = ?`, (err, rows) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(rows[0])
                }
            })
        })
    }

    static async countPesertaProses(){
        return new Promise((resolve, reject) => {
            connection.query(`select count(id) as peserta_proses from peserta where status = 'Proses'`, (err, rows) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    static async countPesertaAKtif(){
        return new Promise((resolve, reject) => {
            connection.query(`select count(id) as peserta_aktif from peserta where status = 'Aktif'`, (err, rows) => {
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
            connection.query(`update peserta set ? where id = ?`, [data, id], (err, result) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }

    static async getPesertaById(idUser) {
        return new Promise((resolve, reject) => {
            connection.query(`select * from peserta where id = ?`, [idUser], (err, rows) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(rows[0])
                }
            })
        })
    }
}

module.exports = modelPeserta