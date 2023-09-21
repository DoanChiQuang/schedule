import Yard from "../../models/yard.js";

export const create = async (req, res, next) => {
    try {
        const {id, name, branch} = req.body;
        if(!name) {
            const error = new Error('Tên không hợp lệ.');
            error.statusCode = 400;
            next(error);
            return;
        }
        if(!branch) {
            const error = new Error('Chi nhánh không hợp lệ.');
            error.statusCode = 400;
            next(error);
            return;
        }
        if (id){
            const yard = await Yard.findById(id);
            if(!yard) {
                const error = new Error('Sân không tồn tại.');
                error.statusCode = 400;
                next(error);
                return ;
            }

            const result = await Yard.updateOne({_id: id}, {
                name: name,
                branch: branch
            });

            return res.json({
                status: 200,
                message: "Cập nhật sân thành công.",
                success: true,                
                data: {}
            });
        }
        else{
            const yardCheck = await Yard.findOne({name: name});
            if(yardCheck) {
                const error = new Error('Tên đã tồn tại.');
                error.statusCode = 400;
                next(error);
                return;
            }

            const yard = await Yard.create({
                name,
                branch
            });

            return res.json({
                status: 200,
                message: "Thêm sân thành công.",
                success: true,                
                data: {}
            });
        }
    } catch (error) {
        next(error);
    }
}