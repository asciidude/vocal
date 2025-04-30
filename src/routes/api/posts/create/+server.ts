import { error, json, type RequestHandler } from "@sveltejs/kit";
import { isValidObjectId } from "mongoose";
import { PostModel } from "src/lib/models/Post.model";
import { ReplyModel } from "src/lib/models/Reply.model";
import type { UserType } from "src/lib/types/User.types";

export const POST: RequestHandler = async({ request, locals }) => {
    const user = typeof locals.user === 'string' ? JSON.parse(locals.user) : locals.user;

    if(!user) {
        throw error(401, 'Unauthorized');
    }

    try {
        const formData = await request.formData();
        const postType = formData.get('postType');
        const content = formData.get('content');

        if(!content) {
            throw error(422, 'Unprocessable Content');
        }

        if(postType === 'reply') {
            const replyParent = formData.get('replyParent');

            if(!replyParent || !isValidObjectId(replyParent)) {
                throw error(422, 'Unprocessable Content');
            }
        
            const post = await ReplyModel.create({
                parent_post: replyParent,
                author: (user as UserType)._id,
                content: content,
                attachments: [] // later
            });

            return json({
                status: 200,
                message: 'Success',
                user, post
            });
        } else if(postType === 'reply') {
            const post = await PostModel.create({
                author: user._id,
                content: content,
                attachments: [] // later
            });
    
            return json({
                status: 200,
                message: 'Success',
                user, post
            });
        } else {
            throw error(401, 'Invalid Request')
        }
    } catch(err) {
        console.log(err);
        throw error(500, 'Internal Server Error');
    }
}