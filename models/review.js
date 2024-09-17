const mongoose=require("mongoose");



const ReviewSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', required: true 
    },
    serviceProvider: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ServiceProvider', required: true 
    },
    rating: { 
        type: Number, 
        min: 1, 
        max: 5, 
        required: true 
    }, // rating out of 5
    reviewText: { 
        type: String 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

const Review=mongoose.model("Review",ReviewSchema);

module.exports=Review;