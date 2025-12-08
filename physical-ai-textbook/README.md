# Physical AI Textbook Platform

An interactive learning platform for **Physical AI & Humanoid Robotics**, teaching the "Sim-to-Real" journey from simulation to real-world deployment.

Built with [Docusaurus 3.x](https://docusaurus.io/)

## 🎯 Features

- Interactive Landing Page with feature showcase
- Structured 3-part curriculum (Fundamentals, Simulation, Real World)
- Chapter template with Theory, Code Examples, and Interactive Components
- Multilingual support (English + Urdu structure)
- Dark mode cyberpunk theme
- Accessibility-first (WCAG 2.1 AA, Lighthouse ≥90)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
npm run serve
```

The site opens at `http://localhost:3000`

## 🧪 Testing

```bash
npm test              # Unit tests
npm run test:e2e      # E2E tests
npm run test:lighthouse  # Accessibility audit
npm run typecheck     # TypeScript check
```

## 📁 Project Structure

```
physical-ai-textbook/
├── docs/              # MDX content
├── src/
│   ├── components/    # React components
│   ├── css/          # Theme styling
│   └── pages/        # Custom pages
├── tests/            # Unit & E2E tests
└── i18n/             # Translations
```

## 🎨 Tech Stack

- **Framework**: Docusaurus 3.x
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4 + Infima
- **Testing**: Jest, Playwright, Lighthouse CI

## 📚 Documentation

See `../specs/001-physical-ai-platform/` for:
- `spec.md` - Feature requirements
- `plan.md` - Architecture decisions
- `tasks.md` - Implementation tasks
- `quickstart.md` - Detailed setup guide

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel && vercel
```

### GitHub Pages
```bash
GIT_USER=<username> npm run deploy
```

## 🤝 Contributing

Contributions welcome! See project spec for guidelines.

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ for Physical AI learners
