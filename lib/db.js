const mongoose = require('mongoose'),
    mongoURI = `mongodb://pointOfSale:diemBanHang@ds151993.mlab.com:51993/pointofsale`,
    options = {
        useMongoClient: true
    };

mongoose.connect(mongoURI, options);
const conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));

conn.once('open', function () {
    console.log("Database Connect Successfully");
});
export {conn};
export default mongoose;