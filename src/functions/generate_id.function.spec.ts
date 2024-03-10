import { generateId } from "./generate_id.function";

describe('generateId', () => {
    it('should generate a unique ID', () => {
      const id1 = generateId();
      const id2 = generateId();
  
      expect(id1).not.toBe(id2);
    });
  
    it('should generate a string with length 9', () => {
      const id = generateId();
  
      expect(id.length).toBe(9);
    });
  
    it('should generate a string consisting of alphanumeric characters', () => {
      const id = generateId();
      const alphanumericRegex = /^[a-z0-9]+$/i;
  
      expect(alphanumericRegex.test(id)).toBe(true);
    });
  });