# Data Entry Tool

A full-stack web application for streamlined data entry, management, and reporting. The project consists of a React frontend and a Node.js/Express backend, designed for easy collaboration and extensibility.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Folder Structure](#folder-structure)
- [Frontend (React)](#frontend-react)
- [Backend (Nodejs--Express)](#backend-nodejs--express)
- [Setup & Installation](#setup--installation)
- [Running the Project](#running-the-project)
- [Environment Variables](#environment-variables)
- [Key Features](#key-features)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

This tool enables users to input, manage, and report on company, production, certification, operational, and other business data. It supports user authentication, role-based access, document uploads, and admin dashboards. The backend exposes RESTful APIs, while the frontend provides a modern, responsive UI.

---

## Folder Structure

```
├── frontend/           # React frontend
│   ├── public/
│   ├── src/
│   │   ├── adminpages/
│   │   ├── assets/
│   │   ├── context/
│   │   ├── instant/
│   │   ├── loginpages/
│   │   ├── shared/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── SI Backend/         # Node.js/Express backend
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── socket/
│   │   └── util/
│   ├── dataEntryMiddle/
│   ├── localStorage/
│   ├── uploads/
│   ├── index.js
│   └── package.json
│
├── README.md
└── ...
```

---

## Frontend (React)

- Located in the `frontend/` folder
- Built with React 18, React Router, Bootstrap, MUI, Chart.js, and more
- Main entry: `frontend/src/App.js`
- Key features: Multi-step forms, dashboards, authentication, PDF generation, charts, and responsive design

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

### Install dependencies

```bash
cd "SI Backend"
npm install
```

### Run the backend

```bash
npm start
```

- Runs on [http://localhost:5000](http://localhost:5000) by default (configurable)

---

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

## Contributing

- Fork the repo and create a new branch for your feature or bugfix
- Follow the existing code style and structure
- Add clear commit messages
- Test your changes before submitting a pull request

---

## License

This project is licensed under the MIT License.
