import natural from "natural";
import { PostModel } from "../models/Post.model";

const TfIdf = natural.TfIdf;
export const tfidf = new TfIdf();

export async function initializeTfIdf() {
    const posts = await PostModel.find({}, 'content').lean();
    posts.forEach(p => {
        if (p.content) tfidf.addDocument(String(p.content));
    });
    console.log(`TF-IDF initialized with ${tfidf.documents.length} documents`);
}

export function normalize(vec: Record<string, number>) {
    const mag = Math.sqrt(Object.values(vec).reduce((s, v) => s + v*v, 0)) || 1;
    const out: Record<string, number> = {};
    for (const k in vec) out[k] = vec[k] / mag;
    return out;
}

export function computeVector(text: string) {
    if (!text || !text.trim()) return { unknown: 1 };

    const vector: Record<string, number> = {};

    tfidf.tfidfs(text, (i: number, measure: number, key?: string | Record<string, any>) => {
        if (!key || typeof key !== 'string') return;
        if (measure > 0) vector[key] = measure;
    });

    return normalize(vector);
}

export function cosineSimilarity(a: Record<string, number>, b: Record<string, number>) {
    let sum = 0;
    for (const k in a) {
        if (b[k] !== undefined) sum += a[k] * b[k];
    }
    return sum;
}