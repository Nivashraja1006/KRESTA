# KRESTA

## AI-Powered Restaurant Operations & Intelligence Platform
**A Production-Quality Enterprise SaaS Platform for Multi-Branch Restaurant Operations, Machine Learning Forecasting, and Grounded Business Intelligence.**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.110-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_18_%2B_TypeScript-61DAFB.svg?style=flat&logo=react)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_16-4169E1.svg?style=flat&logo=postgresql)](https://www.postgresql.org)
[![Scikit-Learn](https://img.shields.io/badge/AI%2FML-Scikit--Learn-F7931E.svg?style=flat&logo=scikit-learn)](https://scikit-learn.org)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/DevOps-Docker_Compose-2496ED.svg?style=flat&logo=docker)](https://www.docker.com)

---

## 1. Project Overview

**RestaurantIQ** is designed to demonstrate MNC-level software engineering, data analytics, machine learning pipelines, REST API architecture, and modern UI/UX for restaurant owners and managers.

Unlike simple ordering or basic CRUD college projects, **RestaurantIQ** functions end-to-end as a multi-tenant, multi-branch SaaS platform connecting:
- Real-time Point of Sale (POS) and table ordering
- Kitchen Display System (KDS) with live timers and workload indicators
- Recipe-driven automated inventory deductions
- Scikit-Learn **Gradient Boosting Regressor** for 7-day dish demand forecasting
- Lead time and safety-stock inventory replenishment optimizer
- **Isolation Forest** unsupervised anomaly detection across revenue and waste
- **K-Means RFM** (Recency, Frequency, Monetary) customer segmentation
- **NLP Aspect Sentiment Extraction** across customer reviews
- Grounded **AI Business Assistant** answering questions from live SQL metrics without hallucinating statistics

---

## 2. Architecture & Data Flow

```
[ Dining Floor / POS / Waiter ]           [ Kitchen KDS Display ]
              │                                      ▲
              ▼                                      │ (WebSockets)
     [ React 18 + TS UI ] ──── REST / JWT ───► [ FastAPI Backend ]
                                                     │
               ┌─────────────────────────────────────┼──────────────────────────────────┐
               │                                     │                                  │
               ▼                                     ▼                                  ▼
      [ PostgreSQL 16 DB ]                 [ Scikit-Learn / ML ]               [ Grounded AI Assistant ]
    - Multi-Branch Schema                - Gradient Boosting (Demand)         - SQL Intent Router
    - Recipe Bridge Deductions           - Isolation Forest (Anomalies)       - Verified Statistics Table
    - Immutable Audit Trails             - K-Means RFM (Customers)            - Actionable Recommendations
    - Alembic Migrations                 - NLP Aspect Sentiment               - Offline / LLM Abstraction
```

---

## 3. Technology Stack

### Backend
- **Python 3.11** with **FastAPI**
- **SQLAlchemy 2.0** ORM & **Alembic** migrations
- **PostgreSQL 16** (with automatic zero-setup SQLite fallback)
- **JWT (python-jose)** authentication & **Passlib/Bcrypt** password hashing
- **WebSockets** for live Kitchen Display System & notification events
- **Pytest** automated test suite

### Machine Learning & Data Science
- **Scikit-Learn**: `GradientBoostingRegressor`, `KMeans`, `IsolationForest`, `StandardScaler`
- **Pandas** & **NumPy** for feature engineering (lag 1, lag 7, rolling averages, cyclic calendar)
- Custom Aspect-Based **NLP Lexicon & Polarity Sentiment Analyzer**

### Frontend
- **React 19** with **TypeScript**
- **Vite** bundler
- **Tailwind CSS** with dark slate enterprise theme
- **Recharts** interactive data visualizations
- **Lucide React** modern iconography
- **Axios** with automatic token interceptors and 401 handling

### DevOps & Infrastructure
- **Docker** & **Docker Compose**
- Multi-stage container builds
- Comprehensive `.env.example`

---

## 4. User Roles & Access Matrix (RBAC)

| Operational Role | POS Orders | Kitchen KDS | Inventory & Recipes | AI Forecast & ML | Executive Analytics | Staff / Admin |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Super Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Owner** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Manager** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Chef** | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Staff** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 5. Quick Start (Running Locally)

### Prerequisites
- Python 3.11+
- Node.js v18+ and npm
- (Optional) Docker & Docker Desktop for PostgreSQL

### Step 1: Clone the Repository
```bash
git clone https://github.com/Nivashraja1006/KRESTA.git
cd KRESTA
```

### Step 2: Configure Environment Variables
```bash
cp .env.example .env
```
Before starting the backend, set a unique random `SECRET_KEY` in `.env`. To
create seeded demo accounts locally, also set a strong `DEMO_USER_PASSWORD`.
Keep `.env` private and never commit it.

### Step 3: Backend Setup
```bash
# Create virtual environment
python -m venv backend/venv

# Activate virtual environment
# Windows:
backend\venv\Scripts\activate
# Linux/macOS:
source backend/venv/bin/activate

# Run backend commands from the backend package root
cd backend

# Install requirements
pip install -r requirements.txt

# Seed realistic dataset
python -m app.core.seed

# Start FastAPI backend server
uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
```
API Documentation will be live at: [http://localhost:8080/docs](http://localhost:8080/docs)

### Step 4: Frontend Setup
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Platform UI will be live at: [http://localhost:5173](http://localhost:5173)

---

## 6. Demo Accounts

Demo accounts are created only when automatic seeding is enabled and the private
`DEMO_USER_PASSWORD` environment variable is set. All seeded demo roles share
that configured value. Set a unique, strong password in your local `.env` file;
the login shortcuts fill the account email only and never include a password.

---

## 7. Running with Docker Compose

To spin up the entire multi-tier stack (PostgreSQL + FastAPI + Nginx Frontend):
```bash
# Set POSTGRES_PASSWORD and replace the SECRET_KEY placeholder in .env first.
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API & Swagger: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432`

---

## 8. Running Automated Tests

Execute the Pytest test suite covering authentication, RBAC, orders, inventory, demand forecasting, and the AI assistant:
```bash
# Windows
backend\venv\Scripts\pytest.exe -v

# Linux / macOS
pytest -v
```

---

## 9. Comprehensive Documentation

Detailed architectural and module documents are available in the [`docs/`](docs/) directory:
- [`docs/architecture.md`](docs/architecture.md) &mdash; Detailed system architecture & component blueprints.
- [`docs/database.md`](docs/database.md) &mdash; PostgreSQL schema, table relationships, and index design.
- [`docs/api.md`](docs/api.md) &mdash; Versioned REST API endpoints and payload specifications.
- [`docs/ai-ml.md`](docs/ai-ml.md) &mdash; Machine Learning models, feature engineering, and evaluation metrics.
- [`docs/deployment.md`](docs/deployment.md) &mdash; Production deployment instructions and CI/CD guide.

---

## 10. License
Developed for Academic Innovation and Enterprise Demonstration. Licensed under the MIT License.
