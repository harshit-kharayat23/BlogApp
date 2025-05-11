const jwt=require("jsonwebtoken");
const User=require("../models/userModel")
const auth=async(req,res,next)=>{

    try{
            const {token}=req.cookies;
            if(!token){
                return res.status(401).send("Invalid Token!")
            }
            const decodedToken=await jwt.verify(token,"Harsh@2181$")
            console.log(decode);
            const {_id}=decodedToken;
            const user=await User.findById(_id);
            req.user={user,decodedToken};
            next();

    }catch(err){
         res.status(400).send("ERROR: "+err.message )
    }


}

const isStudent=(req,res,next)=>{

        try{

            const {token}=req.cookies;
        if(!token){
                return res.status(401).send("Invalid Token!")
            }
        const {decodedToken}=req.user;
        if(decodedToken.role==="student"){
            next();
        }
        else{
            return res.status(401).send("Unauthorised user!")
        }

        }catch(err){
            res.status(400).send("ERROR: "+err.message )
        }

        
        


}
const isAdmin=(req,res,next)=>{

        try{

            const {token}=req.cookies;
        if(!token){
                return res.status(401).send("Invalid Token!")
            }
        const {decodedToken}=req.user;
        if(decodedToken.role==="student"){
            next();
        }
        else{
            return res.status(401).send("Unauthorised user!")
        }

        }catch(err){
            res.status(400).send("ERROR: "+err.message )
        }


}

module.exports={
    auth,
    isStudent,
    isAdmin
}