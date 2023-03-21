
const mongoose = require("mongoose")
const {Schema , model} = mongoose;
const  ObjectId = mongoose.SchemaTypes.ObjectId ;

const coordsSchema = new Schema({
    lat : String,
    lng : String
})

const weatherSchema = new Schema({

    pincode : {

        type : String,
        required : true,
        unique : true,
    },

    coords : {
        type : String,
        required : true,
    },

    info : {
        type : String
    }
},
{
    timestamps : true
}
)


exports.weatherModel = new model("weather",weatherSchema);