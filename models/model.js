const mongoose = require('mongoose')
const findOrCreate = require('mongoose-findorcreate')
const UserSchema = new mongoose.Schema({
    googleId:{
        type: String,
        required: true  
    },
    Username: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    // Password: {
    //     type: String,
    //     required: true
    // },
    Lists:[{
        ListName:{
            type:String,
            required:true
        },
        Songs: [{
            SongName: String,
            SongLink: String,
            SongImg: String
        }]
    }]
})
UserSchema.plugin(findOrCreate)
module.exports = mongoose.model('User', UserSchema)