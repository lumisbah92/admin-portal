## Overview
This project is a functional admin portal built with Next.js (App Router) and TypeScript. It includes:
- **Authentication:** Secure login with token-based authentication, managed using Context API and LocalStorage.
- **Admin Dashboard:** Real-time data visualization from provided APIs, featuring a responsive table with pagination, searching, filtering, and interactive charts using ApexCharts.
- **Onboarding Offer:** A dedicated page to send onboarding offers to new users. It leverages MUI Autocomplete for user selection, dynamic API-based search, and form validation using React Hook Form combined with zod.
- **Responsive Design:** The application is designed to work seamlessly across devices, maintaining design integrity per the Figma design guidelines.

## Features
- **Authentication:**
  - Login page with API integration.
  - Auth state stored via Context API and LocalStorage.
  - Route protection to ensure unauthorized users cannot access restricted pages.
  - Different layouts for authenticated vs. non-authenticated users.
- **Admin Dashboard:**
  - Data table with real-time API data.
  - Pagination, search, and filtering functionalities.
  - Data visualization using ApexCharts.
- **Onboarding Offer:**
  - User selection via MUI Autocomplete with API-driven search.
  - Form handling and validation using React Hook Form and zod.
  - Ability to send onboarding offers to selected users.
- **Clean Code & Architecture:**
  - Modular, component-based structure.
  - Comprehensive TypeScript typings.
  - Organized Git workflow with meaningful commits and feature branching.
- **Deployment:**
  - Deployed on Vercel for live demonstration.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI Library:** Material UI (MUI)
- **Form Handling:** React Hook Form with zod for validation
- **Charting:** ApexCharts
- **State Management:** Context API & LocalStorage
- **Version Control:** Git & GitHub
- **Deployment:** Vercel

## Deployment
The project is deployed on Vercel. You can view the live application here:
**Live Site Link:** [https://huiblue-frontend.vercel.app/](https://huiblue-frontend.vercel.app/)

## Contact
Feel free to reach out if you have any questions or issues, please contact [lumisbah92@gmail.com](mailto:lumisbah92@gmail.com).

