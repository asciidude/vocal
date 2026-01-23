import { json, type RequestHandler } from "@sveltejs/kit";
import fs from 'fs';
import path from 'path';
import { PostModel } from "src/lib/models/Post.model";
import { ReplyModel } from "src/lib/models/Reply.model";
import type { AttachmentType } from "src/lib/types/Attachment.type";

export const POST: RequestHandler = async ({ params, request, locals }) => {
    try {
        const user = typeof locals.user === 'string' ? JSON.parse(locals.user) : locals.user;
        if (!user) {
            return json({ status: 401, message: 'You are not authenticated' }, { status: 401 });
        }

        const formData = await request.formData();
        const posterId = String(formData.get('posterId') || '');
        const postId = params.slug;

        if (!postId) {
            return json({ status: 422, message: 'Post not found' }, { status: 422 });
        }

        if (user._id !== posterId) {
            return json({ status: 401, message: 'You are not authorized to edit this post' }, { status: 401 });
        }

        const postType = String(formData.get('postType') || '');
        const content = String(formData.get('content') || '').trim();

        if (!content) {
            return json({ status: 422, message: 'Post content cannot be empty' }, { status: 422 });
        }

        let post;
        if (postType === 'reply') {
            post = await ReplyModel.findById(postId);
        } else if (postType === 'post') {
            post = await PostModel.findById(postId);
        } else {
            return json({ status: 400, message: 'Bad request: invalid postType' }, { status: 400 });
        }

        if (!post) {
            return json({ status: 404, message: 'Post not found' }, { status: 404 });
        }

        post.content = content;

        // handle attachments if any
        const attachments = formData.getAll('attachments') as File[];
        if (attachments.length > 0) {
            const uploadDir = path.join('static', 'posts', post._id.toString(), 'uploads');
            fs.mkdirSync(uploadDir, { recursive: true });

            const newAttachments: AttachmentType[] = [];

            for (const file of attachments.slice(0, 10)) {
                if (!file.name) continue;

                const parts = file.name.split('.');
                const ext = parts.length > 1 ? '.' + parts.pop() : '';
                const baseName = parts.join('.').replace(/[^a-zA-Z0-9_-]/g, "_");
                const safeName = baseName + ext;

                const filePath = path.join(uploadDir, safeName);
                const buffer = Buffer.from(await file.arrayBuffer());
                fs.writeFileSync(filePath, buffer);

                newAttachments.push({
                    url: `/posts/${post._id}/uploads/${safeName}`,
                    type: 'image',
                    name: safeName,
                    size: String(file.size)
                });
            }

            post.attachments = newAttachments;
        }

        await post.save();

        return json({ status: 200, message: 'Post updated successfully', post });
    } catch (err) {
        console.error(err);
        return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
    }
};
