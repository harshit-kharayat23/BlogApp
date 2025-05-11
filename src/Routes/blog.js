const express=require("express");
const blogRouter=express.Router();
const Post=require("../models/postModel");
const Comment=require("../models/commentModel");
const Like=require("../models/likeModel");
const { message } = require("statuses");

blogRouter.post("/post/create",async(req,res)=>{

    try{

        const {title,body}=req?.body;

        // creating new instance of post model
        const newPost=new Post({
            title,body
        })
        await  newPost.save();
        res.json({message:"Post added succesfully !!!",
            data:newPost
        }
        )

    }
    catch(err){
        res.status(400).send("ERROR: "+err.message )
    }
    


})
blogRouter.post("/comment/create",async(req,res)=>{

    try{
            const {post,user,body}=req.body;
            // create instance of Comment
            const comment=new Comment({
                user,
                post,
                body,
            })


            const newComment=await comment.save();

            const updatedPost=await Post.findByIdAndUpdate(post,{
                $push:{comments:newComment._id},
            },{new:true}).populate("comments").exec();

 
            res.json({
                message:"Comment Added successfully!",
                data:updatedPost,
            })



    }catch(err){
            res.status(400).send("ERROR: "+err.message )
    }


})

blogRouter.get("/posts",async(req,res)=>{


    try{

        const post=await Post.find({}).populate("comments").exec();
        res.json({
                message:"Posts are:!",
                data:post,
            })



    }catch(err){
            res.status(400).send("ERROR: "+err.message )
    }




})
blogRouter.post("/like",async(req,res)=>{


    try{

        const {user,post}=req.body;

        const like=new Like({
                user,
                post,
            }) 
        const savedLike=await like.save();

        const updatePost=await Post.findByIdAndUpdate(
            post,
            {$push:{likes:savedLike._id}},
            {
                new:true,
            }

        ).populate("likes comments").exec();
        res.json({
            message:"Post Updated",
            data:updatePost,
        })




    }catch(err){
            res.status(400).send("ERROR: "+err.message )
    }


})

blogRouter.post("/unlike",async(req,res)=>{

    const {post,like}=req.body;
    
    const unlike=await  Like.findOneAndDelete(
        {post:post,_id:like})
    const updatedPost=await Post.findByIdAndUpdate(
        post,{$pull :{likes:unlike._id}}
        )   

    res.json({
        message:'unliked the post !',
        data:updatedPost,
    })




})
module.exports=blogRouter;