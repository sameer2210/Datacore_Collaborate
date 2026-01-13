![login](/data%20entry%20tool/show/l.jpeg)
---

## Workflow

### 1. User Registration & Authentication

- Users register and verify their email (OTP-based)
- Login with credentials; JWT-based authentication
- Role-based access (Admin, Super Admin, User)

### 2. Data Entry (Frontend)

- Users fill multi-step forms: Company Info → Production Details → Certifications → Documents Upload → Operational Data → Electrical, HVAC, SCADA, Building, etc.
- Sidebar navigation for step progress
- Data is validated and submitted to backend APIs

### 3. Admin Dashboard

- Admins can view/manage users, reports, and analytics
- Assign roles, approve/reject reports, monitor submissions

### 4. File Uploads & Reports

- Users upload supporting documents (PDF, images, etc.)
- Generate and preview PDF reports
- Download or share reports

### 5. Payments & Subscriptions

- Stripe integration for subscription plans
- Admins manage plans, view revenue analytics

### 6. Notifications

- Email notifications for registration, password reset, report status, etc. (SendGrid)

### 7. Real-time Features

- Chat and call booking (for support/admin)
- Real-time updates via Socket.io

---

## New & Notable Features

- Modular folder structure for easy scaling
- Multi-role authentication and onboarding
- Step-based data entry with autosave
- PDF generation and preview
- Stripe payment integration
- Admin analytics dashboard
- File/document upload and management
- Real-time chat and call booking
- Comprehensive error handling and validation

---

# Data Entry Tool

A full-stack web application for streamlined data entry, management, and reporting. The project consists of a React frontend and a Node.js/Express backend, designed for easy collaboration and extensibility.

![dashboard](/data%20entry%20tool/show/d.jpeg)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Full File Structure & Descriptions](#full-file-structure--descriptions)
- [Frontend (React)](#frontend-react)
- [Backend (Nodejs--Express)](#backend-nodejs--express)
- [Setup & Installation](#setup--installation)
- [Running the Project](#running-the-project)
- [Environment Variables](#environment-variables)
- [Key Features](#key-features)
- [Workflow](#workflow)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

This tool enables users to input, manage, and report on company, production, certification, operational, and other business data. It supports user authentication, role-based access, document uploads, and admin dashboards. The backend exposes RESTful APIs, while the frontend provides a modern, responsive UI.

---

## Full File Structure & Descriptions

### Root

```
├── README.md                # Project documentation
├── frontend/                # React frontend app
├── SI Backend/              # Node.js/Express backend app
```

### Frontend (`frontend/`)

```
├── .env                     # Frontend environment variables
├── .gitignore               # Git ignore rules
├── api/                     # API utility functions/endpoints
├── build/                   # Production build output (auto-generated)
├── node_modules/            # Node.js dependencies (auto-generated)
├── package.json             # Project metadata and dependencies
├── public/                  # Static public assets (index.html, favicon, etc.)
├── src/                     # Source code
│   ├── adminpages/          # Admin dashboard, user management, etc.
│   ├── api/                 # API endpoint helpers
│   ├── assets/              # Images, SVGs, and static assets
│   ├── components/          # Reusable React components
│   ├── context/             # React context providers (Auth, Form, Org, etc.)
│   ├── instant/             # Axios instances for API calls
│   ├── loginpages/          # User-facing forms and data entry pages
│   ├── shared/              # Shared UI elements (Sidebar, UploadFile, etc.)
│   ├── theme/               # Theme and color configuration
│   ├── utils/               # Utility functions and hooks
│   ├── App.js               # Main React app component
│   ├── App.css              # App-wide styles
│   ├── index.js             # React entry point
│   ├── index.css            # Global styles
│   ├── logo.svg             # Logo asset
│   ├── reportWebVitals.js   # Performance measuring
│   ├── setupTests.js        # Test setup
```

#### Example: What do some files/folders do?

- `adminpages/` - Admin dashboard, user management, analytics
- `loginpages/` - Multi-step forms for company, production, certification, etc.
- `shared/Sidebar.js` - Navigation sidebar for step-based forms
- `utils/report.endpoints.js` - API endpoints for reports
- `context/FormContext.js` - React context for form state

### Backend (`SI Backend/`)

```
├── .env                     # Backend environment variables
├── .gitignore               # Git ignore rules
├── dataEntryMiddle/         # Custom Express middleware (auth, mail, etc.)
├── index.js                 # Main backend entry point
├── localStorage/            # Local JWT/session storage (dev only)
├── node_modules/            # Node.js dependencies (auto-generated)
├── output.txt               # Output logs (dev only)
├── package.json             # Project metadata and dependencies
├── src/                     # Source code
│   ├── config/              # App config, DB connection
│   ├── middleware/          # Express middleware (auth, error, quota, etc.)
│   ├── models/              # Mongoose models and route controllers
│   ├── routes/              # API route aggregators
│   ├── socket/              # Socket.io setup
│   ├── util/                # Utility functions (AWS S3, sendgrid, etc.)
│   ├── index.js             # Express app setup
├── uploads/                 # Uploaded files (user docs, etc.)
```

#### Example: What do some files/folders do?

- `dataEntryMiddle/` - Custom middleware for authentication, mail, user logic
- `src/models/` - Contains all business logic for users, reports, data entry, etc.
- `src/routes/routesAll.js` - Aggregates all API routes
- `uploads/` - Stores uploaded documents

---

## Frontend (React)

- Located in the `frontend/` folder
- Built with React 18, React Router, Bootstrap, MUI, Chart.js, and more
- Main entry: `frontend/src/App.js`
- Key features: Multi-step forms, dashboards, authentication, PDF generation, charts, and responsive design

![sub](/data%20entry%20tool/show/s.jpeg)

### Install dependencies

```bash
cd frontend
npm install
```

### Run the frontend

```bash
npm start
```

- Runs on [http://localhost:3000](http://localhost:3000) by default

---

## Backend (Node.js & Express)

- Located in the `SI Backend/` folder
- Built with Express, Mongoose, JWT, SendGrid, Stripe, and more
- Main entry: `SI Backend/index.js` and `SI Backend/src/index.js`
- Features: REST APIs, authentication, role-based access, file uploads, Stripe integration, email notifications

## Environment Variables

Both frontend and backend require environment variables. Create a `.env` file in each folder as needed.

### Example for Backend (`SI Backend/.env`):

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_key
STRIPE_SECRET_KEY=your_stripe_key
```

### Example for Frontend (`frontend/.env`):

```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Key Features

- User authentication (JWT, role-based)
- Multi-step data entry forms
- Company, production, certification, operational, and electrical data modules
- File/document uploads
- Admin dashboard and user management
- PDF report generation
- Stripe payment integration
- Email notifications (SendGrid)
- Responsive UI with charts and analytics

---

## Running the Project

1. Clone the repository
2. Install dependencies in both `frontend` and `SI Backend`
3. Set up environment variables as shown above
4. Start the backend server
5. Start the frontend app
6. Access the app at [http://localhost:3000](http://localhost:3000)

---
