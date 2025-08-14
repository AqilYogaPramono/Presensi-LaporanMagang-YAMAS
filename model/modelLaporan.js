const connection = require('../config/db')

class ModelLaporan {
    static async getAll() {
        try {
            const [rows] = await connection.query(`SELECT laporan.id, laporan.waktu_absensi_masuk, laporan.waktu_absensi_keluar, laporan.laporan_harian, laporan.id_peserta, peserta.nama AS nama_peserta FROM laporan JOIN peserta ON laporan.id_peserta = peserta.id ORDER BY laporan.waktu_absensi_masuk DESC`)
            return rows
        } catch (err) {
            throw err
        }
    }

    static async presensiMasuk(id_peserta) {
        try {
            const [result] = await connection.query(`INSERT INTO laporan (waktu_absensi_masuk, id_peserta) VALUES (NOW(), ?)`,[id_peserta])
            return result
        } catch (err) {
            throw err
        }
    }

    static async presensiKeluar(id_peserta) {
        try {
            const [result] = await connection.query(`UPDATE laporan SET waktu_absensi_keluar = NOW() WHERE id_peserta = ? AND DATE(waktu_absensi_masuk) = CURDATE()`,[id_peserta])
            return result
        } catch (err) {
            throw err
        }
    }

    static async kirimLaporan(laporan_harian, id_peserta) {
        try {
            const [result] = await connection.query(`UPDATE laporan SET laporan_harian = ? WHERE id_peserta = ? AND DATE(waktu_absensi_masuk) = CURDATE()`, [laporan_harian, id_peserta]
            )
            return result
        } catch (err) {
            throw err
        }
    }

    static async getAllById(idUser) {
        try {
            const [rows] = await connection.query(`SELECT laporan.id, laporan.waktu_absensi_masuk, laporan.waktu_absensi_keluar, laporan.laporan_harian, peserta.nama AS nama_peserta FROM laporan LEFT JOIN peserta ON laporan.id_peserta = peserta.id WHERE laporan.id_peserta = ?`,
                [idUser]
            )
            return rows
        } catch (err) {
            throw err
        }
    }

    static async getByID(idUser) {
        try {
            const [rows] = await connection.query(`SELECT * FROM laporan WHERE id_peserta = ?`,[idUser])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async updateLaporanFile(idUser, laporan_pdf) {
        try {
            const [result] = await connection.query(`UPDATE laporan SET laporan_harian = ? WHERE id_peserta = ?`,[laporan_pdf, idUser]
            )
            return result
        } catch (err) {
            throw err
        }
    }

    static async getLaporanHariIni(userId) {
        try {
            const [rows] = await connection.query(`SELECT p.nama, l.waktu_absensi_masuk, l.waktu_absensi_keluar, l.laporan_harian FROM peserta p LEFT JOIN laporan l ON p.id = l.id_peserta AND DATE(l.waktu_absensi_masuk) = CURDATE() WHERE p.id = ?`, [userId])
            return rows
        } catch (err) {
            throw err
        }
    }
}

module.exports = ModelLaporan
