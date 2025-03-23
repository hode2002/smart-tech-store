<p align="center">
  <a href="http://nextjs.org/" target="blank"><img src="https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png" width="150" alt="Next.js Logo" /></a>
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="150" alt="Nest Logo" /></a>
</p>

<div align="center">
  <div>
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />    
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" alt="nestjs" />
    <img src="https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white" alt="mysql" />
    <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" alt="mongodb" />
    <img src="https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white" alt="redis" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="prisma" />
    <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" alt="docker" />
    <img src="https://img.shields.io/badge/swagger-%25230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" alt="swagger" />
  </div>
  <h1 align="center">Smart Tech Store</h1>
</div>

## 📝 Project Description

Smart Tech Store is an e-commerce platform for electronic devices such as phones, laptops, and tech accessories. Users can easily search for products, view detailed information, read customer reviews, and take advantage of special offers.

## 🛠️ Tech Stack

- **TypeScript** - Programming language
- **Next.js** - Frontend framework
- **TailwindCSS** - CSS framework
- **ShadCN** - UI component library
- **Nest.js** - Backend framework
- **Prisma** - ORM
- **MySQL** - Primary database
- **MongoDB** - NoSQL database
- **Redis** - In-memory data store
- **Docker** - Containerization

## ✨ Key Features

### 👤 Customer Features

- **🔐 Authentication with JWT/Passport**: Create accounts or sign in through Facebook or Google
- **👤 Profile Management**: Update customer information (name, phone number, address, password)
- **🛒 Order Management**: Search products by keyword or category, add to cart, and checkout with COD or VNPAY
- **📦 Order Tracking**: Check order status, receive or cancel orders
- **⭐ Product Reviews**: View and submit product reviews after purchase

### 👑 Admin Features

- **📊 Admin Dashboard**: View statistics on revenue, product count, users, feedback, and orders
- **📋 Order Management**: Check revenue, approve orders by week/month/year, search orders by phone number or status
- **👥 Customer Management**: View registered users, their purchase history, and manage user accounts
- **🏷️ Product Management**: Add, edit, and view products, categories, brands, and product bundles
- **📰 News Management**: Create tech and product-related news articles
- **🎟️ Voucher Management**: Create, edit, and delete vouchers
- **🔔 Notification Management**: Create announcements about vouchers and promotions

## 🚀 Getting Started

### Prerequisites

- Node.js
- Docker and Docker Compose
- MySQL (if running locally)
- MongoDB (if running locally)
- Redis (if running locally)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/hode2002/smart-tech-store.git
   cd smart-tech-store
   ```

2. Install dependencies
   ```bash
   npm install --legacy-peer-deps
   ```

3. Create an `.env` file based on the example provided

4. Start the application with Docker
   ```bash
   docker-compose up -d api
   ```

> ⚠️ **Note**: When running the application in a local environment, the Nginx service is not required. Nginx is only configured for use in a production environment.

### API Endpoints

The application includes RESTful API endpoints for:
- Products
- Orders
- Users
- Authentication
- Vouchers
- and more

### Project Structure

- `/src` - Main application source code
  - `/api` - API endpoints
    - `/v1` - API version 1 
    - `/v2` - API version 2
  - `/common` - Common components
  - `/config` - Configuration
  - `/prisma` - Prisma service

### API Documentation

API documentation is automatically generated with <b>Swagger</b> and can be accessed at the root path of the application.