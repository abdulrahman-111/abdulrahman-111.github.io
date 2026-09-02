export interface NavigationItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  location: string;
  navigation: NavigationItem[];
}

export const siteConfig: SiteConfig = {
  name: 'Abdulrahman Gomaa Hassan',
  tagline: 'I build intelligent systems—and the infrastructure behind them.',
  description: 'A recruiter-first portfolio for ML systems, infrastructure, and engineering work.',
  url: 'https://abdulrahman-111.github.io',
  location: 'Cairo, Egypt',
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects/' },
    { label: 'Writing', href: '/blog/' },
    { label: 'About', href: '/about/' },
    { label: 'Credentials', href: '/certifications/' },
    { label: 'Resume', href: '/resume/' },
  ],
};
