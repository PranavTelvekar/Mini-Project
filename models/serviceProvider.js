const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");

const serviceProviderSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    contactNumber:{
        type:Number,
        required:true
    },
    serviceCategory:{
        type:String,
        enum:{
            values:["Plumber","Electrician","Painter","Nursing Home","Beauty"],
            message:"This Service Is Not Here"
        }
    },
    adharCardNumber:{
        type:Number,
        required:true
    },
    experience:{
        type:Number,
        required:true
    },
    LicineNumber:{
        type:String,
        required:true
    },
    serviceArea:{
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        }
    },
    workDescription:{
        type:String,
        required:true
    },
    slots:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Slot"
        }
    ],
    bookings:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Booking"
        }
    ],
    reviews:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"review"
        }
    ]
});

serviceProviderSchema.plugin(passportLocalMongoose);

const ServiceProvider=mongoose.model("ServiceProvider",serviceProviderSchema);

module.exports=ServiceProvider;