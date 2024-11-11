import mongoose from "mongoose";

const Schema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    confirmPassword:String
})

const UserModal = mongoose.model('user',Schema)

export default UserModal