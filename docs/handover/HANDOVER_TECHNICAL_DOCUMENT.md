# MFI Platform – Handover Technical Document

**Project:** Millers for Nutrition (MFI)  
**Repository:** MFI-Web  
**Firebase Project:** ignite-program  
**Maintained by:** TechnoServe (Ignite Program)  
**Last Updated:** 2026-02  

---

## 1. Purpose of This Document

This Handover Technical Document provides a comprehensive technical overview of the MFI platform for the purpose of:

- Ownership transfer
- Vendor transition
- Long-term maintenance
- Audit and compliance
- Business continuity and disaster recovery

It is intended for senior engineers, IT managers, and external technical partners.

---

## 2. Platform Ownership & Responsibility

| Area | Owner |
|----|------|
| Source Code | TechnoServe |
| Firebase Project | Ignite Program |
| Cloud Billing | TechnoServe |
| Deployment | Authorized engineers only |
| Secrets Management | Platform maintainers |

---

## 3. High-Level Architecture

The MFI platform is deployed entirely on **Firebase (Google Cloud Platform)**.

Core components:
- Firebase Hosting (frontend)
- Firebase Cloud Functions (backend API)
- Firestore (database)
- Firebase Authentication
- Firebase Storage

A detailed architecture diagram is available at:

```
docs/architecture/mfi-architecture.png
```

---

## 4. Old vs Current Technical Setup

### 4.1 Old Setup (Legacy)

| Component | Value |
|--------|------|
| Cloud Functions Runtime | nodejs18 |
| Local Node Version | Node 18.x |
| Firebase CLI | < 15 |
| Dependency Strategy | Loose / legacy |
| Documentation | Minimal |

---

### 4.2 Current Setup (Active)

| Component | Value |
|--------|------|
| Cloud Functions Runtime | nodejs20 |
| Local Node Version | **Node 20.18.2** |
| Firebase CLI | **15.4.0** |
| Dependency Strategy | Pinned & audited |
| Documentation | Versioned Markdown |

> This upgrade improves security, long-term support, and deployment reliability.

---

## 5. Repository & Codebase Structure

```
MFI-Web/
├── frontend/        # React admin dashboard
├── functions/       # Firebase Cloud Functions (API)
├── docs/            # Architecture & documentation
├── firebase.json    # Firebase configuration
├── package.json     # Root scripts
```

---

## 6. Backend Architecture (Cloud Functions)

- **Generation:** Cloud Functions Gen 1
- **Region:** us-central1
- **Framework:** Express.js
- **Routing:** `/api/v1/*`

Gen 1 was intentionally retained for stability and compatibility.

---

## 7. Authentication & Authorization Model (MFI)

- Firebase Authentication is used for identity
- Backend issues JWT tokens
- No Firebase custom claims are used
- Authorization is enforced via backend logic and Firestore data

> Note: KMFI uses a different authorization model. This document applies strictly to MFI.

---

## 8. Environment Variables & Secrets

Secrets are stored in a `.env` file located at:

```
functions/.env
```

### Active Environment Variables

| Variable | Purpose |
|-------|---------|
| AUTH_FILE | Service account credentials |
| PROJECT_ID | Firebase project ID |
| NODE_ENV | Environment flag |
| FRONTEND_URL | Allowed frontend origin |
| TRANSACTIONAL_EMAIL_ADDRESS | Email sender |
| SMTP_USERNAME | SMTP auth |
| SMTP_PASSWORD | SMTP auth |
| SMTP_ENDPOINT | SMTP server |
| REPLY_TO_EMAIL | Reply-to address |

⚠️ `.env` is intentionally excluded from version control.

---

## 9. Database (Firestore)

- Firestore runs in **Native mode**
- Database region: **nam5**
- Single logical database for MFI
- Composite indexes are required and documented separately

---

## 10. Storage

- Firebase Storage is used for document uploads
- Access controlled via Firebase rules
- Migration and backup performed using `gsutil`

---

## 11. Deployment Process (Summary)

Full deployment instructions are documented in:

```
docs/deployment/DEPLOYMENT_RUNBOOK.md
```

High-level steps:
1. Build frontend
2. Deploy functions
3. Deploy hosting
4. Verify production endpoints

---

## 12. Disaster Recovery & Backup

### Firestore
- Export via `gcloud firestore export`
- Stored in Google Cloud Storage

### Authentication
- Users exportable via Firebase Admin SDK

### Storage
- Backup via `gsutil rsync`

---

## 13. Risks, Constraints & Known Limitations

| Area | Notes |
|----|------|
| Secrets | Stored in `.env` (planned future migration) |
| Functions | Gen 1 (stable, not deprecated yet) |
| Frontend | React 17 (upgradeable) |

---

## 14. Recommended Future Improvements

- Migrate secrets to Firebase Params
- Introduce CI/CD pipeline
- Upgrade frontend to React 18+
- Formalize staging environment

---

## 15. Sign-off & Acknowledgement

This document reflects the system state at the time of handover and is approved for operational continuity.

---
