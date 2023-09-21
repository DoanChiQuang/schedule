import Yard from "../../models/yard.js";

export const remove = async (req, res, next) => {
    try {
        const { id } = req.body;
        if(!id) {
            const error = new Error('Không có sân nào để xóa.')
            error.statusCode = 400
            next(error)
            return
        }        

        const result = await Yard.updateOne({_id: id}, {del: 1});

        return res.json({
            status: 200,
            message: "Xóa sân thành công.",
            success: true,       
            data: {}
        });		
	} 
	catch (error) {
		next(error);
	}
}