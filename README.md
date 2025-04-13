# Skincare E-commerce API

A full-featured RESTful API for a skincare e-commerce platform built with NestJS and MongoDB.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [API Documentation](#api-documentation)

## Features

- **User Management** - Registration, login, profile management
- **Authentication** - JWT-based authentication with refresh tokens
- **Google OAuth Integration** - Login with Google
- **Role-Based Access Control** - Admin, manager, staff, and user roles
- **Product Management** - CRUD operations for skincare products
- **Brand Management** - CRUD operations for product brands
- **Permissions System** - Fine-grained access control
- **Cart & Checkout** - Shopping cart functionality and order processing
- **Payment Integration** - PayOS payment gateway integration
- **File Upload** - Cloudinary integration for image uploads
- **Email Service** - OTP verification, order confirmations, and invoices
- **Skin Type Quiz** - Personalized product recommendations based on skin type
- **Data Validation** - Request data validation with class-validator
- **API Documentation** - Swagger UI documentation

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT, Passport.js
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Payment**: PayOS
- **Documentation**: Swagger
- **Validation**: Class Validator & Class Transformer
- **PDF Generation**: PDFKit

## Project Structure

The API is organized into the following modules:

```
src/
├── auth/               # Authentication module
├── brands/             # Brand management
├── cart/               # Shopping cart functionality
├── core/               # Core functionality
├── decorator/          # Custom decorators
├── email/              # Email service
├── files/              # File upload service
├── items/              # Product management
├── payos/              # Payment integration
├── permissions/        # Permission management
├── roles/              # Role management
├── skin-quiz/          # Skin type quiz functionality
└── users/              # User management
```

## API Endpoints

The API includes the following main endpoints:

- `/api/auth` - Authentication routes
- `/api/users` - User management
- `/api/items` - Product management
- `/api/brands` - Brand management
- `/api/cart` - Shopping cart operations
- `/api/roles` - Role management
- `/api/permissions` - Permission management
- `/api/files` - File uploads
- `/api/email` - Email services
- `/api/payos` - Payment processing
- `/api/skin-quiz` - Skin type quiz and recommendations

## Authentication

The API supports multiple authentication strategies:

- **Local Authentication**: Username/password login
- **JWT Authentication**: Token-based authentication
- **Google OAuth**: Social login
- **Refresh Token**: Token renewal

Access control is implemented using Guards and custom decorators.

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# MongoDB
MONGO_URL=mongodb://localhost:27017/skincare-db

# JWT
JWT_ACCESS_TOKEN_SECRET=your-access-token-secret
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_TOKEN_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/redirect

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password

# PayOS
PAYOS_CLIENT_ID=your-payos-client-id
PAYOS_API_KEY=your-payos-api-key
PAYOS_CHECKSUM_KEY=your-payos-checksum-key

# Frontend URLs
FRONTEND_LOCAL_URI=http://localhost:3000
FRONTEND_GLOBAL_URI=https://your-production-frontend.com

# Default Role
DEFAULT_ROLE=USER

# Port
PORT=8000
```

## Running the App

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

The API will be available at `http://localhost:8000/api`.

## API Documentation

Swagger UI documentation is available at `http://localhost:8000/api` when the application is running.

## Features in Detail

### User Management

- Register new accounts
- Login with email/password or Google
- User profile management (update details, change password)
- Role-based access control
- Favorite products list

### Product Management

- CRUD operations for skincare products
- Image upload for products
- Search and filtering options
- Flash sale functionality

### Cart & Checkout

- Add/remove items from cart
- Place orders
- Order history
- Order status tracking
- PDF invoice generation

### Skin Quiz

- Interactive skin type questionnaire
- Skin type analysis
- Personalized product recommendations
- Skin care routine suggestions

### Payment Processing

- Multiple payment methods
- Secure payment gateway integration
- Order status updates