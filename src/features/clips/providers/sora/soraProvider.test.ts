import soraProvider from './soraProvider';
import soraApi from '../../../../common/apis/soraApi';
import type { RootState } from '../../../../app/store';

jest.mock('../../../../common/apis/soraApi');

const mockSoraApi = soraApi as jest.Mocked<typeof soraApi>;

describe('SoraProvider', () => {
  describe('URL parsing', () => {
    it('gets clip info from sora.chatgpt.com url', () => {
      expect(soraProvider.getIdFromUrl('https://sora.chatgpt.com/p/s_68dd8793a2e081919577cf6d096f8319')).toEqual(
        's_68dd8793a2e081919577cf6d096f8319'
      );
    });

    it('gets clip info from sora.chatgpt.com url with query params', () => {
      expect(soraProvider.getIdFromUrl('https://sora.chatgpt.com/p/s_68dd8793a2e081919577cf6d096f8319?ref=feed')).toEqual(
        's_68dd8793a2e081919577cf6d096f8319'
      );
    });

    it('returns undefined for invalid domain', () => {
      expect(soraProvider.getIdFromUrl('https://example.com/p/s_68e42c7f7e40819188360a4ad1825a44')).toBeUndefined();
    });

    it('returns undefined for wrong path', () => {
      expect(soraProvider.getIdFromUrl('https://sora.chatgpt.com/profile/username')).toBeUndefined();
    });

    it('returns undefined for url without s_ prefix', () => {
      expect(soraProvider.getIdFromUrl('https://sora.chatgpt.com/p/68e42c7f7e40819188360a4ad1825a44')).toBeUndefined();
    });

    it('accepts valid s_ prefix format', () => {
      expect(soraProvider.getIdFromUrl('https://sora.chatgpt.com/p/s_68dd8793')).toEqual('s_68dd8793');
    });
  });

  describe('cameo filtering', () => {
    const mockState = (soraCameoUsernames: string[], soraAcceptNoCameos: boolean): RootState => ({
      settings: {
        soraCameoUsernames,
        soraAcceptNoCameos,
      },
    } as RootState);

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('accepts clip when no filtering is enabled', async () => {
      const state = mockState([], true);
      const result = await soraProvider.shouldAcceptClip('s_test123', state);
      expect(result).toBe(true);
      expect(mockSoraApi.getPost).not.toHaveBeenCalled();
    });

    it('accepts clip with cameos when no filtering is enabled', async () => {
      mockSoraApi.getPost.mockResolvedValue({
        post: {
          id: 's_test123',
          text: 'Test video',
          cameo_profiles: [
            { username: 'testuser1', display_name: 'Test User', user_id: 'user-123', verified: true },
          ],
        },
        profile: { username: 'testcreator' },
      });

      const state = mockState([], true);
      const result = await soraProvider.shouldAcceptClip('s_test123', state);
      expect(result).toBe(true);
    });

    it('rejects clip without cameos when acceptNoCameos is disabled', async () => {
      mockSoraApi.getPost.mockResolvedValue({
        post: {
          id: 's_test123',
          text: 'Test video',
          cameo_profiles: null,
        },
        profile: { username: 'testcreator' },
      });

      const state = mockState([], false);
      const result = await soraProvider.shouldAcceptClip('s_test123', state);
      expect(result).toBe(false);
      expect(mockSoraApi.getPost).toHaveBeenCalledWith('s_test123');
    });

    it('accepts clip with cameos when acceptNoCameos is disabled', async () => {
      mockSoraApi.getPost.mockResolvedValue({
        post: {
          id: 's_test123',
          text: 'Test video',
          cameo_profiles: [
            { username: 'testuser1', display_name: 'Test User', user_id: 'user-123', verified: true },
          ],
        },
        profile: { username: 'testcreator' },
      });

      const state = mockState([], false);
      const result = await soraProvider.shouldAcceptClip('s_test123', state);
      expect(result).toBe(true);
    });

    it('accepts clip with matching cameo username', async () => {
      mockSoraApi.getPost.mockResolvedValue({
        post: {
          id: 's_test123',
          text: 'Test video',
          cameo_profiles: [
            { username: 'alloweduser1', display_name: 'Allowed User', user_id: 'user-123', verified: true },
            { username: 'alloweduser2', display_name: 'Another Allowed', user_id: 'user-456', verified: true },
          ],
        },
        profile: { username: 'testcreator' },
      });

      const state = mockState(['alloweduser1'], true);
      const result = await soraProvider.shouldAcceptClip('s_test123', state);
      expect(result).toBe(true);
    });

    it('accepts clip when at least one cameo matches allowlist', async () => {
      mockSoraApi.getPost.mockResolvedValue({
        post: {
          id: 's_test123',
          text: 'Test video',
          cameo_profiles: [
            { username: 'alloweduser1', display_name: 'Allowed User', user_id: 'user-123', verified: true },
            { username: 'alloweduser2', display_name: 'Another Allowed', user_id: 'user-456', verified: false },
          ],
        },
        profile: { username: 'testcreator' },
      });

      const state = mockState(['alloweduser2', 'nonexistentuser'], true);
      const result = await soraProvider.shouldAcceptClip('s_test123', state);
      expect(result).toBe(true);
    });

    it('rejects clip when no cameos match allowlist', async () => {
      mockSoraApi.getPost.mockResolvedValue({
        post: {
          id: 's_test123',
          text: 'Test video',
          cameo_profiles: [
            { username: 'someuser', display_name: 'Some User', user_id: 'user-123', verified: true },
          ],
        },
        profile: { username: 'testcreator' },
      });

      const state = mockState(['alloweduser1', 'alloweduser2'], true);
      const result = await soraProvider.shouldAcceptClip('s_test123', state);
      expect(result).toBe(false);
    });

    it('performs case-insensitive cameo username matching', async () => {
      mockSoraApi.getPost.mockResolvedValue({
        post: {
          id: 's_test123',
          text: 'Test video',
          cameo_profiles: [
            { username: 'TestUser', display_name: 'Test User', user_id: 'user-123', verified: true },
          ],
        },
        profile: { username: 'testcreator' },
      });

      const state = mockState(['testuser'], true);
      const result = await soraProvider.shouldAcceptClip('s_test123', state);
      expect(result).toBe(true);
    });

    it('accepts clip without cameos when allowlist is set and acceptNoCameos is true', async () => {
      mockSoraApi.getPost.mockResolvedValue({
        post: {
          id: 's_test123',
          text: 'Test video',
          cameo_profiles: null,
        },
        profile: { username: 'testcreator' },
      });

      const state = mockState(['alloweduser1'], true);
      const result = await soraProvider.shouldAcceptClip('s_test123', state);
      expect(result).toBe(true);
    });

    it('combines acceptNoCameos=false and allowlist filters', async () => {
      mockSoraApi.getPost.mockResolvedValue({
        post: {
          id: 's_test123',
          text: 'Test video',
          cameo_profiles: [
            { username: 'alloweduser1', display_name: 'Allowed User', user_id: 'user-123', verified: true },
          ],
        },
        profile: { username: 'testcreator' },
      });

      const state = mockState(['alloweduser1'], false);
      const result = await soraProvider.shouldAcceptClip('s_test123', state);
      expect(result).toBe(true);
    });

    it('rejects when acceptNoCameos is false but allowlist does not match', async () => {
      mockSoraApi.getPost.mockResolvedValue({
        post: {
          id: 's_test123',
          text: 'Test video',
          cameo_profiles: [
            { username: 'someuser', display_name: 'Some User', user_id: 'user-123', verified: true },
          ],
        },
        profile: { username: 'testcreator' },
      });

      const state = mockState(['alloweduser1'], false);
      const result = await soraProvider.shouldAcceptClip('s_test123', state);
      expect(result).toBe(false);
    });

    it('handles empty cameo_profiles array', async () => {
      mockSoraApi.getPost.mockResolvedValue({
        post: {
          id: 's_test123',
          text: 'Test video',
          cameo_profiles: [],
        },
        profile: { username: 'testuser' },
      });

      const state = mockState([], false);
      const result = await soraProvider.shouldAcceptClip('s_test123', state);
      expect(result).toBe(false);
    });

    it('handles API returning undefined', async () => {
      mockSoraApi.getPost.mockResolvedValue(undefined);

      const state = mockState(['alloweduser1'], false);
      const result = await soraProvider.shouldAcceptClip('s_test123', state);
      expect(result).toBe(false);
    });
  });
});
