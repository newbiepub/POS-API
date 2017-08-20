const path = require("path");
const level =require("level");
const db = path.resolve(__dirname, "../", "./db");

export default level(db);