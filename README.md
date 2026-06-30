# JudgeSphere

JudgeSphere is a backend system for an online programming judge. It provides REST APIs for authentication, problem management, submissions, and isolated code execution using Docker and BullMQ.

The project is built with a scalable backend architecture using Node.js, Express, PostgreSQL, Redis, BullMQ, Docker, and TypeScript.

---

## Features

### Authentication

* User Registration
* User Login
* JWT Access & Refresh Tokens
* Logout
* Protected Routes

### Problem Management

* Create Problems
* View All Problems
* View Problem Details
* View My Problems
* Delete Problems
* Multiple Sample Examples
* Hidden Test Cases

### Submission System

* Create Submission
* View Submission
* View My Submissions
* Submission History

## Judge Engine

- Asynchronous submission processing using BullMQ
- Docker-based sandboxed execution
- Language-specific execution pipeline
- Hidden test case evaluation
- Automatic verdict generation
- Runtime measurement
- Sandbox lifecycle management

---

## Current Verdicts

* Accepted (AC)
* Wrong Answer (WA)
* Compilation Error (CE)
* Runtime Error (RE)
* Time Limit Exceeded (TLE)
* Internal Error

---

## Tech Stack

### Backend

* Node.js
* Express.js
* TypeScript

### Database

* PostgreSQL
* Drizzle ORM

### Queue

* Redis
* BullMQ

### Sandbox

* Docker

### Authentication

* JWT
* bcrypt

### Validation

* Zod

---

## Project Structure

```text
src/
│
├── config/
│
├── db/
│   ├── schema/
│   └── migrations/
│
├── executor/
│   ├── docker.ts
│   └── cpp.executor.ts
│
├── middleware/
│
├── modules/
│   ├── auth/
│   ├── problems/
│   └── submissions/
│
├── queue/
│
├── utils/
│   └── sandbox.ts
│
└── workers/
```

---

## Architecture

```text
                    Client
                       │
                       ▼
                  Express API
                 ┌─────┴─────┐
                 ▼           ▼
           PostgreSQL      Redis
                              │
                              ▼
                         BullMQ Queue
                              │
                              ▼
                      Submission Worker
                              │
                              ▼
                       Docker Sandbox
                              │
                              ▼
                  Compile & Execute Code
                              │
                              ▼
                     Generate Verdict
                              │
                              ▼
                      Update Database
```

---

## Database Schema

* Users
* Refresh Tokens
* Problems
* Problem Examples
* Test Cases
* Submissions

---

## Supported Languages

* C++

More languages (Java, Python, JavaScript) are planned.

---

## Submission Lifecycle

```text
QUEUED
   │
   ▼
RUNNING
   │
   ▼
FINISHED
```

After execution a verdict is assigned:

```text
AC
WA
CE
RE
TLE
```

---

## Running the Project

### Clone the repository

```bash
git clone <repository-url>
cd JudgeSphere
```

### Install dependencies

```bash
npm install
```

### Configure environment

Create a `.env` file:

```env
PORT=3000

DATABASE_URL=postgresql://username:password@localhost:5433/judgesphere

JWT_ACCESS_SECRET=your_access_secret

JWT_REFRESH_SECRET=your_refresh_secret
```

### Start PostgreSQL & Redis

Use Docker Compose or your local installation.

### Run migrations

```bash
npx drizzle-kit migrate
```
### Build the Docker image

```bash
docker build -t judgesphere-cpp .
```

This image contains the C++ compiler used by the judge engine.

### Start the API

```bash
npm run dev
```

### Start the Worker

```bash
npm run worker
```

---

## Current API

### Authentication

```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

### Problems

```
POST   /api/v1/problems
GET    /api/v1/problems
GET    /api/v1/problems/me
GET    /api/v1/problems/:id
DELETE /api/v1/problems/:id
```

### Submissions

```
POST /api/v1/submissions
GET  /api/v1/submissions/me
GET  /api/v1/submissions/:id
```

---

## Roadmap

- Java Support
- Python Support
- JavaScript Support
- Socket.IO live submission updates
- Memory usage measurement
- Docker resource limits
- Output Limit Exceeded (OLE)
- Presentation Error (PE)
- Rejudge support
- Object storage for source code
- Distributed workers
- Execution metrics and monitoring