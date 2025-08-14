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

    static async presensiMasuk(userId) {
        try {
            const [result] = await connection.query(`INSERT INTO laporan (waktu_absensi_masuk, id_peserta) VALUES (NOW(), ?)`,[userId])
            return result
        } catch (err) {
            throw err
        }
    }

    static async presensiKeluar(userId) {
        try {
            const [result] = await connection.query(`UPDATE laporan SET waktu_absensi_keluar = NOW() WHERE id_peserta = ? AND DATE(waktu_absensi_masuk) = CURDATE()`,[userId])
            return result
        } catch (err) {
            throw err
        }
    }

    static async getAllById(userId) {
        try {
            const [rows] = await connection.query(`SELECT laporan.id, laporan.waktu_absensi_masuk, laporan.waktu_absensi_keluar, laporan.laporan_harian, peserta.nama AS nama_peserta FROM laporan LEFT JOIN peserta ON laporan.id_peserta = peserta.id WHERE laporan.id_peserta = ?`,
                [userId]
            )
            return rows
        } catch (err) {
            throw err
        }
    }

    static async getByID(userId) {
        try {
            const [rows] = await connection.query(`SELECT * FROM laporan WHERE id_peserta = ?`,[userId])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async updateLaporanFile(idUser, laporan_pdf) {
        try {
            const [result] = await connection.query(`UPDATE laporan SET laporan_harian = ? WHERE id_peserta = ? AND DATE(waktu_absensi_masuk) = CURDATE()`,[laporan_pdf, idUser]
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

    static async checkPresensiMasuk(userId) {
        try{
            const [rows] = await connection.query(`SELECT 1 FROM laporan WHERE id_peserta = ? AND DATE(waktu_absensi_masuk) = CURDATE() LIMIT 1`, [userId])
            return rows.length > 0
        } catch(err) {
            throw err
        }
    }

    static async checkPresensiKeluar(userId) {
        try{
            const [rows] = await connection.query(`SELECT 1 FROM laporan WHERE id_peserta = ? AND DATE(waktu_absensi_keluar) = CURDATE() LIMIT 1`, [userId])
            return rows.length > 0
        } catch(err) {
            throw err
        }
    }

    static async checkUploudFile(userId) {
        try{
            const [rows] = await connection.query(`SELECT 1 FROM laporan WHERE id_peserta = ? AND DATE(waktu_absensi_masuk) = CURDATE() AND laporan_harian IS NOT NULL LIMIT 1`, [userId])
            return rows.length > 0
        } catch(err) {
            throw err
        }
    }
}

module.exports = ModelLaporan
