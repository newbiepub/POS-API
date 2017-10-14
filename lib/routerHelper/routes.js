import {checkAuthToken} from "../controllers/accessToken";

export const authCheck = async (req, res, next) => {
    try {
        let { access_token, refresh_token } = req.body
        if( access_token && refresh_token ) {
            let token = await checkAuthToken(access_token, refresh_token);
            res.statusCode = 200;
            res.end(JSON.stringify(token));
        } else {
            res.statusCode = 401;
            res.end(JSON.stringify({
                error: {message: "Access Token is required"}
            }))
        }
    } catch (e) {
        res.statusCode = 401;
        res.end(JSON.stringify({
            error: {message: "Auth Failed"}
        }))
    }
};