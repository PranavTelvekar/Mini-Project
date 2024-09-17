const express=require("express");
const router=express.Router({mergeParams:true});
const User=require("../models/user");
const Review=require("../models/review");
const ServiceProvider=require("../models/serviceProvider");

const ensureRole=require("../middlewares/middleware");




router.post("/:pid",ensureRole("User"),async(req,res)=>{
    let {pid}=req.params;
    let user=req.user;
    let newReview= new Review(req.body);
    newReview.user=user._id;
    newReview.serviceProvider=newReview._id;
    let reviewAddedProvider=await ServiceProvider.findByIdAndUpdate(pid,{$push:{reviews:newReview._id}});
    newReview.save();
    reviewAddedProvider.save();
    res.redirect(`/services/${pid}`);
});

router.delete("/:pid/:rid",ensureRole("User"),async(req,res)=>{
    let {pid,rid}=req.params;
    let user=req.user;
    let reviewDeletedUser=await User.findByIdAndUpdate(user._id,{$pull:{reviews:rid}});
    //console.log(reviewDeletedUser);
    let deletedReviev=await Review.findByIdAndDelete(rid);
    //console.log(deletedReviev)
    let reviewDeletedProvider=await ServiceProvider.findByIdAndUpdate(pid,{$pull:{reviews:rid}});
    //console.log(reviewDeletedProvider);
    res.redirect(`/services/${pid}`);
});

module.exports=router;