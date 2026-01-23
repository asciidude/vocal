import { json, type RequestHandler } from "@sveltejs/kit";
import { isValidObjectId } from "mongoose";
import { PostModel } from "src/lib/models/Post.model";
import { ReplyModel } from "src/lib/models/Reply.model";
import { UserModel } from "src/lib/models/User.model";
import fs from 'node:fs';
import path from 'node:path';
import type { AttachmentType } from "src/lib/types/Attachment.type";
import { computeDocumentVector, tfidf } from "src/lib/utils/TF-IDF.util";

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
        let vector: Record<string, number> = {};

        if (postType === 'post') {
            tfidf.addDocument(content);
            vector = computeDocumentVector(content);
            post = await PostModel.create({ author: user._id, content, attachments: [], postVectors: vector });
        } else if (postType === 'reply') {
            const replyParent = String(formData.get('replyParent') || '');
            if (!replyParent || !isValidObjectId(replyParent)) {
                return json({ success: false, message: 'Reply parent is missing or invalid' }, { status: 422 });
            }
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

        if (postType === 'post') {
            const updatedVector = { ...(userDoc.userInterestVectors || {}) };
            for (const [token, weight] of Object.entries(vector)) {
                updatedVector[token] = (updatedVector[token] || 0) + weight;
            }

            const mag = Math.sqrt(Object.values(updatedVector).reduce((s, v) => s + v * v, 0)) || 1;
            for (const k in updatedVector) updatedVector[k] = updatedVector[k] / mag;

            userDoc.userInterestVectors = updatedVector;
            await userDoc.save();
        }

        return json({ success: true, message: 'Success', user, post });
    } catch (err) {
        console.error(err);
        return json({ success: false, message: 'An error occured' }, { status: 500 });
    }
};
