# 🌾 Sahakar Setu (सहकार सेतु)
### AI-Enabled Cooperative Capacity Building, ERP & Employment Ecosystem

> **Smart India Hackathon (SIH 2026)**  
> **Problem Statement ID**: `26087` | **Theme**: Smart Education | **Category**: Hardware  
> **Team ID**: `26087` | **Team Name**: HexaForge  
> **Organization**: National Council for Cooperative Training (NCCT), Ministry of Cooperation, Govt. of India  
> **Live Web Prototype**: [sahaker-setu.vercel.app](https://sahaker-setu.vercel.app) | **AI Assistant**: [ncct-chatbot.vercel.app](https://ncct-chatbot.vercel.app)

---

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![Autocannon](https://img.shields.io/badge/Load_Tested-100_Conns_Zero_Drop-brightgreen?style=for-the-badge)](loadtest/RESULTS.md)
[![DPDP Act 2023](https://img.shields.io/badge/Compliance-DPDP_Act_2023-blueviolet?style=for-the-badge)](#-feasibility-viability--compliance)

---

## 📌 Problem Statement & Proposed Solution

### The Challenge
NCCT operates premier institutes (VAMNICOM Pune, 14 Regional Institutes of Cooperative Management - RICMs/ICMs) and oversees thousands of Primary Agricultural Credit Societies (PACS). Currently, NCCT lacks a unified, AI-enabled digital platform for training ERP, attendance, verifiable certification, and cooperative job matching. Furthermore, rural training centers suffer from frequent power cuts and zero cellular data connectivity.

### The Solution: Sahakar Setu
An integrated, multi-tenant digital ecosystem combining:
1. **Training ERP**: Streamlines candidate registrations, batch allocation, trainer scheduling, timetables, and hostel logistics.
2. **Smart LMS**: Multilingual courseware (English, Hindi, Marathi, etc.), interactive content, assessments, and progress tracking.
3. **Digital Skill Passport**: Verifiable digital credentials with tamper-proof QR verification ready for DigiLocker.
4. **AI Career & Job Matching**: Transparent skill-overlap engine matching trainees to cooperative enterprises with skill-gap advisories.
5. **Apex Analytics Dashboard**: Centralized tracking of institute capacity, attendance fidelity, certifications, and rural employment outcomes.
6. **Offline Attendance & Data Sync** — Stores attendance and learning transactions locally during connectivity failures and synchronizes them with the central system when connectivity is restored.
---

## 📸 Web Dashboard & Working Prototype Outputs

The system is deployed and fully operational. Below are the functional views of the platform:

### 1. NCCT Administrator Apex Dashboard
Cross-institute governance aggregating training performance, courses, certificates issued, and attendance rates across member institutes (`inst_a`, `inst_b`, `inst_c`).
![NCCT Administrator Dashboard]<img width="1600" height="801" alt="WhatsApp Image 2026-09-20 at 17 39 16 (2)" src="https://github.com/user-attachments/assets/bd9b2e6e-a42f-434e-a27c-1e5bf56f6bdb" />


---

### 2. Training ERP — Trainee Management & Registration
Institute-level trainee directory displaying profile details, tagged competencies, and batch registration forms with tenant isolation.
![Training ERP - Trainees Management]<img width="1600" height="806" alt="WhatsApp Image 2026-09-20 at 17 39 16 (1)" src="https://github.com/user-attachments/assets/fc821ef3-85eb-47bf-b99e-1d3701b348c3" />


---

### 3. Smart LMS — Multilingual & Offline-Ready Courses
Curriculum catalog supporting multi-language delivery (English, Hindi, Marathi) with duration tracking and `offlineCapable` caching flags for remote learners.
![Smart LMS - Course Management]<img width="1600" height="805" alt="WhatsApp Image 2026-09-20 at 17 39 16" src="https://github.com/user-attachments/assets/4acd8b49-4a34-45fb-9df8-064b81cf72e0" />


---

### 4. Edge Attendance Module (FaceID / QR / Manual)
Simulates edge terminal event logging (Raspberry Pi). Processes facial landmarks on-device with liveness detection; zero raw biometric images are transmitted or stored.
![Edge Attendance Terminal]
<img width="700" height="1600" alt="image" src="https://github.com/user-attachments/assets/5264b14a-5a53-4f1d-8c45-76a173cbc318" />
<img width="1600" height="811" alt="WhatsApp Image 2026-09-20 at 17 39 15 (1)" src="https://github.com/user-attachments/assets/ca08a3c6-d23a-480d-8d06-19a86d39a7c2" />


---

### 5. Digital Skill Passport & Public QR Verification
Issues tamper-proof certificates with embedded cryptographic verification URLs, allowing employers to verify credentials without authentication.
![Digital Skill Passport]<img width="1600" height="807" alt="WhatsApp Image 2026-09-20 at 17 39 15" src="https://github.com/user-attachments/assets/3556194b-b7ca-4312-b78e-4b41a9907a91" />


---

### 6. AI Career & Job Matching Engine
Transparent weighted skill-overlap engine (`lib/matching.js`). Evaluates candidate skills against cooperative job vacancies, computes percentage match, and highlights skill gaps.
![AI Career & Job Matching]<img width="1600" height="805" alt="WhatsApp Image 2026-09-20 at 17 39 14" src="https://github.com/user-attachments/assets/194f9ded-bb4b-4378-b681-f31c0f3009ce" />


---

### 7. Institutional Performance Analytics
Analytics dashboard comparing student throughput, batch performance, and completion rates across cooperative institutes.
![Institutional Performance Analytics]<img width="1600" height="805" alt="WhatsApp Image 2026-09-20 at 17 39 13" src="https://github.com/user-attachments/assets/d7100742-3028-49c0-a9f0-62795dd82d27" />

---

### 8. NCCT AI Career Assistant (RAG Chatbot)
Dedicated multilingual AI assistant powered by Retrieval-Augmented Generation (RAG) providing real-time guidance on NCCT training programs, VAMNICOM, 14 ICMs, and cooperative careers.
![NCCT AI Assistant Chatbot]<img width="1600" height="803" alt="WhatsApp Image 2026-09-20 at 17 39 17" src="https://github.com/user-attachments/assets/07887dba-6646-47fa-a1e0-e77b86058d0b" />

---

## 🛠️ Technical Architecture & Key Flows

### Accessible Platforms & Tech Stack
- **Web Application**: Next.js 14, React 18, Tailwind CSS, Recharts.
- **Mobile Application**: React Native (Offline-first with local SQLite cache).
- **Face ID Edge Device**: Raspberry Pi 4 / ESP32 / Electron with Camera Module & Local Storage.

### System Architecture Flow

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 1. ACCESSIBLE PLATFORMS                                 │
│         Learners (Mobile App)  •  Faculty (Web Portal)  •  Management (Edge Kiosk)      │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              2. SECURE API GATEWAY (NGINX)                              │
│       SSL Termination  •  Rate Limiting  •  Load Balancing  •  Request Routing         │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   3. IDENTITY & ACCESS (KEYCLOAK / JWT AUTH GUARD)                      │
│        SSO (OAuth2 / OIDC)  •  Role-Based Access Control (RBAC)  •  Tenant Isolation   │
└─────────────────────┬───────────────────────────────────────────┬──────────────────────┘
                      │                                           │
                      ▼                                           ▼
┌──────────────────────────────────────────────┐ ┌───────────────────────────────────────┐
│     4. CORE SERVICES (NESTJS / NODE.JS)      │ │   5. AI / ML SERVICES (PYTHON/FASTAPI)│
│ • User Management    • Assessment Service    │ │ • Face Landmark Recognition           │
│ • Training & Course  • Attendance Service    │ │ • Career Assistant (RAG LLM)         │
│ • Certificate Service• Job Matching Service  │ │ • Explainable Job Matching Engine     │
│ • Notification       • Analytics Service     │ │ • Predictive Dropout Analytics        │
└─────────────────────┬────────────────────────┘ └───────────────────┬───────────────────┘
                      │                                              │
                      ▼                                              ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                    6. EVENT STREAMING & ASYNC QUEUES (REDIS / BULLMQ)                  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                       7. PERSISTENT DATA LAYER & NATIONAL APIS                         │
│ PostgreSQL / SQLite  •  MinIO / S3  •  Bhashini  •  DigiLocker  •  National Career (NCS)│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Key Operational Flows

```
┌────────────────────────────────┐     ┌────────────────────────────────┐
│   1. USER LOGIN & ACCESS       │     │   2. LEARNING & ASSESSMENT     │
│   User (Web / Mobile / Device) │     │   Access Offline Courses       │
│               ↓                │     │               ↓                │
│   NGINX (API Gateway)          │     │   Attend Sessions / Take Tests │
│               ↓                │     │               ↓                │
│   Keycloak (SSO / RBAC Token)  │     │   Evaluate & Store Results     │
│               ↓                │     │               ↓                │
│   Role-Based Dashboard         │     │   Analytics & Progress Tracking│
└────────────────────────────────┘     └────────────────────────────────┘
┌────────────────────────────────┐     ┌────────────────────────────────┐
│   3. ATTENDANCE (FACE ID)      │     │   4. CERTIFY & EMPLOY          │
│   Capture Face / Scan QR Code  │     │   Complete Training Program    │
│               ↓                │     │               ↓                │
│   Local Processing (Liveness)  │     │   Issue QR Certificate (Digi)  │
│               ↓                │     │               ↓                │
│   Store Offline in SQLite      │     │   Explainable AI Job Match     │
│               ↓                │     │               ↓                │
│   Sync to Backend Attendance   │     │   Notify Candidate of Vacancy  │
└────────────────────────────────┘     └────────────────────────────────┘
```

---


- **Offline Curriculum**: Textbooks, vocational training videos (H.264/H.265), and quizzes accessible without mobile data.
- **Biometric Attendance**: Edge FaceID with liveness verification; stores attendance logs locally in SQLite and syncs upstream when connectivity returns.
- **Power Autonomy**: Sized with a 12V LiFePO4 battery buffer delivering up to 48 hours of continuous operation without sunlight.

---

## 📈 Feasibility, Viability & Compliance

- **Technical Feasibility**: Built with battle-tested open-source components (Next.js, Node.js, SQLite/PostgreSQL, Raspberry Pi).
- **Operational Feasibility**: Natively supports NCCT's hierarchy (Apex NCCT ➔ RICMs/ICMs ➔ Trainees) with two-way offline sync.
- **Economic Feasibility**: Open-source architecture and low-cost edge BOM ($< \$150$) drastically reduce rollout and maintenance costs.
- **Regulatory Feasibility (DPDP Act 2023)**: Face data is processed locally into 128-d embeddings and raw camera frames are discarded immediately.
- **Scalability**: Zero errors under 100 concurrent connections (**~1,100–2,000 req/sec**); proven horizontal scalability with Docker Compose and NGINX load balancer.

---

## 🌟 Impacts & Stakeholder Benefits

| Stakeholder | Key Impact & Value Delivered |
|---|---|
| **Learners & Rural Youth** | Accessible, multilingual offline education, verified digital skills, and automated job matching. |
| **Faculty & Trainers** | Automated attendance, streamlined assessments, and real-time student progress tracking. |
| **Institute Management** | Centralized records, paperless operations, and enhanced placement metrics. |
| **Cooperative Employers** | Access to pre-screened, verified rural talent with transparent skill ratings. |
| **National Growth (NCCT)** | Scalable cooperative capacity building directly supporting UN Sustainable Development Goals (SDGs 4, 8, and 9). |

---

## 📚 Research Foundations & Citations

1. **Rural Digital Literacy**:  
   Gogoi, A., Manoranjini, M., & Gupta, M. (2025). *Design and implementation of digital literacy training programme: Findings of a quasi-experimental study from rural India.* **PLOS Digital Health**. Supports Sahakar Setu's rural-first, multilingual approach.
2. **AI Vocational Job Matching**:  
   Xiao, Y., & Li, Q. (2026). *Bayesian network modelling for predicting employment tendency and major matching of vocational education students.* **Discover Artificial Intelligence (Springer Nature)**. Underpins our AI-based career guidance module.
3. **Overcoming Rural Connectivity Barriers**:  
   Kaur, D. H. (2025). *Offline Realities in an Online Era: Barriers to Virtual Learning in Rural Indian Colleges.* **International Education and Research Journal**. Validates our solar-powered offline-first Wi-Fi hub.

---

## 🚀 Quick Start Guide

### 1. Installation & Running Locally

```bash
# Clone the repository
git clone https://github.com/subashini-debug/sahaker-setu.git
cd sahaker-setu

# Install dependencies
npm install

# Seed demo database (creates institutes, users, courses, jobs)
npm run seed

# Start development server
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) in your browser.

### 2. Pre-Configured Demo Credentials (Password: `password123`)

| Role | Email | Tenant Scope |
|---|---|---|
| **NCCT Apex Admin** | `ncct.admin@sahakarsetu.in` | All institutes (cross-tenant rollup) |
| **Institute A Admin** | `admin.a@sahakarsetu.in` | Pune Institute only |
| **Faculty (Inst A)** | `faculty.a@sahakarsetu.in` | Pune Institute courses & attendance |
| **Trainee 1** | `trainee1@sahakarsetu.in` | Personal Skill Passport & Job Matches |

### 3. Load Testing & Docker Scaling Demo

```bash
# Autocannon load test
npm run build && npm run start &
npm run loadtest

# Multi-instance Docker Compose with NGINX load balancer
docker compose -f loadtest/docker-compose.scaling.yml up --build
LOADTEST_URL=http://localhost:8080 node loadtest/run.js
```

---

## 👥 Team HexaForge — SIH 2026

* **Project**: Sahakar Setu — Cooperative Capacity Building, ERP & Employment Ecosystem
* **Problem Statement ID**: 26087
* **Organization**: National Council for Cooperative Training (NCCT), Ministry of Cooperation, Govt. of India
* **Repository**: [https://github.com/subashini-debug/sahaker-setu](https://github.com/subashini-debug/sahaker-setu)

---
*Built with ❤️ by Team HexaForge for India's Cooperative Movement.*
