var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
require('mongoose-double')(mongoose);

mongoose.connect('mongodb://'+process.env.MONGO_LBI_SERVICE_HOST+':27017/preAnalysis', { useNewUrlParser: true , server: { reconnectTries: Number.MAX_VALUE }  })
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

mongoose.UserPromotionSchema = new mongoose.Schema({
    "requestId": String,
    "userId": Number,
    "promotionId": String,
    "used": Boolean,
    "sys_insertDateTime": String,
}, {collection: 'promoAdobe'});


// index
mongoose.UserPromotionSchema.index({ requestId: 1, userId: 1, promotionId: 1 })

// models
mongoose.UserPromotionModel = mongoose.model('promoAdobe', mongoose.UserPromotionSchema);

module.exports = mongoose;

// dummy records to populate mongo collection --> ensure spark job runs even in case of mongo failure
// collection needed
const dummyStore = {
  requestId: "initTest",
  store_key: -1,
  activity_dossier:"initTestActDos",
  sys_insertDateTime: "1900-01-01 00:00:00"
}
