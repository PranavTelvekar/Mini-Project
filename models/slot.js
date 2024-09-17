const mongoose=require("mongoose");

const slotSchema = new mongoose.Schema({
    serviceProvider: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ServiceProvider', 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    startTime: { 
        type: String, 
        required: true 
    }, // format 'HH:mm'
    endTime: { 
        type: String, 
        required: true 
    }, // format 'HH:mm'
    isBooked: { 
        type: Boolean, 
        default: false 
    },
    price: { 
        type: Number 
    }, // Optional: cost of the service for this slot
    booking: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Booking' 
    }], // Reference to booking, if booked
    // canBeCancelled: { 
    //     type: Boolean, 
    //     default: true 
    // }, // Optional: whether slot can be canceled
    // slotType: { 
    //     type: String, 
    //     enum: ['On-site', 'In-office'] 
    // }, // Optional: slot type
    additionalInfo: { 
        type: String 
    }, // Optional: any extra notes,
    numberOfBookings:{
        type:Number,
        default:0,
        min:0
    }
});

const Slot=mongoose.model("Slot",slotSchema)

module.exports=Slot;