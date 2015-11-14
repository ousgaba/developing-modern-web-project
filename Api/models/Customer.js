var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var CustomerSchema = new Schema({
    email: String,
    password: String,
    favourite_list: String,
    
});
mongoose.model('Customer', CustomerSchema);