# Girionix AI ⚡

> **Next-Generation Multimodal AI Platform & Universal Creative Workstation**  
> *Envisioned, designed, and created by [Abhinav Giri](https://github.com/abhinavgiri45)*

[![React](https://img.shields.io/badge/React-18-blue.svg?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020.svg?style=flat-square&logo=cloudflare)](https://pages.cloudflare.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

---

## 🌟 Overview

**Girionix AI** is a unified, omnipotent AI polymath platform engineered to eliminate boundaries between fullstack software engineering, Olympiad-level mathematics, 8K studio visual art, Hollywood cinematic direction, and real-time fluid voice intelligence.

Available as a high-performance web app and as standalone desktop/mobile applications for **Windows**, **macOS**, **Linux**, and **Android**.

---

## ✨ Core Pillars & Capabilities

1. **💻 Superhuman Code Studio**
   * Real-time React 18 component sandboxing and code execution.
   * Fullstack architecture designs in TypeScript, Python, C++, Go, and Rust.
   * Big-O complexity analysis and automated diff viewers.

2. **📐 Mathematical Olympiad & Surface 3D Lab**
   * Formal mathematical proofs and calculus derivations formatted in KaTeX LaTeX.
   * Interactive 2D plotting and 3D surface visualizations.

3. **🎨 8K Studio Visual Generation**
   * Multi-model visual rendering engine powered by FLUX.1 models (Ultra-Realism, 8K Cinema, Anime Master, 3D Octane).
   * Intelligent aspect ratio detection (1:1, 16:9, 9:16, 3:4, 21:9).

4. **🎬 Hollywood Cinematic Direction & Video Studio**
   * Visual script writing, camera trajectory vectors, and lens focal-length scripting.
   * Integrated cinematic media player.

5. **🎙️ Voice AI Engine & Telemetry HUD**
   * Real-time bidirectional voice conversational intelligence.
   * Live neural token streaming telemetry and latency metrics.

6. **📦 Multi-Platform Native App Support**
   * Windows (`.exe` installer & portable)
   * Android (`.apk`)
   * macOS (`.dmg` & launcher)
   * Linux (`.AppImage`)

---

## 🚀 Quick Start

### Prerequisites
* Node.js 18+ or 20+
* npm, pnpm, or yarn

### 1. Clone Repository
```bash
git clone https://github.com/abhinavgiri45/girionix-ai.git
cd girionix-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory (based on `.env.example`):
```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
VITE_REPLICATE_API_TOKEN=your_replicate_api_token_here
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

---

## 📱 Android App (`/android`)

The native Android app version is fully integrated in the [`/android`](./android) directory:
* **Architecture:** Jetpack Compose, Room SQLite Database, WebKit Android Bridge (`GirionixAppBridge`), Material 3.
* **Open in Android Studio:** Open the `./android` directory in Android Studio (Giraffe / Hedgehog / Iguana / Jellyfish / Ladybug).
* **Build APK via Gradle:**
  ```bash
  cd android
  ./gradlew assembleRelease
  # Or assembleDebug for immediate device testing
  ./gradlew assembleDebug
  ```
* Output APK is generated at: `android/app/build/outputs/apk/release/app-release.apk` (or `app-debug.apk`).

---

## 🌐 Deploy to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Select repository: `abhinavgiri45/girionix-ai`.
3. Configure build settings:
   * **Framework preset:** `Vite`
   * **Build command:** `npm run build`
   * **Build output directory:** `dist`
4. Under **Environment variables**, add:
   * `VITE_OPENROUTER_API_KEY`
   * `VITE_REPLICATE_API_TOKEN`
5. Click **Save and Deploy**.

---

## 👨‍💻 Creator & Developer

**Abhinav Giri**
* **GitHub:** [@abhinavgiri45](https://github.com/abhinavgiri45)
* **X / Twitter:** [@AbhinavGiri45](https://x.com/AbhinavGiri45)
* **Instagram:** [@abhinavgiri45](https://instagram.com/abhinavgiri45)

---

## 📄 License
This project is licensed under the MIT License.
