import afreecaClipProvider from './afreecaClipProvider';

describe('afreecaClipProvider', () => {
  it('gets clip info from vod.afreecatv.com url', () => {
    expect(afreecaClipProvider.getIdFromUrl('https://vod.afreecatv.com/player/92015748')).toEqual('92015748');
  });
});
