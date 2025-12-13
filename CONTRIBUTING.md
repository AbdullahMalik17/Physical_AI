# Contributing to Physical AI Platform

First off, thank you for considering contributing to the Physical AI Platform! It's people like you that make this educational resource better for everyone in the robotics and AI community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contribution Workflow](#contribution-workflow)
- [Style Guides](#style-guides)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Guidelines](#documentation-guidelines)
- [Translation Guidelines](#translation-guidelines)
- [Community](#community)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

**Our Pledge:**
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

---

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title** describing the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs **actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, Node version, browser)
- **Error messages** or console logs

**Bug Report Template:**
```markdown
**Description:**
Brief description of the bug

**Steps to Reproduce:**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior:**
What you expected to happen

**Actual Behavior:**
What actually happened

**Screenshots:**
If applicable, add screenshots

**Environment:**
- OS: [e.g., Windows 11, macOS 14]
- Node Version: [e.g., 18.17.0]
- Browser: [e.g., Chrome 120, Firefox 121]
- Platform Version: [e.g., commit hash or version number]
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title** and **detailed description**
- **Use cases** - why is this enhancement useful?
- **Examples** from other projects (if applicable)
- **Mockups** or **sketches** (if UI-related)

### Contributing Code

We love code contributions! Here are areas where you can help:

1. **Content Improvements**
   - Fix typos or grammatical errors
   - Improve explanations or add examples
   - Add missing topics or sections
   - Update outdated information

2. **Feature Development**
   - Add new interactive components
   - Improve existing components
   - Add new visualization tools
   - Enhance the AI chatbot

3. **Bug Fixes**
   - Fix reported issues
   - Improve error handling
   - Fix accessibility issues
   - Optimize performance

4. **Testing**
   - Write unit tests
   - Add E2E tests
   - Improve test coverage
   - Create visual regression tests

5. **Documentation**
   - Improve README files
   - Add code comments
   - Create tutorials
   - Write API documentation

6. **Translations**
   - Translate chapters to Urdu
   - Add new languages
   - Improve existing translations
   - Fix translation errors

---

## 🛠️ Development Setup

### Prerequisites

- **Node.js** 18+ and **npm** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **Code Editor** (VS Code recommended)

### Initial Setup

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/Physical_AI.git
cd Physical_AI

# 3. Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/Physical_AI.git

# 4. Navigate to textbook directory
cd physical-ai-textbook

# 5. Install dependencies
npm install

# 6. Start development server
npm start
```

The site will open at `http://localhost:3000`

### Optional: AI Features Setup

To work with the RAG chatbot:

```bash
# 1. Copy environment template
cp .env.example .env.local

# 2. Add your API keys to .env.local
OPENAI_API_KEY=sk-proj-your-key-here
PINECONE_API_KEY=your-pinecone-key-here

# 3. Index content (one-time)
node scripts/index-content.js
```

**Get API Keys:**
- OpenAI: https://platform.openai.com/api-keys
- Pinecone: https://www.pinecone.io/

---

## 📁 Project Structure

```
Physical_AI/
├── physical-ai-textbook/          # Main platform
│   ├── docs/                      # MDX chapter content
│   │   ├── part1-fundamentals/    # Chapters 1-5
│   │   ├── part2-simulation/      # Chapters 6-7
│   │   ├── part3-nvidia-isaac/    # Chapters 8-10
│   │   ├── part4-humanoid-robotics/ # Chapters 11-12
│   │   └── part5-cognitive-robotics/ # Chapter 13
│   ├── src/                       # React components
│   │   ├── components/            # Reusable components
│   │   ├── pages/                 # Custom pages
│   │   └── css/                   # Styles
│   ├── api/                       # Serverless functions
│   ├── scripts/                   # Utility scripts
│   ├── tests/                     # Tests
│   ├── i18n/                      # Translations
│   ├── static/                    # Static assets
│   ├── docusaurus.config.ts       # Main config
│   └── sidebars.ts                # Sidebar navigation
│
├── specs/                         # Feature specs
├── history/                       # Development history
├── .github/workflows/             # CI/CD pipelines
└── docs/                          # Project documentation
```

---

## 🔄 Contribution Workflow

### 1. Before You Start

```bash
# Update your fork with latest upstream changes
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### 2. Create a Feature Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

**Branch Naming Convention:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `test/` - Test additions/changes
- `refactor/` - Code refactoring
- `style/` - Code style/formatting
- `i18n/` - Translation work

### 3. Make Your Changes

- Write clear, focused commits
- Follow the style guides (see below)
- Add tests for new features
- Update documentation as needed
- Test your changes thoroughly

### 4. Test Your Changes

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Build verification
npm run build

# Accessibility check
npm run test:lighthouse

# Start dev server to test manually
npm start
```

### 5. Commit Your Changes

Use clear, descriptive commit messages:

```bash
# Format: <type>: <description>

git add .
git commit -m "feat: add progress tracking to chapter pages"
git commit -m "fix: resolve mobile navigation overlap issue"
git commit -m "docs: update installation instructions"
git commit -m "test: add unit tests for ChatRAG component"
```

**Commit Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Formatting, missing semicolons, etc.
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Create a Pull Request

1. Go to your fork on GitHub
2. Click "Pull Request" button
3. Fill out the PR template:
   - **Title**: Clear, descriptive summary
   - **Description**: What changes were made and why
   - **Screenshots**: For UI changes
   - **Testing**: How you tested the changes
   - **Checklist**: Complete all items

**Pull Request Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Translation
- [ ] Other (specify)

## Changes Made
- Change 1
- Change 2
- Change 3

## Screenshots (if applicable)
[Add screenshots here]

## Testing
How were these changes tested?
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Build succeeds
- [ ] Manually tested in browser

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Added comments for complex code
- [ ] Updated documentation
- [ ] Added tests for new features
- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Accessibility tested
```

### 8. Code Review Process

- Maintainers will review your PR
- Address requested changes
- Once approved, your PR will be merged!

---

## 📝 Style Guides

### MDX/Markdown Style

**Chapter Content:**
- Use frontmatter for metadata:
  ```mdx
  ---
  id: chapter-slug
  title: "Chapter Title"
  sidebar_position: 1
  description: "Brief description"
  keywords: [keyword1, keyword2]
  ---
  ```

- Use heading hierarchy (# → ## → ###)
- Add code blocks with language tags:
  ````mdx
  ```python
  def hello():
      print("Hello, World!")
  ```
  ````

- Use components for interactivity:
  ```mdx
  import RobotStatus from '@site/src/components/RobotStatus';
  import ChatRAG from '@site/src/components/ChatRAG';

  <RobotStatus status="online" label="Robot Active" />

  <ChatRAG
    placeholder="Ask about this chapter..."
    useRealAPI={false}
    messageLimit={10}
  />
  ```

### TypeScript/React Style

**General:**
- Use TypeScript for type safety
- Follow functional components with hooks
- Use meaningful variable names
- Add JSDoc comments for complex functions

**Component Structure:**
```typescript
import React, { useState, useEffect } from 'react';

interface MyComponentProps {
  title: string;
  count?: number; // Optional props
}

/**
 * Brief description of what this component does
 */
export default function MyComponent({ title, count = 0 }: MyComponentProps) {
  const [state, setState] = useState(0);

  useEffect(() => {
    // Side effects
  }, []);

  return (
    <div className="my-component">
      <h2>{title}</h2>
      <p>Count: {count}</p>
    </div>
  );
}
```

**Styling:**
- Use Tailwind CSS utility classes
- Follow existing theme conventions
- Test dark mode compatibility

### Code Examples Style

**Python:**
```python
#!/usr/bin/env python3
"""
Brief description of what this script does
"""
import rclpy
from rclpy.node import Node

class MyNode(Node):
    """Brief class description"""

    def __init__(self):
        super().__init__('my_node')
        # Implementation
```

**C++:**
```cpp
// Standard includes
#include <iostream>
#include <rclcpp/rclcpp.hpp>

// Brief description
class MyNode : public rclcpp::Node {
public:
  MyNode() : Node("my_node") {
    // Constructor
  }
};
```

### Git Commit Messages

**Format:**
```
<type>: <short summary>

<optional body>

<optional footer>
```

**Examples:**
```
feat: add user authentication system

Implemented JWT-based authentication with refresh tokens.
Added login/logout endpoints and protected routes.

Closes #123
```

```
fix: resolve mobile navigation overlap

The mobile menu was overlapping with content on screens
smaller than 768px. Added z-index fix and responsive padding.

Fixes #456
```

---

## 🧪 Testing Guidelines

### Unit Tests

- Test individual components and functions
- Use Jest and React Testing Library
- Aim for 80%+ code coverage

**Example:**
```typescript
import { render, screen } from '@testing-library/react';
import RobotStatus from '../RobotStatus';

describe('RobotStatus', () => {
  it('renders online status correctly', () => {
    render(<RobotStatus status="online" label="Active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});
```

### E2E Tests

- Test user workflows end-to-end
- Use Playwright
- Test critical user journeys

**Example:**
```typescript
import { test, expect } from '@playwright/test';

test('navigate to chapter 1', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Chapter 1');
  await expect(page).toHaveTitle(/Embodied Intelligence/);
});
```

### Accessibility Testing

- Run Lighthouse audits
- Test keyboard navigation
- Test screen reader compatibility
- Ensure 100/100 accessibility score

---

## 📖 Documentation Guidelines

### Code Documentation

- Add JSDoc comments for public APIs
- Document component props with TypeScript interfaces
- Explain complex algorithms
- Include usage examples

### README Updates

- Update if you add new features
- Add new dependencies to requirements
- Update screenshots if UI changes
- Keep installation steps current

### Chapter Content

- Write clear, concise explanations
- Use practical examples
- Include code that actually works
- Add diagrams for complex concepts
- Link to official documentation

---

## 🌍 Translation Guidelines

### Adding a New Language

1. **Check Language Support**
   ```bash
   # Add language to docusaurus.config.ts
   i18n: {
     locales: ['en', 'ur', 'your-locale'],
     defaultLocale: 'en',
   }
   ```

2. **Initialize Locale**
   ```bash
   npm run write-translations -- --locale your-locale
   ```

3. **Translate Files**
   - Navigate to `i18n/your-locale/`
   - Translate MDX files and JSON strings
   - Maintain formatting and code blocks

4. **Test Build**
   ```bash
   npm run build
   ```

### Translation Best Practices

- Preserve technical terms (e.g., "ROS 2", "node", "topic")
- Keep code blocks in English
- Maintain markdown formatting
- Test all links work
- Ensure proper text direction (LTR/RTL)

---

## 💬 Community

### Getting Help

- **GitHub Discussions:** Ask questions, share ideas
- **GitHub Issues:** Report bugs, request features
- **Discord:** Real-time chat (coming soon)

### Staying Updated

- Watch the repository for notifications
- Follow project roadmap
- Join monthly community calls (coming soon)

---

## 🙏 Thank You!

Your contributions make this project better for everyone. Whether you're fixing a typo, adding a feature, or translating content, every contribution matters!

**Recognition:**
- Contributors listed in README
- Shoutouts in release notes
- Credit in documentation

---

## 📞 Questions?

If you have questions about contributing, feel free to:
- Open a GitHub Discussion
- Create an issue with the "question" label
- Reach out to maintainers

---

**Happy Contributing!** 🚀

*Last Updated: December 13, 2025*
