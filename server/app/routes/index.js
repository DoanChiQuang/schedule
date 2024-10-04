import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import AuthRoute from './auth.js'
import { auth } from '../middlewares/auth.js'

const startup = (app) => {
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }))
    app.use(cookieParser())
    app.use(express.json())

    app.use('/api', AuthRoute)

    // Test
    app.use('/api/users', auth, (req, res, next) => {
        res.send({
            msg: 'User List'
        })
    });

    app.use(function (err, req, res, next) {
        res.status(err.status || 500)
        res.send({
            msg: err.message || 'Something goes wrong. Please contact us',
        })
    })

    app.use((req, res) => {
        res.status(404)
        res.send({ msg: "Sory, can't find that" })
    })
}

export default startup
