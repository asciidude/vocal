import { json, type RequestHandler } from "@sveltejs/kit";
import fs from "node:fs";
import path from "node:path";
import { PostModel } from "src/lib/models/Post.model";
import { ReplyModel } from "src/lib/models/Reply.model";
import { UserModel } from "src/lib/models/User.model";
import type { AttachmentType } from "src/lib/types/Attachment.type";

export const config = {
	csrf: false
};

export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        const user = typeof locals.user === 'string' ? JSON.parse(locals.user) : locals.user;
        if (!user) return json({ success: false, message: 'You are not authenticated' }, { status: 401 });

        const userDoc = await UserModel.findById(user._id);
        if (!userDoc) return json({ success: false, message: 'User not found' }, { status: 401 });

        const formData = await request.formData();
        const postType = String(formData.get('postType') || '').trim();
        const content = String(formData.get('content') || '').trim();
        if (!content) return json({ success: false, message: 'Post content is missing' }, { status: 422 });

        const attachments = formData.getAll('attachments') as File[];
        const attachmentsLimited = attachments.filter(f => f.name).slice(0, 10);

        let post;
        if (postType === 'post') {
            post = await PostModel.create({ author: user._id, content, attachments: [] });
        } else if (postType === 'reply') {
            const replyParent = String(formData.get('replyParent') || '');
            if (!replyParent) return json({ success: false, message: 'Reply parent is missing' }, { status: 422 });
            post = await ReplyModel.create({ parent_post: replyParent, author: user._id, content, attachments: [] });
        } else {
            return json({ success: false, message: 'Invalid postType' }, { status: 400 });
        }

        const linkedFiles: AttachmentType[] = [];
        if (attachmentsLimited.length > 0) {
            const uploadDir = path.join('static', 'posts', post._id.toString(), 'uploads');
            fs.mkdirSync(uploadDir, { recursive: true });

            for (const file of attachmentsLimited) {
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
                    size: String(file.size)
                });
            }

            post.attachments = linkedFiles;
            await post.save();
        }

        return json({ success: true, message: 'Success', user, post });
    } catch (err: any) {
        console.error(err);
        return json({ success: false, message: err.message || 'An error occurred' }, { status: 500 });
    }
};
