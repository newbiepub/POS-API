import {Category} from "../../models/category";

const Router = require("router");
const category = Router();
import CategoryController from '../../controllers/category';
import {getUserId} from '../../controllers/accessToken';
import {Product} from "../../models/product";
import * as _ from "lodash";

category.get('/getCategory', async (req, res, next) => {
    try {
        let accesstoken = req.query.access_token;
        let id = await getUserId(accesstoken);
        let category = await CategoryController.getCategory(id);
        res.end(JSON.stringify(category));
    } catch (e) {
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Có lỗi đã xảy ra"}}));
    }
});

category.post("/create", async (req, res, next) => {
    try {
        let {name, categoryProducts} = req.body;
        if (name) {
            let category = await new Category({
                name,
                employeeId: req.userId
            }).save();
            for (let product of categoryProducts) {
                await Product.update({_id: product}, {$set: {categoryId: category._id}}).exec();
            }
            res.statusCode = 200;
            res.end(JSON.stringify({success: true}));
        }
        res.statusCode = 405;
        res.end(JSON.stringify({error: {message: "Bạn phải nhập tên loại"}}));
    } catch (e) {
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Không thể tạo mục"}}));
    }
});

category.post("/update", async (req, res, next) => {
    try {
        let {categoryId, name, categoryProducts} = req.body;
        if(name && categoryId) {
            await Category.findOneAndUpdate({_id: categoryId}, {$set: {name}}).exec();

            // Unset category product
            let getProducts = await Product.find({categoryId}, {_id: true}).exec();
            for(let item of getProducts) {
                if(!_.includes(categoryProducts, item._id)) {
                    await Product.findOneAndUpdate({_id: item._id}, {$unset: {categoryId: ""}}).exec();
                }
            }
            // Update Category Product
            for (let product of categoryProducts) {
                await Product.findOneAndUpdate({_id: product}, {$set: {categoryId}}).exec();
            }
            res.statusCode = 200;
            res.end(JSON.stringify({success: true}));
        }
        res.statusCode = 405;
        res.end(JSON.stringify({error: {message: "Bạn phải nhập tên loại"}}));
    } catch (e) {
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Có lỗi đã xảy ra"}}));
    }
});

category.post("/remove", async (req, res ,next) => {
    try {
        let { categoryId } = req.body;

        if(categoryId) {
            await Product.update({categoryId}, {$set: {categoryId: ""}}, {multi: true}).exec();
            await Category.remove({_id: categoryId}).exec();
        }
        res.statusCode = 200;
        res.end(JSON.stringify({success: true}));
    } catch(e) {
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Đã có lỗi xảy ra"}}));
    }
});

export default category;