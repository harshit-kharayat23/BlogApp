const express=require("express");
const app=express();
const connectDB=require("./Config/database")
const cookieparser=require("cookie-parser")
const fileUpload=require("express-fileupload");
const cloudinaryConnect=require("./Config/cloudinary");



app.use(express.json());
app.use(cookieparser())
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir : '/tmp/'

}));

const blogRouter=require("./Routes/blog");
const userAuthRouter = require("./Routes/userAuth");
const fileUploadRouter=require("./Routes/fileUpload")

app.use("/",blogRouter); 
app.use("/",userAuthRouter);
app.use("/",fileUploadRouter);


cloudinaryConnect(); 

connectDB().then(()=>{
    console.log("Database succesfully connected !!!")
    app.listen(process.env.PORT,()=>{
    console.log("Server is listening in port number 4000");
})
}).catch((err)=>{
    console.log("Database facing connection error !!!")
})



app.get("/",(req,res)=>{
    res.send("Hello world!")
})