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
import passwordHash from "password-hash";
import {Roles, User} from "./models/modelConfigs";
import api from "./routes/api";

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

app.use('*', cors({origin: process.env.BASE_URL || 'http://localhost:3000'}));

const boot = async () => {
    try {
        let rolesCount = await Roles.find().count().exec(),
            adminRole = "",
            employeeRole = "";
        if (!rolesCount) {
            adminRole = await new Roles({
                roleName: "company"
            }).save();
            employeeRole = await new Roles({
                roleName: "employee"
            }).save();
        }

        let userCount = await User.find().count().exec();
        if (!userCount) {
            let company = await new User({
                email: "lam@example.com",
                password: passwordHash.generate("123456"),
                profile: {
                    name: "Lam Nguyen",
                    address: "K43/59 Lê Hữu Trác",
                    phoneNumber: "1282066863"
                },
                roles: [adminRole._id.toString()]
            }).save();

            let employee = await new User({
                username: "lamnguyen2306",
                password: passwordHash.generate("123456"),
                profile: {
                    name: "POS-01",
                    address: "K69/96 No Name",
                    phoneNumber: "123456789"
                },
                roles: [employeeRole._id.toString()]
            }).save();
        }
    } catch (e) {
        console.log(e);
    }
};

boot(); // Boot App

app.use('/api', api);

// GraphiQL playground
app.get("/graphiql", expressPlayground({
    endpoint: "/api"
}));

const ws = http.createServer(app);

ws.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running at port ${(process.env.PORT || 3000)}`);
});