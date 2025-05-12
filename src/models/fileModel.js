const mongoose=require("mongoose");
const nodemailer=require("nodemailer")
require("dotenv").config()


const fileModelSchema=mongoose.Schema({

        name:{
            type:String,
            required:true,
        },
        imageUrl:{
            type:String,
            required:true,
        },
        tags:{
            type:String, 
        },
        emailId:{
            type:String,
        }


})
// post middleware

fileModelSchema.post("save",async(doc)=>{

    try{
        // transporter 
        let transporter=nodemailer.createTransport({
                host:process.env.MAIL_HOST,
                port: 465, // or 587
                secure: true, // true for port 465, false for 587

                auth:{
                    user:process.env.MAIL_USER,
                    pass:process.env.MAIL_PASS,
                },


        })
 
        // send mail
        let info=await transporter.sendMail({
            from: `"Harshit 👻" <${process.env.MAIL_USER}>`,
            to:doc.emailId,
            subject:"new File uploaded on cloudinary",
            html:`<h2>Hello Jee</h2> <p>File Uploaded</p> View here: <a href="${doc.imageUrl}">${doc.imageUrl}</a>`,

        })
        console.log("info",info);


    }catch(err){
        console.error("Error sending email:", err.message);

    }

})


module.exports=mongoose.model("File",fileModelSchema);