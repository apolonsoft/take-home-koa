import { Document } from "./document.interface";

describe('Document', () => {
    it('should have the correct properties', () => {
      const document: Document = {
        id: '1',
        title: 'Test Document',
        content: 'Lorem ipsum dolor sit amet',
        createdAt: new Date(),
        creatorId: 'user1',
        updatedAt: new Date(),
        updateAuthorId: 'user2',
        versions: []
      };
  
      expect(document.id).toBe('1');
      expect(document.title).toBe('Test Document');
      expect(document.content).toBe('Lorem ipsum dolor sit amet');
      expect(document.createdAt).toBeInstanceOf(Date);
      expect(document.creatorId).toBe('user1');
      expect(document.updatedAt).toBeInstanceOf(Date);
      expect(document.updateAuthorId).toBe('user2');
      expect(document.versions).toEqual([]);
    });
  });