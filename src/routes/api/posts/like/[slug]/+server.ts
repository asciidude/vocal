/**
 * Like/unlike should be handled here,
 * extra information should be added to the user object
 * regarding the post such as categories...later.
 */

import { error, json, type RequestHandler } from "@sveltejs/kit";
import { LikeModel } from '$lib/models/Like.model';
import { PostModel } from "src/lib/models/Post.model";
import { UserModel } from "src/lib/models/User.model";

export const POST: RequestHandler = async({ params, request, locals }) => {
    const user = typeof locals.user === 'string' ? JSON.parse(locals.user) : locals.user;

    const postId = params.slug;
    const [userDoc, post] = await Promise.all([
        UserModel.findById(user._id),
        PostModel.findById(postId)
    ]);

    if(!postId || !post || !userDoc) {
        throw error(422, 'Unprocessable Entity');
    }

    if(!user) {
        throw error(401, 'Unauthorized');
    }

    const updatedVector = { ...(userDoc.userInterestVectors || {}) };

    for (const [token, weight] of Object.entries(post.postVectors || {})) {
        updatedVector[token] = (updatedVector[token] || 0) + weight;
    }

    userDoc.userInterestVectors = updatedVector;
    await userDoc.save();

    try {
        const like = await LikeModel.exists({ parent_post: postId, author: user._id });

        if(!like) {
            await LikeModel.create({
                parent_post: postId,
                author: user._id
            });
            
            return json({
                status: 200,
                newlyLiked: true,
                message: 'Success'
            });
        } else {
            await LikeModel.deleteOne({
                parent_post: postId,
                author: user._id
            });

            return json({
                status: 200,
                newlyLiked: false,
                message: 'Success'
            });
        }
    } catch(err) {
        console.log(err);
        throw error(500, 'Internal Server Error');
    }
}