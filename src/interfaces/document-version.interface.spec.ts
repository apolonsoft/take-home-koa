import { DocumentVersion } from "./document-version.interface";

describe('DocumentVersion', () => {
  it('should create a new instance', () => {
    const version: DocumentVersion = {
      version: 1,
      content: 'Lorem ipsum',
      updatedAt: new Date(),
      updateAuthorId: '12345',
    };

    expect(version).toBeDefined();
    expect(version.version).toBe(1);
    expect(version.content).toBe('Lorem ipsum');
    expect(version.updatedAt).toBeInstanceOf(Date);
    expect(version.updateAuthorId).toBe('12345');
  });
});