import mongoose from "mongoose";
const mongoURI = process.env.DATABASE_URL, options = {};

mongoose.connect(mongoURI, options);

const conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));

conn.once('open', function () {
    console.log("Database connected successfully");
});
export {conn};

export function createModel (schemaName, modelSchema, collection) {
    return mongoose.model(schemaName, modelSchema, collection);
}

export default mongoose;