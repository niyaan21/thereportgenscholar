
# Foss AI: Intelligent Research & Report Generation Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Genkit (Gemini)](https://img.shields.io/badge/Genkit%20(Gemini)-AI%20Powered-orange?logo=google&logoColor=white)](https://firebase.google.com/docs/genkit)
[![Firebase](https://img.shields.io/badge/Firebase-SDK-FFCA28?logo=firebase)](https://firebase.google.com/)
[![ShadCN UI](https://img.shields.io/badge/ShadCN%20UI-Styling-black?logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Utility%20First-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Foss AI is a powerful Next.js web application designed to revolutionize your research process. It leverages cutting-edge Generative AI (powered by Google's Gemini models via Genkit) to assist users in formulating research queries, synthesizing knowledge, generating comprehensive reports, visualizing concepts, capturing voice notes, and extracting ideas for mind mapping.

## ✨ Core Features

*   **AI Query Formulation:** Transforms complex research questions into optimized search vectors, alternative phrasings, key concepts, and potential sub-topics.
*   **Intelligent Knowledge Synthesis:** Distills information based on formulated queries to provide concise summaries of key insights and themes. The AI-generated summary is editable by the user before full report generation.
*   **Comprehensive Report Generation:** Automatically generates structured, multi-section academic-style reports with sections like executive summary, literature review, methodology, results (with chart suggestions), discussion, and real academic references.
*   **File-Powered Guided Reporting:** Upload documents (TXT, MD, PDF, DOCX) and provide specific guidance to generate tailored reports based on the file's content.
*   **Voice-to-Text Research Notes:** Capture ideas, notes, and observations on-the-go using audio input. Transcribed notes can be edited and saved locally in the browser.
*   **Interview Transcription & Analysis:** Upload audio/video files for automated transcription and AI-powered thematic analysis, sentiment detection, and key insight extraction.
*   **Mind Map Concept Extraction:** Analyzes text input to identify a main idea and key concepts with related terms, providing a structured starting point for mind mapping.
*   **AI-Powered Originality Analysis:** Leverages AI to compare generated text against its vast knowledge base of academic literature and web sources, identifying potential similarities and citing likely original sources to help ensure academic integrity.
*   **Secure User Authentication:** Robust Firebase authentication (Email/Password, Sign in with Google).
*   **Intuitive User Interface:** Clean, modern, and responsive UI built with Next.js, ShadCN UI, and Tailwind CSS.
*   **Downloadable Outputs:** Export reports in structured JSON and formatted PDF.
*   **User Dashboard:** View activity stats (local), get daily research sparks (prompts), and quickly access features.
*   **Account Settings:** Manage profile, preferences (theme, language, notifications, interface - saved to `localStorage`), and research/voice note history (with export/import for research history).
*   **Dynamic Particle Background:** Visually engaging background that adapts to light/dark themes (disabled on mobile for performance).
*   **Basic Keyboard Shortcuts:** Quick navigation and actions for power users.
*   **Multi-language Support:** The interface for key pages (Login, Signup, Account Settings) is translated using i18next, with a framework in place for full application-wide internationalization.
*   **Robust API Failover:** Automatically retries requests on temporary "model overloaded" errors and rotates API keys if an authentication error occurs, ensuring high availability.

## 🚀 Planned Future Features

Foss AI is continuously evolving. Here are some of the exciting capabilities on our roadmap:

*   **Custom Report Templates:** Ability for users to create, save, and share report templates tailored to specific academic fields, journal requirements, or organizational standards.
*   **Research Timeline Visualization:** Interactive tools to create and visualize research project timelines, milestones, and progress. (Placeholder UI exists).
*   **Research Network Visualization:** Tools to map and explore connections between researchers, published papers, institutions, and key topics within a field.
*   **Ethics Compliance Checker:** AI-assisted review to help identify potential ethical considerations and ensure research aligns with relevant guidelines. (Placeholder UI exists).
*   **Advanced Keyboard Shortcuts:** A comprehensive set of keyboard shortcuts for power users to navigate and operate Foss AI features with maximum efficiency.
*   **Citation Management:** Advanced tools to manage citations and export bibliographies in various formats (e.g., .bib, RIS).

## ⌨️ Keyboard Shortcuts

Boost your productivity with these keyboard shortcuts:

*   **`Cmd/Ctrl + K`**: Focus on the main research question input (when on the homepage).
*   **`Cmd/Ctrl + Shift + H`**: Navigate to the Home page.
*   **`Cmd/Ctrl + Shift + D`**: Navigate to your Dashboard.
*   **`Cmd/Ctrl + Shift + ,`**: Navigate to Account Settings.
*   **`Cmd/Ctrl + Shift + U`**: Navigate to the File Report / Analysis Tools page.
*   **`Cmd/Ctrl + Shift + N`**: Navigate to the Notes & Transcription page.

(More shortcuts planned for future updates!)

## 🚀 Technology Stack

*   **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Components, Server Actions)
*   **AI Integration:** [Genkit for Firebase](https://firebase.google.com/docs/genkit) with Google Gemini models
*   **UI Library:** [React](https://reactjs.org/)
*   **Component Library:** [ShadCN UI](https://ui.shadcn.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Authentication:** [Firebase Authentication](https://firebase.google.com/docs/auth)
*   **Speech Recognition & Synthesis:** Browser's Web Speech API
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
    *   Create one or more API keys for Genkit to access Google AI services. Using multiple keys enhances application reliability.
    *   For Google Sign-In, ensure your OAuth 2.0 Client ID has the correct "Authorized JavaScript origins" and "Authorized redirect URIs" (including `http://localhost:[PORT]` for development).
*   A modern web browser that supports the Web Speech API (for Voice Notes feature, e.g., Chrome, Edge, Safari on macOS/iOS).

## ⚙️ Environment Setup

1.  **Clone the repository (if applicable):**
    ```bash
    git clone <your-repository-url>
    cd foss-ai # or your project directory
    ```

2.  **Create a `.env` file** in the root of your project and add your API keys. This is **required** for the application to function.
    ```env
    # Firebase Configuration (replace with your actual Firebase project config)
    NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXX"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789012"
    NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789012:web:xxxxxxxxxxxxxxxxxxxxxx"

    # Google AI API Key(s) for Genkit (REQUIRED for AI features)
    # Get your keys from your Google Cloud project with the "Generative Language API" enabled.
    # The application is configured to use a pool of keys for reliability.
    GEMINI_API_KEY_1="your_first_google_ai_key"
    GEMINI_API_KEY_2="your_second_google_ai_key"
    GEMINI_API_KEY_3="your_third_google_ai_key"
    # You can add more keys (GEMINI_API_KEY_4, etc.)
    ```
    The application is configured to read these variables. Ensure they are correctly set for all features to work.

## 🛠️ Installation

Install project dependencies:
```bash
npm install
# or
# yarn install
```

## ▶️ Running the Development Server

Foss AI requires two development servers to run concurrently: one for the Next.js frontend and one for the Genkit AI flows.

1.  **Start the Next.js Development Server:**
    ```bash
    npm run dev
    ```
    This will typically start the Next.js app on `http://localhost:3000`.

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

To build the application for production, run:
```bash
npm run build
```

To start the production server, run:
```bash
npm run start
```

## 🚀 Deployment to Netlify

This project is configured for easy deployment on Netlify.

> **⚠️ ATTENTION: CRITICAL DEPLOYMENT STEP**
> The most common reason for deployment errors (like "Unexpected response" or "API configuration issue") is missing environment variables on Netlify. Your local `.env` file is **NOT** uploaded. You **MUST** add your Firebase and Gemini API keys to the Netlify UI for the live application to work. Please follow the instructions in Step 3 carefully.

### Step-by-Step Guide

1.  **Connect Your Git Repository:** Log in to Netlify, click "Add new site" -> "Import an existing project", and connect to the GitHub/GitLab/Bitbucket repository containing your code.
2.  **Build Settings:** Netlify will automatically detect this is a Next.js project. The settings in `netlify.toml` will be used (`npm run build` command, `.next` publish directory). You shouldn't need to change anything here.
3.  **Add Environment Variables (CRITICAL):** This is the most important step for the deployed app to work. Your local `.env` file is NOT uploaded to Netlify. You must add the variables manually in the Netlify UI.
    *   In your Netlify site, go to **Site configuration > Environment variables**.
    *   Click **Add a variable**.
    *   Add each variable from your `.env` file one by one. It is crucial that the names match exactly.
    *   **`GEMINI_API_KEY_1`**: Add this variable with your first Google AI key.
    *   **`GEMINI_API_KEY_2`**: Add this variable with your second Google AI key.
    *   **`GEMINI_API_KEY_3`**: Add this variable with your third Google AI key.
        *   *(You can add more, e.g., `GEMINI_API_KEY_4`, `GEMINI_API_KEY_5`, etc.)*
    *   **Firebase Variables**: Add all the `NEXT_PUBLIC_FIREBASE_*` variables from your `.env` file.
4.  **Deploy Site:** Click the "Deploy site" button. Netlify will build and deploy your application.

### Troubleshooting Deployment Errors

*   **Error: "API configuration issue" or "Unexpected response"**: This error almost always means your **environment variables were not set correctly on Netlify**.
    1.  Go back to **Site configuration > Environment variables** in Netlify.
    2.  Double-check that you have added `GEMINI_API_KEY_1` (and any others) and all `NEXT_PUBLIC_FIREBASE_*` variables.
    3.  Verify that there are no typos in the variable names or their values.
    4.  After adding/correcting the variables, you must **re-deploy** your site. Go to the "Deploys" tab and trigger a new deploy.


## 📂 Key Project Structure

```
foss-ai/
├── .env                  # Environment variables (Firebase config, API keys)
├── netlify.toml          # Netlify deployment configuration
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
│   │   ├── (page routes)/# e.g., dashboard/, about/, login/, voice-notes/, file-report/
│   │   ├── actions.ts    # Server Actions
│   │   ├── globals.css   # Global styles and Tailwind theme
│   │   └── layout.tsx    # Root layout
│   ├── components/       # Reusable UI components
│   │   ├── landing/      # Components for the landing page
│   │   ├── layout/       # Layout components (Navbar, Footer, ParticleBackground, GlobalKeyboardShortcuts)
│   │   ├── scholar-ai/   # Core application feature components (now Foss AI components)
│   │   └── ui/           # ShadCN UI components
│   ├── hooks/            # Custom React hooks (e.g., useToast, useMobile)
│   └── lib/              # Utility functions and libraries
│       ├── firebase.ts   # Firebase initialization
│       ├── historyService.ts # Local storage for research history
│       ├── voiceNotesService.ts # Local storage for voice notes
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

## 🧠 AI Functionality (Genkit)

Foss AI uses **Genkit for Firebase** to integrate with Google's Gemini AI models. The core AI logic is encapsulated in "flows" located in `src/ai/flows/`. These flows are server-side functions that handle tasks like:

*   `formulate-research-query.ts`: Takes a user's research question and generates optimized search queries, alternative phrasings, key concepts, and sub-topics.
*   `summarize-research-papers.ts`: (Conceptual) Takes paper abstracts/queries and synthesizes a summary.
*   `generate-research-report.ts`: Generates a detailed, multi-section academic-style report based on a research question and an optional summary.
*   `generate-report-from-file.ts`: Generates a report based on an uploaded file and user guidance.
*   `generate-daily-prompt-flow.ts`: Creates a "Prompt of the Day" for the dashboard.
*   `extract-mindmap-concepts.ts`: Extracts key concepts and a main idea from text for mind mapping.
*   `transcribe-and-analyze-flow.ts`: Transcribes audio/video files and performs thematic analysis.
*   `plagiarism-check-flow.ts`: Performs an AI-powered originality analysis on text, identifying similar sentences and citing likely real-world sources.

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
*   Set language preferences for the UI (placeholder for future localization, saved to `localStorage`).
*   Set notification preferences (Email Notifications, Newsletter - saved to `localStorage`).
*   Configure interface settings (Items PerPage, Experimental Features - saved to `localStorage`).
*   View, export, and import their research activity history (managed via `localStorage`).
*   Manage voice notes (view, edit, delete - stored in `localStorage`).

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
