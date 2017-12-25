const Router = require("router");
const category = Router();
import CategoryController from '../../controllers/category';
import {currentCompany} from '../../controllers/accessToken';

category.get('/getCategory', async (req, res, next) => {
    try {
        let accesstoken = req.query.access_token;
        let {_id} = await currentCompany(accesstoken);
        let category = await CategoryController.getCategory(_id);
        res.end(JSON.stringify(category));
    } catch (e) {
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Có lỗi đã xảy ra"}}));
    }
});


export default category;