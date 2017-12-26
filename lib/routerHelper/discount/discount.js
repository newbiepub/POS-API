const Router = require("router");
const discount = Router();
import {getDiscountForEmployee} from '../../controllers/discount';
import {getUserId, currentCompany} from '../../controllers/accessToken';

discount.get('/getDiscount', async (req, res, next) => {
    let accesstoken = req.query.access_token;
    let companyId = await currentCompany(accesstoken);
    let employeeId = await getUserId(accesstoken)
    let result = await getDiscountForEmployee(companyId._id, employeeId);
    console.log(result);
    res.end(JSON.stringify(result))
});
export default discount;