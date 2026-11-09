# STRATOWATCH — Sudden Stratospheric Warming Platform

> **End-to-End Atmospheric Intelligence Platform: Public Awareness & Deep Scientific Analysis**  
> Developed by **Team CipheI / AtmosAI**  
> Department of Computer Science & Engineering (AI & ML), **Pimpri Chinchwad College of Engineering (PCCOE), Pune, India**

---

## 👥 Project Contributors

- **Tanmay Joshi** (`125B1C170`) — Analytical / Machine Learning Research & Sequence Modeling
- **Rahul & Teammates** — Public Awareness, Interactive Operations UI & Geographic Signal Translation
- **Dr. Jyoti Kulkarni** — Faculty Project Guide & Lead Advisor
- **Diksha Ithape** (`125B1C171`) — Co-Researcher
- **Aryan Patil** (`125B1C032`) — Co-Researcher
- **Chinmay Jain** (`125B1C169`) — Co-Researcher
- **Gaurav Dhurve** & **Riya Patil** — Project Contributors

---

## 🌐 Unified Dual-Page Platform

The merged STRATOWATCH platform connects real-time atmospheric science to practical citizen preparedness across two integrated pages:

### 1. Page 1: Public Awareness (`/` or `index.html`)
- **App Walkthrough (3-Phone Simulation):** Step-by-step mobile preview with simulated GPS location crosshair, local signal resolution, and practical precautions.
- **SSW Event Banner:** Real-time event warning with alert subscription toggle.
- **Interactive Coordinate Impact Map:** Live coordinate projection ($45^\circ\text{--}70^\circ\text{N} / 80^\circ\text{W}\text{--}35^\circ\text{E}$) with high/medium/low risk regions (Nordic corridor, UK & North Atlantic, Central Europe, Eastern Canada) and Google Maps-linked city pins.
- **Precautions Matrix:** High, Medium, and Low watch recommendations adapted from NOAA NWS and Ready.gov winter preparedness protocols.
- **Community Help Layer:** Live street map with safe point ("Warm centre"), filterable helper/request pins, and an interactive chat drawer.
- **Area Situation Report:** Real-time road status (E6, E18, Route 4), river levels, power status, and satellite-synced operations board.
- **Urgent SSW Warning Modal:** Animated warning modal with affected area details and safety action triggers.

### 2. Page 2: Scientific Analysis (`/science` or `science.html`)
- **Rigorous Charlton & Polvani (2007) Indexing:** 8 candidate events analyzed, 2 springtime "Final Warmings" correctly filtered out, isolating 6 genuine Major SSW events (`2021-01-05`, `2021-02-01`, `2023-02-16`, `2024-01-16`, `2024-03-04`, `2026-03-04`).
- **Target Leakage Discovery & Experimental Fix:** Eliminated $U$-wind features to prevent target leakage, forcing models to predict vortex collapse purely from Geopotential Height, Polar Cap Temperature, and Meridional ($V$) Wind dynamics.
- **Model Evaluation:** 14-Day Sequence LSTM achieves **0.909 ROC-AUC** and **66.7% Recall** on the imbalanced test set.
- **Synoptic ERA5 Projections:** 28 polar contour projections covering 2021–2026 across Temperature, U-Wind, V-Wind, and Geopotential Height.
- **3–4 Day Pre-Onset Precursor Heatmap Matrix & Lead Trajectory:** Multi-day lead tracking with real ERA5 baseline data.
- **Downward Coupling & Regional Surface Weather Impacts:** Teleconnections to North America (polar vortex displacement), Europe (Storm Filomena), and Northern India.
- **Live Atmospheric Sandbox:** Interactive sliders to test input variables against calibrated model thresholds.

---

## 🚀 Running the Website Locally

### 1. Launch with Python (Recommended)
```bash
python -m http.server 8080
```
Open your browser and visit:
- **Public Awareness (Page 1):** [http://localhost:8080](http://localhost:8080)
- **Scientific Analysis (Page 2):** [http://localhost:8080/science.html](http://localhost:8080/science.html) (or `http://localhost:8080/science/`)

You can switch between both pages using the **STRATOWATCH** topbar navigation links anytime!

### 2. Launch with React / Vite (Optional for Development)
```bash
npm install
npm run dev
```

---

## 📂 Repository Structure

```
SSW-Project/
├── index.html                   # Page 1: Public Awareness Dashboard
├── science.html                 # Page 2: Scientific Analysis & Research Platform
├── public-awareness.html        # Alias for Public Awareness
├── science/
│   └── index.html               # Seamless redirector for /science/
├── assets/
│   ├── css/
│   │   ├── public-awareness.css # Complete stylesheet for Public Awareness UI
│   │   └── style.css            # Editorial stylesheet for Scientific Dashboard
│   ├── js/
│   │   ├── public-awareness.js  # Interactive state engine for Public Awareness
│   │   ├── main.js              # Theme switcher & cross-page navigation
│   │   ├── scientific-data.js   # ERA5 datasets, model metrics, event indices
│   │   └── scientific-charts.js # Chart.js visualizations, heatmaps & sandbox
│   └── images/
│       └── map_{var}_{date}.png # 28 synoptic ERA5 polar contour maps (2021-2026)
├── src/                         # Teammates' React/TypeScript source components
│   ├── App.tsx
│   ├── main.tsx
│   └── style.css
├── package.json                 # Node dependencies
├── vite.config.ts               # Vite configuration
└── README.md
```

---

&copy; 2026 Team CipheI / AtmosAI — Pimpri Chinchwad College of Engineering (PCCOE), Pune.
