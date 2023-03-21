const userModel = require("../database/models/user").userModel;
// const urlModel = require("../database/models/url_data").urlDataModel;

const salt = process.env.SALT;
const crypto = require("crypto");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId ;

function responseData(status,message,error,data){
    const obj = {
        "status" : status,
        "message" : message,
        "error" : error,
        "data" : data
    }
    return obj;
}


exports.getUserDetails = async (req,res) => {
    try{
        const user = await userModel.find();
        console.log(user);
        res.status(200).send({"ststusCode":200,"message":"List of all users","error":false,"data":user});
    }

    catch(err){
        res.status(200).send({"ststusCode":200,"message":err.message,"error":true,"data":null});
    }
}


exports.setUserDetails = async (req,res) => {
    try{
        // console.log(req);
        const userData = req.body;
        console.log(userData);
        // const newUser = await createUserObj(req);
        // const savedUser = await User.create(newUser);
        return res.status(200).send({"message":"User created successfully","data":userData})
    }
    catch(err){
        return res.status(400).send({error:"Unable to create the user",error:err});
    }
}


const authenticate = (user,email,password) =>{
    try{
        
        if(email){
            // console.log(userObj);
            const pass = String(password).concat(salt);
            const hash = crypto.createHash(process.env.ENCODING_ALGO)
            hash.update(pass);
            const hashPassword = hash.digest(process.env.DIGEST_ENCODING);
            // console.log(hashPassword);
            // console.log(userObj.password)
            if(hashPassword==user.password)
            {
                return true;
            }
        }
    }
    catch(err)
    {
        console.log(err.message);
        return false;
    }

}


exports.delUserAccount = async(req,res) => {
    try{
        const userData = req.body;
        console.log(userData);
        const user = await userModel.findOne({email : userData.email})
        if(authenticate(user,userData.email,userData.pass))
        {
            // console.log(user);
            try{
                
                for(let i of user.associated_url){
                    // console.log(i)
                    const url = await urlModel.deleteOne({ "_id":ObjectId(i)});
                    // console.log(url);
                }
            }
            catch(err){}
            
            const del_user = await userModel.deleteOne({email : userData.email})

            res.status(200).send({"message":"User data successfully Deleted","data":del_user})
        }
        else{
            res.status(400).send({error:"unable to authenticate ! Wrong password","data":userData})
        }
    }
    catch(err){
        res.status(400).send({error:"error caught",error:err.message});
    }
}


exports.ChangePassword = async(req,res) => {
    try{

            const data = req.body;
            console.log(data);

            const user = await userModel.findOne({"_id" : data.userId});
            if(!user) return res.status(400).send(responseData(400,"user not found",true,data));

            const pass = String(data.pass1).concat(process.env.SALT);
            const hash = crypto.createHash(process.env.ENCODING_ALGO)
            hash.update(pass);
            const hashPassword = hash.digest(process.env.DIGEST_ENCODING);
            user.password = hashPassword;
            const updatedUser = await user.save();

            return res.status(200).send(responseData(200,"Password Changed Successfully!",false,updatedUser));
        }
        catch(err){
            return res.status(400).send(responseData(400,"Caught an Error!",true,err));
        }
}

exports.hello = async(req,res) => {
    res.status(200).send({"Message" : "Hello"})
}

