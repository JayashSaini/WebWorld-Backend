import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
        required: true
    },
    loginType: {
        type: String,
        required: true,
        enum: ['local', 'google'],
        default: 'local'
    }
});

const User = mongoose.model("User", userSchema);

export default User;