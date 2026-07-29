# 🛡️ Secure Auth Platform — MERN Two-Token Authentication System

[![Next.js](https://img.shields.io/badge/Frontend-Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Backend-Express.js-green?style=for-the-badge&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Deployment-Docker-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

A production-ready **Two-Token Authentication System** built using the MERN stack architecture (PostgreSQL, Express, Next.js, and Node.js). This project implements secure cookie-based session persistence, in-memory access tokens, silent token rotation, and a protected dummy dashboard workspace.

---

## 🖼️ Application Core Flow

The application implements standard OAuth2-like secure session persistence:

```
  ┌─────────────────┐             POST /login or /signup             ┌─────────────────┐
  │                 ├───────────────────────────────────────────────>│                 │
  │                 │                                                │                 │
  │ Client Browser  │  Access Token (JSON) + HttpOnly Cookie (Set)   │ Express Backend │
  │                 │<───────────────────────────────────────────────┤                 │
  │                 │                                                └─────────────────┘
  └────────┬────────┘                                                         ▲
           │                                                                  │
           │                     POST /refresh (Silent Cookie Exchange)       │
           └──────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

- **🛡️ Secure Two-Token Architecture**: Separate short-lived Access Token and long-lived Refresh Token.
- **🔒 In-Memory Access Tokens**: Stored strictly in React context state to prevent XSS theft.
- **🍪 HttpOnly Refresh Cookie**: Exchanged via a secure, `HttpOnly`, `SameSite=Lax` cookie.
- **🔄 Automatic Silent Refresh**: Axios response interceptors intercept `401 Unauthorized` responses and request a new Access Token automatically.
- **🔑 Refresh Token Hashing**: Refresh tokens are cryptographically hashed in the PostgreSQL database using `bcryptjs` to protect against data leaks.
- **✨ Premium UI Interface**: Beautiful modern glassmorphic login, signup, and dashboard screens.
- **🐳 Multi-Container Docker Stack**: Pre-configured `docker-compose` setup for local development.

---

## 🛠️ Tech Stack & Security Decisions

### Tech Stack
- **Frontend**: Next.js 16 (App Router), Tailwind CSS v4, Axios, Lucide Icons, React Context API.
- **Backend**: Node.js, Express, TypeScript, Zod Payload Validation, rate limiter, helmet.
- **Database**: PostgreSQL with Prisma ORM.

### Security Decisions
1. **XSS Mitigation**: The access token is stored in-memory, making it inaccessible to malicious client scripts via `document.cookie` or `localStorage`.
2. **CSRF Mitigation**: The refresh token is transmitted using cookies with `SameSite=Lax` constraint and CORS permissions.
3. **Database Compromise Safety**: The refresh token is hashed via `bcryptjs` before being stored in the database's `hashedRefreshToken` field, preventing session hijacking even if the database records are compromised.

---

## 📡 API Endpoints

All API endpoints are unified under `/api`:

| Method | Route | Authentication | Payload (Zod) | Description |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/signup` | Public | `{ name, email, password }` | Registers a new user. Sets refresh cookie and returns access token + user details. |
| **POST** | `/api/auth/login` | Public | `{ email, password }` | Authenticates credentials. Sets refresh cookie and returns access token + user details. |
| **POST** | `/api/auth/refresh` | Cookie-Only | None (Reads cookie) | Validates refresh token cookie. Returns a new access token. |
| **POST** | `/api/auth/logout` | Protected | None (Bearer header) | Erases database refresh token and clears the client's cookie. |
| **GET** | `/api/auth/me` | Protected | None (Bearer header) | Retrieves the current user's profile details. |
| **GET** | `/api/dashboard` | Protected | None (Bearer header) | Dummy protected route that returns server status details. |

---

## 📁 Folder Structure

```
mern-auth-assignment/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Simplified schema (User model only)
│   └── src/
│       ├── config/
│       │   └── prisma.ts         # Prisma client initialization
│       ├── controllers/
│       │   └── auth.controller.ts # Signup, login, refresh, logout logic
│       ├── middlewares/
│       │   ├── auth.middleware.ts # verifyJWT access token helper
│       │   └── error.middleware.ts# Global express error handler
│       ├── routes/
│       │   ├── auth.routes.ts     # Auth routers
│       │   └── index.ts          # Unified sub-router mounting
│       ├── schemas/
│       │   └── auth.schema.ts     # Zod payload validators
│       ├── services/
│       │   └── auth.service.ts    # DB queries & business operations
│       └── utils/
│           ├── jwt.ts            # Token generator and verification utility
│           └── response.ts       # Uniform API response standard
└── frontend/
    ├── app/
    │   ├── (auth)/
    │   │   ├── login/
    │   │   │   └── page.tsx      # Sign-in page
    │   │   └── signup/
    │   │       └── page.tsx      # Sign-up page
    │   ├── dashboard/
    │   │   └── page.tsx          # Dummy protected dashboard
    │   ├── globals.css           # Global stylesheet and Tailwind settings
    │   ├── layout.tsx            # Global layout wrapper with AuthProvider
    │   └── page.tsx              # Root auto-redirect router
    ├── components/
    │   └── ProtectedRoute.tsx    # Auth checker for frontend pages
    ├── context/
    │   └── AuthContext.tsx       # Auth context storing access tokens in memory
    └── lib/
        └── api.ts                # Axios instance (handles refresh interceptors)
```

---

## ⚡ Setup Instructions

### Environment Variables

#### Backend (`backend/.env`)
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/auth_db?sslmode=disable"
JWT_SECRET="super-secret-access-key-change-this"
NODE_ENV="development"
```

---

### Local Installation

#### 1. Backend Setup
```bash
# Navigate into backend directory
cd backend

# Install npm packages
npm install

# Build Prisma Client & Sync Schema
npm run prisma:generate
npx prisma db push

# Start the dev server
npm run dev
```
The backend API server will start on: `http://localhost:5000`

#### 2. Frontend Setup
```bash
# Navigate into frontend directory
cd ../frontend

# Install npm packages
npm install

# Start Next.js dev server
npm run dev
```
The client dashboard will start on: `http://localhost:3000`

---

## 🐳 Docker Compose Deployment

To spin up the entire production-ready container stack (Backend API + Next.js App + PostgreSQL DB) in isolated environments:

```bash
docker-compose up --build
```

- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000/api`

To tear down the containers:
```bash
docker-compose down
```