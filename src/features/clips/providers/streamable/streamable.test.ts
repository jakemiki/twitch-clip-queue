import streamableProvider from './streamableProvider';

describe('StreamableProvider', () => {
  it('gets clip info from streamable.com url', () => {
    expect(streamableProvider.getIdFromUrl('https://streamable.com/vxfb7q')).toEqual('vxfb7q');
  });

  it('gets clip info from www.streamable.com url', () => {
    expect(streamableProvider.getIdFromUrl('https://www.streamable.com/vxfb7q')).toEqual('vxfb7q');
  });
});
