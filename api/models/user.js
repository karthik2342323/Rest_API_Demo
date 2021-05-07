const mongoose = require('mongoose');
const moment=require('moment');

/*
Likewise what We gonna do is while Login Time
@para - email
@para - passwd

And Signup Time All Para
 */
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: true },
    userID:{type:String,require:true},
    name:{type:String,required: true},
    dob:{type:String,required: true},
    address:{type:String,required:true},
    description: {type:String,required:true},
    token:{type:String,required:true},
    followers:{type:String},
    following:{type:String},
    createdAt:{type:String,require:true}
   // createdAt:""+moment().format('MMMM Do YYYY, h:mm:ss a')
});

const User = mongoose.model('User', userSchema);

module.exports = User;
