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
[![Hardware](https://img.shields.io/badge/Hardware-Solar--Powered_Offline_Wi--Fi_Hub-orange?style=for-the-badge)](#-hardware-edge-node-solar-powered-offline-wi-fi-hub)
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
6. **Solar-Powered Offline Wi-Fi Hub**: Edge hardware node (Raspberry Pi/ESP32) providing zero-data local Wi-Fi course streaming and FaceID attendance in off-grid rural areas.

---

## 📸 Web Dashboard & Working Prototype Outputs

The system is deployed and fully operational. Below are the functional views of the platform:

### 1. NCCT Administrator Apex Dashboard
Cross-institute governance aggregating training performance, courses, certificates issued, and attendance rates across member institutes (`inst_a`, `inst_b`, `inst_c`).
![NCCT Administrator Dashboard](screenshots/01_ncct_admin_dashboard.jpeg)

---

### 2. Training ERP — Trainee Management & Registration
Institute-level trainee directory displaying profile details, tagged competencies, and batch registration forms with tenant isolation.
![Training ERP - Trainees Management](screenshots/02_trainees_erp.jpeg)

---

### 3. Smart LMS — Multilingual & Offline-Ready Courses
Curriculum catalog supporting multi-language delivery (English, Hindi, Marathi) with duration tracking and `offlineCapable` caching flags for remote learners.
![Smart LMS - Course Management](screenshots/03_lms_courses.jpeg)

---

### 4. Edge Attendance Module (FaceID / QR / Manual)
Simulates edge terminal event logging (Raspberry Pi). Processes facial landmarks on-device with liveness detection; zero raw biometric images are transmitted or stored.
![Edge Attendance Terminal](screenshots/04_edge_attendance.jpeg)

---

### 5. Digital Skill Passport & Public QR Verification
Issues tamper-proof certificates with embedded cryptographic verification URLs, allowing employers to verify credentials without authentication.
![Digital Skill Passport](screenshots/05_digital_skill_passport.jpeg)

---

### 6. AI Career & Job Matching Engine
Transparent weighted skill-overlap engine (`lib/matching.js`). Evaluates candidate skills against cooperative job vacancies, computes percentage match, and highlights skill gaps.
![AI Career & Job Matching](screenshots/06_ai_job_matching.jpeg)

---

### 7. Institutional Performance Analytics
Analytics dashboard comparing student throughput, batch performance, and completion rates across cooperative institutes.
![Institutional Performance Analytics](screenshots/07_institutional_analytics.jpeg)

---

### 8. NCCT AI Career Assistant (RAG Chatbot)
Dedicated multilingual AI assistant powered by Retrieval-Augmented Generation (RAG) providing real-time guidance on NCCT training programs, VAMNICOM, 14 ICMs, and cooperative careers.
![NCCT AI Assistant Chatbot](screenshots/08_ai_assistant_chatbot.jpeg)

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
