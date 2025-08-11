const mysql = require('mysql')

database = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

database.connect((err) => {
    if(err) return console.log(err)
    return console.log("Berhasil Terhubung")
})

module.exports = database