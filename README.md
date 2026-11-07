# Sudden Stratospheric Warming (SSW) Detection & Prediction Platform

> **Random Forest & LSTM Based Prediction of Stratospheric Sudden Warming (SSW) Events in the Northern Polar Region**  
> Developed by **Team CipheI / AtmosAI**  
> Department of Computer Science & Engineering (AI & ML), **Pimpri Chinchwad College of Engineering (PCCOE), Pune, India**

---

## 👥 Project Contributors

- **Tanmay Joshi** (`125B1C170`) — Analytical / Machine Learning Research Contribution
- **Dr. Jyoti Kulkarni** — Faculty Project Guide & Lead Advisor
- **Diksha Ithape** (`125B1C171`) — Co-Researcher
- **Aryan Patil** (`125B1C032`) — Co-Researcher
- **Chinmay Jain** (`125B1C169`) — Co-Researcher
- **Gaurav Dhurve** & **Riya Patil** — Project Contributors

---

## 📌 Project Overview

Sudden Stratospheric Warmings (SSWs) are extreme atmospheric disruptions in the winter polar stratosphere (10 hPa, ~30 km altitude). Strong circumpolar westerly winds weaken rapidly and reverse to easterlies ($U < 0\text{ m/s}$), accompanied by a 30°C–50°C polar-cap warming spike. Within 1 to 3 weeks, this disruption propagates downward into the troposphere, causing severe sub-zero cold waves and snowstorms across North America, Europe, East Asia, and prolonged cold-day waves in **North & Northwest India**.

This project provides an end-to-end, reproducible machine learning pipeline trained on **6 winter seasons (2020–2026, 727 daily observations)** from Copernicus ECMWF ERA5 reanalysis to detect atmospheric precursor patterns and predict impending polar vortex collapse.

---

## 🔬 Key Scientific & ML Highlights

1. **Rigorous Charlton & Polvani (2007) Indexing:**
   - Detects winter circulation reversals with $\ge 20$-day event separation.
   - Requires winds to recover to westerly for $\ge 10$ consecutive days before April 30, successfully filtering out 2 springtime "Final Warmings" and isolating **6 genuine Major SSW events** (`2021-01-05`, `2021-02-01`, `2023-02-16`, `2024-01-16`, `2024-03-04`, `2026-03-04`).

2. **Target Leakage Discovery & Experimental Fix:**
   - In initial experiments, including $U$-wind resulted in an artificial $F1 = 1.00$ because the target is *defined* as $U < 0$.
   - We eliminated all $U$-wind features from the predictor matrix, forcing models to predict vortex collapse purely from Geopotential Height, Polar Cap Temperature, and Meridional ($V$) Wind dynamics.

3. **Model Evaluation & Results:**
   - **Linear Regression Baseline:** Accuracy = `0.485`, F1 = `0.271`, ROC-AUC = `0.594` (fails on binary threshold, high false alarms).
   - **Random Forest (300 Trees):** Accuracy = `0.824`, Recall = `0.238`, F1 = `0.294`, ROC-AUC = `0.689` (high accuracy on non-events, but misses 76% of rare SSWs).
   - **14-Day Sequence LSTM (Best Model):** Accuracy = `0.779`, **Recall = 0.667** (catches 14 of 21 test SSW days), **F1 = 0.483**, **ROC-AUC = 0.909**.

4. **Key Atmospheric Warning Signs:**
   - **#1:** `Geopotential_lag3` (0.140) & `Geopotential_roll7_mean` (0.114) — gravitational pressure structure deforms days before temperature peaks.
   - **#2:** `Temperature_roll7_std` (0.122) — 7-day temperature volatility is 2.1x more predictive than raw temperature alone (0.057).

---

## 🚀 How Teammates Can Clone and Run

### 1. Clone the Repository
```bash
git clone https://github.com/tanjo0407-creator/SSW-Project.git
cd SSW-Project
```

### 2. Run the Local Web Server
You can view the dashboard by launching any static file server:

**Using Python:**
```bash
python -m http.server 8080
```
Then open your browser and navigate to:
👉 **[http://localhost:8080](http://localhost:8080)**

Alternatively, you can directly double-click `index.html` to open it in Chrome, Edge, or Firefox!

---

## 📂 Repository Structure

```
SSW-Project/
├── index.html                   # Scientific Research & Analytical Contribution Dashboard
├── research.html                # Direct fallback redirect to index.html
├── README.md                    # Project documentation & execution guide
├── .gitignore                   # Git ignore rules
└── assets/
    ├── css/
    │   └── style.css            # Editorial scientific theme (Ivory, Terracotta, Navy) + presets
    ├── js/
    │   ├── main.js              # Theme switcher (Editorial / Forest / Obsidian) & KaTeX math engine
    │   ├── scientific-data.js   # ERA5 research datasets, model metrics, 8 candidate events
    │   └── scientific-charts.js # Chart.js interactive visualizations, ROC curves, loss curve & sandbox
    └── images/
        ├── fig1_polar_cap_temperature.png
        ├── lstm_actual_vs_predicted.png
        ├── lstm_training_loss.png
        ├── confusion_matrix_comparison.png
        ├── model_comparison_bar.png
        ├── model_roc_comparison.png
        └── map_{variable}_{event_date}.png  # 24 synoptic ERA5 polar contour maps
```

---

## 💻 Hardware Environment

- **CPU:** Intel® Core™ i9-14900K (24 cores / 32 threads)
- **GPU:** NVIDIA RTX 4500 Ada Generation (24GB GDDR6 with ECC)
- **Software Stack:** Python 3.11, TensorFlow/Keras, Scikit-Learn, ECMWF CDS-API, Xarray, NetCDF4, Chart.js, KaTeX

---

&copy; 2026 Team CipheI / AtmosAI — Pimpri Chinchwad College of Engineering (PCCOE), Pune.
