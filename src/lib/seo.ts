import { siteConfig } from '../data/site';

export function buildCanonical(pathname: string): string {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const pathWithTrailingSlash = normalizedPath.endsWith('/')
    ? normalizedPath
    : `${normalizedPath}/`;

  return `${siteConfig.url}${pathWithTrailingSlash}`;
}
