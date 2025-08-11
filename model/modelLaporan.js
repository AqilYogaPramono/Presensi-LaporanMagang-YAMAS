const connection = require('../config/db')

class modelLaporan {
    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT laporan.id, laporan.waktu_absensi_masuk, laporan.waktu_absensi_keluar, laporan.laporan_harian, laporan.id_peserta, peserta.nama AS nama_peserta FROM laporan JOIN peserta ON laporan.id_peserta = peserta.id ORDER BY laporan.waktu_absensi_masuk DESC`, (err, rows) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    static presensiMasuk(id_peserta) {
        return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO laporan (waktu_absensi_masuk, id_peserta) VALUES (NOW(), ?)`, [id_peserta], (err, result) => {
            if (err) reject(err)
            resolve(result)
        })
        })
    }

    static presensiKeluar(id_peserta) {
        return new Promise((resolve, reject) => {
        connection.query(`UPDATE laporan SET waktu_absensi_keluar = NOW() WHERE id_peserta = ? AND DATE(waktu_absensi_masuk) = CURDATE()`, [id_peserta], (err, result) => {
            if (err) reject(err)
            resolve(result)
        })
        })
    }

    static kirimLaporan(laporan_harian, id_peserta) {
        return new Promise((resolve, reject) => {
        connection.query(`UPDATE laporan SET laporan_harian = ? WHERE id_peserta = ? AND DATE(waktu_absensi_masuk) = CURDATE()`, [laporan_harian, id_peserta], (err, result) => {
            if (err) reject(err)
            resolve(result)
        })
        })
    }

    static async getAllById(idUser) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT laporan.id, laporan.waktu_absensi_masuk, laporan.waktu_absensi_keluar, laporan.laporan_harian, peserta.nama AS nama_peserta FROM laporan LEFT JOIN peserta ON laporan.id_peserta = peserta.id WHERE laporan.id_peserta = ?`,[idUser], (err, rows) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    static async getByID(idUser) {
        return new Promise((resolve, reject) => {
            connection.query(`select * from laporan where id_peserta = ?`,[idUser], (err, rows) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(rows[0])
                }
            })
        })
    }

    static async updateLaporanFile(idUser, laporan_pdf) {
        return new Promise((resolve, reject) => {
        connection.query(`UPDATE laporan SET laporan_harian = ? WHERE id_peserta = ?    `, [laporan_pdf, idUser], (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
        })
    }

    static async getLaporanHariIni(userId) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT p.nama, l.waktu_absensi_masuk, l.waktu_absensi_keluar, l.laporan_harian FROM peserta p LEFT JOIN laporan l ON p.id = l.id_peserta AND DATE(l.waktu_absensi_masuk) = CURDATE() WHERE p.id = ? `,[userId], (err, rows) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }
}

module.exports = modelLaporan