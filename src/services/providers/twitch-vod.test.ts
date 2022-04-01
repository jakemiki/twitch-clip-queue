import TwitchVodProvider from './twitch-vod';

describe('TwitchVodProvider', () => {
  it('does not get clip info from www.twitch.tv/videos url without timestamp', () => {
    expect(TwitchVodProvider.getInfo('https://www.twitch.tv/videos/1409747385')).toEqual(undefined);
  });

  it('does not get clip info from www.twitch.tv/video url without timestamp', () => {
    expect(TwitchVodProvider.getInfo('https://www.twitch.tv/video/1409747385')).toEqual(undefined);
  });

  it('gets clip info from www.twitch.tv/videos url with timestamp', () => {
    expect(TwitchVodProvider.getInfo('https://www.twitch.tv/videos/1409747385?t=01h36m38s')).toEqual({
      id: '1409747385',
      provider: 'twitch-vod',
      startTime: '01h36m38s',
    });
  });

  it('gets clip info from www.twitch.tv/video url with timestamp', () => {
    expect(TwitchVodProvider.getInfo('https://www.twitch.tv/video/1409747385?t=01h36m38s')).toEqual({
      id: '1409747385',
      provider: 'twitch-vod',
      startTime: '01h36m38s',
    });
  });

  it('does not get clip info from twitch.tv/videos url without timestamp', () => {
    expect(TwitchVodProvider.getInfo('https://www.twitch.tv/videos/1409747385')).toEqual(undefined);
  });

  it('does not get clip info from twitch.tv/video url without timestamp', () => {
    expect(TwitchVodProvider.getInfo('https://www.twitch.tv/video/1409747385')).toEqual(undefined);
  });

  it('gets clip info from twitch.tv/videos url with timestamp', () => {
    expect(TwitchVodProvider.getInfo('https://www.twitch.tv/videos/1409747385?t=01h36m38s')).toEqual({
      id: '1409747385',
      provider: 'twitch-vod',
      startTime: '01h36m38s',
    });
  });

  it('gets clip info from twitch.tv/video url with timestamp', () => {
    expect(TwitchVodProvider.getInfo('https://www.twitch.tv/video/1409747385?t=01h36m38s')).toEqual({
      id: '1409747385',
      provider: 'twitch-vod',
      startTime: '01h36m38s',
    });
  });
});
