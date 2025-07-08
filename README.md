# MFI (Millers for Nutrition)

A Firebase-powered web application built to support millers' self-assessment and nutrition tracking across organizations.

## 📦 Project Structure

```
├── frontend         # React-based frontend interface
├── functions        # Firebase Cloud Functions (Node.js backend)
├── .husky           # Git hooks (pre-commit linting)
├── package.json     # Project metadata and scripts
```

## 🚀 Features

- 🔐 Firebase Authentication
- ☁️ Firebase Functions for backend logic
- 🌐 React-based frontend
- ✅ Linting and formatting with ESLint + Prettier
- 🧪 Git hooks using Husky and Pretty-Quick
- 📤 One-step deployment to Firebase

## 🛠️ Scripts

| Script            | Description                             |
|-------------------|-----------------------------------------|
| `npm run serve`   | Serve Firebase locally in production mode |
| `npm run deploy`  | Deploy app to Firebase                  |
| `npm run lint`    | Run lint checks for frontend and functions |
| `npm run format`  | Auto-format code with Prettier          |
| `npm run husky:install` | Set up Git hooks                  |
| `npm run pull:deploy`   | Pull from `develop` and deploy    |

## 📦 Installation

```bash
git clone https://github.com/TechnoServe/MFI-Web.git
cd MFI-main
npm install
```

> **Note:** This project requires Node.js version 18.18.0. If you're using NVM, run:

```bash
nvm use 18.18.0
```

### Install frontend and functions dependencies:

```bash
cd frontend && npm install
cd ../functions && npm install
```

## 🔧 Firebase Setup

Make sure you’ve initialized Firebase with the correct project settings:

```bash
firebase login
firebase use --add
```

To serve locally:

```bash
npm run serve
```

## ✅ Pre-commit Hooks

Linting runs automatically before every commit using Husky:

```bash
npm run lint
```

## 🌐 Live URL

[https://selfassessment.mfi-ng.org](https://selfassessment.mfi-ng.org)

## 📄 License

ISC License. See [LICENSE](LICENSE) for details.

## 🤝 Contributing

Pull requests are welcome. Please open an issue first to discuss what you’d like to change.

---

## 🐛 Bugs & Issues

Report issues here:  
👉 [https://github.com/TechnoServe/MFI-Web/issues](https://github.com/TechnoServe/MFI-Web/issues)
