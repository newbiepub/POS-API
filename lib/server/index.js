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
import nunjucks from "nunjucks";
import {initData} from "../utils/initDatabase";

const expressPlayground = require("graphql-playground-middleware-express/dist/index").default; // GraphiQL playground
const app = express();

// Logs
app.use(morgan('dev'));

//Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Query String
app.use((req, res, next) => {
    req.query = querystring.parse(
        url.parse(req.url).query
    );
    next();
});

// Session
app.use(session({
    secret: UUIDGeneratorNode(),
    resave: true,
    saveUninitialized: false
}));

// Helmet and CSRF Protection
app.use(helmet());

// Enable Cookie
app.use(cookieParser());

// Minifying
app.use(compression());
app.use(minify());

nunjucks.configure(join(__dirname, "../", "../", "views"), {
    autoescape: true,
    express: app
});

app.engine('html', nunjucks.render);
app.set("view engine", 'html');

app.use('*', cors({origin: process.env.BASE_URL || 'http://localhost:3000'}));

const boot = async () => {
    try {
        await initData();
    } catch (e) {
        console.log(e);
    }
};

boot(); // Boot App

app.use("/account", account);

app.use('/api', api);

// GraphiQL playground
app.get("/graphiql", expressPlayground({
    endpoint: "/api"
}));

/*// Handle Not Found Route
app.get("/404", (req, res, next) => {
    res.status(404).json({errors: [{message: "Not Found"}]});
});

// Handle Not Found Route
app.use((req, res, next) => {
    res.redirect("/404");
});*/

const ws = http.createServer(app);

ws.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running at port ${(process.env.PORT || 3000)}`);
});