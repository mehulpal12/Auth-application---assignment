# 🔐 MERN Authentication System

> A production-oriented MERN authentication application implementing a secure **Two-Token Authentication** architecture using short-lived JWT Access Tokens and long-lived Refresh Tokens stored in HttpOnly cookies.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)
![Docker](https://img.shields.io/badge/Docker-Containerization-2496ED)

---

# 📖 Overview

This project is a full-stack authentication system built using the MERN ecosystem with modern security practices.

Instead of storing JWTs in Local Storage, the application follows a production-oriented authentication approach:

- Short-lived Access Tokens
- Long-lived Refresh Tokens
- HttpOnly Secure Cookies
- Silent Token Refresh
- Password Hashing
- Protected Routes
- Secure Session Management

The project demonstrates authentication architecture commonly used in modern web applications.

---

# ✨ Features

## Authentication

- User Registration
- User Login
- User Logout
- Protected Dashboard
- Current User Endpoint (`/me`)

---

## Security

- JWT Access Token (15 Minutes)
- JWT Refresh Token (7 Days)
- HttpOnly Cookie
- SameSite Cookie
- Secure Cookie Support
- Refresh Token Hashing
- Password Hashing (bcrypt)
- Protected Express Middleware
- Zod Request Validation
- Environment Variable Configuration

---

## Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- Axios
- Authentication Context
- Silent Refresh
- Protected Routes
- Modern Authentication UI

---

## Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Cookie Parser
- CORS Configuration
- Docker Ready

---

# 🏗️ Architecture

```
                    +----------------------+
                    |      Next.js App     |
                    |----------------------|
                    | Login / Signup UI    |
                    | AuthContext          |
                    | Axios Interceptors   |
                    +----------+-----------+
                               |
                               |
                     HTTPS + Bearer Token
                               |
                               ▼
                  +--------------------------+
                  |     Express Backend      |
                  |--------------------------|
                  | Authentication Routes    |
                  | JWT Middleware           |
                  | Cookie Parser            |
                  | Prisma ORM               |
                  +------------+-------------+
                               |
                               |
                               ▼
                  +--------------------------+
                  |      PostgreSQL DB       |
                  |--------------------------|
                  | User                     |
                  | Hashed Password          |
                  | Hashed Refresh Token     |
                  +--------------------------+
```

---

# 🔄 Authentication Flow

```
User Login

↓

Verify Credentials

↓

Generate Access Token (15 Minutes)

↓

Generate Refresh Token (7 Days)

↓

Hash Refresh Token

↓

Store Hash in Database

↓

Set Refresh Token as HttpOnly Cookie

↓

Return Access Token

↓

User Accesses Protected APIs

↓

Access Token Expires

↓

Axios calls /auth/refresh

↓

New Access Token Issued

↓

User Continues Without Logging In Again
```

---

# 🔑 Token Strategy

| Token | Lifetime | Storage |
|---------|----------|----------|
| Access Token | 15 Minutes | React Memory (AuthContext) |
| Refresh Token | 7 Days | HttpOnly Secure Cookie |

## Why?

### Access Token

- Short-lived
- Never stored in Local Storage
- Removed when page closes
- Resistant to XSS attacks

### Refresh Token

- Stored in HttpOnly Cookie
- Cannot be accessed by JavaScript
- Automatically sent by browser
- Used only for generating new Access Tokens

---

# 🛡️ Security Decisions

## Password Hashing

Passwords are hashed using **bcrypt** before storing in PostgreSQL.

---

## Refresh Token Hashing

Refresh Tokens are hashed before being stored in the database.

Even if the database is compromised, raw refresh tokens cannot be recovered.

---

## HttpOnly Cookies

Refresh Tokens are issued using:

- HttpOnly
- Secure
- SameSite=Lax

This prevents client-side JavaScript from reading the cookie.

---

## No Local Storage

Access Tokens are intentionally **not** stored in Local Storage.

Keeping tokens in memory significantly reduces the attack surface for Cross-Site Scripting (XSS).

---

# 📂 Folder Structure

```
mern-auth-system/

├── backend/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── utils/
│   └── index.ts
│
└── frontend/
    ├── app/
    │   ├── login/
    │   ├── signup/
    │   ├── dashboard/
    │   └── layout.tsx
    │
    ├── components/
    ├── context/
    ├── lib/
    └── types/
```

---

# 📊 Database Schema

```
User

id
name
email
password
hashedRefreshToken
createdAt
updatedAt
```

---

# 📡 API Endpoints

## Authentication

### POST

```
/api/auth/signup
```

Create a new user account.

---

### POST

```
/api/auth/login
```

Authenticate user credentials.

Returns:

- Access Token

Sets:

- Refresh Token Cookie

---

### POST

```
/api/auth/refresh
```

Generates a new Access Token using the Refresh Token.

---

### POST

```
/api/auth/logout
```

Clears:

- Refresh Token Cookie
- Refresh Token Hash in Database

---

### GET

```
/api/auth/me
```

Returns authenticated user information.

---

### GET

```
/api/dashboard
```

Protected dummy endpoint.

---

# ⚙️ Environment Variables

Backend

```env
PORT=5000

DATABASE_URL=

JWT_ACCESS_SECRET=

JWT_REFRESH_SECRET=

CLIENT_URL=
```

Frontend

```env
NEXT_PUBLIC_API_URL=
```

---

# 🚀 Local Setup

## Clone Repository

```bash
git clone https://github.com/yourusername/mern-auth-system.git
```

---

## Backend

```bash
cd backend

npm install

npx prisma generate

npx prisma db push

npm run dev
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🐳 Docker

Run the complete application.

```bash
docker-compose up --build
```

Stop

```bash
docker-compose down
```

---

# ☁️ Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon PostgreSQL |

### Why These Platforms?

**Vercel**

- Optimized for Next.js
- Global CDN
- Easy deployment

**Render**

- Simple Express deployment
- HTTPS support
- Environment variables

**Neon PostgreSQL**

- Serverless PostgreSQL
- Prisma compatible
- Free developer tier

---

# 🧪 Testing Checklist

- User Registration
- Login
- Logout
- Protected Routes
- Refresh Token
- Silent Refresh
- Invalid Credentials
- Expired Access Token
- Expired Refresh Token
- Unauthorized Requests

---

# 📈 Future Improvements

- Email Verification
- Password Reset
- Refresh Token Rotation
- OAuth Login (Google/GitHub)
- Multi-Factor Authentication
- Session Management
- Redis Session Store
- Rate Limiting
- Login Notifications

---

# 🛠️ Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express.js
- Prisma ORM

### Database

- PostgreSQL

### Authentication

- JWT
- bcrypt
- Cookie Parser

### Deployment

- Docker
- Vercel
- Render
- Neon PostgreSQL

---

# 📄 License

This project is provided for educational and demonstration purposes.

---

## 👨‍💻 Author

**Mehul Pal**

GitHub: https://github.com/mehulpal12

LinkedIn: https://www.linkedin.com/in/mehul-pal-3ab6891b2/

Portfolio: https://mehulpal-portfolio.vercel.app/
