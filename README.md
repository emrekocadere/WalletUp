# WalletUp

![WalletUp Logo](./src/client/public/logo.svg)

> Modern personal finance management application for tracking expenses, managing accounts, and achieving financial goals.

🌐 **Live Demo:** [walletup.io](https://walletup.io)

## 📋 Overview

WalletUp is a full-stack personal finance management application that helps users track their spending, manage multiple accounts, set financial goals, and gain insights into their financial habits. Built with modern technologies and clean architecture principles, the application provides a seamless experience for managing personal finances.

## ✨ Features

- **Account Management** - Create and manage multiple financial accounts (bank accounts, credit cards, cash)
- **Transaction Tracking** - Record and categorize income and expenses
- **Financial Goals** - Set savings goals and track progress
- **Dashboard & Analytics** - Visualize spending patterns and financial overview
- **Multi-Currency Support** - Handle transactions in different currencies
- **Google OAuth Integration** - Secure authentication with Google Sign-In
- **AI-Powered Insights** - Get personalized financial insights and recommendations
- **Responsive Design** - Fully responsive UI that works on all devices

## 🏗️ Architecture

### Frontend

The client application is built with **React 19** and follows a modern component-based architecture:

**Tech Stack:**
- **React 19** - Modern UI framework with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Redux Toolkit** - Global state management
- **React Query (TanStack Query)** - Server state management and caching
- **Axios** - HTTP client for API communication
- **Tailwind CSS** - Utility-first CSS framework
- **Google OAuth** - Authentication integration

**Architecture Pattern:**
- Component-based architecture with clear separation of concerns
- Custom hooks for reusable logic
- Redux for global state (user, preferences)
- React Query for server state and caching
- Type-safe API layer with TypeScript

### Backend

The API is built with **.NET 8** following **Clean Architecture** and **CQRS** patterns:

**Tech Stack:**
- **.NET 8** - Modern cross-platform framework
- **ASP.NET Core Web API** - RESTful API framework
- **Entity Framework Core** - ORM for database operations
- **PostgreSQL** - Relational database
- **Redis** - Caching layer
- **MediatR** - CQRS implementation
- **AutoMapper** - Object-object mapping
- **FluentValidation** - Input validation
- **JWT Bearer Authentication** - Secure API authentication
- **Google Auth API** - OAuth integration
- **Refit** - Type-safe HTTP client

**Architecture Pattern:**
```
├── Domain Layer - Core business entities and interfaces
├── Application Layer - Business logic, CQRS handlers, DTOs
├── Infrastructure Layer - External services, database, caching
└── API Layer - Controllers, middleware, configuration
```

**Key Patterns:**
- Clean Architecture for separation of concerns
- CQRS (Command Query Responsibility Segregation) with MediatR
- Repository pattern for data access
- Dependency Injection throughout
- JWT-based authentication and authorization

## 🚀 Getting Started

### Prerequisites

**Frontend:**
- Node.js 18+
- npm or yarn

**Backend:**
- .NET 8 SDK
- PostgreSQL
- Redis (optional, for caching)

### Installation

**Frontend:**
```bash
cd src/client
npm install
npm run dev
```

**Backend:**
```bash
cd src/api
dotnet restore
dotnet run --project CashCat.API
```

## 📁 Project Structure

```
WalletUp/
├── src/
│   ├── client/              # React frontend application
│   │   ├── src/
│   │   │   ├── api/         # API client and endpoints
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── pages/       # Page components
│   │   │   ├── store/       # Redux store
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   └── types/       # TypeScript definitions
│   │   └── public/          # Static assets
│   │
│   └── api/                 # .NET backend API
│       ├── CashCat.API/            # API layer (Controllers, Middleware)
│       ├── WalletUp.Application/   # Application layer (CQRS, Business Logic)
│       ├── WalletUp.Domain/        # Domain layer (Entities, Interfaces)
│       └── WalletUp.Infrastructure/ # Infrastructure layer (Database, Services)
```

## 📸 Screenshots

![WalletUp Screenshot](./src/client/public/logo.png)

## 🛠️ Technologies Summary

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, TypeScript, Vite, Redux Toolkit, React Query, Tailwind CSS |
| **Backend** | .NET 8, ASP.NET Core, Entity Framework Core, MediatR |
| **Database** | PostgreSQL, Redis |
| **Authentication** | JWT, Google OAuth |
| **Architecture** | Clean Architecture, CQRS, Repository Pattern |

## 📝 License

This project is private and for demonstration purposes.

---

Built with ❤️ using modern web technologies
