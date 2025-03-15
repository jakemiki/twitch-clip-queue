import kickClipProvider from './kickClipprovider';

describe('KickClipProvider', () => {
  it('gets clip info from www.Kick.com url', () => {
    expect(kickClipProvider.getIdFromUrl('https://kick.com/silent/clips/clip_01JNVX1HA6QA593VKT6WEE5ZQE')).toEqual(
      'clip_01JNVX1HA6QA593VKT6WEE5ZQE'
    );
  });
});
