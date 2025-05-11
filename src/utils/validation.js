const validator=require("validator")

const validate=(req)=>{
    const {emailId,name,password}=req.body;

    if(name.length<3 || name.length>=20){
        throw  new Error("Name should be Between 3 to 20 characters !")
    }
    if(!email || !password){
        throw  new Error("Enter the credentials !")
    }
    if(!validator.isEmail(emailId)){
        throw new Error("Email not valid! ");
    }
    if(!validator.isStrongPassword(password)){
            throw new Error("Enter a Strong Password!");
    }

}

module.exports=validate;