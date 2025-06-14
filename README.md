
# Foss AI: Intelligent Research & Report Generation Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Genkit (Gemini)](https://img.shields.io/badge/Genkit%20(Gemini)-AI%20Powered-orange?logo=google&logoColor=white)](https://firebase.google.com/docs/genkit)
[![Firebase](https://img.shields.io/badge/Firebase-SDK-FFCA28?logo=firebase)](https://firebase.google.com/)
[![ShadCN UI](https://img.shields.io/badge/ShadCN%20UI-Styling-black?logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Utility%20First-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Foss AI is a powerful Next.js web application designed to revolutionize your research process. It leverages cutting-edge Generative AI (powered by Google's Gemini models via Genkit) to assist users in formulating research queries, synthesizing knowledge, generating comprehensive reports, visualizing concepts, and extracting ideas for mind mapping.

## ✨ Core Features

*   **AI Query Formulation:** Transforms complex research questions into optimized search vectors, alternative phrasings, key concepts, and potential sub-topics.
*   **Intelligent Knowledge Synthesis:** Distills information based on formulated queries to provide concise summaries of key insights and themes.
*   **Comprehensive Report Generation:** Automatically generates structured, multi-section academic-style reports with sections like executive summary, literature review, methodology, results (with chart suggestions), discussion, and references.
*   **File-Powered Guided Reporting:** Upload documents (TXT, MD, PDF, DOCX) and provide specific guidance to generate tailored reports based on the file's content.
*   **Mind Map Concept Extraction:** Analyzes text input to identify a main idea and key concepts with related terms, providing a structured starting point for mind mapping.
*   **Conceptual Image Visualization:** Generates abstract images representing core research concepts, useful for presentations and creative insights.
*   **Secure User Authentication:** Robust Firebase authentication (Email/Password, Sign in with Google).
*   **Intuitive User Interface:** Clean, modern, and responsive UI built with Next.js, ShadCN UI, and Tailwind CSS.
*   **Downloadable Outputs:** Export reports in structured JSON and formatted PDF.
*   **User Dashboard:** View activity stats, get daily research prompts, and quickly access features.
*   **Account Settings:** Manage profile, preferences (theme, notifications, interface), and research history (with export/import).
*   **Dynamic Particle Background:** Visually engaging background that adapts to light/dark themes.

## 🚀 Technology Stack

*   **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Components, Server Actions)
*   **AI Integration:** [Genkit for Firebase](https://firebase.google.com/docs/genkit) with Google Gemini models
*   **UI Library:** [React](https://reactjs.org/)
*   **Component Library:** [ShadCN UI](https://ui.shadcn.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Authentication:** [Firebase Authentication](https://firebase.google.com/docs/auth)
*   **Deployment (Assumed):** Firebase Hosting or similar Node.js compatible platforms.
*   **Particle Effects:** [tsParticles](https://particles.js.org/)
*   **PDF Generation (Client-side):** jsPDF & html2canvas

## 📋 Prerequisites

*   [Node.js](https://nodejs.org/) (version 20.x or higher recommended)
*   `npm` (usually comes with Node.js) or `yarn`
*   A **Firebase Project**:
    *   Set up Firebase Authentication (Email/Password and Google Sign-In providers enabled).
    *   Obtain your Firebase project configuration (API key, auth domain, etc.).
*   A **Google Cloud Project** (often linked to your Firebase project):
    *   Ensure the "Generative Language API" (for Gemini models) is enabled.
    *   Set up appropriate API keys or service accounts for Genkit to access Google AI services.
    *   For Google Sign-In, ensure your OAuth 2.0 Client ID has the correct "Authorized JavaScript origins" and "Authorized redirect URIs" (including `http://localhost:[PORT]` for development).

## ⚙️ Environment Setup

1.  **Clone the repository (if applicable):**
    ```bash
    git clone <your-repository-url>
    cd foss-ai # or your project directory
    ```

2.  **Create a `.env` file** in the root of your project and add your Firebase project configuration:
    ```env
    # Firebase Configuration (replace with your actual Firebase project config)
    NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXX"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789012"
    NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789012:web:xxxxxxxxxxxxxxxxxxxxxx"

    # Google AI API Key for Genkit (if required directly by your setup)
    # Genkit often uses Application Default Credentials or service accounts when deployed.
    # For local development, you might need to set GOOGLE_API_KEY if genkit.ts doesn't use ADC.
    # GOOGLE_API_KEY="your_google_ai_api_key_if_needed"
    ```
    **Note:** The `src/lib/firebase.ts` file uses hardcoded Firebase config values. It's highly recommended to move these to environment variables as shown above for better security and flexibility. If you update `firebase.ts` to use `process.env.NEXT_PUBLIC_FIREBASE_...`, then the `.env` file will be the source.

## 🛠️ Installation

Install project dependencies:
```bash
npm install
# or
# yarn install
```

After installation, if you added `patch-package`:
```bash
npm run postinstall
# or
# yarn postinstall
```

## ▶️ Running the Development Server

Foss AI requires two development servers to run concurrently: one for the Next.js frontend and one for the Genkit AI flows.

1.  **Start the Next.js Development Server:**
    ```bash
    npm run dev
    ```
    This will typically start the Next.js app on `http://localhost:3000` (or the port specified in `package.json`, e.g., 9002).

2.  **Start the Genkit Development Server:**
    Open a new terminal window/tab and run:
    ```bash
    npm run genkit:dev
    # or for auto-reloading on flow changes:
    # npm run genkit:watch
    ```
    This starts the Genkit development server, usually on `http://localhost:3100`, making your AI flows available for inspection and testing. The Next.js app will call these flows server-side.

    Ensure both servers are running to use all AI features.

## 🏗️ Building for Production

1.  **Build the Next.js Application:**
    ```bash
    npm run build
    ```

2.  **Start the Production Server:**
    ```bash
    npm run start
    ```
    For Genkit flows in production, you'll typically deploy them as part of your backend (e.g., to Firebase Functions or Cloud Run). The `genkit start` command is for development. Refer to Genkit documentation for production deployment strategies.

## 📂 Key Project Structure

```
foss-ai/
├── .env                  # Environment variables (Firebase config, API keys)
├── components.json       # ShadCN UI configuration
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies and scripts
├── public/               # Static assets
├── src/
│   ├── ai/               # Genkit AI related code
│   │   ├── dev.ts        # Genkit development server entry point
│   │   ├── flows/        # Directory for individual Genkit flows
│   │   └── genkit.ts     # Genkit initialization and global AI object
│   ├── app/              # Next.js App Router: pages, layouts, actions
│   │   ├── (page routes)/# e.g., dashboard/, about/, login/
│   │   ├── actions.ts    # Server Actions
│   │   ├── globals.css   # Global styles and Tailwind theme
│   │   └── layout.tsx    # Root layout
│   ├── components/       # Reusable UI components
│   │   ├── common/       # General common components (deprecated Simple3DElement)
│   │   ├── landing/      # Components for the landing page
│   │   ├── layout/       # Layout components (Navbar, Footer, ParticleBackground)
│   │   ├── scholar-ai/   # Core application feature components (renamed from Foss AI for consistency with some internal naming)
│   │   └── ui/           # ShadCN UI components
│   ├── hooks/            # Custom React hooks (e.g., useToast, useMobile)
│   └── lib/              # Utility functions and libraries
│       ├── firebase.ts   # Firebase initialization
│       ├── historyService.ts # Local storage for research history
│       └── utils.ts      # Utility functions (e.g., cn for Tailwind)
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 📜 Available Scripts

*   `npm run dev`: Starts the Next.js development server (with Turbopack).
*   `npm run genkit:dev`: Starts the Genkit development server.
*   `npm run genkit:watch`: Starts the Genkit development server with auto-reloading for flow changes.
*   `npm run build`: Builds the Next.js application for production.
*   `npm run start`: Starts the Next.js production server.
*   `npm run lint`: Runs Next.js linter.
*   `npm run typecheck`: Runs TypeScript type checking.
*   `npm run postinstall`: (If using `patch-package`) Applies patches after installation.

## 🧠 AI Functionality (Genkit)

Foss AI uses **Genkit for Firebase** to integrate with Google's Gemini AI models. The core AI logic is encapsulated in "flows" located in `src/ai/flows/`. These flows are server-side functions that handle tasks like:

*   `formulate-research-query.ts`: Takes a user's research question and generates optimized search queries, alternative phrasings, key concepts, and sub-topics.
*   `summarize-research-papers.ts`: (Conceptual) Takes paper abstracts/queries and synthesizes a summary.
*   `generate-research-report.ts`: Generates a detailed, multi-section academic-style report based on a research question and an optional summary.
*   `generate-research-image.ts`: Creates a conceptual image for a given research topic.
*   `generate-report-from-file.ts`: Generates a report based on an uploaded file and user guidance.
*   `generate-daily-prompt-flow.ts`: Creates a "Prompt of the Day" for the dashboard.
*   `extract-mindmap-concepts.ts`: Extracts key concepts and a main idea from text for mind mapping.

These flows are called by Next.js Server Actions defined in `src/app/actions.ts`.

## 🔐 Authentication

User authentication is handled by **Firebase Authentication**, supporting:
*   Email & Password sign-up and login.
*   Sign in with Google.

Authenticated users can access core features and manage their account settings.

## 🎨 Styling

The user interface is built with **ShadCN UI** components and styled using **Tailwind CSS**. The theme (colors, radius, etc.) is defined in `src/app/globals.css` and `tailwind.config.ts`. Dark mode is supported and managed by `next-themes`.

## ⚙️ Account Settings

The `/account-settings` page allows users to:
*   Manage their profile information (Display Name, Profile Picture URL - saved to Firebase Auth).
*   Update their password or request a password reset.
*   Delete their account.
*   Customize appearance (Theme: Light, Dark, System - saved to `localStorage`).
*   Set notification preferences (Email Notifications, Newsletter - saved to `localStorage`).
*   Configure interface settings (Items Per Page, Experimental Features - saved to `localStorage`).
*   View, export, and import their research activity history (managed via `localStorage`).

## 🤝 Contributing (Placeholder)

We welcome contributions to Foss AI! If you'd like to contribute, please:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature` or `fix/YourFix`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/YourFeature`).
6.  Open a Pull Request.

Please ensure your code adheres to the existing style and that any new features are well-documented.

## 📜 License (Placeholder)

This project is licensed under the **MIT License**. See the `LICENSE` file for details (if one exists, otherwise assume MIT or specify).

## 📞 Contact & Support (Placeholder)

If you have any questions, feedback, or encounter issues, please reach out via:
*   **GitHub Issues:** For bug reports and feature requests.
*   **Contact Page:** `/contact` within the application (uses a placeholder submission).
*   **Email:** `support@fossai.example.com` (placeholder)

---

Thank you for using and exploring Foss AI! We hope it empowers your research endeavors.
