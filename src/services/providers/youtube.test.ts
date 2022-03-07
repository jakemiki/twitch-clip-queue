import YoutubeProvider from './youtube';

describe('YoutubeProvider', () => {
  it('gets clip info from youtube.com url', () => {
    expect(YoutubeProvider.getInfo('https://youtube.com/watch?v=1TewCPi92ro')).toEqual({
      id: '1TewCPi92ro',
      provider: 'youtube',
    });
  });

  it('gets clip info from youtube.com url', () => {
    expect(YoutubeProvider.getInfo('https://youtube.com/watch?v=1TewCPi92ro&t=30')).toEqual({
      id: '1TewCPi92ro',
      provider: 'youtube',
      startTime: '30',
    });
  });

  it('gets clip info from www.youtube.com url', () => {
    expect(YoutubeProvider.getInfo('https://www.youtube.com/watch?v=1TewCPi92ro')).toEqual({
      id: '1TewCPi92ro',
      provider: 'youtube',
    });
  });

  it('gets clip info from www.youtube.com url', () => {
    expect(YoutubeProvider.getInfo('https://www.youtube.com/watch?v=1TewCPi92ro&t=30')).toEqual({
      id: '1TewCPi92ro',
      provider: 'youtube',
      startTime: '30',
    });
  });

  it('gets clip info from youtu.be url', () => {
    expect(YoutubeProvider.getInfo('https://youtu.be/1TewCPi92ro')).toEqual({
      id: '1TewCPi92ro',
      provider: 'youtube',
    });
  });

  it('gets clip info from youtu.be url', () => {
    expect(YoutubeProvider.getInfo('https://youtu.be/1TewCPi92ro?t=30')).toEqual({
      id: '1TewCPi92ro',
      provider: 'youtube',
      startTime: '30',
    });
  });

  it('gets clip info from youtube.com/shorts url', () => {
    expect(YoutubeProvider.getInfo('https://youtube.com/shorts/1TewCPi92ro')).toEqual({
      id: '1TewCPi92ro',
      provider: 'youtube',
    });
  });

  it('gets clip info from www.youtube.com/shorts url', () => {
    expect(YoutubeProvider.getInfo('https://www.youtube.com/shorts/1TewCPi92ro')).toEqual({
      id: '1TewCPi92ro',
      provider: 'youtube',
    });
  });
});
