import youtubeProvider from './youtubeProvider';

describe('youtubeProvider', () => {
  it('gets clip info from youtube.com url', () => {
    expect(youtubeProvider.getIdFromUrl('https://youtube.com/watch?v=1TewCPi92ro')).toEqual('1TewCPi92ro');
  });

  it('gets clip info from youtube.com url', () => {
    expect(youtubeProvider.getIdFromUrl('https://youtube.com/watch?v=1TewCPi92ro&t=30')).toEqual('1TewCPi92ro;30');
  });

  it('gets clip info from www.youtube.com url', () => {
    expect(youtubeProvider.getIdFromUrl('https://www.youtube.com/watch?v=1TewCPi92ro')).toEqual('1TewCPi92ro');
  });

  it('gets clip info from www.youtube.com url', () => {
    expect(youtubeProvider.getIdFromUrl('https://www.youtube.com/watch?v=1TewCPi92ro&t=30')).toEqual('1TewCPi92ro;30');
  });

  it('gets clip info from youtu.be url', () => {
    expect(youtubeProvider.getIdFromUrl('https://youtu.be/1TewCPi92ro')).toEqual('1TewCPi92ro');
  });

  it('gets clip info from youtu.be url', () => {
    expect(youtubeProvider.getIdFromUrl('https://youtu.be/1TewCPi92ro?t=30')).toEqual('1TewCPi92ro;30');
  });

  it('gets clip info from youtube.com/shorts url', () => {
    expect(youtubeProvider.getIdFromUrl('https://youtube.com/shorts/1TewCPi92ro')).toEqual('1TewCPi92ro');
  });

  it('gets clip info from www.youtube.com/shorts url', () => {
    expect(youtubeProvider.getIdFromUrl('https://www.youtube.com/shorts/1TewCPi92ro')).toEqual('1TewCPi92ro');
  });
});
