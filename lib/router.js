import Router from 'router';
import bodyParser from "body-parser";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import {resolve} from "path";
import qs from 'querystring';
import url from "url";
import {loginCompany} from "./controllers/company";
import {currentCompany} from "./controllers/accessToken";

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

// Define API route with authentication
app.use("/api", (req, res, next) => {
    if(req.query.access_token == undefined) {
        res.statusCode = 401;
        next(new Error("Unauthorized", 401))
    } else {
        next()
    }
});

app.get("/", (req, res, next) => {
	res.setHeader("Content-Type", "text/plain");
	res.setHeader("Accept", "text/plain");
	res.end("Welcome to POS-API");
});

app.post("/login", (req, res, next) => {
    try {
        res.setHeader("Content-Type", "application/json");
        if(req.body.companyId && req.body.companySecret) {
            loginCompany(req.body.companyId, req.body.companySecret)
                .then(accessToken => {
                    res.end(JSON.stringify(accessToken));
                }).catch(err => {
                    next(err)
            })
        }
    } catch(e) {
        next(e);
    }
});

app.use("/api/Company/current", (req, res, next) => {
    try {
        res.setHeader("Content-Type", "application/json");
        let access_token = req.query.access_token;
        currentCompany(access_token).then(company => res.end(JSON.stringify(company)))
            .catch(e => next(e))
    } catch(e) {
        next(e);
    }
});

app.use((req, res, next) => {
    next("Not Found");
});


export default app