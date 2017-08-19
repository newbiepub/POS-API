import finalHandler from "finalhandler";
import http from "http";
import app from "./router";

const server = http.createServer((req, res) => app(
        req, res, finalHandler(req, res)
    ));

server.listen((process.env.PORT || 3000), () => {
   console.log("App is running on http://localhost:"+(process.env.PORT || 3000));
});