# Skincare E-commerce Backend API

A comprehensive RESTful API for a skincare e-commerce platform built with NestJS and MongoDB.

## Features

- **Authentication**
  - JWT-based authentication system
  - Multiple authentication strategies (Local, Google OAuth)
  - Access & refresh token implementation
  - Password encryption with bcrypt

- **User Management**
  - User registration and profile management
  - Role-based access control
  - Password reset functionality
  - Google OAuth integration

- **Product Management**
  - Product CRUD operations
  - Brand categorization
  - Image uploads with Cloudinary integration
  - Product search with fuzzy matching

- **Cart & Checkout**
  - Shopping cart functionality
  - Order history tracking
  - PDF invoice generation

- **Payment Processing**
  - Integration with PayOS payment gateway
  - Secure payment handling
  - Order status tracking

- **Authorization**
  - Role-based access control (RBAC)
  - Permission-based actions
  - Public/private route management

## Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js, JWT
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Documentation**: Swagger
- **Validation**: Class-validator
- **Payments**: PayOS

## Project Structure

```
src/
├── auth/               # Authentication related files
├── brands/             # Brand management
├── cart/               # Shopping cart functionality
├── core/               # Core utilities and interceptors
├── decorator/          # Custom decorators
├── email/              # Email service functionality
├── files/              # File upload management
├── items/              # Product management
├── payos/              # Payment integration
├── permissions/        # Permission management
├── roles/              # Role-based access control
├── users/              # User management
├── app.module.ts       # Main application module
├── main.ts             # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# App
PORT=8080
FRONTEND_LOCAL_URI=http://localhost:5173
FRONTEND_GLOBAL_URI=https://your-frontend-domain.com

# MongoDB
MONGO_URL=mongodb://localhost:27017/skincare-db

# JWT
JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_ACCESS_EXPIRE=1d
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8080/api/auth/google/redirect

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# PayOS
PAYOS_CLIENT_ID=your_payos_client_id
PAYOS_API_KEY=your_payos_api_key
PAYOS_CHECKSUM_KEY=your_payos_checksum_key

# Default Role
DEFAULT_ROLE=USER
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/skincare-ecommerce-api.git
cd skincare-ecommerce-api
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:8080/api`.

### API Documentation

Swagger documentation is available at `/api` endpoint when the server is running.

## Authentication Flows

### Local Authentication
1. Register: `POST /api/users/register`
2. Login: `POST /api/auth/login`
3. Refresh token: `GET /api/auth/refresh`
4. Logout: `POST /api/auth/logout`

### Google Authentication
1. Redirect to Google: `GET /api/auth/google/login`
2. Google callback: `GET /api/auth/google/redirect`

## API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/create` - Create a user (admin only)
- `GET /api/users/info/:id` - Get user information
- `GET /api/users/all` - Get all users (with pagination)
- `PATCH /api/users/update` - Update user
- `PATCH /api/users/delete/:id` - Soft delete a user
- `DELETE /api/users/delete/:id` - Hard delete a user

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/account` - Get current user
- `GET /api/auth/refresh` - Refresh token
- `GET /api/auth/google/login` - Google OAuth login
- `GET /api/auth/google/redirect` - Google OAuth callback

### Products
- `POST /api/items/create` - Create a product
- `GET /api/items/all` - Get all products
- `GET /api/items/paginate` - Get products with pagination
- `GET /api/items/fuzzy/:name` - Search products
- `GET /api/items/:id` - Get product by ID
- `PATCH /api/items/:id` - Update product
- `PATCH /api/items/hide/:id` - Soft delete product
- `DELETE /api/items/:id` - Hard delete product

### Brands
- `POST /api/brands/create` - Create a brand
- `GET /api/brands/all` - Get all brands
- `GET /api/brands/paginate` - Get brands with pagination
- `GET /api/brands/name/:name` - Get brand by name
- `GET /api/brands/fuzzy/:name` - Search brands
- `GET /api/brands/:id` - Get brand by ID
- `PATCH /api/brands/:id` - Update brand
- `PATCH /api/brands/hide/:id` - Soft delete brand
- `DELETE /api/brands/:id` - Delete brand

### Permissions & Roles
- `POST /api/permissions/create` - Create permission
- `GET /api/permissions/all` - Get all permissions
- `POST /api/roles/create` - Create role
- `GET /api/roles/all` - Get all roles

### Cart & Orders
- `POST /api/cart/create` - Create cart
- `GET /api/cart/all` - Get all carts
- `GET /api/cart/pending` - Get pending carts
- `GET /api/cart/done` - Get completed carts
- `GET /api/cart/cancel` - Get canceled carts
- `GET /api/cart/download/:cartId` - Generate PDF invoice
- `GET /api/cart/user/:userId` - Get user carts
- `GET /api/cart/info/:cartId` - Get cart by ID
- `PATCH /api/cart/:cartId` - Update cart status

### Files
- `POST /api/files/upload` - Upload file to Cloudinary

### Payment
- `POST /api/payos` - Create payment
- `POST /api/payos/create-payment-link` - Create payment link
- `GET /api/payos/:id` - Get payment information
- `GET /api/payos/payment-status/:id` - Get payment status

### Email
- `POST /api/email/send-otp` - Send OTP
- `POST /api/email/verify-otp` - Verify OTP
- `POST /api/email/send-invoice` - Send invoice via email

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request