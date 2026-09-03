import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const outputDirectory = join(root, 'public/certificates');
const redact = '#07111f';

const certificates = [
  {
    source: '/mnt/shared-dir/Certificates/AWS AI Practitioner Challenge Udacity.pdf',
    output: 'aws-ai-practitioner-challenge.webp',
    page: 1,
    rotate: 90,
    rectangles: [[805, 690, 855, 1130]],
  },
  {
    source:
      '/mnt/shared-dir/Certificates/AWS/CLF-C02/AWS Certified Cloud Practitioner certificate.pdf',
    output: 'aws-certified-cloud-practitioner.webp',
    page: 1,
    rectangles: [[55, 585, 1145, 765]],
  },
  {
    source: '/mnt/shared-dir/Certificates/Duolingo English Test.pdf',
    output: 'duolingo-english-test.webp',
    page: 1,
    rectangles: [
      [175, 194, 444, 229],
      [500, 193, 865, 262],
    ],
  },
  {
    source: '/mnt/shared-dir/Certificates/MCIT PYTHON/MCIT 1 & 2 .pdf',
    output: 'mcit-python.webp',
    page: 1,
  },
  {
    source: '/mnt/shared-dir/Certificates/NTI/NLP/Abdulrahman Gomaa Hassan.pdf',
    output: 'nti-natural-language-processing.webp',
    page: 1,
    rectangles: [[640, 722, 830, 762]],
  },
  {
    source:
      '/mnt/shared-dir/Certificates/NTI/cloud/AWS_Academy_Graduate___AWS_Academy_Cloud_Foundations_Badge20250823-33-wq6l9w.pdf',
    output: 'aws-academy-cloud-foundations.webp',
    page: 1,
  },
  {
    source: '/mnt/shared-dir/Certificates/NTI/cloud/CLOUD ARCHITECT NTI .pdf',
    output: 'nti-cloud-architect.webp',
    page: 1,
    rectangles: [[640, 722, 830, 762]],
  },
  {
    source: '/mnt/shared-dir/Certificates/NTI/cloud/deep learning nvidia/My Learning _ NVIDIA.pdf',
    output: 'nvidia-deep-learning.webp',
    page: 1,
  },
  {
    source: '/mnt/shared-dir/Certificates/NTI/network/Abdulrahman nti network .pdf',
    output: 'nti-network-essentials.webp',
    page: 1,
    rectangles: [[500, 650, 715, 695]],
  },
  {
    source:
      '/mnt/shared-dir/Certificates/NTI/network/AbdulrahmanHassan-IEEE-EUI Network-certificate_instructorsignature.pdf',
    output: 'cisco-networking-essentials.webp',
    page: 1,
  },
  {
    source:
      '/mnt/shared-dir/Certificates/SPRINTS/DEVOPS FOUNDATION/Microsoft Learn intro to microsoft azure.pdf',
    output: 'microsoft-azure-cloud-concepts.webp',
    page: 1,
    rotate: 90,
    rectangles: [
      [330, 10, 725, 48],
      [30, 1150, 840, 1194],
    ],
  },
  {
    source: '/mnt/shared-dir/Certificates/SPRINTS/DEVOPS FOUNDATION/sprints devops Micrrosoft.pdf',
    output: 'sprints-devops-foundations.webp',
    page: 1,
    rectangles: [[500, 775, 700, 820]],
  },
  {
    source: '/mnt/shared-dir/Certificates/UDEMY/docker fakharany/DOCKER FAKHARANY.pdf',
    output: 'udemy-docker.webp',
    page: 1,
    rectangles: [[740, 65, 1150, 150]],
  },
  {
    source:
      '/mnt/shared-dir/Certificates/UDEMY/system programming in linux/System programming in linux.pdf',
    output: 'udemy-system-programming-linux.webp',
    page: 1,
    rectangles: [[740, 65, 1150, 150]],
  },
  {
    source: '/mnt/shared-dir/Certificates/kodecloud/helm for beginners.pdf',
    output: 'kodekloud-helm.webp',
    page: 1,
    rectangles: [[60, 495, 715, 555]],
  },
  {
    source: '/mnt/shared-dir/Certificates/kodecloud/k8s for beginners.pdf',
    output: 'kodekloud-kubernetes.webp',
    page: 1,
    rectangles: [[60, 495, 715, 555]],
  },
];

function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`${command} failed:\n${result.stderr || result.stdout}`);
  }
}

await mkdir(outputDirectory, { recursive: true });
const temporaryDirectory = await mkdtemp(join(tmpdir(), 'portfolio-certificates-'));

try {
  for (const certificate of certificates) {
    const stem = join(temporaryDirectory, certificate.output.replace('.webp', ''));
    const png = `${stem}.png`;
    run('pdftoppm', [
      '-f',
      String(certificate.page),
      '-singlefile',
      '-png',
      '-scale-to',
      '1200',
      certificate.source,
      stem,
    ]);

    const transforms = [];
    for (const rectangle of certificate.rectangles ?? []) {
      transforms.push('-fill', redact, '-draw', `rectangle ${rectangle.join(',')}`);
    }
    if (certificate.rotate) transforms.push('-rotate', String(certificate.rotate));
    transforms.push(
      '-resize',
      '1200x900>',
      '-background',
      '#07111f',
      '-gravity',
      'center',
      '-extent',
      '1200x900',
      '-strip',
      '-quality',
      '84',
      join(outputDirectory, certificate.output),
    );
    run('magick', [png, ...transforms]);
  }
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
