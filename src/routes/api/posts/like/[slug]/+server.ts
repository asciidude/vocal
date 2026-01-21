import { error, json, type RequestHandler } from "@sveltejs/kit";
import { LikeModel } from '$lib/models/Like.model';
import { PostModel } from "src/lib/models/Post.model";
import { UserModel } from "src/lib/models/User.model";
import { ReplyModel } from "src/lib/models/Reply.model";
import type { PostType } from "src/lib/types/Post.type";

export const POST: RequestHandler = async ({ params, request, locals }) => {
    const user = typeof locals.user === 'string' ? JSON.parse(locals.user) : locals.user;
    console.log(user);

    const postId = params.slug;

    const formData = await request.formData();
    const postType = formData.get('postType');

    const [userDoc, post] = await Promise.all([
        UserModel.findById(user._id),
        postType === 'post' ? PostModel.findById(postId) : ReplyModel.findById(postId)
    ]);

    if (!postId || !post || !userDoc) {
        throw error(422, 'Post not found');
    }

    if (!user) {
        throw error(401, 'You are not authenticated');
    }

    try {
        const like = await LikeModel.exists({ parent_post: postId, author: user._id });

        if (!like) {
            if (postType === 'post') {
                const updatedVector = { ...(userDoc.userInterestVectors || {}) };

                for (const [token, weight] of Object.entries((post as PostType).postVectors || {})) {
                    updatedVector[token] = (updatedVector[token] || 0) + weight;
                }

                const mag = Math.sqrt(Object.values(updatedVector).reduce((s, v) => s + v * v, 0)) || 1;
                for (const k in updatedVector) {
                    updatedVector[k] = updatedVector[k] / mag;
                }

                userDoc.userInterestVectors = updatedVector;
                await userDoc.save();
            }

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
            if (postType === 'post') {
                const updatedVector = { ...(userDoc.userInterestVectors || {}) };

                for (const [token, weight] of Object.entries(post.postVectors || {})) {
                    if (updatedVector[token] !== undefined) {
                        updatedVector[token] = Math.max(0, updatedVector[token] - weight);
                        if (updatedVector[token] < 0.001) {
                            delete updatedVector[token];
                        }
                    }
                }

                const mag = Math.sqrt(Object.values(updatedVector).reduce((s, v) => s + v * v, 0)) || 1;
                for (const k in updatedVector) {
                    updatedVector[k] = updatedVector[k] / mag;
                }

                userDoc.userInterestVectors = updatedVector;
                await userDoc.save();
            }

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
    } catch (err) {
        console.log(err);
        throw error(500, 'Internal Server Error');
    }
}