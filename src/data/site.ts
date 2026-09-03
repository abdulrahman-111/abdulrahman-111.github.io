export interface NavigationItem {
  label: string;
  href: string;
}

export interface ResumeRecord {
  label: string;
  focus: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  role: string;
  tagline: string;
  description: string;
  url: string;
  location: string;
  email: string;
  social: { github: string; linkedin: string };
  navigation: NavigationItem[];
  education: { institution: string; detail: string; period: string }[];
  experience: { organization: string; role: string; period: string; summary: string }[];
  skillGroups: { label: string; skills: string[] }[];
  resumes: ResumeRecord[];
}

export const siteConfig: SiteConfig = {
  name: 'Abdulrahman Gomaa Hassan',
  role: 'ML Systems & DevOps Engineer',
  tagline: 'I build intelligent systems—and the infrastructure behind them.',
  description:
    'ML systems and DevOps portfolio spanning model pipelines, Kubernetes delivery, cloud infrastructure, and Linux systems programming.',
  url: 'https://abdulrahman-111.github.io',
  location: 'Cairo, Egypt',
  email: 'abdulrahman.gomaa.h05@gmail.com',
  social: {
    github: 'https://github.com/abdulrahman-111',
    linkedin: 'https://www.linkedin.com/in/abdulrahman-gomaa',
  },
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects/' },
    { label: 'Writing', href: '/blog/' },
    { label: 'About', href: '/about/' },
    { label: 'Credentials', href: '/certifications/' },
    { label: 'Resume', href: '/resume/' },
  ],
  education: [
    {
      institution: 'Egypt University of Informatics',
      detail: 'B.Sc. in Computer Engineering · CGPA 3.98/4.00',
      period: 'Oct 2023 — Present',
    },
    {
      institution: 'Purdue University',
      detail: 'ECE 30100: Signals and Systems · Grade A+',
      period: 'Jun — Sep 2025',
    },
  ],
  experience: [
    {
      organization: 'Digital Egypt Pioneers Initiative (DEPI)',
      role: 'DevOps Intern',
      period: 'Nov 2025 — Jun 2026',
      summary:
        'Built practical depth across containers, configuration automation, CI/CD, Kubernetes, GitOps, observability, and secrets management.',
    },
    {
      organization: 'National Telecommunication Institute (NTI)',
      role: 'Cloud Architect Intern',
      period: 'Jul — Aug 2025',
      summary:
        'Completed AWS Academy Cloud Foundations and operated core AWS services across compute, storage, identity, and networking.',
    },
    {
      organization: 'National Telecommunication Institute (NTI)',
      role: 'Network Essentials Intern',
      period: 'Aug — Sep 2024',
      summary:
        'Practiced IP addressing, routing, switching, and network troubleshooting through structured labs.',
    },
  ],
  skillGroups: [
    { label: 'Languages', skills: ['Python', 'C++', 'C', 'SQL', 'Shell scripting'] },
    { label: 'ML & data', skills: ['TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy', 'OpenCV'] },
    { label: 'Platform', skills: ['Linux', 'Docker', 'Kubernetes', 'Helm', 'Argo CD', 'AWS'] },
    { label: 'Automation', skills: ['Terraform', 'Ansible', 'Jenkins', 'GitHub Actions'] },
    { label: 'Operations', skills: ['Prometheus', 'Grafana', 'Loki', 'SonarQube', 'Trivy'] },
  ],
  resumes: [
    {
      label: 'ML / AI résumé',
      focus:
        'Machine learning pipelines, computer vision, data analysis, and supporting infrastructure.',
      href: '/resume/ml-ai-resume.pdf',
    },
    {
      label: 'DevOps / Cloud résumé',
      focus:
        'Cloud infrastructure, Kubernetes, GitOps, CI/CD, observability, and platform automation.',
      href: '/resume/devops-cloud-resume.pdf',
    },
  ],
};
