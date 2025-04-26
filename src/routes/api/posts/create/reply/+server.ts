import { error, json, type RequestHandler } from "@sveltejs/kit";
import { isValidObjectId } from "mongoose";
import { ReplyModel } from "src/lib/models/Reply.model";
import type { UserType } from "src/lib/types/User.types";

export const POST: RequestHandler = async({ request, locals }) => {
    const user = locals.user;

    if(!user) {
        throw error(401, 'Unauthorized');
    }

    try {
        const formData = await request.formData();
        const content = formData.get('content');
        const replyParent = formData.get('replyParent');

        if(
            !content || !replyParent
            || isValidObjectId(replyParent)
        ) {
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
    } catch(err) {
        console.log(err);
        throw error(500, 'Internal Server Error');
    }
}