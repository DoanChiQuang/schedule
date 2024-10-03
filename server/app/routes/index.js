import express from 'express'
import AuthRoute from './auth.js'
import { auth } from '../middlewares/auth.js'

const startup = (app) => {
    app.use(express.json())

    app.use('/api', AuthRoute)

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
