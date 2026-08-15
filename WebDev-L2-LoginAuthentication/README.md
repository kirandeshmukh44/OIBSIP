# Login Authentication System

A client-side authentication system developed using HTML5, CSS3 and Vanilla JavaScript.

## Objective

The objective of this project is to create a simple authentication system that allows users to register, login and access a protected dashboard after successful authentication.

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Browser LocalStorage
- Web Crypto API

## Features

- User registration
- Username and email fields
- Password validation
- Minimum 8-character password
- Password must contain at least one number
- Duplicate username/email checking
- User login
- Username or email login
- Incorrect credential error handling
- Protected dashboard
- Login session using localStorage
- Logout functionality
- SHA-256 password hashing
- Empty form validation
- Responsive design

## Authentication Flow

```text
Register
   ↓
Validate Form
   ↓
Check Duplicate User
   ↓
Hash Password
   ↓
Save User
   ↓
Login
   ↓
Verify Credentials
   ↓
Create Session
   ↓
Dashboard