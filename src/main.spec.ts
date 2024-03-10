import supertest from 'supertest';
import {app} from './main';
import { Document } from './interfaces/document.interface';

const server = app.listen();


describe('POST /documents', () => {
    const request = supertest(server);
    it('should create a new document', async () => {
        const response = await request
            .post('/documents')
            .send({ title: 'Test Document', content: 'Test Content', creatorId: 'test-user' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('Test Document');
        expect(response.body.content).toBe('Test Content');
        expect(response.body.creatorId).toBe('test-user');
        expect(response.body.versions).toHaveLength(1);
        expect(response.body.versions[0].version).toBe(1);
        expect(response.body.versions[0].content).toBe('Test Content');
        expect(response.body.versions[0].updateAuthorId).toBe('test-user');
        
    });
});

describe('PUT /documents/:id', () => {
    it('should return 404 if the document is not found', async () => {
      const response =  await supertest(server)
        .put('/documents/2')
        .send({ content: 'Updated content', updateAuthorId: 'user2' });
      expect(response.status).toBe(404);

      expect(response.body.error).toBe('Document not found');
    });
  });