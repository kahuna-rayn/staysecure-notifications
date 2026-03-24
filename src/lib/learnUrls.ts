/**
 * Single place for Learn app URL rules used in emails and templates.
 *
 * Production: https://staysecure-learn.raynsecure.com/{tenant} (Index — there is no /login route)
 * Dev / staging: https://dev.staysecure-learn.raynsecure.com/ (no tenant path segment)
 */

export const DEFAULT_LEARN_APP_BASE_URL = 'https://staysecure-learn.raynsecure.com';

/**
 * Origin only. APP_BASE_URL is sometimes set with a mistaken path (e.g. …/nexus);
 * combining that with clientId would produce …/nexus/NEXUS.
 */
export function normalizeLearnAppBaseUrl(input: string): string {
  const trimmed = input.trim().replace(/\/$/, '');
  try {
    const u = new URL(trimmed);
    return `${u.protocol}//${u.host}`;
  } catch {
    return trimmed;
  }
}

/** dev / staging / default / tenant slug for URL path (tenant segments lowercased). */
function normalizeClientSegmentForUrl(clientId: string | null | undefined): {
  kind: 'env' | 'default' | 'tenant';
  segment: string;
} {
  const raw = (clientId || 'default').trim() || 'default';
  const lower = raw.toLowerCase();
  if (lower === 'dev' || lower === 'staging') {
    return { kind: 'env', segment: lower };
  }
  if (lower === 'default') {
    return { kind: 'default', segment: 'default' };
  }
  return { kind: 'tenant', segment: lower };
}

/** First path segment is an app route, not a tenant short name */
export const RESERVED_LEARN_APP_PATH_PREFIXES = new Set([
  'admin',
  'forgot-password',
  'reset-password',
  'activate-account',
  'email-notifications',
]);

export function getLearnClientSlugFromBrowser(): string | null {
  if (typeof window === 'undefined') return null;
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  if (pathParts.length === 0) return null;
  const first = pathParts[0];
  if (!RESERVED_LEARN_APP_PATH_PREFIXES.has(first)) {
    return first;
  }
  const last = sessionStorage.getItem('lastBasePath');
  if (last && last !== '/') {
    const slug = last.replace(/^\//, '').split('/')[0];
    if (slug && !RESERVED_LEARN_APP_PATH_PREFIXES.has(slug)) {
      return slug;
    }
  }
  return null;
}

export interface BuildLearnLoginUrlOptions {
  /** Base URL with no trailing slash (browser origin or APP_BASE_URL) */
  appBaseUrl?: string;
  /** Tenant slug, or dev / staging / default */
  clientId?: string | null;
}

/**
 * Tenant segment for path-based routing: '' for default/dev/staging, else /{slug}
 */
export function buildLearnPathPrefix(clientId: string | null | undefined): string {
  const norm = normalizeClientSegmentForUrl(clientId);
  if (norm.kind === 'tenant') {
    return `/${norm.segment}`;
  }
  return '';
}

export function buildLearnLoginUrl(options: BuildLearnLoginUrlOptions): string {
  const base = normalizeLearnAppBaseUrl(options.appBaseUrl || DEFAULT_LEARN_APP_BASE_URL);
  const norm = normalizeClientSegmentForUrl(options.clientId);
  // Learn App.tsx: login is Index at `/` and `/:client` — no `/login` route.
  if (norm.kind === 'env') {
    return `${base}/`;
  }
  if (norm.kind === 'tenant') {
    return `${base}/${norm.segment}`;
  }
  return `${base}/`;
}

/**
 * Deep link into a specific lesson inside a track.
 * Matches UserDashboard's ?track=&lesson= deep-link pattern and send-lesson-reminders.
 * Preferred over buildLearnLessonUrl for all email links.
 */
export function buildLearnTrackLessonDeepLinkUrl(
  options: BuildLearnLoginUrlOptions & { learningTrackId: string; lessonId: string }
): string {
  const base = normalizeLearnAppBaseUrl(options.appBaseUrl || DEFAULT_LEARN_APP_BASE_URL);
  const prefix = buildLearnPathPrefix(options.clientId);
  const q = new URLSearchParams({ track: options.learningTrackId, lesson: options.lessonId });
  return `${base}${prefix}/?${q.toString()}`;
}

/** @deprecated Use buildLearnTrackLessonDeepLinkUrl — `/lesson/:id` is not a router route */
export function buildLearnLessonUrl(
  options: BuildLearnLoginUrlOptions & { lessonId: string }
): string {
  const base = normalizeLearnAppBaseUrl(options.appBaseUrl || DEFAULT_LEARN_APP_BASE_URL);
  const prefix = buildLearnPathPrefix(options.clientId);
  return `${base}${prefix}/lesson/${options.lessonId}`;
}

/**
 * Resolves tenant slug for email deep links: explicit context → URL/session → org_profile (if allowed by RLS).
 */
export async function resolveLearnClientIdForEmailUrls(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  explicitClientId?: string | null
): Promise<string> {
  if (explicitClientId && explicitClientId !== 'default') {
    return explicitClientId;
  }
  const fromBrowser = getLearnClientSlugFromBrowser();
  if (fromBrowser) {
    return fromBrowser;
  }
  try {
    const { data } = await supabase
      .from('org_profile')
      .select('org_short_name')
      .limit(1)
      .maybeSingle();
    const name = (data as { org_short_name?: string | null } | null)?.org_short_name;
    if (name) {
      return name;
    }
  } catch {
    // RLS may block; caller still gets default
  }
  return 'default';
}
