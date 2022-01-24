import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const postSchema = new Schema({
    title: String,
    content: String,
    imageUrl: String,
    likes: Number,
    author: Object,
    createdAt: String
});

export default model('Post', postSchema);