import {Category} from "../../models/category";

const Router = require("router");
const category = Router();
import CategoryController from '../../controllers/category';
import {getUserId} from '../../controllers/accessToken';
import {Product} from "../../models/product";
category.get('/getCategory', async (req, res, next) => {
    try {
        let accesstoken = req.query.access_token;
        let id = await getUserId(accesstoken);
        let category = await CategoryController.getCategory(id);
        res.end(JSON.stringify(category));
    } catch(e) {
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Có lỗi đã xảy ra"}}));
    }
});

category.post("/create", async (req, res, next) => {
    try {
        let {name, categoryProducts} = req.body;
        if(name) {
            let category = await new Category({
                name,
                employeeId: req.userId
            }).save();
            for(let product of categoryProducts) {
                await Product.update({_id: product}, {$set: {categoryId: category._id}}).exec();
            }
            res.statusCode = 200;
            res.end(JSON.stringify({success: true}));
        }
        res.statusCode = 405;
        res.end(JSON.stringify({error: {message: "Bạn phải nhập tên loại"}}));
    } catch(e) {
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Không thể tạo mục"}}));
    }
});

export default category;