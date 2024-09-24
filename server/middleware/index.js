import {accessTokenSecretTemp} from '../contants/jwt.js';
import { verifyToken } from '../services/jwt.js'


 const isAuth = async (req, res, next) => {
	const accessTokenFromHeader = req.headers.authorization;
	if (!accessTokenFromHeader) {
		return res
			.status(401)
			.json({
				success: false,
				message: 'Access Token không hợp lệ.'
			});
	}
    const token = accessTokenFromHeader.split(' ')[1];
	const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || accessTokenSecretTemp;

	const verified = await verifyToken(
		token,
		accessTokenSecret
	);

	if (!verified) {
		return res
			.status(401)
			.json({
				success: false,
				message: 'Bạn không có quyền truy cập vào tính năng này.'
			});
	}
	return next();
};
export { isAuth }
