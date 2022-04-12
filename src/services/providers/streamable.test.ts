import StreamableProvider from './streamable';

describe('StreamableProvider', () => {
  it('gets clip info from streamable.com url', () => {
    expect(StreamableProvider.getInfo('https://streamable.com/vxfb7q')).toEqual({
      id: 'vxfb7q',
      provider: 'streamable',
    });
  });

  it('gets clip info from www.streamable.com url', () => {
    expect(StreamableProvider.getInfo('https://www.streamable.com/vxfb7q')).toEqual({
      id: 'vxfb7q',
      provider: 'streamable',
    });
  });
});
