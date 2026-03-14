# 🛒 ShelfSense: Intelligent Grocery Store Management

<div align="center">
  <img src="https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite-blue?style=for-the-badge&logo=react" alt="Frontend" />
  <img src="https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-009688?style=for-the-badge&logo=fastapi" alt="Backend" />
  <img src="https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Styling" />
  <p><strong>Transforming local grocery operations through modern software.</strong></p>
  <p><strong><a href="https://shelfsense-xi.vercel.app/">🚀 View Live Demo</a></strong></p>
</div>

---

## 🎯 The Problem

Local and independent grocery stores face an uphill battle when managing their daily operations. Traditional Point of Sale (POS) and inventory systems are often bulky, expensive, and fail to cater to the nuanced needs of smaller retailers. Key challenges include:

- **Complex Inventory Tracking:** Difficulty managing products sold by weight or volume (e.g., loose produce) versus discrete pre-packaged items.
- **Lack of Actionable Insights:** Store owners lack real-time visibility into "stock health," making it hard to predict when to restock items before they run out.
- **Clunky Interfaces:** Outdated UIs slow down the checkout process and increase the learning curve for staff.
- **Fragmented Systems:** Disconnected tools for sales, inventory, and analytics lead to data silos and manual reconciliation.

## 💡 The Solution: ShelfSense

**ShelfSense** is a comprehensive, full-stack management ecosystem custom-built for modern grocery retail. It abstracts away the complexity of inventory and sales tracking into a seamless, blazing-fast web application.

By leveraging a robust **FastAPI backend** and a highly responsive **React + Vite frontend**, ShelfSense provides store owners with a unified, intuitive dashboard to monitor stock health, record dynamic sales, and analyze business performance in real time.

---

## ✨ Key Features & Technical Highlights

### 📦 Smart Inventory System

- **Dual Tracking Modes:** Natively supports both _Count-based_ (pre-packaged) and _Weight/Volume-based_ (loose) items, ensuring accurate tracking down to the decimal.
- **Stock Health Monitoring:** Automated low-stock alerts and "stock health" scoring logic to proactively prevent stockouts.

### 💳 Streamlined POS (Point of Sale)

- **Frictionless Checkout:** A rapid `RecordSale` interface designed for speed, allowing absolute flexibility with quantity adjustments and dynamic pricing based on unit types.

### 📊 Real-Time Analytics & Dashboard

- **Data-Driven Insights:** Comprehensive dashboard widgets showing daily revenue, popular items, and crucial inventory alerts.
- **Dedicated Analytics Engine:** API-driven statistical endpoints calculating trends and performance metrics over time.

### 🔒 Secure Multi-Tenant Architecture

- **JWT Authentication:** Robust user authentication ensuring data privacy.
- **Store-level Isolation:** Designed with a normalized database schema (`User` -> `Store` -> `Product` & `Sale`) enabling scalable, multi-tenant operations.

---

## 🛠️ Technology Stack

### Frontend

- **Framework:** React 19 + Vite (Blazing fast HMR and optimized builds)
- **Styling & UI:** Tailwind CSS + Radix UI Primitives (Accessible, unstyled components)
- **Routing:** React Router v7
- **Data Visualization:** Recharts
- **Animations:** Motion (Framer Motion)

### Backend

- **Framework:** FastAPI (High performance, async-ready Python framework)
- **Database:** SQLite / SQLAlchemy ORM (Easily swappable to PostgreSQL)
- **Validation:** Pydantic (Strict schema checking and self-documenting APIs)
- **Authentication:** JWT (JSON Web Tokens) with Passlib (bcrypt)

---

## 🚀 Getting Started

Follow these steps to run ShelfSense locally on your machine.

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

### 1. Backend Setup

Navigate to the backend directory and set up the Python environment:

```bash
cd backend
python -m venv venv
# Activate the virtual environment:
# On Windows: venv\Scripts\activate
# On macOS/Linux: source venv/bin/activate

pip install -r requirements.txt
```

Start the FastAPI server:

```bash
fastapi dev main.py
# The API will run on http://localhost:8000
```

### 2. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
# The app will be available at http://localhost:5173
```

---

## 📂 Project Architecture

```text
ShelfSense/
├── backend/                  # FastAPI Application
│   ├── api/                  # Route handlers (auth, products, sales, etc.)
│   ├── core/                 # App configuration & Database setup
│   ├── models/               # SQLAlchemy ORM definitions
│   ├── schemas/              # Pydantic validation schemas
│   └── services/             # Core business logic decoupled from routes
└── frontend/                 # React Application
    ├── src/
    │   ├── api/              # Axios API client hooks
    │   ├── components/       # Reusable UI components
    │   ├── pages/            # Main views (Dashboard, POS, Analytics)
    │   └── routes.jsx        # Route definitions and data loaders
```

---

## 🚀 Future Scope

- **Vertical Scaling & Modularization:** Refactor the architecture to seamlessly cater to diverse retail verticals (e.g., pharmacies, hardware stores) through a highly extensible, modular plugin system.
- **Barcode Scanner Integration:** Expand POS capabilities with external hardware support.
- **Supplier Order Automation:** Generate purchase orders automatically for low-stock items.
- **Advanced Predictive Analytics:** Incorporate ML to forecast demand based on seasonal trends.
