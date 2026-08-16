# PizzaCraft: Complete Project Guide

This file explains what the project does, how its pieces work together, how to configure it, and how to run and test it locally.

## 1. What this project is

PizzaCraft is a full-stack pizza-delivery application built for Oasis Infobyte SIP Level 3 Task 1.

There are two applications inside this folder:

```text
Pizza-Delivery-App/
├── client/  # React website users and admins open in the browser
└── server/  # Node/Express API that handles database, auth, payments, emails
```

The browser never talks directly to MongoDB. It calls the Express API, and Express reads or writes MongoDB after checking authentication and validation rules.

## 2. Technologies and why they are used

| Technology | Where used | Purpose |
| --- | --- | --- |
| React + Vite | `client/` | Builds the fast, single-page user interface. |
| React Router | `client/src/App.jsx` | Changes pages without a full browser reload. |
| Node.js + Express | `server/` | Creates HTTP API endpoints such as login and orders. |
| MongoDB Atlas + Mongoose | `server/src/models/` | Stores users, admins, orders, and stock. Mongoose defines the data shape. |
| bcryptjs | authentication controller | Hashes passwords; plain passwords are never stored. |
| JWT | authentication middleware | Creates a signed login token that protects user/admin API routes. |
| Nodemailer | `services/emailService.js` | Sends verification, reset, and low-stock emails. |
| Razorpay | payment controller | Uses Razorpay **test mode** checkout and verifies payment signatures on the server. |
| node-cron | `jobs/lowStockJob.js` | Runs the low-stock check every six hours. |
| Socket.IO | `server.js` | Emits instant order-status events. The frontend also polls every 15 seconds as a reliable fallback. |

## 3. Important folders and files

```text
client/src/
├── App.jsx                 # All browser routes
├── App.css                 # Application styling
├── pages/                  # Complete screens: Login, Builder, Orders, Admin, etc.
├── components/             # Reusable UI pieces such as Navbar and PizzaPreview
├── data/pizzaData.js       # The five bases, five sauces, cheese, vegetable choices/prices
└── services/api.js         # One reusable function that calls the backend API

server/src/
├── server.js               # Starts Express, Socket.IO, CORS, routes and cron job
├── config/db.js            # Connects to MongoDB Atlas
├── models/                 # Mongoose schemas: User, Admin, Order, Inventory
├── controllers/            # Business logic for each API feature
├── routes/                 # Maps URL paths to controller functions
├── middleware/             # JWT checks, admin checks and error handling
├── services/emailService.js# Nodemailer configuration
├── jobs/lowStockJob.js     # Scheduled stock-alert process
└── utils/tokens.js         # Secure random verification/reset token helpers
```

## 4. Environment files — important

Use the environment files **inside `server` and `client`**. The root file `Pizza-Delivery-App/.env` is not automatically read by this code and can be ignored unless you have another separate tool using it.

### Server environment: `server/.env`

Create it from `server/.env.example`:

```bash
cd Pizza-Delivery-App/server
cp .env.example .env
```

Fill it like this (do not commit real secrets):

```env
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/pizzacraft
JWT_SECRET=use_a_long_random_secret_here
CLIENT_URL=http://localhost:5173

# Email is optional for an initial visual run, but required for verification/reset emails.
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com

# This creates the first admin account the first time the server starts.
ADMIN_NAME=PizzaCraft Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin12345

# Get these from Razorpay Dashboard in Test Mode.
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxx
```

Notes:

- For Gmail, `EMAIL_PASSWORD` must normally be a Google App Password, not your normal Gmail password.
- `JWT_SECRET` should be a long random value. Never expose it in the frontend.
- The configured admin is created only when it does not already exist. Change the environment value before first startup, or update/delete the admin document in MongoDB if necessary.
- Razorpay keys are required only to execute real test checkout. Never use live keys while testing this project.

### Client environment: `client/.env`

```bash
cd Pizza-Delivery-App/client
cp .env.example .env
```

For local development:

```env
VITE_API_URL=http://localhost:5000/api
```

Only variables beginning with `VITE_` are accessible in React. Never put a MongoDB URI, JWT secret, email password, or Razorpay secret here.

## 5. How to install and run

Open two terminals.

### Terminal 1: backend

```bash
cd /media/deshmukh-kiran/Kiran/Internship/OIBSIP/Pizza-Delivery-App/server
npm install
npm run dev
```

Expected message:

```text
MongoDB connected successfully
Server running on http://localhost:5000
```

### Terminal 2: frontend

```bash
cd /media/deshmukh-kiran/Kiran/Internship/OIBSIP/Pizza-Delivery-App/client
npm install
npm run dev
```

Open the Vite URL printed in the terminal, normally:

```text
http://localhost:5173
```

### Production build check

```bash
cd Pizza-Delivery-App/client
npm run build
```

This creates the deployable `client/dist` folder.

## 6. User flow: what happens after each action

### Register and verify email

1. User submits name, email and password on `/register`.
2. `POST /api/auth/register` validates a password of at least eight characters containing a number.
3. The server hashes the password with bcrypt and saves the user in MongoDB.
4. The server creates a secure random token, stores only its SHA-256 hash plus expiry, and emails the original token link.
5. The user opens `/verify-email?token=...`.
6. `POST /api/auth/verify-email` checks the hashed token and expiry, then marks `isVerified` true.
7. Login is permitted only after verification.

### Login and protected routes

1. Login calls `POST /api/auth/login`.
2. The server compares the submitted password with bcrypt.
3. It returns a JWT containing user ID and role.
4. React stores the JWT in `localStorage` and sends it on requests as:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

5. `authMiddleware.js` checks that token before the order and profile routes run.

### Forgot password

1. `/forgot-password` sends an email address.
2. The server stores a hashed, one-hour reset token and sends the reset link.
3. `/reset-password?token=...` submits a new valid password.
4. The server checks the expiry, re-hashes the password, and removes the reset token.

### Pizza builder and order

The builder has exactly four steps:

1. Five pizza bases
2. Five sauces
3. Cheese choice
4. Multiple vegetable choices

`pizzaData.js` provides names, prices and icons. The builder calculates the total in React and creates a **pending** order with `POST /api/orders`. The API checks that every selected ingredient currently exists in inventory.

### Payment and stock deduction

1. Checkout calls `POST /api/payment/create-order`.
2. The backend asks Razorpay Test Mode to make a Razorpay order.
3. Razorpay Checkout opens in the browser.
4. On success, React sends Razorpay order ID, payment ID and signature to `POST /api/payment/verify`.
5. The backend calculates the signature itself using `RAZORPAY_KEY_SECRET`. It never trusts the browser alone.
6. Only a verified payment is marked `paid`.
7. The backend deducts each ingredient in a MongoDB transaction. If any ingredient has no stock, the transaction is aborted and the user sees the out-of-stock message.

### Order tracking

An admin changes `Order Received` → `In Kitchen` → `Sent to Delivery`. The backend saves the status and emits a Socket.IO event to the correct user. The Orders page additionally reloads data every 15 seconds, so it continues to update even if a realtime connection is interrupted.

## 7. Admin flow

Go to `/admin` and sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `server/.env`.

Admin routes:

- `/admin` — statistics, orders, and inventory
- `/admin/orders` — same protected admin dashboard
- `/admin/inventory` — same protected admin dashboard

Before any user pays for a pizza, create stock items for all ingredients you want to sell. Names and categories must match the pizza builder data exactly.

Examples to create in Inventory:

| Name | Category | Example quantity | Example threshold |
| --- | --- | ---: | ---: |
| Thin Crust | Pizza Bases | 50 | 20 |
| Tomato | Sauces | 50 | 20 |
| Mozzarella | Cheeses | 50 | 20 |
| Onion | Vegetables | 50 | 20 |
| Corn | Vegetables | 50 | 20 |

The Admin screen can add items and increase/decrease their quantities. The API also allows threshold updates with `PATCH /api/admin/inventory/:id`.

## 8. API overview

| Method | Endpoint | Access | Use |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register user and send verification email |
| POST | `/api/auth/login` | Public | Get user JWT |
| POST | `/api/auth/verify-email` | Public | Verify token |
| POST | `/api/auth/forgot-password` | Public | Send reset email |
| POST | `/api/auth/reset-password` | Public | Set new password |
| GET | `/api/auth/profile` | User JWT | Get current user |
| GET/POST | `/api/orders` | User JWT | Read/create own orders |
| GET | `/api/orders/:id` | User JWT | Read one own order |
| POST | `/api/payment/create-order` | User JWT | Create Razorpay order |
| POST | `/api/payment/verify` | User JWT | Verify successful payment |
| POST | `/api/admin/login` | Public | Get separate admin JWT |
| GET | `/api/admin/dashboard` | Admin JWT | Get admin statistics |
| GET | `/api/admin/orders` | Admin JWT | Read every order |
| PATCH | `/api/admin/orders/:id/status` | Admin JWT | Change delivery status |
| GET/POST | `/api/admin/inventory` | Admin JWT | Read/add inventory |
| PATCH | `/api/admin/inventory/:id` | Admin JWT | Update quantity or threshold |

## 9. Key concepts to explain in a viva/interview

- **Frontend vs backend:** React renders interface; Express applies security/business rules; MongoDB persists data.
- **Mongoose model:** A schema enforcing fields and relationships for a MongoDB collection.
- **Hashing vs encryption:** bcrypt is one-way hashing. Passwords are checked by comparison, not decrypted.
- **JWT:** A signed, expiry-based proof that the caller has logged in. It is sent in an Authorization header.
- **Middleware:** A function that runs between a request and controller. Here it verifies user/admin JWTs.
- **Role-based access control:** Admin JWTs contain `role: "admin"`; user JWTs cannot call admin endpoints.
- **Environment variable:** Deployment-specific secret/configuration outside source code.
- **Payment verification:** The server checks Razorpay’s HMAC signature with the secret key before setting an order as paid.
- **Transaction:** Groups inventory changes and paid-status update so all succeed together or all are reverted. MongoDB Atlas supports this because it runs as a replica set.
- **Polling and Socket.IO:** Polling re-fetches periodically; Socket.IO pushes changes immediately. This project uses both for resilient status updates.

## 10. Testing checklist

1. Register a new user with `Testuser123` as a valid password pattern.
2. Verify from email. If email is not configured, check the server terminal for the intended email notice; configure Nodemailer before treating verification as fully tested.
3. Log in, open builder, select base/sauce/cheese/vegetables.
4. Add matching inventory in Admin first.
5. Create an order and complete Razorpay Test Mode checkout.
6. Open Orders; confirm payment shows paid.
7. In Admin, change status and confirm Orders changes automatically.
8. Reduce an item below its threshold and wait for the cron schedule to test the email alert.

## 11. Common problems

| Problem | Solution |
| --- | --- |
| `Unable to connect to server` | Start server first and confirm `VITE_API_URL` is `http://localhost:5000/api`. |
| MongoDB connection failed | Re-check `MONGO_URI`, Atlas database-user password, and Atlas Network Access IP allowlist. |
| Cannot log in after registration | Verify the email first. |
| Payment says not configured | Add both Razorpay test environment values and restart backend. |
| Ingredient out of stock | Create the exact inventory item/category and increase its quantity in Admin. |
| Email does not arrive | Configure `EMAIL_USER` and `EMAIL_PASSWORD` as an app password; inspect spam folder. |
| CORS error | Set `CLIENT_URL` to the exact frontend origin, then restart backend. |

## 12. Deployment summary

1. Push code without `.env` files or credentials.
2. Deploy `client` on Vercel. Set `VITE_API_URL=https://your-api-domain/api`.
3. Deploy `server` on Render/Railway. Add every `server/.env.example` variable in the platform’s environment settings.
4. Set `CLIENT_URL=https://your-vercel-domain` on backend.
5. Use MongoDB Atlas and Razorpay test keys while testing.
6. Build the client with `npm run build` before deployment validation.
