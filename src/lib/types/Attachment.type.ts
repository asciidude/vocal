export interface AttachmentType {
    url: string;
    type: AttachmentTypes;
    name?: string;
    size?: string;
}

export type AttachmentTypes = 'image' | 'video' | 'audio' | 'file';