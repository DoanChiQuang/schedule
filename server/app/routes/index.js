import express from 'express'
import AuthRoute from './auth.js'

const startup = (app) => {
    app.use(express.json())

    app.use('/api', AuthRoute)

    app.use((err, req, res, next) => {
        const message = {}
        // Success Handler
        if(!err) {
            message.success = true;
            message.status = req.resStatus || 200;
            message.message = req.resMessage || "Successfully";
            message.data = req.resObject;        
        }

        // Error Handler
        message.success = false;
        message.status = err.statusCode || 500;
        message.message = err.message || 'Internal Server Error';
        message.data = {};        

        res.status(message.status).send(message);
        return next();
    })
}

export default startup
