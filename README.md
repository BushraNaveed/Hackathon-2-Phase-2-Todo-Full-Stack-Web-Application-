# 🚀 Hackathon II: Phase II - Full-Stack Todo Web Application

This repository contains the full-stack implementation for Phase II of the "Evolution of Todo" project. The console application has been transformed into a modern, multi-user web application using a monorepo structure, Spec-Driven Development, and a robust security model.

## 🎯 Functionality Objectives

* **Multi-User Todo Management:** Users can perform all 5 Basic Level CRUD operations (Create, View, Update, Delete, Toggle Complete) on their personal todo tasks.
* **Secure Authentication:** User isolation is strictly enforced. Each user can only view and modify their own tasks.

## 💻 Technology Stack

This project is built using a monorepo structure with distinct frontend and backend services: 

| Layer | Technology | Key Details |
| :--- | :--- | :--- |
| **Frontend** | `frontend/` (Next.js 16+) | TypeScript, App Router, Tailwind CSS for styling. |
| **Backend** | `backend/` (Python FastAPI) | RESTful API endpoints, uses SQLModel for ORM. |
| **Database** | Neon Serverless PostgreSQL | Persistent, scalable storage. |
| **Authentication** | Better Auth + JWT | Used for secure user signup/signin and API request verification. |
| **Development** | Spec-Kit Plus + Claude Code | Entire implementation generated via Spec-Driven Development. |

## 🛡️ Security: JWT Token Integration

The core security challenge of bridging JavaScript (Better Auth) and Python (FastAPI) is solved using **JSON Web Tokens (JWTs)**.

| Component | Role |
| :--- | :--- |
| **Better Auth (Frontend)** | Configured to issue a JWT upon user sign-in. |
| **Frontend API Client** | Attaches the JWT to every API request header: `Authorization: Bearer <token>`. |
| **FastAPI Backend** | Implements middleware to verify the JWT signature using a shared secret (`BETTER_AUTH_SECRET`), extracts the `user_id`, and passes it to the route handlers for filtering. |

## ⚙️ Project Structure (Monorepo)

The repository is organized to facilitate Spec-Driven Development and manage both services easily:
