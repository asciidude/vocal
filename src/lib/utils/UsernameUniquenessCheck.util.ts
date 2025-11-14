import { UserModel } from "../models/User.model";

function generateRandomSuffix(length = 4) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function getUniqueUsername(base: string) {
    const existing: = await UserModel.find({ username: new RegExp(`^${base}`) }).select('username');
    if(existing?._id === excludeId) return;
    
    const taken = new Set(existing.map(u => u.username));

    if (!taken.has(base)) return base;

    for (let i = 0; i < 10; i++) {
        const candidate = `${base}_${generateRandomSuffix()}`;
        if (!taken.has(candidate)) return candidate;
    }

    return getUniqueUsername(base);
}