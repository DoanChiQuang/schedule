import jwt from 'jsonwebtoken';

const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;
const TOKEN_LIFE = process.env.TOEKN_LIFE;

export const sign = (payload) => {
    try {
        return jwt.sign(payload, TOKEN_SECRET_KEY, {
            expiresIn: TOKEN_LIFE,
        });
    } catch (error) {
        console.error(`[Error]: ${error}`);
        return null;
    }
};

export const verify = (token) => {
    try {
        return jwt.verify(token, TOKEN_SECRET_KEY);
    } catch (error) {
        console.error(`[Error]: ${error}`);
        return null;
    }
};
