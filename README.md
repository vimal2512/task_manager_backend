# Task Management API

A secure and role-based Task Management API built using **Node.js**, **Express**, and **MongoDB**. It supports user registration, login, task creation, assignment, and admin functionalities like managing users and roles.

## Features

- User Authentication (JWT + Refresh Tokens)
-  Role-based Access Control (`user`, `admin`)
-  Task CRUD operations
-  Token Refreshing & Logout
-  Admin operations (User listing, role update, delete)
- Input validation with Joi
- CORS enabled (Frontend @ `http://localhost:3000`)
- Error handling middleware
- Modular file structure

## Tech Stack

- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Authentication: JWT (Access & Refresh Tokens), bcryptjs
- Validation: Joi
- Environment: dotenv

---

##Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local)
- npm or yarn

---

### Installation

```bash
git clone https://github.com/yourusername/task-manager-api.git
cd task-manager-api
npm install
