import { DocumentVersion } from "./document-version.interface";

export interface Document {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    creatorId: string;
    updatedAt: Date;
    updateAuthorId: string;
    versions: DocumentVersion[];
}