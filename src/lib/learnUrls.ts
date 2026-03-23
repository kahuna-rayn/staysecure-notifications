/**
 * Single place for Learn app URL rules used in emails and templates.
 *
 * Production: https://staysecure-learn.raynsecure.com/{tenant}/login
 * Dev / staging hosts: https://dev.staysecure-learn.raynsecure.com/login (no path segment for tenant slug)
 */

export const DEFAULT_LEARN_APP_BASE_URL = 'https://staysecure-learn.raynsecure.com';

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
  const cid = (clientId || 'default').trim() || 'default';
  if (cid === 'dev' || cid === 'staging' || cid === 'default') {
    return '';
  }
  return `/${cid}`;
}

export function buildLearnLoginUrl(options: BuildLearnLoginUrlOptions): string {
  const base = (options.appBaseUrl || DEFAULT_LEARN_APP_BASE_URL).replace(/\/$/, '');
  const cid = (options.clientId || 'default').trim() || 'default';
  if (cid === 'dev' || cid === 'staging') {
    return `${base}/login`;
  }
  if (cid !== 'default') {
    return `${base}/${cid}/login`;
  }
  return `${base}/login`;
}

export function buildLearnLessonUrl(
  options: BuildLearnLoginUrlOptions & { lessonId: string }
): string {
  const base = (options.appBaseUrl || DEFAULT_LEARN_APP_BASE_URL).replace(/\/$/, '');
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
