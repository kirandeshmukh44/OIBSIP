# PizzaCraft — Pizza Delivery Application

Full-stack Oasis Infobyte SIP Level 3 Task 1 project for custom pizza ordering, secure payments, inventory operations, and live order tracking.

## Features

- JWT user accounts, email verification, and password recovery
- Four-step custom builder with five bases, five sauces, cheese and multi-select vegetables
- Razorpay test-mode order creation and signature verification
- User order history with automatic status polling
- Separate admin authentication, order status management, and inventory APIs
- Automatic inventory deduction after verified payment and scheduled low-stock emails

## Stack

React + Vite, Node.js + Express, MongoDB Atlas + Mongoose, Socket.IO, Razorpay, Nodemailer and node-cron.

## Run locally

1. Copy `server/.env.example` to `server/.env` and populate MongoDB, JWT, email, admin, and Razorpay test credentials.
2. Copy `client/.env.example` to `client/.env` if the API is not on the default local URL.
3. Run `npm run dev` in `server`, then `npm run dev` in `client`.

The seeded administrator is created from `ADMIN_EMAIL` and `ADMIN_PASSWORD` on server startup. Visit `/admin` to sign in. Seed the matching inventory ingredients through `POST /api/admin/inventory` before testing payment; this prevents orders using unavailable stock.

## Main API routes

`/api/auth/*`, `/api/orders`, `/api/payment/*`, `/api/admin/*`. All user order/payment routes need the user Bearer token; admin routes need the separate admin token.

## Deployment

Deploy the client to Vercel with `VITE_API_URL` set to the deployed API URL. Deploy the server to Render/Railway with all variables from `.env.example`, set `CLIENT_URL` to the frontend origin, and use a MongoDB Atlas replica set (required for transaction-safe stock deductions in production).
