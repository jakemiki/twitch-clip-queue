import TwitchClipProvider from './twitch-clip';

describe('TwitchClipProvider', () => {
  it('gets clip info from www.twitch.tv url', () => {
    expect(
      TwitchClipProvider.getInfo('https://www.twitch.tv/zerkaa/clip/SneakyFineBillItsBoshyTime-JjCNavRWMDXzNTDh')
    ).toEqual({ id: 'SneakyFineBillItsBoshyTime-JjCNavRWMDXzNTDh', provider: 'twitch-clip' });
  });

  it('gets clip info from www.twitch.tv url with query params', () => {
    expect(
      TwitchClipProvider.getInfo(
        'https://www.twitch.tv/zerkaa/clip/SneakyFineBillItsBoshyTime-JjCNavRWMDXzNTDh?filter=clips&range=7d&sort=time'
      )
    ).toEqual({ id: 'SneakyFineBillItsBoshyTime-JjCNavRWMDXzNTDh', provider: 'twitch-clip' });
  });

  it('gets clip info from twitch.tv url', () => {
    expect(
      TwitchClipProvider.getInfo('https://twitch.tv/zerkaa/clip/SneakyFineBillItsBoshyTime-JjCNavRWMDXzNTDh')
    ).toEqual({ id: 'SneakyFineBillItsBoshyTime-JjCNavRWMDXzNTDh', provider: 'twitch-clip' });
  });

  it('gets clip info from twitch.tv url with query params', () => {
    expect(
      TwitchClipProvider.getInfo(
        'https://twitch.tv/zerkaa/clip/SneakyFineBillItsBoshyTime-JjCNavRWMDXzNTDh?filter=clips&range=7d&sort=time'
      )
    ).toEqual({ id: 'SneakyFineBillItsBoshyTime-JjCNavRWMDXzNTDh', provider: 'twitch-clip' });
  });

  it('gets clip info from clips.twitch.tv url', () => {
    expect(TwitchClipProvider.getInfo('https://clips.twitch.tv/BumblingDiligentPotPraiseIt-5B65rVgbKTmzruYt')).toEqual({
      id: 'BumblingDiligentPotPraiseIt-5B65rVgbKTmzruYt',
      provider: 'twitch-clip',
    });
  });
});
