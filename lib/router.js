import Router from 'router';
import bodyParser from "body-parser";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import {resolve} from "path";
import qs from 'querystring';
import url from "url";

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
    if(req.query.access_token != undefined) {
        res.end("Hello");
    } else {
        res.end("Unauthorized");
    }
});

app.get("/", (req, res, next) => {
	res.setHeader("Content-Type", "text/plain");
	res.setHeader("Accept", "text/plain");
	res.end("Welcome To POS API");
});



export default app