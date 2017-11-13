import {getCurrentEmployee} from "../../controllers/employee";

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

export default user;