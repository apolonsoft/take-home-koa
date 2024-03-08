import  Koa from 'koa';
import Router from 'koa-router';

// Simple in-memory database
const documents: Document[] = [];

// Document model
interface Document {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    creatorId: string;
    updatedAt: Date;
    updateAuthorId: string;
    versions: DocumentVersion[];
}

interface DocumentVersion {
    version: number;
    content: string;
    updatedAt: Date;
    updateAuthorId: string;
}

// Initialize Koa app and router
const app = new Koa();
const router = new Router();

// Editor API routes
router.post('/documents', async (ctx: Koa.Context) => {
    const { title, content, creatorId } = ctx.body as { title: string, content: string, creatorId: string };

    const document: Document = {
        id: generateId(),
        title,
        content,
        createdAt: new Date(),
        creatorId,
        updatedAt: new Date(),
        updateAuthorId: creatorId,
        versions: [{ version: 1, content, updatedAt: new Date(), updateAuthorId: creatorId }],
    };

    documents.push(document);

    ctx.body = document;
});

router.put('/documents/:id', async (ctx: Koa.Context) => {
    const { id } = ctx.params;
    const { content, updateAuthorId } = ctx.body as { content: string, updateAuthorId: string };

    const document = documents.find((doc) => doc.id === id);

    if (!document) {
        ctx.status = 404;
        ctx.body = { error: 'Document not found' };
        return;
    }

    document.content = content;
    document.updatedAt = new Date();
    document.updateAuthorId = updateAuthorId;

    const version: DocumentVersion = {
        version: document.versions.length + 1,
        content,
        updatedAt: new Date(),
        updateAuthorId,
    };

    document.versions.push(version);

    ctx.body = document;
});

router.post('/documents/:id/publish', async (ctx: Koa.Context) => {
    const { id } = ctx.params;

    const document = documents.find((doc) => doc.id === id);

    if (!document) {
        ctx.status = 404;
        ctx.body = { error: 'Document not found' };
        return;
    }

    const latestVersion = document.versions[document.versions.length - 1];

    document.content = latestVersion.content;
    document.updatedAt = latestVersion.updatedAt;
    document.updateAuthorId = latestVersion.updateAuthorId;

    ctx.body = document;
});

router.get('/documents/:id/versions', async (ctx: Koa.Context) => {
    const { id } = ctx.params;

    const document = documents.find((doc) => doc.id === id);

    if (!document) {
        ctx.status = 404;
        ctx.body = { error: 'Document not found' };
        return;
    }

    ctx.body = document.versions;
});

// Content Serving API routes
router.get('/published-documents', async (ctx: Koa.Context) => {
    const publishedDocuments = documents.filter((doc) => doc.versions.length > 0);

    ctx.body = publishedDocuments;
});

router.get('/published-documents/:id', async (ctx: Koa.Context) => {
    const { id } = ctx.params;

    const document = documents.find((doc) => doc.id === id && doc.versions.length > 0);

    if (!document) {
        ctx.status = 404;
        ctx.body = { error: 'Published document not found' };
        return;
    }

    const latestVersion = document.versions[document.versions.length - 1];

    ctx.body = {
        id: document.id,
        title: document.title,
        content: latestVersion.content,
        updatedAt: latestVersion.updatedAt,
        updateAuthorId: latestVersion.updateAuthorId,
    };
});

// Generate a unique ID for documents
function generateId(): string {
    return Math.random().toString(36).substr(2, 9);
}

// Use the router middleware
app.use(router.routes()).use(router.allowedMethods());

// Start the server
app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});