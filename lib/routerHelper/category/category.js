const Router = require("router");
const category = Router();
import CategoryController from '../../controllers/category';
import {getUserId} from '../../controllers/accessToken';
category.get('/getCategory', async (req, res, next) => {

    //console.log(req.query.access_token)
    let accesstoken = req.query.access_token;
    let id = await getUserId(accesstoken);
    let category = await CategoryController.getCategory(id);

    res.end(JSON.stringify(category));
});
export default category;