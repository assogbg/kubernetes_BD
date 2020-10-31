var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
console.log('mongodb://'+process.env.MONGO_USERNAME+':'+process.env.MONGO_PASSWORD + '@' +process.env.MONGO_HOST+':27017/promo');

mongoose.connect('mongodb://'+process.env.MONGO_USERNAME+':'+process.env.MONGO_PASSWORD + '@' +process.env.MONGO_HOST+':27017/promo?authSource=admin', { useNewUrlParser: true , server: { reconnectTries: Number.MAX_VALUE }  })
    .then(() => console.log('connection successful'))
.catch((err) => console.error(err));

var db = mongoose.connection;
var SchemaTypes = mongoose.Schema.Types;
// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

mongoose.UserLoggingSchema = new mongoose.Schema({
    "requestId": String,
    "api": String,
    "value": String,
    "sys_insertDateTime": String
}, {collection: 'promoLogging'});

// models
mongoose.UserLoggingModel = mongoose.model('promoLogging', mongoose.UserLoggingSchema);

module.exports = mongoose;
