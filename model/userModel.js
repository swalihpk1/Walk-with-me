const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true
    },
    emergency_contacts: [{
        type:Number,
        required:true
    }]

})