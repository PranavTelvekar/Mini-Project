const express=require("express");
const router=express.Router({mergeParams:true});
const ServiceProvider=require("../models/serviceProvider");
const Slot=require("../models/slot");
const wrapAsync=require("../utils/wrapAsync");

const serviceProviderLogin=require("../middlewares/middleware");
const ensureRole=require("../middlewares/middleware");



router.get("/:id",ensureRole("ServiceProvider"),wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let provider=await ServiceProvider.findById(id);
    res.render("slot/slotFrom.ejs",{provider});
}))

router.put("/:id",ensureRole("ServiceProvider"),wrapAsync(async(req,res)=>{
    //console.log(req.body);
    let {id}=req.params;
    
    let newSlot=new Slot(req.body);
    newSlot.serviceProvider=id;
    let provider=await ServiceProvider.findByIdAndUpdate(id,{$push:{slots:newSlot._id}});
    newSlot.save();
    //console.log(provider);
    //console.log(newSlot);
    res.redirect(`/services/${id}`);
}));

router.delete("/:sid/:pid",ensureRole("ServiceProvider"),wrapAsync(async(req,res)=>{
    let {sid,pid}=req.params;
    let slot=await Slot.findByIdAndDelete(sid);
    let provider=await ServiceProvider.findByIdAndUpdate(pid,{$pull:{slots:sid}});
    //console.log(slot);
    //console.log(provider);
    res.redirect(`/services/${pid}`);
}))

module.exports=router;