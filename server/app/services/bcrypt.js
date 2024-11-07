import bcrypt from 'bcrypt';

const SALT_ROUND = parseInt(process.env.SALT_ROUND) || 10;

export const hash = async (plainText) => {
    return await bcrypt.hash(plainText, SALT_ROUND);
};

export const compare = async (plainText, hashedText) => {
    return bcrypt.compare(plainText, hashedText);
};
