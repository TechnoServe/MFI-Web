# MFI Platform – Deployment Runbook

**Project:** Millers for Nutrition (MFI)  
**Repository:** MFI-Web  
**Firebase Project:** ignite-program  
**Maintained by:** TechnoServe (Ignite Program)  
**Last Updated:** 2026-02  

---

## 1. Purpose of This Runbook

This Deployment Runbook provides **step-by-step, copy-safe instructions** for deploying the MFI platform.

It is intended for:
- Release engineers
- DevOps / operations staff
- Authorized technical partners

This runbook prioritizes **safety, repeatability, and auditability**.

---

## 2. Deployment Scope

This runbook covers deployment of:
- Frontend (Firebase Hosting)
- Backend API (Firebase Cloud Functions – Gen 1)

It does **not** cover:
- Database migrations
- Firestore index creation
- Authentication user imports

These are handled separately.

---

## 3. Prerequisites

### 3.1 Required Tooling

| Tool | Required Version |
|---|---|
| Node.js | **20.18.2** |
| Firebase CLI | **15.4.0** |
| npm | v9+ |
| Git | Latest |

Verify:
```bash
node -v
firebase --version
```

---

### 3.2 Access Requirements

- Access to the `ignite-program` Firebase project
- Firebase project selected locally:
```bash
firebase use ignite-program
```

- Valid `.env` file present:
```
functions/.env
```

---

## 4. Pre-Deployment Checklist (MANDATORY)

Before deploying, confirm all items below:

- [ ] Correct Firebase project selected
- [ ] Node.js version is 20.18.2
- [ ] Firebase CLI version is 15.4.0
- [ ] `.env` file exists in `functions/`
- [ ] No uncommitted critical changes
- [ ] Deployment approved by TechnoServe

---

## 5. Install Dependencies

From the repository root:

```bash
npm install
cd frontend && npm install
cd ../functions && npm install
```

---

## 6. Local Verification (Strongly Recommended)

### 6.1 Lint All Code
```bash
npm run lint
```

### 6.2 Run Emulators
```bash
firebase emulators:start
```

Verify:
- Frontend loads
- Login works
- API endpoints respond

---

## 7. Build Frontend (Required)

The frontend **must be built before deployment**.

```bash
cd frontend
npm run build
cd ..
```

Confirm build artifacts were generated successfully.

---

## 8. Deploy to Production

### 8.1 Deploy Everything (Recommended)

From repository root:
```bash
npm run deploy
```

This deploys:
- Cloud Functions
- Firebase Hosting

---

### 8.2 Deploy Functions Only (If Required)

```bash
firebase deploy --only functions
```

---

### 8.3 Deploy Hosting Only (If Required)

```bash
firebase deploy --only hosting
```

---

## 9. Post-Deployment Verification

After deployment, verify the following:

### 9.1 Frontend
- URL loads successfully
- No console errors
- Authentication works

### 9.2 Backend API
- Health endpoint responds:
```
/api/v1/health
```

- Protected endpoints return expected results

### 9.3 Email
- Transactional emails send successfully
- SMTP credentials valid

---

## 10. Rollback Strategy

### 10.1 Functions Rollback
- Firebase retains previous versions
- Redeploy last known good commit

### 10.2 Hosting Rollback
- Use Firebase Console → Hosting → Rollback
- Or redeploy previous build

---

## 11. Monitoring & Logs

### View Logs
```bash
firebase functions:log
```

### Firebase Console
- Functions → Logs
- Hosting → Usage
- Firestore → Usage

---

## 12. Common Deployment Errors & Fixes

| Error | Likely Cause | Resolution |
|---|---|---|
| Node version mismatch | Wrong Node installed | Switch to Node 20.18.2 |
| 403 Forbidden | Missing auth / rewrite | Verify hosting rewrites |
| Build fails | Frontend deps | Run `npm install` |
| Functions fail | Missing `.env` | Verify environment variables |

---

## 13. Deployment Rules & Governance

- Only authorized engineers may deploy
- Deployments must be logged
- Emergency deploys require post-incident review
- Production secrets must never be logged

---

## 14. References

- Firebase Documentation  
- Tech Training Manual: `docs/training/TECH_TRAINING_MANUAL.md`  
- Handover Technical Document: `docs/handover/HANDOVER_TECHNICAL_DOCUMENT.md`

---

## 15. Final Notes

This runbook reflects the **current, approved production deployment process** for MFI.

Any deviation must be documented and approved by TechnoServe.

---
