import { verify } from "../lib/jwt.js";

export const auth = async (req, res, next) => {
    const tokenHeader = req.headers.authorization;
    if(!tokenHeader) {
        res.status(401).send({ msg: 'Request missing Authorization Data' })
        return
    }

    const token = tokenHeader.split(' ')[1]
    const verified = verify(token)
    if(!verified) {
        res.status(401).send({ msg: 'Unauthorized' })
        return
    }
    next()
}