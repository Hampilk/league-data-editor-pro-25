
# Getting Started

This guide will walk you through setting up Football League Analytics for local development.

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn package manager
- Git

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/football-league-analytics.git
cd football-league-analytics
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
football-league-analytics/
├── src/
│   ├── components/ - UI components
│   ├── hooks/      - Custom React hooks
│   ├── pages/      - Application pages/routes
│   ├── utils/      - Utility functions
│   ├── types/      - TypeScript type definitions
│   ├── services/   - API service layers
│   └── data/       - Static data & mock datasets
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Recommended Dev Tools

- [VS Code](https://code.visualstudio.com/) - Our recommended IDE
- [ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - For linting
- [Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - For code formatting
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - For Tailwind CSS support

## Troubleshooting

If you encounter any issues during setup, please check the following:

- Make sure you're using the correct Node.js version
- Clear your npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

If problems persist, please [open an issue](https://github.com/yourusername/football-league-analytics/issues/new) with details about your environment and the error you're experiencing.
