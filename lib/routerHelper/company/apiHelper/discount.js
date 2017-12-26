const Router = require("router");
const discount = Router();
import {createDiscount, getDiscountForCompany, upsertDiscount,removeById} from '../../../controllers/discount';

discount.post('/createDiscount', async (req, res, next) => {
    let discount = req.body.discount;
    if (discount.name != "" && discount.employeeId.length > 0 && discount.value > 0 && discount.type !== "" && discount.productItems.length > 0) {
        discount = {
            ...discount,
            companyId: req.companyId
        };
        let result = await createDiscount(discount);
        // console.log(result)
        res.end(JSON.stringify(result));
    } else {
        console.log("Thông tin không đúng:", req.body.discount);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Thông tin không đúng !"}}));
    }


});

discount.post('/upsertDiscount', async (req, res, next) => {

    let discount = req.body.discount;
    console.log(discount)
    let result = await upsertDiscount(discount);

    res.end(JSON.stringify(result));

});
discount.get('/getDiscount', async (req, res, next) => {
    let result = await getDiscountForCompany(req.companyId);
    // console.log(result);
    res.end(JSON.stringify(result))
});

discount.get('/removeDiscount', async (req, res, next) => {
    try{
        let id = req.query.id;
        let result = await removeById(id);
        res.statusCode = 200;
        res.end(JSON.stringify(result))
    }catch(e)
    {
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Xoá khuyến mãi thất bại "}}));
    }

});
export default discount;