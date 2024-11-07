import jwt from 'jsonwebtoken';

export const sign = (payload, secretKey, expireTime) => {
    try {
        return jwt.sign(payload, secretKey, {
            expiresIn: expireTime,
        });
    } catch (error) {
        console.error(`[Error]: ${error}`);
        return null;
    }
};

export const verify = (token, secretKey) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        console.error(`[Error]: ${error}`);
        return null;
    }
};
