const express=require("express");
const fileUploadRouter=express.Router();
const File=require("../models/fileModel");

const {supportedFile,supportedVideoFile}=require("../utils/supportedFileType")

const cloudinary=require("cloudinary").v2
const fileUploadToCloudinary=async(file,folder,quality)=>{

    const options={
        folder:folder,
        resource_type: "auto" ,// important for videos
        transformation: [
        {
            quality: quality || "auto",
            fetch_format: "auto"  // converts to best possible format like WebP
        }
        ]


    }

    return await cloudinary.uploader.upload(file.tempFilePath,options)

}

fileUploadRouter.post("/imageupload",async(req,res)=>{

  
    try{
            // data fetch
          const {name,emailId,tags}=req.body;
            const file=req?.files?.imagefile; 

            // validation
           if(!supportedFile(file)){
                throw new Error("File type not supported!")
           }
            

            // file format supported

            const response=await fileUploadToCloudinary(file,"harshit",60);

            const savefile=new File({
                    name,
                    tags,
                    emailId,
                    imageUrl:response.secure_url,

            })
            await savefile.save();  

            res.json({
                success:true,
                message:"Image Uploaded successfully !"
            })




    }catch(err){
        res.status(400).send("Error: "+err.message)
    }



})
fileUploadRouter.post("/videoupload",async(req,res)=>{

    try{
            // fetching the data
            const {name,emailId,tags }=req.body;
            const file=req?.files?.videofile;

            // validation
            if (!file) {
                    throw new Error("No video file uploaded.");
                }


            if(!supportedVideoFile(file)){
                throw new Error("Invalid video type!")
            }
            // TODO upper limit for 5 mb for video
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                throw new Error("Video file size exceeds 5MB limit.");
            }

            const response=await fileUploadToCloudinary(file,"harshit");

              const savefile=new File({
                    name,
                    tags,
                    emailId,
                    imageUrl:response.secure_url,

            })
            await savefile.save();  

            res.json({
                success:true,
                message:"Video Uploaded successfully !"
            })






    }catch(err){
        res.status(400).send("Error: "+err.message)
    }



})
fileUploadRouter.post("/imageReducerUpload",async(req,res)=>{

        try{

            // fetching the data
            const {emailId,tags,name}=req.body;
            const file=req.files.imagefile;
            // vaidation
            if(!supportedFile(file)){
                throw new Error("Invalid file type!")
            }
            //reducing the size of file
            const response=await fileUploadToCloudinary(file,"harshit");
            console.log(response);
            const savefile=new File({
                    name,
                    tags,
                    emailId,
                    imageUrl:response.secure_url,

            })
            await savefile.save();  

            res.json({
                success:true,
                message:"photo compressed and  Uploaded successfully !"
            })

        }catch(err){
            res.status(400).send("Error: "+err.message)
        }


})
fileUploadRouter.post("/localFileUpload",async(req,res)=>{


    try{

        // fetch file
        const file=req.files.file;
        console.log("File agayi ",file);

        //define the path and the folder
        const path=__dirname+"/files/"+Date.now()+'.'+`${file.name.split('.')[1]}`;

        file.mv(path,(err)=>{
            console.log("Error is :",err);
        })

        res.json({ 
            success:true,
            message:"Local File uploaded successfully!"
        })

    }
    catch(err){
        res.status(400).send("Error : "+err.message)
    }



})




module.exports=fileUploadRouter;