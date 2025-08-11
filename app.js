var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
require('dotenv').config()
var session = require('express-session')
var flash = require('express-flash')

//
const indexRouter = require('./routes/index')

//auth
const authRouter = require('./routes/auth')

//admin
const dashboardAdminRouter = require('./routes/admin/dashboard')
const pembimbingRouter = require('./routes/admin/pembimbing')

//pembimbing
const dashboardPembimbingRouter = require('./routes/pembimbing/dashboard')
const pesertaRouter = require('./routes/pembimbing/peserta')

//peserta
const logBookRouter = require('./routes/peserta/logbook')
const detailLogBook = require('./routes/peserta/detailLogBook')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/file', express.static(path.join(__dirname, 'public/file')));

//middleware untuk menyimpan data login
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        secure: false, //ubah ke true jika sudah di hosting 
        maxAge: 600000000
    }
}))

//middleware untuk mengirim pesan
app.use(flash())

//index
app.use('/', indexRouter)

//auth
app.use('/', authRouter)

//admin
app.use('/admin', dashboardAdminRouter)
app.use('/admin', pembimbingRouter)

//pembimbing
app.use('/pembimbing', dashboardPembimbingRouter)
app.use('/pembimbing', pesertaRouter)

//peserta
app.use('/peserta', logBookRouter)
app.use('/peserta', detailLogBook)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
