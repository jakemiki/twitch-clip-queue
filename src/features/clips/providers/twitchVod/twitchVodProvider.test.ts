import twitchVodProvider from './twitchVodProvider';

describe('twitchVodProvider', () => {
  it('does not get clip info from www.twitch.tv/videos url without timestamp', () => {
    expect(twitchVodProvider.getIdFromUrl('https://www.twitch.tv/videos/1409747385')).toEqual(undefined);
  });

  it('does not get clip info from www.twitch.tv/video url without timestamp', () => {
    expect(twitchVodProvider.getIdFromUrl('https://www.twitch.tv/video/1409747385')).toEqual(undefined);
  });

  it('gets clip info from www.twitch.tv/videos url with timestamp', () => {
    expect(twitchVodProvider.getIdFromUrl('https://www.twitch.tv/videos/1409747385?t=01h36m38s')).toEqual(
      '1409747385;01h36m38s'
    );
  });

  it('gets clip info from www.twitch.tv/video url with timestamp', () => {
    expect(twitchVodProvider.getIdFromUrl('https://www.twitch.tv/video/1409747385?t=01h36m38s')).toEqual(
      '1409747385;01h36m38s'
    );
  });

  it('does not get clip info from twitch.tv/videos url without timestamp', () => {
    expect(twitchVodProvider.getIdFromUrl('https://www.twitch.tv/videos/1409747385')).toEqual(undefined);
  });

  it('does not get clip info from twitch.tv/video url without timestamp', () => {
    expect(twitchVodProvider.getIdFromUrl('https://www.twitch.tv/video/1409747385')).toEqual(undefined);
  });

  it('gets clip info from twitch.tv/videos url with timestamp', () => {
    expect(twitchVodProvider.getIdFromUrl('https://www.twitch.tv/videos/1409747385?t=01h36m38s')).toEqual(
      '1409747385;01h36m38s'
    );
  });

  it('gets clip info from twitch.tv/video url with timestamp', () => {
    expect(twitchVodProvider.getIdFromUrl('https://www.twitch.tv/video/1409747385?t=01h36m38s')).toEqual(
      '1409747385;01h36m38s'
    );
  });
});
