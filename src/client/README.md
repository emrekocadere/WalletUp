# CashCat 🐱💰

CashCat is a personal budget/expense tracking app I built to keep track of my spending and accounts. This repo is the React-based frontend of the app.

## What It Does

- Sign in with Google, with an onboarding flow to set up your account
- Add and manage different accounts (bank, credit card, cash, etc.)
- Log income/expense transactions and view history from the account detail view
- Define recurring transactions (rent, subscriptions, etc.) that get tracked automatically
- Set goals and see how close you are to your savings/budget targets
- Dashboard summarizes your overall financial status with charts
- Reports page generates detailed reports, exportable as PDF
- Multi-language support
- Manage account/preferences from the settings page

## Tech Stack

- **React 19 + TypeScript** — some older files are still `.jsx`, newer code is `.tsx`
- **Vite** — dev server & build tool
- **Redux Toolkit** — global state management
- **TanStack Query (React Query)** — server state, API caching, refetching
- **Axios** — API requests
- **React Router DOM v7** — routing, auth-protected routes
- **Tailwind CSS** — styling
- **@react-oauth/google + jwt-decode** — Google OAuth login
- **i18next / react-i18next** — multi-language support
- **Chart.js + react-chartjs-2** — charts
- **jsPDF + html2canvas** — PDF report export
- **react-hot-toast** — notifications
