const express=require("express");
const router=express.Router({mergeParams:true});
const ServiceProvider=require("../models/serviceProvider");

const wrapAsync=require("../utils/wrapAsync");


const passport=require("passport");
const localStrategy=require("passport-local");

//index route


router.get("/",wrapAsync(async(req,res)=>{
    let services=await ServiceProvider.find();
    //console.log(services);
    res.render("services/index.ejs",{services})
}));


//signup route


router.get("/signup",wrapAsync(async(req,res)=>{
    res.render("services/signup.ejs");
}))

router.post("/signup",wrapAsync(async(req,res)=>{
    let {username,email,password,contactNumber,serviceCategory,adharCardNumber,experience,LicineNumber,serviceArea,workDescription}=req.body;
    let newServiceProvider=new ServiceProvider({username,email,contactNumber,serviceCategory,adharCardNumber,experience,LicineNumber,serviceArea,workDescription});
    const registeredServiceProvider=await ServiceProvider.register(newServiceProvider,password);
    console.log(registeredServiceProvider);
    req.login(registeredServiceProvider,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You Have Succesfuly Signup Welcome");
        res.redirect("/services");
    })
    
}))



router.get("/login",(req,res)=>{
    res.render("services/login.ejs")
})



router.post("/login",passport.authenticate("local-service", { failureRedirect: "login",failureFlash:true }),(req,res)=>{
    req.flash("success","Login Successfuly");
    req.flash("error","please enter correct passwor or username")
    res.redirect("/services");
});



router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let provider=await ServiceProvider.findById(id).populate({path:"slots",populate:{path:"booking",populate:"user"}}).populate({path:"reviews",model:"Review",populate:"user"}).populate({path:"bookings",model:"Booking",populate:"user"});
    console.log(provider);
    res.render("services/profile.ejs",{provider})
}))

module.exports=router;