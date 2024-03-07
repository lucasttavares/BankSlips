import { base64ToString } from '../utils/base64ToString';

describe('Base64ToString', () => {
  test('Converter', () => {
    const string = 'dGVzdA==';

    expect(base64ToString(string)).toEqual('test');
  });
});
