export interface AttachmentType {
    url: string;
    type: AttachmentTypes;
    name?: string;
    size?: number;
}

export type AttachmentTypes = 'image' | 'video' | 'audio' | 'file';