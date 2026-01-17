# Kgwahla Wi-Fi Frontend

Frontend application for the Kgwahla Wi-Fi Management System built with React, Vite, and Tailwind CSS.

## Features

- Responsive user interface
- Tenant registration and login
- Payment verification pages
- Admin dashboard for management
- Protected routes
- Modern UI with shadcn/ui components

## Tech Stack

- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Navigation
- **Lucide React** - Icons

## Prerequisites

- Node.js (v16 or higher)

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd Kgwahla-Wi-Fi-Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

To start the development server:
```bash
npm run dev
```

The application will run on `http://localhost:5173`.

To build for production:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## Project Structure

```
Kgwahla-Wi-Fi-Frontend/
├── public/                    # Static assets
├── src/
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── AdminDashboard.jsx # Admin dashboard
│   │   ├── LandingPage.jsx    # Home page
│   │   ├── LoginPage.jsx      # Login page
│   │   └── ...                # Other pages
│   ├── utils/                 # Utility functions
│   ├── lib/                   # Library utilities
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── package.json
└── README.md
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

