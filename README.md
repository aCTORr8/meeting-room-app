# Meeting Room Booking App

A React and Firebase application for creating meeting rooms, managing access, and scheduling conflict-free bookings.

## Features

- Firebase email and password authentication
- Protected application routes
- Meeting room creation, editing, and deletion
- Per-room Admin and User access management
- Booking creation and cancellation
- Time conflict validation
- Responsive Tailwind CSS interface

## Project structure

```text
src/
  components/
    layout/       Shared application layout
    ui/           Reusable presentation components
  config/         External service configuration
  features/
    auth/          Authentication context, provider, hook, schemas, and UI
    bookings/      Booking service, components, and utilities
    rooms/         Room service, state hook, types, and components
  pages/           Route-level composition
  types/           Shared domain models
```

## Environment variables

Create a `.env` file with the following Firebase configuration:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
```
