# MFI Platform – Technical Training Manual

**Project:** Millers for Nutrition (MFI)  
**Repository:** MFI-Web  
**Maintained by:** TechnoServe / Ignite Program  
**Last Updated:** 2026-02  

---

## 1. Purpose of This Document

This Technical Training Manual is designed to onboard developers, technical partners, and IT teams responsible for maintaining or extending the MFI platform.

It explains:
- How the system is structured
- How to run the system locally
- How key services interact
- How to safely make changes

This document assumes basic familiarity with JavaScript, Node.js, and Firebase.

---

## 2. High-Level System Overview

The MFI platform is a **Firebase-centric web application** composed of:

- **Frontend:** React (Webpack-based admin dashboard)
- **Backend:** Firebase Cloud Functions (Express API)
- **Database:** Firestore (NoSQL)
- **Authentication:** Firebase Authentication
- **Storage:** Firebase Cloud Storage
- **Hosting:** Firebase Hosting

All services are deployed under a single Firebase project.

---

## 3. Repository Structure

```
MFI-Web/
├── frontend/          # React admin dashboard
├── functions/         # Cloud Functions (API backend)
├── docs/              # Documentation (this file lives here)
├── firebase.json      # Firebase configuration
├── package.json       # Root scripts and tooling
```

### 3.1 Frontend (`/frontend`)
- React 17
- Webpack 5
- Chakra UI
- Redux Toolkit
- Axios for API calls

Key entry points:
- `src/index.js`
- `src/app.js`
- `webpack.config.js`

### 3.2 Backend (`/functions`)
- Node.js runtime: **20**
- Express-based API
- Firebase Admin SDK
- JWT-based session handling (custom, legacy-compatible)

Key entry points:
- `index.js` – main function export
- `index.admin.js` – admin-specific routes
- `middlewares/` – auth, validation
- `companies/`, `assessments/`, `admin/` – domain logic

---

## 4. Runtime & Tooling Requirements

### Required Versions
- **Node.js:** 20.18.2 (local)
- **Firebase CLI:** 15.4.0
- **npm:** v9+

Verify:
```bash
node -v
firebase --version
```

---

## 5. Environment Variables (.env)

The backend uses a `.env` file located in:

```
functions/.env
```

These values are read at deploy/runtime.

### Required Variables

| Variable | Description |
|--------|-------------|
| AUTH_FILE | Firebase service account JSON |
| PROJECT_ID | Firebase project ID |
| NODE_ENV | environment (production / development) |
| FRONTEND_URL | Allowed frontend origin |
| TRANSACTIONAL_EMAIL_ADDRESS | Sender email |
| SMTP_USERNAME | SMTP username |
| SMTP_PASSWORD | SMTP password |
| SMTP_ENDPOINT | SMTP host |
| REPLY_TO_EMAIL | Reply-to address |

⚠️ **Never commit `.env` to GitHub.**

---

## 6. Running Locally (Development)

### 6.1 Install Dependencies

```bash
npm install
cd frontend && npm install
cd ../functions && npm install
```

### 6.2 Start Firebase Emulators

```bash
firebase emulators:start
```

Services started:
- Firestore
- Functions
- Auth
- Hosting
- Storage

### 6.3 Start Frontend Dev Server

```bash
cd frontend
npm run start
```

---

## 7. API Architecture

The backend exposes a versioned REST API:

```
/api/v1/*
```

Routing is handled via:
- Firebase Hosting rewrites
- Express routers inside Cloud Functions

Example:
```js
app.use('/api/v1/companies', companiesRouter);
```

---

## 8. Authentication Model (MFI)

MFI uses **Firebase Authentication + JWT**.

Key notes:
- No role-based access via custom claims
- Access is based on backend validation and Firestore data
- JWTs are signed server-side

Login flow:
1. User authenticates
2. Backend issues JWT
3. Frontend stores token
4. Token sent on API requests

---

## 9. Database (Firestore)

- Firestore runs in **Native mode**
- Single logical database for MFI
- Collections are domain-driven (companies, assessments, scores, etc.)

Indexes are managed via Firestore composite indexes.

---

## 10. Common Developer Tasks

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
```

### Deploy Everything
```bash
npm run deploy
```

### Deploy Functions Only
```bash
firebase deploy --only functions
```

---

## 11. Debugging & Logs

### View Logs
```bash
firebase functions:log
```

### Emulator UI
```text
http://localhost:4000
```

---

## 12. Troubleshooting

**Port conflicts**
- Stop old emulators
- Check ports in `firebase.json`

**403 errors**
- Verify JWT
- Confirm FRONTEND_URL
- Check Hosting rewrites

**Deployment failures**
- Confirm Node version
- Confirm Firebase CLI version
- Check `.env` presence

---

## 13. Best Practices

- Always test in emulators first
- Never deploy directly from unreviewed branches
- Keep documentation updated with code changes
- Rotate secrets periodically

---

## 14. Support & Ownership

For access, issues, or escalations:
- TechnoServe Ignite Program
- Platform Maintainers

---
