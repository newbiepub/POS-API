const Router = require("router");
const discount = Router();
import {createDiscount, getDiscount,upsertDiscount} from '../../controllers/discount';
import {getUserId, currentCompany} from '../../controllers/accessToken';

discount.post('/createDiscount', async (req, res, next) => {

    //console.log(req.query.access_token)
    let accesstoken = req.query.access_token;
    let employeeId = await getUserId(accesstoken);
    let companyId = await currentCompany(accesstoken);
    let discount = req.body.discount;
    discount = {
        ...discount,
        employeeId,
        companyId: companyId._id
    };
    let result = await createDiscount(discount);
    // console.log(result)
    res.end(JSON.stringify(result));

});

discount.post('/upsertDiscount', async (req, res, next) => {

    //console.log(req.query.access_token)
    let accesstoken = req.query.access_token;
    let discount = req.body.discount;
    console.log(discount)
    let result = await upsertDiscount(discount);

    res.end(JSON.stringify(result));

});
discount.get('/getDiscount', async (req,res,next)=>{
    let accesstoken = req.query.access_token;
    let employeeId = await getUserId(accesstoken);
    let result = await getDiscount(employeeId);
    // console.log(result);
    res.end(JSON.stringify(result))
});
export default discount;