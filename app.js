const express=require("express");
const app=express();
let port=8080;
app.listen(port,()=>{
    console.log(`Server Is Started On Port ${port}`);
})


//---------------------------------------------------------------------------------------

const User=require("./models/user");
const ServiceProvider=require("./models/serviceProvider");
const Review=require("./models/review")

//----------------------------------------------------------------------------------------

//Connecting Database

// getting-started.js
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/services');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

//--------------------------+--------------------------------------------------------------

const path=require("path");

app.set("view engine","ejs");


app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));

//----------------------------------------------------------------------------------------
const methodOverride=require("method-override");

app.use(methodOverride("_method"));

const ExpressError=require("./utils/ExpressError");
//----------------------------------------------------------------------------------------

const session=require("express-session");
const sessionOption={
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};
const flash=require("connect-flash");
app.use(session(sessionOption));
app.use(flash());

const passport=require("passport");
const localStrategy=require("passport-local");
app.use(passport.initialize());
app.use(passport.session());



const ensureRole=require("./middlewares/middleware")



//---------------------------------------------------------------------------------------


// passport.use(new localStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.use("user-local",new localStrategy(User.authenticate()));
passport.use("local-service",new localStrategy(ServiceProvider.authenticate()));

passport.serializeUser((user,done)=>{
    done(null,{id:user._id,type:user.constructor.modelName})
})
passport.deserializeUser(async(obj,done)=>{
    try{
        const model=obj.type==='User'?User:ServiceProvider;
        const user=await model.findById(obj.id);
        done(null,user)
    }catch(err){
        done(err,null);
    }
    
})



//----------------------------------------------------------------------------------------


// passport.use(new localStrategy(ServiceProvider.authenticate()));
// passport.serializeUser(ServiceProvider.serializeUser());
// passport.deserializeUser(ServiceProvider.deserializeUser());





//--------------------------------------------------------------------------------------


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
})


app.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You Are Logged out");
        res.redirect("/services");
    })
})



//----------------------------------------------------------------------------------------

const userRouter=require("./routes/user");
app.use("/user",userRouter);

//----------------------------------------------------------------------------------------
const servicesRouter=require("./routes/services");
app.use("/services",servicesRouter);

//----------------------------------------------------------------------------------------
const slotsRouter=require("./routes/slots");
app.use("/slot",slotsRouter);

//----------------------------------------------------------------------------------------

const reviewsRouter=require("./routes/reviews");
app.use("/review",reviewsRouter);

//----------------------------------------------------------------------------------------

const Booking=require("./models/booking");
const Slot = require("./models/slot");

app.get("/booking/:sid",ensureRole("User"),(req,res)=>{
    let {sid}=req.params;
    res.render("booking/bookingForm.ejs",{sid});
})

app.post("/booking/:sid",ensureRole("User"),async(req,res)=>{
    //console.log(req.body);
    let {problemDescription}=req.body;
    let {sid}=req.params;
    const slotBooking=await Slot.findById(sid);
    let a=slotBooking.numberOfBookings;
    a=a+1;
    const serviceProvider=await ServiceProvider.findById(slotBooking.serviceProvider);
    const user=req.user;
    let booking=new Booking({user:user._id,serviceProvider:serviceProvider._id,slot:sid,problemDescription:problemDescription});
    console.log(booking)
    let slotBookingEdit=await Slot.findByIdAndUpdate(sid,{$push:{booking:booking.id},numberOfBookings:a});
    console.log(slotBookingEdit)
    let serviceProviderEdit=await ServiceProvider.findByIdAndUpdate(serviceProvider._id,{$push:{bookings:booking._id}});
    console.log(serviceProviderEdit)
    let userBooking=await User.findByIdAndUpdate(user._id,{$push:{bookings:booking._id}});
    console.log(userBooking);
    booking.save();
    res.redirect(`/services/${serviceProvider.id}`);
})




//---------------Error Handling ---------------------------------------------------------//

app.use("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Exists"));
})
app.use((err,req,res,next)=>{
    let {statusCode,message}=err;
    res.render("ErrorHandling/error.ejs",{message});
})