const mongoose=require("mongoose");

const validator=require("validator")

const userSchema=mongoose.Schema({

        name:{
            type:String,
            required:true,
            minLength:3,
            maxLength:20,
        },
        emailId:{
            type:String,
            required:true,
            unique:true,
            trime:true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Email not valid! ");
                }

            }

        },
        password:{
            type:String,
            required:true,
            trim:true,
            validate(value){
                if(!validator.isStrongPassword(value)){
                        throw new Error("Enter a Strong Password!");
                }
            }
            
        },
        role:{
            type:String,
            lowercase:true,
            trim:true,
            enum:["admin","student","visitor"]
        }

})

module.exports=mongoose.model("User",userSchema);