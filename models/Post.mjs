import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const postSchema = new Schema({
    caption: String,
    imageUrl: String,
    likes: Number,
    dislikes: Number,
    author: Object
});

export default model('Post', postSchema);