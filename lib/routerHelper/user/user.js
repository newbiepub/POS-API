import {getCurrentEmployee} from "../../controllers/employee";
import {removeToken} from "../../controllers/accessToken";

const Router = require("router");
const user = Router();

user.get("/me", async (req, res, next) => {
    try {
        let currentUser = await getCurrentEmployee(req.userId);
        res.end(JSON.stringify(currentUser, null, 4));
    } catch(e) {
        res.statusCode = 404;
        res.end(JSON.stringify({error: {message: "Not Found"}}));
    }
});

user.post('/logout', async (req, res, next) => {
    try {
        await removeToken(req.body.access_token);
        res.statusCode = 200;
        res.end();
    }  catch(e) {
        res.statusCode = 500;
        res.end(JSON.stringify({error: {message: "Cannot Logout User"}}));
    }
});

export default user;