const express = require('express')
const connectDB = require('./db/connect')
const passport = require('passport')
const session = require('express-session')
const user = require('./routes/routes')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))

const MongoStore = require('connect-mongo')
app.use(passport.initialize())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI}),
    cookie: {
        maxAge: 1000 * 60 * 60 *24,
        // secure: true,
        signed: true
    }
}))

app.use(passport.session())

require('./config/passport')

app.use(cors(
    {
        origin: 'http://localhost:3000',
        credentials: true
    }
))

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "http://localhost:3000")
    res.header(
        "Access-Control-Allow-Headers", 
        "Access-Control-Allow-Credentials", 
        "Origin, X-Requested-With, Content-Type, Accept"
    )
    next()
})

app.use( user )

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(4000, console.log('server is runnning on port 4000'))
    } catch (error) {
        console.log(error)
    }
}

start()