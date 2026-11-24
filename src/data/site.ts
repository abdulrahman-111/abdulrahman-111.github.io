export interface NavigationItem {
  label: string;
  href: string;
}

export interface ResumeRecord {
  label: string;
  focus: string;
  href: string;
}

export interface ResearchPaper {
  title: string;
  authors: string[];
  year: number;
  status: 'Submitted';
  contribution: string;
  details: string[];
}

export interface SiteConfig {
  name: string;
  role: string;
  tagline: string;
  description: string;
  url: string;
  location: string;
  email: string;
  social: { github: string; linkedin: string; kaggle: string; medium: string };
  navigation: NavigationItem[];
  education: { institution: string; detail: string; period: string }[];
  experience: { organization: string; role: string; period: string; summary: string }[];
  research: ResearchPaper[];
  awards: { title: string; event: string; year: number; detail: string; href: string }[];
  skillGroups: { label: string; skills: string[] }[];
  resumes: ResumeRecord[];
}

export const siteConfig: SiteConfig = {
  name: 'Abdulrahman Gomaa Hassan',
  role: 'ML Systems & DevOps Engineer',
  tagline: 'I build intelligent systems—and the infrastructure behind them.',
  description:
    'Applied AI research and DevOps portfolio spanning chest X-ray analysis, circular statistics, model pipelines, cloud infrastructure, and Linux systems programming.',
  url: 'https://abdulrahman-111.github.io',
  location: 'Cairo, Egypt',
  email: 'abdulrahman.gomaa.h05@gmail.com',
  social: {
    github: 'https://github.com/abdulrahman-111',
    linkedin: 'https://www.linkedin.com/in/abdulrahman-gomaa',
    kaggle: 'https://www.kaggle.com/abdulrahmanh05',
    medium: 'https://medium.com/@agofficial',
  },
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects/' },
    { label: 'Research', href: '/research/' },
    { label: 'Writing', href: '/blog/' },
    { label: 'About', href: '/about/' },
    { label: 'Credentials', href: '/certifications/' },
    { label: 'Résumé', href: '/resume/' },
  ],
  education: [
    {
      institution: 'Egypt University of Informatics',
      detail:
        'B.Sc. in Computer Engineering · CGPA 3.98/4.00 · Ranked 2nd in Computer Engineering · President’s List twice · Dean’s List six times',
      period: 'Oct 2023 — Expected 2028',
    },
    {
      institution: 'Purdue University',
      detail: 'ECE 30100: Signals and Systems · Grade A+',
      period: 'Jun — Sep 2025',
    },
  ],
  experience: [
    {
      organization: 'Azouz Tech Group',
      role: 'DevOps Engineer',
      period: 'Sep 2026 — Present',
      summary:
        'Manage company infrastructure and network configuration, including firewalls and DNS. Build CI/CD pipelines, containerize applications with Docker, and set up self-hosted Gitea for source control and development collaboration.',
    },
    {
      organization: 'Nile University · Center for Informatics Science (CIS)',
      role: 'Research Assistant / Summer Research Intern',
      period: '15 Aug 2026 — Present',
      summary:
        'Work on AI-powered pneumonia detection using chest X-ray imaging under Prof. Mai Mohamed Said Mahmoud Mabrouk. Completed the 2026 Summer NU Research Internship, with a completion certificate dated 31 August 2026; research collaboration continues.',
    },
    {
      organization: 'National Telecommunication Institute (NTI)',
      role: 'Natural Language Processing Trainee · 120 hours',
      period: 'Jun — Aug 2026',
      summary:
        'Completed training in text preprocessing, linguistic analysis, Bag of Words, N-grams, TF-IDF, embeddings, transformers, LLM fine-tuning, prompt engineering, vector databases, and retrieval-augmented generation. Collaborated on a Streamlit customer-complaint analysis capstone combining intent classification, sentiment analysis, topic discovery, and draft-response generation.',
    },
    {
      organization: 'Digital Egypt Pioneers Initiative (DEPI)',
      role: 'DevOps Intern / Trainee',
      period: 'Nov 2025 — Jun 2026',
      summary:
        'Practiced infrastructure provisioning with Terraform and Ansible, configured Docker workloads, and troubleshot Kubernetes networking and cluster issues. Built CI/CD and GitOps workflows with Jenkins, Argo CD, and Helm; integrated SonarQube, Trivy, Sealed Secrets, Prometheus, Grafana, and Loki.',
    },
    {
      organization: 'National Telecommunication Institute (NTI)',
      role: 'Cloud Architect Intern / Trainee',
      period: 'Jul — Aug 2025',
      summary:
        'Completed AWS Academy Cloud Foundations and practical work with EC2, S3, IAM, and VPC for cloud deployment, access control, and networking.',
    },
    {
      organization: 'National Telecommunication Institute (NTI)',
      role: 'Network Essentials Intern / Trainee',
      period: 'Aug — Sep 2024',
      summary:
        'Practiced IP addressing, routing, switching, and network troubleshooting through structured labs.',
    },
    {
      organization: 'Egypt University of Informatics',
      role: 'Junior Teaching Assistant · CSE 021 and CSE 123',
      period: 'Fall 2024 · Spring 2025 · Fall 2025',
      summary:
        'Supported more than 200 students with programming tasks and coding problems during labs and office hours. Assisted CSE 021 in Fall 2024 and Fall 2025, and CSE 123 in Spring 2025, under Dr. Hala Zayed and Eng. Rameez Barakat.',
    },
  ],
  awards: [
    {
      title: '1st Place',
      event: 'SolveThe17 2.0 Hackathon',
      year: 2026,
      detail: 'CityFix / CityCycle · IEEE EUI Student Branch',
      href: '/projects/cityfix/',
    },
  ],
  research: [
    {
      title:
        'How Does Image Enhancement Affect Pneumonia Detection? A Controlled Study of Classification Performance and Model Visual Attention in Chest X-Ray Analysis',
      authors: [
        'Abdulrahman G. Hassan',
        'Walid A. AbdelMeguid',
        'Ahmed Abdelazim',
        'Nadeen N. Shrab',
        'Mai S. Mabrouk',
      ],
      year: 2026,
      status: 'Submitted',
      contribution:
        'First author. Developed modeling and mathematical components, implemented research code, and contributed the Grad-CAM analysis.',
      details: [
        'Compares nine image-enhancement techniques and an unenhanced baseline across ResNet-50, DenseNet-121, EfficientNet-B0, and ConvNeXt-Tiny.',
        'Pairs classification evaluation with Grad-CAM attention analysis to investigate architecture-dependent preprocessing effects and model reliance on image regions.',
        'Research conducted through Nile University under Prof. Mai Mohamed Said Mahmoud Mabrouk.',
      ],
    },
    {
      title: 'The Wrapped Flexible Exponentiated Weibull Distribution for Circular Data Analysis',
      authors: ['Abdulrahman G. Hassan', 'Seif Eldin Haytham', 'Ahmed Herzallah'],
      year: 2026,
      status: 'Submitted',
      contribution:
        'First author. Contributed mathematical development, statistical analysis, and manuscript writing.',
      details: [
        'Studies a three-parameter circular probability model, including density and CDF derivations, truncation-error analysis, and numerical parameter estimation.',
        'Compares six estimators through Monte Carlo simulation across four parameter settings and five sample sizes, with 1,000 replications per configuration.',
        'Evaluates real-data fits against established circular models.',
      ],
    },
  ],
  skillGroups: [
    {
      label: 'Research methods',
      skills: [
        'Mathematical modeling',
        'Statistical analysis',
        'Numerical estimation',
        'Monte Carlo simulation',
        'Grad-CAM',
        'Scientific writing',
      ],
    },
    {
      label: 'Programming',
      skills: ['Python', 'C++', 'C', 'SQL', 'Shell scripting', 'Verilog', 'TypeScript'],
    },
    {
      label: 'ML and data',
      skills: [
        'PyTorch',
        'TensorFlow',
        'scikit-learn',
        'Pandas',
        'NumPy',
        'OpenCV',
        'NLP',
        'CNNs',
        'Sentence embeddings',
        'K-Means',
        'LLM integration',
        'Transformers',
        'RAG',
      ],
    },
    {
      label: 'Platform',
      skills: ['Linux', 'Docker', 'Kubernetes', 'Helm', 'Argo CD', 'AWS', 'Git', 'GitHub', 'Gitea'],
    },
    { label: 'Automation', skills: ['Terraform', 'Ansible', 'Jenkins', 'GitHub Actions'] },
    {
      label: 'Operations',
      skills: [
        'Prometheus',
        'Grafana',
        'Loki',
        'SonarQube',
        'Trivy',
        'Sealed Secrets',
        'DNS',
        'Firewalls',
      ],
    },
    {
      label: 'Applications and data',
      skills: ['React Native', 'Expo', 'Next.js', 'React', 'SQLite', 'PostgreSQL', 'Supabase'],
    },
    {
      label: 'ML delivery and quality',
      skills: ['FastAPI', 'Pydantic', 'ONNX', 'pytest', 'Docker Compose'],
    },
    {
      label: 'Computer engineering',
      skills: [
        'Logisim',
        'RISC-V / RV32I',
        'RTL design',
        'Assembly test programs',
        'Networking',
        'CPU scheduling fundamentals',
      ],
    },
  ],
  resumes: [
    {
      label: 'Complete CV',
      focus:
        'Full experience, internships, submitted research, teaching, leadership, credentials, and projects.',
      href: '/resume/master-cv.pdf',
    },
    {
      label: 'ML/AI résumé',
      focus:
        'Machine learning pipelines, computer vision, data analysis, and supporting infrastructure.',
      href: '/resume/ml-ai-resume.pdf',
    },
    {
      label: 'DevOps and Cloud résumé',
      focus:
        'Cloud infrastructure, Kubernetes, GitOps, CI/CD, observability, and platform automation.',
      href: '/resume/devops-cloud-resume.pdf',
    },
  ],
};
