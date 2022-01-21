import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: String,
    discriminator: String,
    avatar: String,
    language: String,
    email: String,
    discordId: String,
    createdAt: String,
    posts: Array,
    likes: Array,
    dislikes: Array,
    followers: Array
});

export default model('User', userSchema);