import Koa from 'koa';
import Router from 'koa-router';
import { Document } from './interfaces/document.interface';
import { DocumentVersion } from './interfaces/document-version.interface';
import { bodyParser } from '@koa/bodyparser';
import { generateId } from './functions/generate_id.function';

// Simple in-memory database
const documents: Document[] = [];

// Initialize Koa app and router
export const app = new Koa();
const router = new Router();

app.use(bodyParser())

// Editor API routes
router.post('/documents', async (ctx: Koa.Context) => {
    const { title, content, creatorId } = ctx.request.body as { title: string, content: string, creatorId: string };

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
    const { content, updateAuthorId } = ctx.request.body as { content: string, updateAuthorId: string };

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



// Use the router middleware
app.use(router.routes()).use(router.allowedMethods());


// Start the server
app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});
