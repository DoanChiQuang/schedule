import bcrypt from 'bcrypt'
import User from '../../models/User.js'

export const signup = async (req, res, next) => {
    try {
        const SALT_ROUND = parseInt(process.env.SALT_ROUND) || 10
        const hashedString = await bcrypt.hash('123456', SALT_ROUND)

        let user = await User.create({
            email: 'email@gmail.com',
            password: hashedString,
        })
        
        delete user.password;
        
        req.resObject = user;
        res.resMessage = 'Your account has been created';
        
        return next();
    } catch (error) {
        next(error)
    }
}
