# Department of Information Technology Studies — UPSA Accra

Official web platform for the Department of Information Technology Studies within the Faculty of Information Technology and Communication Studies (FITCS) at the University of Professional Studies, Accra (UPSA).

---

## Overview

This application serves as the primary academic portal and digital front door for the Department of IT Studies at UPSA. Designed with a JOMACS-grade typographic hierarchy using the **Poppins** font family, it delivers accredited undergraduate and postgraduate degree programmes, department leadership profiles, student-led software systems engineered in the UPSA Developers Hub, and official enquiry channels for prospective students and industry partners.

---

## Tech Stack

- **Core Framework**: React 19 with TypeScript 6
- **Build Tool & Dev Server**: Vite 8
- **Styling**: Tailwind CSS v4 with custom CSS variables and utility tokens
- **Typography**: Google Fonts — **Poppins** (`300` to `900` weights)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Routing System**: Custom zero-dependency hash router (`src/utils/hashRouter.ts`) supporting deep URL parameters (`#section?modal=...&programme=...`) with zero 404 routing errors on static hosts

---

## Key Features

- **Promotional Announcement Slider**: Full-width top carousel positioned flush beneath the navbar header for institutional announcements (e.g. 14th Congregation Ceremony) with auto-play timer, pause-on-hover, and swipe gesture controls.
- **Top Navigation Bar**: Fixed header with dual utility bar (`FITCS • UPSA ACCRA`) and main navigation bar permanently styled in Dark Mode, featuring the official UPSA crest, brand wordmark, search drawer, and mobile menu overlay.
- **Degree & Diploma Catalog**: Interactive catalog covering 5 accredited academic qualifications:
  - **BSc Information Technology Management (`BSc ITM`)**
  - **BSc Data Science and Analytics (`BSc DSA`)**
  - **Diploma in IT Management (`Dip ITM`)**
  - **MSc Information Security Management (`MSc ISM`)**
  - **MBA in Management Information Systems (`MBA MIS`)**
  - Complete with level filter tabs (*All*, *Undergraduate*, *Postgraduate*, *Diploma*), graphic banner previews, and detail modal dialogs.
- **Faculty Leadership Directory**: Fully verified academic leadership profiles with official portrait photos:
  - **Prof. Godfred Yaw Koi-Akrofi** — Dean, Faculty of Information Technology and Communication Studies (FITCS)
  - **Dr. Joshua Kwaku Ofoeda** — Head of Department, IT Studies
  - **Dr. Augustina Dede Agor** — Senior Lecturer & Developers Hub Mentor
- **UPSA Developers Hub Flagship**: Dedicated initiative section showcasing practical software engineering operating directly from the UPSA Computer Laboratory (established 17 December 2025). Features interactive student application workflows.
- **Innovation Showcase**: Student project gallery featuring verified real-world software systems (*BloodVault Africa*, *UPSA Hospital Management System (HMS)*) with category filtering and media press links.
- **Community & Industry Integration**: Highlight cards for the **DataCamp Classroom Partnership** (hands-on Python/SQL data analytics) and the **UPSA Annual Master Class Programme** (CTO executive lectures).
- **Official Secretariat Contact**: Campus physical location (Justice Aryeetey Building, Rooms 310/311/410), digital address `GM-037-0480`, operating hours, telephone extensions, and interactive inquiry form.

---

## Project Structure

```text
upsa-it-platform/
├── public/
│   ├── favicon.svg                  # Official UPSA Blue & Gold graduation cap favicon
│   └── images/                     # High-resolution programme banners & faculty portrait photos
│       ├── prof_koi_akrofi.png      # Dean Prof. Koi-Akrofi portrait photo
│       ├── dr_joshua_ofoeda.png     # Head of Department Dr. Joshua Ofoeda portrait photo
│       ├── dr_augustina_agor.png    # Developers Hub Mentor Dr. Augustina Agor portrait photo
│       ├── prog_bsc_it.png          # BSc IT Management banner
│       ├── prog_bsc_ds.png          # BSc Data Science banner
│       ├── prog_dip_it.png          # Diploma in IT Management banner
│       ├── prog_msc_sec.png         # MSc Information Security banner
│       └── prog_mba_mis.png         # MBA MIS banner
├── src/
│   ├── assets/                     # Static visual assets
│   ├── components/
│   │   ├── common/                 # Modal dialog container, badges, and promotional slider
│   │   ├── layout/                 # Top fixed Navbar and Footer components
│   │   ├── modals/                 # Programme, Project, and Hub application modals
│   │   └── sections/               # Modular page sections (Hero, About, Academics, Hub, Innovation, Contact)
│   ├── data/
│   │   └── groundTruth.ts          # Ground truth dataset for programmes, faculty, projects, and secretariat info
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces and data models
│   ├── utils/
│   │   └── hashRouter.ts           # Hash-based routing utility and URL state parser
│   ├── App.tsx                     # Main application layout and state composition
│   ├── index.css                   # Global CSS directives, Poppins font system, and component rules
│   └── main.tsx                    # React root entry point
├── index.html                      # HTML entry with Open Graph & Twitter share preview tags
├── package.json                    # Dependencies and npm scripts
└── vite.config.ts                  # Vite build configuration
```

---

## Getting Started

### Prerequisites

Ensure Node.js (v18.0 or higher) and `npm` are installed on your machine.

### Installation & Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/fsulleyman/-upsa-it-platform.git
   cd -upsa-it-platform
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Access the dev server locally at `http://localhost:5173/`.

### Available Scripts

- `npm run dev`: Starts the Vite development server with hot module replacement (HMR).
- `npm run build`: Compiles TypeScript types (`tsc -b`) and builds the production bundle with Vite (`vite build`).
- `npm run preview`: Launches a local web server to preview the compiled `dist` production build.
- `npm run lint`: Executes Oxlint (`oxlint`) static analysis across the codebase.

---

## Deployment Notes

This project is deployed on **Vercel** and integrated with the GitHub repository at `fsulleyman/-upsa-it-platform`.

- **Continuous Deployment**: Any push to the `main` branch triggers an automated Vercel production build and deployment.
- **Static Hosting Optimization**: Hash-based routing ensures direct links to sections or modal states (`#academics`, `#innovation?project=bloodvault`) reload seamlessly without requiring server-side fallback rewriting.
