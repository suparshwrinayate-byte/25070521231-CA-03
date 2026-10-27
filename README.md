# MediTrack: Inventory, simplified

MediTrack is a full-stack web app for managing a medicine inventory. It tracks stock levels and expiry dates in one place and warns you about medicines that are expired, expiring soon, or running low.

Built as a Fullstack Development course assignment with a **React** client and a **Node.js / Express / MongoDB** server.

---

## Features

- **Landing page** with Login and Create Account options
- **Authentication**: create account, login and logout (JWT based, passwords hashed)
- **Dashboard overview** with live stats: Total Products, Total Units, Expiring Soon, Low Stock
- **Medicine inventory**: add, edit and delete medicines
- **Search** by medicine name, brand or batch
- **Filters** by status (All, Expiring soon, Expired, Low stock, In stock) and by category
- **Expiry tracker** and **Low stock alerts** to see what needs attention
- **Export CSV** of the inventory
- Toast notifications and a responsive layout

---

## Tech Stack

| Part | Technology |
|---|---|
| Client | React, Vite, CSS |
| Server | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JSON Web Tokens (JWT), bcryptjs |

---

## Project Structure

```
25070521231-CA-03/
├── client/                  React app (Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── styles.css
│   │   ├── context/AuthContext.jsx
│   │   └── pages/           LandingPage.jsx, AuthPage.jsx
│   ├── vite.config.js
│   └── .env.example
├── server/                  Express API
│   ├── config/              database connection
│   ├── controllers/         medicine and auth logic
│   ├── middleware/          auth check, error handler
│   ├── models/              Medicine, User
│   ├── routes/              medicine and auth routes
│   ├── seed.js              sample data
│   ├── server.js
│   └── .env.example
└── README.md
```

---

## Prerequisites

Install these first:

- [Node.js](https://nodejs.org) (LTS version)
- [Git](https://git-scm.com)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community), installed as a service and running on `127.0.0.1:27017`

Check them in PowerShell:

```powershell
node -v
npm -v
git --version
Get-Service *mongo*
```

---

## Setup

### 1. Clone the repository

```powershell
git clone https://github.com/suparshwrinayate-byte/25070521231-CA-03.git
cd 25070521231-CA-03
```

### 2. Set up the server

```powershell
cd server
npm install
copy .env.example .env
```

Open `server/.env` and set the values:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/meditrack
CLIENT_URL=http://localhost:5173
JWT_SECRET=put_a_long_random_secret_here
JWT_EXPIRES_IN=7d
```

> Never upload your real `.env` file to GitHub. It is already listed in `.gitignore`.

Optional: fill the database with sample medicines.

```powershell
npm run seed
```

### 3. Set up the client

```powershell
cd ..\client
npm install
copy .env.example .env
```

`client/.env` should contain:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Running the App

You need two terminals, one for the server and one for the client.

**Terminal 1: server**

```powershell
cd server
npm start
```

You should see `MongoDB connected` and the server running on `http://localhost:5000`.

**Terminal 2: client**

```powershell
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

### Quick start on Windows

Create a file named `start.bat` in the project root with this content, then double-click it to start both:

```bat
@echo off
start "Server" cmd /k "cd /d %~dp0server && npm start"
start "Client" cmd /k "cd /d %~dp0client && npm run dev"
```

---

## How to Use

1. Open the site and click **Create Account**.
2. Register with your name, email and password, then you are taken to the dashboard.
3. Use **Add medicine** to add items, and the edit and delete buttons to manage them.
4. Use the search box and filters to find medicines, and watch the stat cards for expiry and low-stock warnings.
5. Click the logout button in the sidebar to sign out.

---

## API Endpoints

Base URL: `http://localhost:5000/api`

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create a new account |
| POST | `/auth/login` | Login and receive a token |
| GET | `/auth/me` | Get the logged-in user |

### Medicines (login required, send `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/medicines` | List medicines (supports `?search=`, `?category=`, `?status=`) |
| GET | `/medicines/stats` | Dashboard statistics |
| POST | `/medicines` | Add a medicine |
| PUT | `/medicines/:id` | Update a medicine |
| DELETE | `/medicines/:id` | Delete a medicine |

### Other

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Check that the API is running |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `ECONNREFUSED 127.0.0.1:27017` | MongoDB is not running. Start it with `net start MongoDB` in an administrator PowerShell. |
| `Cannot find module ...` | Run `npm install` inside the `server` or `client` folder. |
| Blank page and `React is not defined` | Make sure `client/vite.config.js` exists and uses the React plugin. |
| Port already in use | Close old servers: `Stop-Process -Name node -Force` |
| Data does not load in the client | Check that the server is running and `VITE_API_URL` is correct. |

---

## Author

**SUPARSHW RINAYATE**
Course: Fullstack Development
GitHub: [suparshwrinayate-byte](https://github.com/suparshwrinayate-byte)

---

## License

This project was created for educational purposes.
