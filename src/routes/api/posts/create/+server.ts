import { error, json, type RequestHandler } from "@sveltejs/kit";
import { isValidObjectId } from "mongoose";
import { PostModel } from "src/lib/models/Post.model";
import { ReplyModel } from "src/lib/models/Reply.model";
import type { UserType } from "src/lib/types/User.types";
import fs from 'node:fs';
import path from 'node:path';
import type { AttachmentType } from "src/lib/types/Attachment.type";

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

        const attachments = formData.getAll('attachments') as File[];
        const attachmentsLimited = attachments
            .filter(file => file.name)
            .slice(0,10);

        let post;

        if(postType === 'reply') {
            const replyParent = formData.get('replyParent');

            if(!replyParent || !isValidObjectId(replyParent)) {
                throw error(422, 'Unprocessable Content');
            }
        
            post = await ReplyModel.create({
                parent_post: replyParent,
                author: (user as UserType)._id,
                content: content,
                attachments: [] // later
            });
        } else if(postType === 'post') {
            post = await PostModel.create({
                author: user._id,
                content: content,
                attachments: []
            });
        } else {
            throw error(401, 'Invalid Request')
        }

        let linkedFiles: AttachmentType[] = [];

        if(attachmentsLimited.length > 0) {
            const uploadDir = path.join('static', 'posts', post._id.toString(), 'uploads');
            fs.mkdirSync(uploadDir, { recursive: true });

            for (const [i, file] of attachmentsLimited.entries()) {
                if (!file.name) continue;

                const parts = file.name.split('.');
                const ext = parts.length > 1 ? '.' + parts.pop() : '';
                const baseName = parts.join('.').replace(/[^a-zA-Z0-9_-]/g, "_");
                const safeName = baseName + ext;

                const filePath = path.join(uploadDir, safeName);

                const buffer = Buffer.from(await file.arrayBuffer());

                fs.writeFileSync(filePath, buffer);
                linkedFiles.push({
                    url: `/posts/${post._id}/uploads/${safeName}`,
                    type: 'image',
                    name: safeName,
                    size: file.size
                });
            }
        }

        if(linkedFiles.length > 0) {
            post.attachments = linkedFiles;
            await post.save();
        }

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