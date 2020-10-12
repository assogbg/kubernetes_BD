var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

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

mongoose.UserPromotionSchema = new mongoose.Schema({
    "requestId": String,
    "userId": Number,
    "promotionId": String,
    "used": Boolean,
    "sys_insertDateTime": String
}, {collection: 'promoAdobe'});


// index
mongoose.UserPromotionSchema.index({ requestId: 1, userId: 1, promotionId: 1 })

// models
mongoose.UserPromotionModel = mongoose.model('promoAdobe', mongoose.UserPromotionSchema);

module.exports = mongoose;

// dummy records to populate mongo collection
mongoose.UserPromotionModel.insertMany([
	{
		"requestId": "MZT95",
		"userId": 1,
		"promotionId": 8,
		"used": "false"
	},
	{
		"requestId": "CJG22",
		"userId": 2,
		"promotionId": 5,
		"used": "false"
	},
	{
		"requestId": "DZY50",
		"userId": 3,
		"promotionId": 3,
		"used": "true"
	},
	{
		"requestId": "FIL38",
		"userId": 4,
		"promotionId": 9,
		"used": "true"
	},
	{
		"requestId": "JHH88",
		"userId": 5,
		"promotionId": 1,
		"used": "true"
	},
	{
		"requestId": "TSZ42",
		"userId": 6,
		"promotionId": 3,
		"used": "true"
	},
	{
		"requestId": "NXZ37",
		"userId": 7,
		"promotionId": 7,
		"used": "true"
	},
	{
		"requestId": "KHW26",
		"userId": 8,
		"promotionId": 1,
		"used": "false"
	},
	{
		"requestId": "ZKS85",
		"userId": 9,
		"promotionId": 2,
		"used": "false"
	},
	{
		"requestId": "FQN17",
		"userId": 10,
		"promotionId": 10,
		"used": "true"
	},
	{
		"requestId": "FTC41",
		"userId": 11,
		"promotionId": 2,
		"used": "true"
	},
	{
		"requestId": "XMW72",
		"userId": 12,
		"promotionId": 9,
		"used": "false"
	},
	{
		"requestId": "DFH89",
		"userId": 13,
		"promotionId": 9,
		"used": "true"
	},
	{
		"requestId": "NBL42",
		"userId": 14,
		"promotionId": 2,
		"used": "true"
	},
	{
		"requestId": "NVW71",
		"userId": 15,
		"promotionId": 1,
		"used": "false"
	},
	{
		"requestId": "BNJ31",
		"userId": 16,
		"promotionId": 1,
		"used": "false"
	},
	{
		"requestId": "UIO82",
		"userId": 17,
		"promotionId": 7,
		"used": "true"
	},
	{
		"requestId": "YWO28",
		"userId": 18,
		"promotionId": 8,
		"used": "false"
	},
	{
		"requestId": "PKK38",
		"userId": 19,
		"promotionId": 6,
		"used": "true"
	},
	{
		"requestId": "UVE85",
		"userId": 20,
		"promotionId": 4,
		"used": "true"
	},
	{
		"requestId": "OVH96",
		"userId": 21,
		"promotionId": 4,
		"used": "false"
	},
	{
		"requestId": "LBG20",
		"userId": 22,
		"promotionId": 6,
		"used": "true"
	},
	{
		"requestId": "ENF07",
		"userId": 23,
		"promotionId": 2,
		"used": "false"
	},
	{
		"requestId": "WKB05",
		"userId": 24,
		"promotionId": 3,
		"used": "false"
	},
	{
		"requestId": "LQZ57",
		"userId": 25,
		"promotionId": 3,
		"used": "true"
	},
	{
		"requestId": "EYU77",
		"userId": 26,
		"promotionId": 1,
		"used": "false"
	},
	{
		"requestId": "YVI16",
		"userId": 27,
		"promotionId": 1,
		"used": "true"
	},
	{
		"requestId": "BZO01",
		"userId": 28,
		"promotionId": 10,
		"used": "true"
	},
	{
		"requestId": "JGE74",
		"userId": 29,
		"promotionId": 7,
		"used": "false"
	},
	{
		"requestId": "WUK45",
		"userId": 30,
		"promotionId": 10,
		"used": "true"
	},
	{
		"requestId": "JDM86",
		"userId": 31,
		"promotionId": 6,
		"used": "true"
	},
	{
		"requestId": "QXQ29",
		"userId": 32,
		"promotionId": 5,
		"used": "false"
	},
	{
		"requestId": "IER32",
		"userId": 33,
		"promotionId": 4,
		"used": "false"
	},
	{
		"requestId": "QKN42",
		"userId": 34,
		"promotionId": 6,
		"used": "false"
	},
	{
		"requestId": "HXI71",
		"userId": 35,
		"promotionId": 3,
		"used": "false"
	},
	{
		"requestId": "NGZ16",
		"userId": 36,
		"promotionId": 9,
		"used": "false"
	},
	{
		"requestId": "QLV74",
		"userId": 37,
		"promotionId": 1,
		"used": "true"
	},
	{
		"requestId": "VAO22",
		"userId": 38,
		"promotionId": 8,
		"used": "false"
	},
	{
		"requestId": "QRA03",
		"userId": 39,
		"promotionId": 1,
		"used": "false"
	},
	{
		"requestId": "AKO20",
		"userId": 40,
		"promotionId": 9,
		"used": "true"
	},
	{
		"requestId": "BEP49",
		"userId": 41,
		"promotionId": 1,
		"used": "false"
	},
	{
		"requestId": "BOC59",
		"userId": 42,
		"promotionId": 5,
		"used": "true"
	},
	{
		"requestId": "JYC43",
		"userId": 43,
		"promotionId": 10,
		"used": "false"
	},
	{
		"requestId": "SFT66",
		"userId": 44,
		"promotionId": 9,
		"used": "false"
	},
	{
		"requestId": "WRX95",
		"userId": 45,
		"promotionId": 2,
		"used": "false"
	},
	{
		"requestId": "VJA30",
		"userId": 46,
		"promotionId": 9,
		"used": "true"
	},
	{
		"requestId": "ESU22",
		"userId": 47,
		"promotionId": 9,
		"used": "false"
	},
	{
		"requestId": "PZT10",
		"userId": 48,
		"promotionId": 6,
		"used": "true"
	},
	{
		"requestId": "OEX45",
		"userId": 49,
		"promotionId": 9,
		"used": "false"
	},
	{
		"requestId": "XPD29",
		"userId": 50,
		"promotionId": 4,
		"used": "false"
	},
	{
		"requestId": "QFU60",
		"userId": 51,
		"promotionId": 8,
		"used": "false"
	},
	{
		"requestId": "CJK64",
		"userId": 52,
		"promotionId": 9,
		"used": "true"
	},
	{
		"requestId": "GBY41",
		"userId": 53,
		"promotionId": 6,
		"used": "true"
	},
	{
		"requestId": "PHF55",
		"userId": 54,
		"promotionId": 5,
		"used": "true"
	},
	{
		"requestId": "WWM61",
		"userId": 55,
		"promotionId": 5,
		"used": "true"
	},
	{
		"requestId": "VFQ54",
		"userId": 56,
		"promotionId": 2,
		"used": "true"
	},
	{
		"requestId": "NMW84",
		"userId": 57,
		"promotionId": 6,
		"used": "false"
	},
	{
		"requestId": "ILW53",
		"userId": 58,
		"promotionId": 2,
		"used": "false"
	},
	{
		"requestId": "VEV17",
		"userId": 59,
		"promotionId": 1,
		"used": "true"
	},
	{
		"requestId": "XTU28",
		"userId": 60,
		"promotionId": 8,
		"used": "false"
	},
	{
		"requestId": "GHJ19",
		"userId": 61,
		"promotionId": 6,
		"used": "false"
	},
	{
		"requestId": "MIP64",
		"userId": 62,
		"promotionId": 4,
		"used": "false"
	},
	{
		"requestId": "FAN41",
		"userId": 63,
		"promotionId": 4,
		"used": "true"
	},
	{
		"requestId": "NIV24",
		"userId": 64,
		"promotionId": 1,
		"used": "true"
	},
	{
		"requestId": "UHO76",
		"userId": 65,
		"promotionId": 6,
		"used": "true"
	},
	{
		"requestId": "KKA81",
		"userId": 66,
		"promotionId": 5,
		"used": "true"
	},
	{
		"requestId": "MNQ32",
		"userId": 67,
		"promotionId": 10,
		"used": "false"
	},
	{
		"requestId": "JYW82",
		"userId": 68,
		"promotionId": 5,
		"used": "false"
	},
	{
		"requestId": "ZZZ86",
		"userId": 69,
		"promotionId": 1,
		"used": "false"
	},
	{
		"requestId": "RWW71",
		"userId": 70,
		"promotionId": 9,
		"used": "false"
	},
	{
		"requestId": "CVI97",
		"userId": 71,
		"promotionId": 6,
		"used": "true"
	},
	{
		"requestId": "JOR64",
		"userId": 72,
		"promotionId": 3,
		"used": "false"
	},
	{
		"requestId": "LXU30",
		"userId": 73,
		"promotionId": 3,
		"used": "true"
	},
	{
		"requestId": "MKG64",
		"userId": 74,
		"promotionId": 3,
		"used": "true"
	},
	{
		"requestId": "DCK96",
		"userId": 75,
		"promotionId": 1,
		"used": "false"
	},
	{
		"requestId": "HKT36",
		"userId": 76,
		"promotionId": 8,
		"used": "true"
	},
	{
		"requestId": "ODP95",
		"userId": 77,
		"promotionId": 1,
		"used": "false"
	},
	{
		"requestId": "ALS70",
		"userId": 78,
		"promotionId": 4,
		"used": "false"
	},
	{
		"requestId": "PYW90",
		"userId": 79,
		"promotionId": 2,
		"used": "true"
	},
	{
		"requestId": "KUQ11",
		"userId": 80,
		"promotionId": 4,
		"used": "false"
	},
	{
		"requestId": "OMZ82",
		"userId": 81,
		"promotionId": 8,
		"used": "false"
	},
	{
		"requestId": "FJR56",
		"userId": 82,
		"promotionId": 3,
		"used": "true"
	},
	{
		"requestId": "YNL14",
		"userId": 83,
		"promotionId": 3,
		"used": "true"
	},
	{
		"requestId": "UMT29",
		"userId": 84,
		"promotionId": 2,
		"used": "false"
	},
	{
		"requestId": "RIX99",
		"userId": 85,
		"promotionId": 1,
		"used": "true"
	},
	{
		"requestId": "KEL81",
		"userId": 86,
		"promotionId": 2,
		"used": "false"
	},
	{
		"requestId": "AJP37",
		"userId": 87,
		"promotionId": 6,
		"used": "false"
	},
	{
		"requestId": "SFV63",
		"userId": 88,
		"promotionId": 8,
		"used": "true"
	},
	{
		"requestId": "XFE31",
		"userId": 89,
		"promotionId": 3,
		"used": "true"
	},
	{
		"requestId": "BPY53",
		"userId": 90,
		"promotionId": 6,
		"used": "true"
	},
	{
		"requestId": "QCQ79",
		"userId": 91,
		"promotionId": 1,
		"used": "false"
	},
	{
		"requestId": "MTM51",
		"userId": 92,
		"promotionId": 6,
		"used": "false"
	},
	{
		"requestId": "LDI83",
		"userId": 93,
		"promotionId": 9,
		"used": "true"
	},
	{
		"requestId": "MVL34",
		"userId": 94,
		"promotionId": 4,
		"used": "true"
	},
	{
		"requestId": "FAI58",
		"userId": 95,
		"promotionId": 8,
		"used": "false"
	},
	{
		"requestId": "USW09",
		"userId": 96,
		"promotionId": 10,
		"used": "false"
	},
	{
		"requestId": "RWH73",
		"userId": 97,
		"promotionId": 6,
		"used": "false"
	},
	{
		"requestId": "CRB47",
		"userId": 98,
		"promotionId": 8,
		"used": "false"
	},
	{
		"requestId": "RGQ78",
		"userId": 99,
		"promotionId": 10,
		"used": "true"
	},
	{
		"requestId": "UDZ38",
		"userId": 100,
		"promotionId": 2,
		"used": "false"
	}
]
)
