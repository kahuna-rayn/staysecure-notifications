import {
  buildLearnLessonUrl,
  buildLearnLoginUrl,
  buildLearnPathPrefix,
  RESERVED_LEARN_APP_PATH_PREFIXES,
} from '../learnUrls';

describe('learnUrls', () => {
  describe('buildLearnLoginUrl', () => {
    it('adds tenant segment in production', () => {
      expect(
        buildLearnLoginUrl({
          appBaseUrl: 'https://staysecure-learn.raynsecure.com',
          clientId: 'nexus',
        })
      ).toBe('https://staysecure-learn.raynsecure.com/nexus/login');
    });

    it('does not duplicate dev in path when client is dev', () => {
      expect(
        buildLearnLoginUrl({
          appBaseUrl: 'https://dev.staysecure-learn.raynsecure.com',
          clientId: 'dev',
        })
      ).toBe('https://dev.staysecure-learn.raynsecure.com/login');
    });

    it('uses bare login for default tenant', () => {
      expect(
        buildLearnLoginUrl({
          appBaseUrl: 'https://staysecure-learn.raynsecure.com',
          clientId: 'default',
        })
      ).toBe('https://staysecure-learn.raynsecure.com/login');
    });
  });

  describe('buildLearnPathPrefix', () => {
    it('returns empty for dev/staging/default', () => {
      expect(buildLearnPathPrefix('dev')).toBe('');
      expect(buildLearnPathPrefix('staging')).toBe('');
      expect(buildLearnPathPrefix('default')).toBe('');
    });

    it('returns slug path for tenants', () => {
      expect(buildLearnPathPrefix('nexus')).toBe('/nexus');
    });
  });

  describe('buildLearnLessonUrl', () => {
    it('includes tenant in lesson path', () => {
      expect(
        buildLearnLessonUrl({
          appBaseUrl: 'https://staysecure-learn.raynsecure.com',
          clientId: 'nexus',
          lessonId: 'abc',
        })
      ).toBe('https://staysecure-learn.raynsecure.com/nexus/lesson/abc');
    });
  });

  it('reserves known app routes', () => {
    expect(RESERVED_LEARN_APP_PATH_PREFIXES.has('admin')).toBe(true);
  });
});
