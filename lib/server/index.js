require('dotenv').config(); // Env config
import express from "express";
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import url from "url";
import session from "express-session";
import minify from "express-minify";
import querystring from "querystring";
import helmet from "helmet";
import compression from 'compression';
import {join, resolve} from "path";
import cors from 'cors';
import http from "http";
import {UUIDGeneratorNode} from "../utils/helpers";
import api from "./routes/api";
import account from "./routes/account";
import {initData} from "../utils/initDatabase";
import webApi from "./routes/web/api";
import RateLimiter from "express-rate-limit";

const expressPlayground = require("graphql-playground-middleware-express/dist/index").default; // GraphiQL playground
const app = express();
const apiLimiter = new RateLimiter({
    windowMs: 2 * 60 * 1000, // Rate limit 2 minutes
    max: 200,
    delayMs: 0,
    message: "TOO_MANY_REQUEST"
}); // API rate limit 2 minutes for 200 request

// Logs
app.use(morgan('dev'));

//Body Parser
app.use(bodyParser.urlencoded({extended: false, limit: '5mb'}));
app.use(bodyParser.json({limit: '5mb'}));

// Query String
app.use((req, res, next) => {
    req.query = querystring.parse(
        url.parse(req.url).query
    );
    next();
});

// Session
let sess = {
    secret: UUIDGeneratorNode(),
    resave: true,
    saveUninitialized: false
};

app.use(session(sess));

// Helmet and CSRF Protection
app.use(helmet());

// Enable Cookie
app.use(cookieParser());

// Minifying
app.use(compression());
app.use(minify());

app.use('*', cors({origin: [process.env.BASE_URL || 'http://localhost:3000', process.env.POS_MANAGER_WEB_URL || 'http://localhost:5000']}));

const boot = async () => {
    try {
        await initData();
    } catch (e) {
        console.log(e);
    }
};

boot(); // Boot App

app.use("/account", account);

// APP API
app.use('/api', apiLimiter, api);

// WEB API
app.use("/web/api", apiLimiter,webApi);

// GraphiQL playground
app.get("/graphiql", expressPlayground({
    endpoint: "/api"
}));

app.use(function (err, req, res, next) {
    res.status(500).send({errors: [{message: err.message}]})
});

const ws = http.createServer(app);

ws.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running at port ${(process.env.PORT || 3000)}`);
});