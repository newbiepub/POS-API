let username = 'pos-api',
    password = 'pos123';
var mongoose = require('mongoose'),
    mongoURI = 'mongodb://' + username + ':' + password + '@ds149763.mlab.com:49763/pos',
    options = {
        server: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}},
        replset: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}}
    };

mongoose.connect(mongoURI, options);
const conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));

conn.once('open', function () {
    console.log("Database Connect Successfully");
});
export {conn};
export default mongoose;