
const mongoose = require("mongoose")
const {Schema , model} = mongoose;
const  ObjectId = mongoose.SchemaTypes.ObjectId ;

const userAddressSchema = new Schema({
    address_line_1 : String,
    address_line_2 : String,
    city : String,
    postal_code : String,
    country : String,
    contact_number : Number,
});


const userSchema = new Schema(
    {
        
        fullName : {
            type : String,
            // required : true,
            trim : true,
            default : 'GuestUser'
        },

        email : {
            type: String
            // required : true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
            unique: true,
          },

        gender : {
            type : String,
            enum : ["Male","Female","Others"]
        },

        address : {
            type : userAddressSchema,
        },

        pincode : {
            type : String,
            required : true
        },

        dob : {
            type : String,
        },


        role :{
            type : String,
            enum:["ADMIN","USER"],
            default:"USER",
           },


        otp : {
            type:Number,
        }
    }
    ,
    {
        timestamps : true
    }
);


exports.userModel = new model("users",userSchema);
