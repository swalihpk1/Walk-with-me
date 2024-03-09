const mongoose = require('mongoose');

const otp = new mongoose.Schema({
    user_id :{
        type :String,
        required :true
    },
    otp: {
        type: Number,
        required:true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('otp', otp);