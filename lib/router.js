import Router from 'router';
import bodyParser from "body-parser";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import {resolve} from "path";
import qs from 'querystring';
import url from "url";
import {loginCompany} from "./controllers/company";
import {createAuthToken, currentCompany} from "./controllers/accessToken";
import passport from "passport";
import {findOneEmployee} from "./controllers/employee";
import * as passwordHash from "password-hash";
import {authCheck} from "./routerHelper/routes";

const LocalStrategy = require('passport-local').Strategy;

const app = Router();

//Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// query string
app.use(
    (req, res, next) => {
        req.query = qs.parse(
            url.parse(req.url).query
        );
        next()
    }
);

// enable cookie
app.use(cookieParser());

// helmet best practise protection
app.use(helmet());

passport.use(new LocalStrategy(
    function (username, password, done) {
        findOneEmployee({username: username}).then((user) => {
            let passwordVerified = passwordHash.verify(password, user.password);
            if (passwordVerified) {
                createAuthToken(user._id.toString()).then(token => {
                    done(null, token);
                }).catch(e => {
                    done(e);
                });
            } else {
                done(new Error("Unauthorized"))
            }
        }).catch(e => {
            done(e);
        })
    }
));

// Define API route with authentication
app.use("/api", (req, res, next) => {
    if(req.query.access_token == undefined) {
        res.statusCode = 401;
        next(new Error("Unauthorized", 401))
    } else {
        next()
    }
});

app.get("/", async (req, res, next) => {
	res.setHeader("Content-Type", "text/plain");
	res.setHeader("Accept", "text/plain");
	res.end("Welcome to POS-API");
});

app.post("/login/app", async (req, res, next) => {
    try {
        passport.authenticate('local', (err, user) => {
            if(err) {
                res.statusCode = 401;
                res.end(JSON.stringify({
                    error: {message: "Unauthorized"}
                }))
            } else {
                res.statusCode = 200;
                let options = {
                    maxAge: 1000 * 60 * 60 * 24 * 14, // would expire after 14 days
                };
                res.end(JSON.stringify({
                    access_token: user.access_token,
                    refresh_token: user.refresh_token,
                    ttl: options.maxAge
                }));
            }
        })(req, res, next)
    } catch(e) {
        next(e);
    }
});

/**
 * Login Auth
 */
app.post("/login/auth", authCheck);

app.get("/api/Company/current", async (req, res, next) => {
    try {
        res.setHeader("Content-Type", "application/json");
        let access_token = req.query.access_token,
            company = await currentCompany(access_token);
        res.end(JSON.stringify(company));
    } catch(e) {
        next(e);
    }
});

app.use("*", (req, res, next) => {
    next("Not Found");
});


export default app