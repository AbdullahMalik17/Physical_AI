# Physical AI Platform

> **An Interactive Textbook for Physical AI & Humanoid Robotics**
> Master ROS 2, simulation, and embodied AI from fundamentals to deployment

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Accessibility](https://img.shields.io/badge/accessibility-100%2F100-brightgreen)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()
[![Locales](https://img.shields.io/badge/locales-en%20%7C%20ur-blue)]()

---

## 🎯 Overview

The Physical AI Platform is a comprehensive, interactive learning platform that teaches the complete journey from ROS 2 fundamentals to deploying humanoid robots with conversational AI capabilities.

**What makes it unique:**
- 📚 **Interactive Chapters** with embedded code examples and components
- 🤖 **AI-Powered Assistance** with integrated chatbot for questions
- 🌐 **Bilingual Support** (English & Urdu/اردو)
- 🎨 **Cyberpunk Dark Theme** optimized for extended reading
- ♿ **100% Accessible** (WCAG 2.1 AA compliant)
- 📱 **Fully Responsive** (mobile, tablet, desktop)

---

## 📊 Current Status

**Phase:** Phase A Complete ✅ | Phase 2 of 7 Complete ✅
**Chapters:** 5 published (13,500+ words)
**Code Examples:** 43+ complete, runnable examples
**Last Updated:** December 11, 2025

### ✅ Phase A: Fix & Deploy (COMPLETE)

- ✅ Component Standardization (all chapters use ChatRAG)
- ✅ Build Verification (100% success, both locales)
- ✅ Visual Testing (9/9 screenshots captured)
- ✅ Test Report Created
- 📋 Ready for Production Deployment

### Completed Modules

- ✅ **Phase 1: Foundation & Introduction**
  - Chapter 1: Introduction to Embodied Intelligence
  - Chapter 2: Sensor Systems and Perception

- ✅ **Phase 2: ROS 2 Fundamentals**
  - Chapter 3: ROS 2 Architecture & Core Concepts
  - Chapter 4: Building ROS 2 Packages with Python
  - Chapter 5: ROS 2 Communication Patterns

### Coming Next

- 🚀 **Deploy to Production** (Vercel)
- 🤖 **Phase B: Professional RAG Chatbot** (Real AI integration)
- 📅 **Phase C: Content Completion** (Chapters 6-13)
- 📅 **Phase D: Advanced Features & Launch**

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Git** ([Download](https://git-scm.com/))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Physical_AI

# Navigate to the platform
cd physical-ai-textbook

# Install dependencies
npm install

# Start development server
npm start
```

The site will open at **http://localhost:3000**

### Build for Production

```bash
# Build static site
npm run build

# Serve production build locally
npm run serve
```

### Deploy to Production (Vercel)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
cd physical-ai-textbook
vercel --prod

# Get your production URL:
# ✅ https://physical-ai-platform.vercel.app
```

**Automated Deployment:**
- Push to `main` branch → auto-deploy
- Create PR → preview deployment
- See `.github/workflows/` for CI/CD configuration

---

## 📁 Project Structure

```
Physical_AI/
├── physical-ai-textbook/      # Main Docusaurus platform
│   ├── docs/                  # Chapter content (MDX)
│   ├── src/                   # React components & pages
│   ├── i18n/                  # Internationalization (Urdu)
│   └── tests/                 # E2E and unit tests
│
├── specs/                     # Feature specifications
│   ├── 001-physical-ai-platform/
│   └── 002-ros2-fundamentals/
│
├── history/                   # Development history
│   ├── prompts/               # Prompt History Records (PHR)
│   └── adr/                   # Architecture Decision Records
│
├── PROJECT_ROADMAP.md         # Development roadmap
├── PROJECT_REVIEW.md          # Professional review & recommendations
├── CLAUDE.md                  # Agent instructions
└── README.md                  # This file
```

---

## 🛠️ Technology Stack

### Core Framework
- **[Docusaurus 3](https://docusaurus.io/)** - Static site generator
- **[React 18](https://react.dev/)** - UI components
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### Styling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **Custom Infima Variables** - Cyberpunk dark theme

### Testing
- **[Playwright](https://playwright.dev/)** - E2E tests
- **[Jest](https://jestjs.io/)** - Unit tests
- **[Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)** - Accessibility audits

### Deployment
- **[Vercel](https://vercel.com/)** - Hosting platform
- **GitHub Actions** - CI/CD pipeline

---

## 📚 Documentation

### For Learners
- **[Live Platform](https://your-domain.vercel.app)** (coming soon)
- **[Getting Started Guide](physical-ai-textbook/README.md)**
- **[Chapter Roadmap](PROJECT_ROADMAP.md)**

### For Developers
- **[Project Review](PROJECT_REVIEW.md)** - Professional analysis
- **[Test Report](physical-ai-textbook/TEST_REPORT.md)** - Phase A test results
- **[Spec-Driven Development](specs/)**
- **[Component Documentation](physical-ai-textbook/src/components/)**
- **[Testing Guide](physical-ai-textbook/tests/)**

### For Contributors
- **[Contributing Guidelines](CONTRIBUTING.md)** (coming soon)
- **[Architecture Documentation](ARCHITECTURE.md)** (coming soon)
- **[Translation Workflow](PROJECT_REVIEW.md#-internationalization-i18n---explanation--recommendations)**

---

## 🌍 Internationalization (i18n)

The platform supports multiple languages using Docusaurus built-in i18n.

**Available Locales:**
- 🇬🇧 **English** (Primary) - 100% complete
- 🇵🇰 **Urdu** (اردو) - Structure ready, translations in progress

**How to contribute translations:** See [PROJECT_REVIEW.md](PROJECT_REVIEW.md#-internationalization-i18n---explanation--recommendations)

---

## 🧪 Testing

### Run All Tests

```bash
cd physical-ai-textbook

# Unit tests
npm test

# E2E tests (requires Playwright installation)
npx playwright install chromium
npm run test:e2e

# Accessibility audit
npm run test:lighthouse
```

### Test Coverage

- ✅ E2E navigation tests (8 scenarios)
- ✅ Component unit tests (RobotStatus, ChatPlaceholder)
- ✅ Accessibility audits (Lighthouse)
- ⚠️ Code coverage: ~30% (target: 80%)

---

## 📈 Metrics & Quality

### Content Metrics
- **Total Chapters:** 5 published
- **Total Words:** 13,500+
- **Code Examples:** 43+ complete examples
- **Languages:** 2 (English + Urdu structure)

### Performance Metrics
- **Build Time:** ~60 seconds (both locales)
- **Bundle Size:** ~5MB (optimized)
- **Lighthouse Accessibility:** 100/100
- **Lighthouse Performance:** TBD (deploy first)

### Quality Score: **A- (90%)**
See [PROJECT_REVIEW.md](PROJECT_REVIEW.md) for detailed analysis.

---

## 🤝 Contributing

We welcome contributions! Whether you're:
- 📝 Improving content
- 🐛 Fixing bugs
- 🌐 Translating to new languages
- 💻 Adding new features
- 🧪 Writing tests

**Getting Started:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit with clear message (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

**Note:** Full contribution guidelines coming soon in `CONTRIBUTING.md`

---

## 🗺️ Roadmap

### ✅ Completed
- **Phase 1:** Foundation (Chapters 1-2)
- **Phase 2:** ROS 2 Fundamentals (Chapters 3-5)

### 🔄 In Progress
- **Phase 3:** Simulation (Gazebo & Unity)

### 📅 Planned
- **Phase 4:** NVIDIA Isaac Platform
- **Phase 5:** Humanoid Robotics
- **Phase 6:** Vision-Language-Action (VLA)
- **Phase 7:** Advanced Features (Real RAG, Videos, Progress Tracking)

See [PROJECT_ROADMAP.md](PROJECT_ROADMAP.md) for detailed timeline.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Docusaurus Team** - Amazing static site framework
- **ROS 2 Community** - Comprehensive robotics middleware
- **NVIDIA Isaac Team** - Cutting-edge simulation platform
- **Contributors** - Thank you for making this better!

---

## 📞 Contact & Support

- **Issues:** [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email:** support@example.com (coming soon)

---

## 🌟 Star History

If you find this project helpful, please consider giving it a ⭐ on GitHub!

---

**Built with ❤️ for the Physical AI community**

*Last Updated: December 11, 2025*
