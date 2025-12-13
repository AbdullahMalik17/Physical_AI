#!/usr/bin/env python3
"""Fix LaTeX math expressions for MDX compatibility"""

import re
import sys

def fix_latex(content):
    """Replace LaTeX math with MDX-safe alternatives"""

    # Replace inline math variables
    replacements = [
        (r'\$\\theta_1\$', 'θ₁'),
        (r'\$\\theta_2\$', 'θ₂'),
        (r'\$\\theta_i\$', 'θᵢ'),
        (r'\$\\alpha_i\$', 'αᵢ'),
        (r'\$a_i\$', 'aᵢ'),
        (r'\$d_i\$', 'dᵢ'),
        (r'\$L_1\$', 'L₁'),
        (r'\$L_2\$', 'L₂'),
        (r'\$\\mathbf\{q\}\$', '**q**'),
        (r'\$\\mathbf\{v\}\$', '**v**'),
        (r'\$\\mathbf\{r\}\$', '**r**'),
        (r'\$\\mathbf\{p\}\$', '**p**'),
        (r'\$\\mathbf\{M\}\$', '**M**'),
        (r'\$\\mathbf\{C\}\$', '**C**'),
        (r'\$\\mathbf\{g\}\$', '**g**'),
        (r'\$\\boldsymbol\{\\tau\}\$', '**τ**'),
        (r'\$\\dot\{\\mathbf\{q\}\}\$', '**q̇**'),
        (r'\$\\ddot\{\\mathbf\{q\}\}\$', '**q̈**'),
        (r'\$J\$', 'J'),
        (r'\$6 \\times n\$', '6×n'),
        (r'\$n \> 3\$', 'n > 3'),
        (r'\$\\lambda\$', 'λ'),
        (r'\$\\omega\$', 'ω'),
    ]

    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)

    # Remove block math $$...$$ and replace with text description
    def replace_block_math(match):
        math_content = match.group(1)
        # Return as code block
        return f'\n```\n{math_content}\n```\n'

    content = re.sub(r'\$\$(.*?)\$\$', replace_block_math, content, flags=re.DOTALL)

    # Remove remaining inline math $...$
    content = re.sub(r'\$([^\$]+)\$', r'`\1`', content)

    return content

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: python fix-latex.py <file>")
        sys.exit(1)

    filepath = sys.argv[1]

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    fixed_content = fix_latex(content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(fixed_content)

    print(f"Fixed LaTeX in {filepath}")
