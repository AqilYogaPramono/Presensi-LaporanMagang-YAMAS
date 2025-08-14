// middleware/scheduleCheck.js
function scheduleCheck(type) {
    return (req, res, next) => {
        const now = new Date()
        const day = now.getDay()
        const hour = now.getHours()

        const schedules = {
            presensiMasuk: {
                1: [9, 10], 2: [9, 10], 3: [9, 10], 4: [9, 10], 5: [9, 10],
                6: [9, 10],
            },
            presensiKeluar: {
                1: [16, 17], 2: [16, 17], 3: [16, 17], 4: [16, 17], 5: [16, 17],
                6: [13, 14],
            },
            uploadLaporan: {
                1: [16, 24], 2: [16, 24], 3: [16, 24], 4: [16, 24], 5: [16, 24],
                6: [14, 24],
            }
        }

        if (day == 0) {
            req.flash('error', 'Hari ini libur, tidak bisa melakukan aksi ini')
            return res.redirect('/peserta/presensi-laporan')
        }

        const schedule = schedules[type][day]
        if (!schedule) {
            req.flash('error', 'Tidak ada jadwal untuk aksi ini hari ini')
            return res.redirect('/peserta/presensi-laporan')
        }

        const [start, end] = schedule
        if (hour < start || hour > end) {
            req.flash('error', `Aksi ini hanya bisa dilakukan antara jam ${start}:00 - ${end}:00`)
            return res.redirect('/peserta/presensi-laporan')
        }

        next()
    }
}

module.exports = scheduleCheck
