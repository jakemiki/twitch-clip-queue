import twitchClipProvider from './twitchClipProvider';

describe('TwitchClipProvider', () => {
  it('gets clip info from www.twitch.tv url', () => {
    expect(
      twitchClipProvider.getIdFromUrl('https://www.twitch.tv/zerkaa/clip/SneakyFineBillItsBoshyTime-JjCNavRWMDXzNTDh')
    ).toEqual('SneakyFineBillItsBoshyTime-JjCNavRWMDXzNTDh');
  });

  it('gets clip info from www.twitch.tv url with query params', () => {
    expect(
      twitchClipProvider.getIdFromUrl(
        'https://www.twitch.tv/zerkaa/clip/SneakyFineBillItsBoshyTime-JjCNavRWMDXzNTDh?filter=clips&range=7d&sort=time'
      )
    ).toEqual('SneakyFineBillItsBoshyTime-JjCNavRWMDXzNTDh');
  });

  it('gets clip info from twitch.tv url', () => {
    expect(
      twitchClipProvider.getIdFromUrl('https://twitch.tv/zerkaa/clip/SneakyFineBillItsBoshyTime-JjCNavRWMDXzNTDh')
    ).toEqual('SneakyFineBillItsBoshyTime-JjCNavRWMDXzNTDh');
  });

  it('gets clip info from m.twitch.tv url', () => {
    expect(
      twitchClipProvider.getIdFromUrl('https://m.twitch.tv/zerkaa/clip/SneakyFineBillItsBoshyTime-JjCNavRWMDXzNTDh')
    ).toEqual('SneakyFineBillItsBoshyTime-JjCNavRWMDXzNTDh');
  });

  it('gets clip info from twitch.tv url with query params', () => {
    expect(
      twitchClipProvider.getIdFromUrl(
        'https://twitch.tv/zerkaa/clip/SneakyFineBillItsBoshyTime-JjCNavRWMDXzNTDh?filter=clips&range=7d&sort=time'
      )
    ).toEqual('SneakyFineBillItsBoshyTime-JjCNavRWMDXzNTDh');
  });

  it('gets clip info from clips.twitch.tv url', () => {
    expect(
      twitchClipProvider.getIdFromUrl('https://clips.twitch.tv/BumblingDiligentPotPraiseIt-5B65rVgbKTmzruYt')
    ).toEqual('BumblingDiligentPotPraiseIt-5B65rVgbKTmzruYt');
  });
});
