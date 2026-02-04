# 📚 MFI Platform – Documentation Index

Welcome to the official documentation hub for the **Millers for Nutrition (MFI)** platform.

This folder contains all technical, operational, and handover documentation required to **run, maintain, audit, and transition** the MFI system.

---

## 🧭 Documentation Overview

### 👩‍💻 Technical Training
**For developers, vendors, and technical partners**

- 📘 **Tech Training Manual**  
  `docs/training/TECH_TRAINING_MANUAL.md`  
  Learn how the system works, how to run it locally, and how to troubleshoot common issues.

---

### 🔁 Handover & Continuity
**For IT leadership, auditors, and incoming vendors**

- 📙 **Handover Technical Document**  
  `docs/handover/HANDOVER_TECHNICAL_DOCUMENT.md`  
  Covers ownership, architecture, old vs current setup, secrets, risks, and disaster recovery.

---

### 🚀 Deployment & Operations
**For release engineers and operations teams**

- 📕 **Deployment Runbook**  
  `docs/deployment/DEPLOYMENT_RUNBOOK.md`  
  Step-by-step, production-safe instructions for deploying and rolling back the MFI platform.

---

## 🏗️ Architecture

- 🖼️ **System Architecture Diagram**  
  `docs/architecture/mfi-architecture.png`  
  Visual overview of Firebase Hosting, Cloud Functions, Firestore, Auth, and Storage.

---

## 🧩 Platform Scope Notes

- This documentation applies specifically to **MFI**.
- **KMFI** is deployed separately and follows different authorization rules.
- MFI does **not** use Firebase custom claims for roles.
- Secrets are currently managed via a `.env` file in the `functions/` directory.

---

## 🛠️ Tooling Summary

| Tool | Version |
|---|---|
| Node.js | 20.18.2 |
| Firebase CLI | 15.4.0 |
| Cloud Functions Runtime | nodejs20 (Gen 1) |
| Frontend | React 17 + Webpack |

---

## 📌 Maintenance Guidelines

- Keep documentation updated alongside code changes
- Update version numbers when runtimes or tooling change
- Review deployment procedures quarterly
- Archive deprecated docs instead of deleting them

---

## 📞 Support & Ownership

**Maintained by:**  
TechnoServe – Ignite Program  

For access requests, deployment approvals, or incidents, contact the platform maintainers.

---

*This index is the authoritative entry point for all MFI technical documentation.*
