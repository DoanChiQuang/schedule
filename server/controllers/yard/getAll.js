import Yard from "../../models/yard.js";

export const getAll = async (req, res, next) => {
    try {
        await Yard.createIndexes({_id: 1});
        const fetchAllYard = await Yard.find({del: 0}, {_id: 1, name: 1, branch: 1});
        return res.json({ 
            status: 200,
            message: "Thành công.",
            success: true,
            data: fetchAllYard
        });
    } catch (error) {
        next(error)
    }

}