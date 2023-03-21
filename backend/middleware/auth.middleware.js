jwt = require("jsonwebtoken")

exports.verifyTokenMiddleware = (req,res,next) => {
    try{
        let token = req.headers.authorization;
        
        // let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzhjNTQzMDU3MmEyZmQ3OGE1ZGJiOTQiLCJpYXQiOjE2NzAyNDYzNzd9.j9RmyCNjttWHufBgdl6hmE31n8aqB9UBDcMPAOdV28U";
        // console.log(req.headers)
        console.log("token ==================================",token);
        // console.log("Secret key ========================",process.env.SECRET_KEY);
        if(token){
            token = token.split(" ")[1];
            // console.log(jwt.decode(token,"173a53a7a3c8d5653a38912ac560a4e68ae8ddcabda6e702cf0829bf48c8a246"));
            // let user = jwt.decode(token,"173a53a7a3c8d5653a38912ac560a4e68ae8ddcabda6e702cf0829bf48c8a246");
            let user = jwt.verify(token,process.env.SECRET_KEY);
            
            // console.log("===========user==============",user);
            // console.log(user)
            if(user){
                req.userId = user.userId;
                next();
            }
            else{
                res.status(401).send({
                    status : 401,
                    error : true,
                    message : "unauthorized user , Invalid token"
                })
            }
        }else{
            res.status(401).send({
                status : 401,
                error : true,
                message : "unauthorized user"
            })
        }

    }
    catch(err)
    {
        console.log(err)
        res.status(400).send({status : 400,error:true,message : err.message});
    }

    
}