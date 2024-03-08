const mongoose = require('mongoose');
const quotes = new mongoose.Schema({
    qoute:{
        type:String
    }
})
module.exports = mongoose.model('quotes',quotes);