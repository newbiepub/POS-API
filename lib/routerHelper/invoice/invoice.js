import Router from 'router';
import {Invoice} from "../../models/invoice";
import nodemailerMG from "../../utils/mailer";

const invoice = Router();

invoice.get("/byDate", async (req, res, next) => {
    try {
        let response = await Invoice.aggregate([
            {
                $group: {
                    _id: {
                        date: {$dayOfMonth: {"$add": ["$createdAt", 7 * 60 * 60 * 1000]}},
                        month: {$month: {"$add": ["$createdAt", 7 * 60 * 60 * 1000]}},
                        year: {$year: {"$add": ["$createdAt", 7 * 60 * 60 * 1000]}}
                    },
                    invoice: {$push: {invoiceContent: "$content", createdAt: "$createdAt", invoiceId: "$invoiceId"}}
                }
            }
        ]).exec();
        res.statusCode = 200;
        res.end(JSON.stringify(response, null, 4));

    } catch (e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Đã có lỗi xảy ra"}}));
    }
});

invoice.post("/remove", async (req, res, next) => {
   try {
        let { invoiceId } = req.body;
        await Invoice.remove({invoiceId}).exec();
        res.statusCode = 200;
        res.end(JSON.stringify({success: true}));
   } catch (e) {
       console.log(e);
       res.statusCode = 500;
       res.end(JSON.stringify({error: {message: "Đã có lỗi xảy ra"}}));
   }
});

invoice.post("/sendEmail", async (req, res, next) => {
    try {
        let { customerEmail, invoice } = req.body;
        if(customerEmail && (new RegExp(/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm)).test(customerEmail)) {
            return nodemailerMG.sendMail({
                from: 'pos@no-reply.com',
                to: customerEmail,
                subject: 'Hoá Đơn Khách Hàng',
                html: invoice.invoiceContent
            }, (error, info) => {
                if (error) console.log(error);
                else console.log(info);
                res.statusCode = 200;
                res.end(JSON.stringify({success: true}));
            })
        }
        res.statusCode = 405;
        res.end(JSON.stringify({error: {message: "Xin mời nhập email của khách hàng"}}))
    } catch (e) {
        console.log(e);
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Đã có lỗi xảy ra"}}));
    }
})

export default invoice;