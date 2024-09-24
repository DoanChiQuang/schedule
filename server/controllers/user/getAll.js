import User from '../../models/user.js';

export const getAll = async (req, res, next) => {
    try {
        await User.createIndexes({_id: 1});
        const fetchUser = await User.find({}, {_id: 1, username: 1, password: 1, name: 1, role: 1, del: 1});
        return res.json({ 
            status: 200,
            message: "Thành công.",
            success: true,
            data: fetchUser
        });
    } catch (error) {
        next(error)
    }
}