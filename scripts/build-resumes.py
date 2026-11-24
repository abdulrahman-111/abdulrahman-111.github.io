"""Compile the public master CV and role-focused versions from one LaTeX source.

Requires Python 3 and pdflatex. All compiler artifacts stay in a temporary directory.
"""

from pathlib import Path
import re
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'docs/resume/master-cv.tex'
OUTPUT = ROOT / 'public/resume'


def entries(section):
    return re.findall(r'\\cvitem\{.*?(?=\\cvitem\{|\Z)', section, re.S)


def focused_document(source, focus, project_titles):
    parts = re.split(r'\\section\*\{([^}]+)\}', source)
    sections = {
        parts[index]: parts[index + 1].replace(r'\newpage', '').replace(r'\end{document}', '')
        for index in range(1, len(parts), 2)
    }
    profile_start = source.index('Computer Engineering undergraduate')
    profile_end = source.index(r'\par', profile_start)
    header = parts[0].replace(source[profile_start:profile_end], focus)
    all_projects = entries(sections['Selected Projects']) + entries(sections['Additional Projects'])
    selected = ''.join(
        entry for title in project_titles for entry in all_projects
        if entry.startswith(r'\cvitem{' + title + '}')
    )
    sections['Selected Projects'] = '\n' + selected
    order = [
        'Education and Academic Distinctions',
        'Professional and Teaching Experience',
        'Research Experience',
        'Internships and Professional Training',
        'Research',
        'Selected Projects',
        'Leadership and Service',
        'Certifications and Languages',
        'Technical Skills',
    ]
    if 'AI research' in focus:
        order.remove('Research')
        order.insert(1, 'Research')
    return header + ''.join(r'\section*{' + name + '}' + sections[name] for name in order) + r'\end{document}'


def main():
    source = SOURCE.read_text()
    documents = {
        'master-cv': source,
        'ml-ai-resume': focused_document(
            source,
            'Computer Engineering undergraduate focused on applied AI research, computer vision, NLP, and reproducible ML delivery. Research Assistant at Nile University and DevOps Engineer at Azouz Tech Group, with two first-author submitted journal manuscripts.',
            ['AI-Powered Customer Complaint Analyzer', 'TaxiFlow', 'Smart Attendance System', 'FIFA Career Mode AI Assistant', 'CityFix / CityCycle'],
        ),
        'devops-cloud-resume': focused_document(
            source,
            'DevOps Engineer at Azouz Tech Group and Computer Engineering undergraduate with experience in infrastructure, networking, CI/CD, Docker, Kubernetes, AWS, and GitOps. Research and teaching experience complement hands-on platform delivery.',
            ['End-to-End DevOps Pipeline', 'TaxiFlow', 'Road to My Own Shell', 'RV32I CPU and miniOS', 'DarSak'],
        ),
    }
    OUTPUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='portfolio-resumes-') as build_dir:
        for name, document in documents.items():
            tex = Path(build_dir) / f'{name}.tex'
            tex.write_text(document)
            command = ['pdflatex', '-no-shell-escape', '-interaction=nonstopmode', '-halt-on-error', f'-output-directory={build_dir}', str(tex)]
            for _ in range(2):
                result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True)
                if result.returncode:
                    raise RuntimeError(result.stdout[-5000:])
            shutil.copyfile(Path(build_dir) / f'{name}.pdf', OUTPUT / f'{name}.pdf')
            print(f'Built {name}.pdf')


if __name__ == '__main__':
    main()
