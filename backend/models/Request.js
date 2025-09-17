const mongoose = require("mongoose");//lib for connecting node.js with mongodb.

const requestSchema = new mongoose.Schema({
    name: {type:String, required:true},
    email: {type: String, required:true},
    title: {type: String, required: true},
    description: {type: String, required:true},
    priority: {type: String, enum:["Low","Medium","High"], default:"Low"},
    status: {type:String, enum:["Open","In Progress","Closed"],default:"Open"},
    createdAt: {type: Date,default:Date.now}
});

module.exports=mongoose.model("Request", requestSchema);