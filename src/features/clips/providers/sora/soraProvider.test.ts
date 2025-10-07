import soraProvider from './soraProvider';

describe('SoraProvider', () => {
  it('gets clip info from sora.chatgpt.com url', () => {
    expect(soraProvider.getIdFromUrl('https://sora.chatgpt.com/p/s_68dd8793a2e081919577cf6d096f8319')).toEqual(
      's_68dd8793a2e081919577cf6d096f8319'
    );
  });

  it('gets clip info from sora.chatgpt.com url with query params', () => {
    expect(soraProvider.getIdFromUrl('https://sora.chatgpt.com/p/s_68dd8793a2e081919577cf6d096f8319?ref=feed')).toEqual(
      's_68dd8793a2e081919577cf6d096f8319'
    );
  });

  it('returns undefined for invalid domain', () => {
    expect(soraProvider.getIdFromUrl('https://example.com/p/s_68e42c7f7e40819188360a4ad1825a44')).toBeUndefined();
  });

  it('returns undefined for wrong path', () => {
    expect(soraProvider.getIdFromUrl('https://sora.chatgpt.com/profile/username')).toBeUndefined();
  });

  it('returns undefined for url without s_ prefix', () => {
    expect(soraProvider.getIdFromUrl('https://sora.chatgpt.com/p/68e42c7f7e40819188360a4ad1825a44')).toBeUndefined();
  });

  it('returns undefined for invalid id format', () => {
    expect(soraProvider.getIdFromUrl('https://sora.chatgpt.com/p/s_invalid')).toBeUndefined();
  });
});
