import { json, type RequestHandler } from "@sveltejs/kit";
import { LikeModel } from '$lib/models/Like.model';
import { PostModel } from "src/lib/models/Post.model";
import { UserModel } from "src/lib/models/User.model";
import { ReplyModel } from "src/lib/models/Reply.model";
import type { PostType } from "src/lib/types/Post.type";

export const POST: RequestHandler = async ({ params, request, locals }) => {
    try {
        const user =
            typeof locals.user === 'string'
                ? JSON.parse(locals.user)
                : locals.user;

        if (!user) {
            return json(
                { status: 401, message: 'Not authenticated' },
                { status: 401 }
            );
        }

        const postId = params.slug;

        if (!postId) {
            return json(
                { status: 422, message: 'Post not found' },
                { status: 422 }
            );
        }

        const formData = await request.formData();
        const postType = String(formData.get('postType') || '');

        if (postType !== 'post' && postType !== 'reply') {
            return json(
                { status: 400, message: 'Invalid postType' },
                { status: 400 }
            );
        }

        const [userDoc, post] = await Promise.all([
            UserModel.findById(user._id),
            postType === 'post'
                ? PostModel.findById(postId)
                : ReplyModel.findById(postId)
        ]);

        if (!userDoc || !post) {
            return json(
                { status: 404, message: 'Post not found' },
                { status: 404 }
            );
        }

        const existingLike = await LikeModel.exists({
            parent_post: postId,
            author: user._id
        });

        let newlyLiked = false;

        if (!existingLike) {
            if (postType === 'post') {
                const updatedVector = { ...(userDoc.userInterestVectors || {}) };

                for (const [token, weight] of Object.entries(
                    (post as PostType).postVectors || {}
                )) {
                    updatedVector[token] =
                        (updatedVector[token] || 0) + weight;
                }

                const mag =
                    Math.sqrt(
                        Object.values(updatedVector).reduce(
                            (s, v) => s + v * v,
                            0
                        )
                    ) || 1;

                for (const k in updatedVector) {
                    updatedVector[k] /= mag;
                }

                userDoc.userInterestVectors = updatedVector;
                await userDoc.save();
            }

            await LikeModel.create({
                parent_post: postId,
                author: user._id
            });

            newlyLiked = true;
        } else {
            if (postType === 'post') {
                const updatedVector = { ...(userDoc.userInterestVectors || {}) };

                for (const [token, weight] of Object.entries(
                    (post as PostType).postVectors || {}
                )) {
                    if (updatedVector[token] !== undefined) {
                        updatedVector[token] -= weight;

                        if (updatedVector[token] < 0.001) {
                            delete updatedVector[token];
                        }
                    }
                }

                const mag =
                    Math.sqrt(
                        Object.values(updatedVector).reduce(
                            (s, v) => s + v * v,
                            0
                        )
                    ) || 1;

                for (const k in updatedVector) {
                    updatedVector[k] /= mag;
                }

                userDoc.userInterestVectors = updatedVector;
                await userDoc.save();
            }

            await LikeModel.deleteOne({
                parent_post: postId,
                author: user._id
            });

            newlyLiked = false;
        }

        const likeCount = await LikeModel.countDocuments({
            parent_post: postId
        });

        return json({
            status: 200,
            newlyLiked,
            likeCount,
            message: 'Success'
        });
    } catch (err) {
        console.error(err);

        return json(
            { status: 500, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};