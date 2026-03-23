import {
  buildLearnLessonUrl,
  buildLearnLoginUrl,
  buildLearnPathPrefix,
  normalizeLearnAppBaseUrl,
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
      ).toBe('https://staysecure-learn.raynsecure.com/nexus');
    });

    it('does not duplicate dev in path when client is dev', () => {
      expect(
        buildLearnLoginUrl({
          appBaseUrl: 'https://dev.staysecure-learn.raynsecure.com',
          clientId: 'dev',
        })
      ).toBe('https://dev.staysecure-learn.raynsecure.com/');
    });

    it('uses app root for default tenant', () => {
      expect(
        buildLearnLoginUrl({
          appBaseUrl: 'https://staysecure-learn.raynsecure.com',
          clientId: 'default',
        })
      ).toBe('https://staysecure-learn.raynsecure.com/');
    });

    it('strips tenant from mistaken APP_BASE_URL and uses one lowercase path segment', () => {
      expect(
        buildLearnLoginUrl({
          appBaseUrl: 'https://staysecure-learn.raynsecure.com/nexus',
          clientId: 'nexus',
        })
      ).toBe('https://staysecure-learn.raynsecure.com/nexus');
    });

    it('lower-cases tenant slug in path', () => {
      expect(
        buildLearnLoginUrl({
          appBaseUrl: 'https://staysecure-learn.raynsecure.com',
          clientId: 'nexus',
        })
      ).toBe('https://staysecure-learn.raynsecure.com/nexus');
    });
  });

  describe('normalizeLearnAppBaseUrl', () => {
    it('returns origin only when path was wrongly included', () => {
      expect(normalizeLearnAppBaseUrl('https://staysecure-learn.raynsecure.com/nexus/')).toBe(
        'https://staysecure-learn.raynsecure.com'
      );
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
      expect(buildLearnPathPrefix('NEXUS')).toBe('/nexus');
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
