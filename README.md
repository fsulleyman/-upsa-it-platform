# UPSA Department of Information Technology Studies

Official web platform for the Department of Information Technology Studies within the Faculty of Information Technology and Communication Studies (FITCS) at the University of Professional Studies, Accra (UPSA).

## Overview

This application serves as the digital front door and academic portal for the Department of IT Studies. It presents accredited undergraduate and postgraduate degree programmes, department leadership profiles, verified student software systems engineered in the UPSA Developers Hub, and official enquiry channels for prospective students and industry partners.

## Tech Stack

- **Core Framework**: React 19 with TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 with custom typographic system based on JOMACS scale
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Routing**: Lightweight hash-based router (`#section?modal=...`) with zero external dependencies and URL state synchronization

## Key Features

- **Promotional Announcement Slider**: Top-of-page full-bleed banner carousel for departmental announcements, graduation notifications, and admissions updates with manual/auto-advance controls.
- **Degree & Diploma Catalog**: Interactive catalog covering BSc IT Management, BSc Data Science, Diploma in IT Management, MSc Information Security, and MBA MIS, complete with level filtering and modal curriculum breakdowns.
- **Academic Leadership Directory**: Verified profiles for Dean Prof. Godfred Yaw Koi-Akrofi, Head of Department Dr. Joshua Kwaku Ofoeda, and Developers Hub mentor Dr. Augustina Dede Agor.
- **UPSA Developers Hub Showcase**: Dedicated feature section and interactive application flow for the department's flagship software engineering initiative in the UPSA Computer Lab.
- **Innovation Showcase**: Student project gallery with category filtering (Web, Mobile, AI, Analytics, Cybersecurity) and media article links.
- **Official Contact & Secretariat Form**: Departmental enquiry interface with real-time field validation, contact details, and campus office hours.
- **Accessibility & Contrast**: Built to WCAG AAA contrast standards on both light (`#FFFFFF`, `#F5F7FA`) and dark navy (`#003366`, `#002244`) containers.

## Project Structure

```text
upsa-it-platform/
├── public/
│   ├── favicon.svg              # Custom UPSA Gold & Blue cap favicon
│   └── images/                 # Programme banners and faculty portrait photos
├── src/
│   ├── assets/                 # Static visual assets
│   ├── components/
│   │   ├── common/             # Modal dialogs, badges, and promotional slider
│   │   ├── layout/             # Top fixed Navbar and Footer components
│   │   ├── modals/             # Programme, Project, and Hub application modals
│   │   └── sections/           # Modular page sections (Hero, About, Academics, Hub, Innovation, Contact)
│   ├── data/
│   │   └── groundTruth.ts      # Authoritative dataset for programmes, faculty, projects, and institutional info
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces for programmes, faculty, and state models
│   ├── utils/
│   │   └── hashRouter.ts       # Hash-based routing utility and URL state parser
│   ├── App.tsx                 # Main application composition
│   ├── index.css               # Global Tailwind CSS directives and typography system
│   └── main.tsx                # React root entry point
├── index.html                  # HTML entry with Open Graph and meta share tags
└── vite.config.ts              # Vite configuration
```

## Getting Started

### Prerequisites

Ensure Node.js (version 18 or higher) and `npm` are installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/fsulleyman/-upsa-it-platform.git
   cd -upsa-it-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the local development server with hot module replacement:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173/` (or the next available port).

### Production Build

To type-check and compile the production bundle:
```bash
npm run build
```

To preview the built production assets locally:
```bash
npm run preview
```

To run the linter:
```bash
npm run lint
```

## Deployment

This repository is connected to Vercel and configured to automatically build and deploy production releases whenever changes are pushed to the `main` branch.
