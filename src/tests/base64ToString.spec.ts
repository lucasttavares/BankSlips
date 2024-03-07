import { base64ToString } from '../utils/base64ToString';

describe('base64ToString', () => {
  test('should decode base64 string correctly', () => {
    const base64String = 'VGhpcyBpcyBhIHRlc3QgYmFzZTY0IHN0cmluZw==';
    const expectedOutput = 'This is a test base64 string';
    expect(base64ToString(base64String)).toEqual(expectedOutput);
  });
});
