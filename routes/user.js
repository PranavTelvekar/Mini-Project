const express=require("express");
const router=express.Router({mergeParams:true});
const passport=require("passport");
const User=require("../models/user");



router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
})

router.post("/signup",async(req,res)=>{
    console.log(req.body);
    let {username,email,password,contactNumber,address}=req.body;
    let newUser=new User({username,email,contactNumber,address});
    let registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    res.locals.currentUser=req.user;
    req.flash("success","Your Account Is Successfuly Created");
    res.redirect("/services");
})

router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
})

router.post("/login",passport.authenticate("user-local", { failureRedirect: "login",failureFlash:true }),(req,res)=>{
    res.locals.currentUser=req.user;
    req.flash("success","You Are Logged In Successfuly");
    res.redirect("/services");
})

module.exports=router;