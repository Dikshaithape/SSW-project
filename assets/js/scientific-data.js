/**
 * Scientific Research Datasets & Model Metrics
 * Sudden Stratospheric Warming (SSW) Detection in Northern Polar Region
 * Team CipheI / AtmosAI - Pimpri Chinchwad College of Engineering (PCCOE)
 */

const SCIENTIFIC_DATA = {
  project: {
    title: "Random Forest & LSTM Based Prediction of Stratospheric Sudden Warming (SSW) Events in the Northern Polar Region",
    shortTitle: "PolarWatch AI / SSW Research Analysis",
    authors: [
      { name: "Diksha Ithape", id: "125B1C171", email: "diksha.ithape25@pccoepune.org" },
      { name: "Aryan Patil", id: "125B1C032", email: "aryan.patil25@pccoepune.org" },
      { name: "Chinmay Jain", id: "125B1C169", email: "chinmay.jain25@pccoepune.org" },
      { name: "Tanmay Joshi", id: "125B1C170", email: "tanmay.joshi25@pccoepune.org" }
    ],
    mentors: [
      { name: "Dr. Jyoti Kulkarni", role: "Faculty Guide", email: "jyoti.kulkarni@pccoepune.org" },
      { name: "Gaurav Dhurve", role: "Contributor", email: "gaurav.dhurve25@pccoepune.org" },
      { name: "Riya Patil", role: "Contributor", email: "riya.patil251@pccoepune.org" }
    ],
    institution: "Department of Computer Science & Engineering (AI & ML), Pimpri Chinchwad College of Engineering, Pune, India",
    dataset: {
      source: "Copernicus ECMWF ERA5 Pressure Levels Reanalysis",
      period: "December 2020 – March 2026 (6 winter seasons)",
      samples: 727,
      level: "10 hPa (approx 30 km altitude / mid-stratosphere)",
      polarCap: "60°N – 90°N; 180°W – 180°E",
      variables: ["Temperature (K)", "U-wind (m/s)", "V-wind (m/s)", "Geopotential (m²/s²)"]
    },
    hardware: {
      cpu: "Intel® Core™ i9-14900K (24 cores / 32 threads)",
      gpu: "NVIDIA RTX 4500 Ada Generation (24GB GDDR6 with ECC)",
      igpu: "Intel® UHD Graphics 770"
    }
  },

  // Split distribution (70 / 15 / 15 chronological split)
  splitDistribution: {
    train: { total: 504, ssw: 71, nonSsw: 433, percentage: "70%" },
    val: { total: 108, ssw: 23, nonSsw: 85, percentage: "15%" },
    test: { total: 109, ssw: 14, nonSsw: 95, percentage: "15%" }
  },

  // 8 Candidate Dates Evaluated (6 Major SSWs Kept, 2 Final Warmings Excluded)
  events: [
    { date: "2021-01-05", type: "Major SSW", status: "Confirmed", uWind: "-14.2 m/s", tempRise: "+34 K", notes: "Vortex split; triggered historic Storm Filomena and prolonged European cold spell." },
    { date: "2021-02-01", type: "Major SSW", status: "Confirmed", uWind: "-8.6 m/s", tempRise: "+28 K", notes: "Prolonged vortex displacement; triggered historic Texas deep freeze cold blast." },
    { date: "2022-03-20", type: "Final Warming", status: "Excluded", uWind: "-5.1 m/s", tempRise: "+18 K", notes: "Seasonal springtime transition (winds failed to recover >=10 consecutive days before April 30)." },
    { date: "2023-02-16", type: "Major SSW", status: "Confirmed", uWind: "-18.5 m/s", tempRise: "+36 K", notes: "Wave-2 warming event; disrupted circumpolar flow and generated sub-zero UK/Nordic cold waves." },
    { date: "2024-01-16", type: "Major SSW", status: "Confirmed", uWind: "-22.1 m/s", tempRise: "+41 K", notes: "Major polar warming; strong teleconnection to severe prolonged cold wave across North & Northwest India." },
    { date: "2024-03-04", type: "Major SSW", status: "Confirmed", uWind: "-12.4 m/s", tempRise: "+26 K", notes: "Late-winter vortex displacement, shifting polar jet stream into mid-latitudes." },
    { date: "2025-03-09", type: "Final Warming", status: "Excluded", uWind: "-7.8 m/s", tempRise: "+19 K", notes: "Springtime final warming transition; correctly filtered by refined recovery criteria." },
    { date: "2026-03-04", type: "Major SSW", status: "Confirmed", uWind: "-60.0 m/s", tempRise: "+48 K", notes: "Deepest reversal analyzed; central Arctic U-wind dropped to -60 m/s with massive temperature spike." }
  ],

  // Model Performance Metrics (Table 3 from research paper)
  metrics: [
    {
      model: "Random Forest",
      type: "Ensemble (300 Trees, Depth 12)",
      accuracy: 0.824,
      precision: 0.385,
      recall: 0.238,
      f1: 0.294,
      rocAuc: 0.689,
      cm: { tn: 107, fp: 8, fn: 16, tp: 5 },
      color: "#38bdf8",
      role: "High overall accuracy due to majority non-event class; poor recall (misses 76% of SSWs)."
    },
    {
      model: "Linear Regression",
      type: "Interpretable Baseline",
      accuracy: 0.485,
      precision: 0.173,
      recall: 0.378,
      f1: 0.271,
      rocAuc: 0.594,
      cm: { tn: 53, fp: 62, fn: 8, tp: 13 },
      color: "#f97316",
      role: "Linear baseline; fails to capture nonlinear atmospheric thresholding; excessive false alarms."
    },
    {
      model: "LSTM (14-day Seq)",
      type: "Deep Recurrent Sequence (64+32 Units)",
      accuracy: 0.779,
      precision: 0.378,
      recall: 0.667,
      f1: 0.483,
      rocAuc: 0.909,
      cm: { tn: 92, fp: 23, fn: 7, tp: 14 },
      color: "#10b981",
      role: "Best performing model; highest recall (66.7%) and superior ROC-AUC (0.909) via temporal memory."
    }
  ],

  // Feature Importance Ranking (Random Forest - Leak-Free Model)
  featureImportances: [
    { feature: "Geopotential_lag3", importance: 0.140, category: "Geopotential", desc: "3-day lagged polar-cap geopotential height at 10 hPa" },
    { feature: "Temperature_roll7_std", importance: 0.122, category: "Temperature", desc: "7-day rolling standard deviation of polar cap temp (volatility)" },
    { feature: "Geopotential_roll7_mean", importance: 0.114, category: "Geopotential", desc: "7-day rolling mean geopotential height" },
    { feature: "Geopotential_lag1", importance: 0.091, category: "Geopotential", desc: "1-day lagged geopotential height" },
    { feature: "Geopotential", importance: 0.090, category: "Geopotential", desc: "Current polar cap geopotential height" },
    { feature: "V_Wind_roll7_std", importance: 0.084, category: "Meridional Wind", desc: "7-day rolling std of meridional wind (planetary wave activity)" },
    { feature: "V_Wind_roll7_mean", importance: 0.066, category: "Meridional Wind", desc: "7-day rolling mean meridional wind at 60°N" },
    { feature: "Temperature", importance: 0.057, category: "Temperature", desc: "Current polar cap mean temperature" },
    { feature: "Temperature_roll7_mean", importance: 0.048, category: "Temperature", desc: "7-day rolling mean temperature" },
    { feature: "Temperature_lag3", importance: 0.045, category: "Temperature", desc: "3-day lagged temperature" },
    { feature: "Geopotential_roll7_std", importance: 0.043, category: "Geopotential", desc: "7-day rolling standard deviation of geopotential" },
    { feature: "Temperature_lag1", importance: 0.042, category: "Temperature", desc: "1-day lagged temperature" },
    { feature: "V_Wind_lag3", importance: 0.030, category: "Meridional Wind", desc: "3-day lagged meridional wind" },
    { feature: "V_Wind_lag1", importance: 0.022, category: "Meridional Wind", desc: "1-day lagged meridional wind" },
    { feature: "V_Wind", importance: 0.020, category: "Meridional Wind", desc: "Current meridional wind (V-wind at 60°N)" }
  ],

  // LSTM Training History across epochs (Early stopping restored best weights at epoch 2)
  lstmTrainingHistory: {
    epochs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    trainLoss: [1.0371, 0.7688, 0.6723, 0.5952, 0.5323, 0.6037, 0.4879, 0.4270, 0.4088, 0.3657, 0.3433, 0.3228],
    valLoss: [0.8949, 0.6121, 0.8183, 0.7912, 0.6747, 0.8334, 0.6842, 0.7553, 0.7351, 0.7198, 0.7317, 0.7131]
  },

  // ROC Curve Points
  rocCurves: {
    lstm: [
      { fpr: 0.00, tpr: 0.00 }, { fpr: 0.02, tpr: 0.30 }, { fpr: 0.05, tpr: 0.58 },
      { fpr: 0.08, tpr: 0.74 }, { fpr: 0.15, tpr: 0.86 }, { fpr: 0.22, tpr: 0.92 },
      { fpr: 0.35, tpr: 0.96 }, { fpr: 0.55, tpr: 0.98 }, { fpr: 1.00, tpr: 1.00 }
    ],
    rf: [
      { fpr: 0.00, tpr: 0.00 }, { fpr: 0.04, tpr: 0.15 }, { fpr: 0.09, tpr: 0.28 },
      { fpr: 0.18, tpr: 0.48 }, { fpr: 0.30, tpr: 0.63 }, { fpr: 0.48, tpr: 0.76 },
      { fpr: 0.72, tpr: 0.88 }, { fpr: 1.00, tpr: 1.00 }
    ],
    lr: [
      { fpr: 0.00, tpr: 0.00 }, { fpr: 0.12, tpr: 0.20 }, { fpr: 0.25, tpr: 0.36 },
      { fpr: 0.42, tpr: 0.52 }, { fpr: 0.62, tpr: 0.70 }, { fpr: 0.82, tpr: 0.86 },
      { fpr: 1.00, tpr: 1.00 }
    ]
  },

  // Polar Cap Temperature Sample Points for Time Series Graph (2020-2026)
  temperatureSeries: [
    { date: "2020-12-01", temp: -72.4 }, { date: "2020-12-15", temp: -75.1 }, { date: "2021-01-01", temp: -62.3 },
    { date: "2021-01-05", temp: -38.2, isEvent: true, label: "05 Jan 2021 SSW" },
    { date: "2021-01-15", temp: -48.6 }, { date: "2021-01-25", temp: -54.0 },
    { date: "2021-02-01", temp: -42.1, isEvent: true, label: "01 Feb 2021 SSW" },
    { date: "2021-02-15", temp: -56.7 }, { date: "2021-03-01", temp: -59.2 }, { date: "2021-03-31", temp: -50.1 },
    { date: "2021-12-01", temp: -73.8 }, { date: "2022-01-15", temp: -71.2 }, { date: "2022-02-15", temp: -68.4 },
    { date: "2022-03-20", temp: -46.5, isExcluded: true, label: "Final Warming" },
    { date: "2022-12-01", temp: -74.5 }, { date: "2023-01-15", temp: -69.8 },
    { date: "2023-02-16", temp: -36.4, isEvent: true, label: "16 Feb 2023 SSW" },
    { date: "2023-03-01", temp: -49.3 }, { date: "2023-03-31", temp: -45.0 },
    { date: "2023-12-01", temp: -76.0 }, { date: "2024-01-05", temp: -68.1 },
    { date: "2024-01-16", temp: -31.8, isEvent: true, label: "16 Jan 2024 SSW" },
    { date: "2024-02-05", temp: -55.2 }, { date: "2024-02-20", temp: -58.7 },
    { date: "2024-03-04", temp: -39.5, isEvent: true, label: "04 Mar 2024 SSW" },
    { date: "2024-03-31", temp: -44.2 }, { date: "2024-12-01", temp: -73.2 }, { date: "2025-01-15", temp: -70.5 },
    { date: "2025-02-15", temp: -66.8 },
    { date: "2025-03-09", temp: -45.1, isExcluded: true, label: "Final Warming" },
    { date: "2025-12-01", temp: -75.8 }, { date: "2026-01-15", temp: -72.1 }, { date: "2026-02-15", temp: -64.3 },
    { date: "2026-03-04", temp: -27.5, isEvent: true, label: "04 Mar 2026 SSW" },
    { date: "2026-03-19", temp: -48.2 }, { date: "2026-03-31", temp: -42.8 }
  ]
  ,
  // 3-to-4 Day Precursor Lead-Time Telemetry & Heatmap Datasets
  // Evaluated for pre-onset early warning (Lead Days T-7 to T0)
  leadTimeForecasts: {
    "simulated-impending": {
      id: "simulated-impending",
      name: "Impending SSW Event (Live 3-Day Countdown)",
      subtitle: "Current Status: T-3 Days Critical Warning — Vortex Collapse in ~72 Hours",
      status: "CRITICAL WARNING",
      statusClass: "badge-rose",
      currentLead: "T-3d",
      onsetEta: "3 Days (72 hrs)",
      confidence: "89.4%",
      leadDays: ["T-7d", "T-6d", "T-5d", "T-4d (Advisory)", "T-3d (Critical)", "T-2d", "T-1d", "T0 (Onset)"],
      shortDays: ["T-7d", "T-6d", "T-5d", "T-4d", "T-3d", "T-2d", "T-1d", "T0"],
      timestamps: ["Day -7", "Day -6", "Day -5", "Day -4", "Day -3 (Current)", "Day -2", "Day -1", "Day 0"],
      metrics: {
        lstmProb: [12, 19, 38, 71, 89, 95, 98, 99],
        uWind: [27.8, 23.5, 17.2, 8.6, 2.4, -2.1, -5.8, -11.2],
        tempAnomaly: [+1.5, +3.8, +8.9, +16.4, +23.2, +28.5, +31.8, +34.5],
        geoVariance: [15, 26, 45, 78, 92, 105, 115, 122],
        vWindFlux: [1.6, 2.7, 5.1, 8.4, 11.2, 13.0, 14.5, 15.2]
      },
      verticalCoupling: [
        { level: "10 hPa (Mid-Stratosphere)", tMinus4: "Wave-1 Amplification", tZero: "Easterly Reversal (-11 m/s)", wPlus1: "Complete Polar Warming (+35K)", wPlus2: "Vortex Displaced South", wPlus3: "Gradual Recovery" },
        { level: "50 hPa (Lower Stratosphere)", tMinus4: "Deceleration Starts", tZero: "Weak Westerlies (+5 m/s)", wPlus1: "Reversal to Easterlies", wPlus2: "Strong Stratospheric Warmth", wPlus3: "Residual Anomaly" },
        { level: "100 hPa (Tropopause)", tMinus4: "Stable Circulation", tZero: "Pressure Wave Forcing", wPlus1: "Tropopause Folding Downward", wPlus2: "Geopotential Ridge Builds", wPlus3: "Slow Strat-Trop Dissipation" },
        { level: "500 hPa (Mid-Troposphere)", tMinus4: "Normal Westerly Jet", tZero: "Jet Stream Meandering", wPlus1: "Negative AO / NAO Blocking", wPlus2: "Massive Arctic Air Leakage", wPlus3: "Persistent Blocking Highs" },
        { level: "1000 hPa (Surface)", tMinus4: "Seasonal Temperatures", tZero: "First Cold Wave Warning", wPlus1: "Sub-Zero Plunge (North America)", wPlus2: "Extreme Cold Day Wave (N. India)", wPlus3: "Severe Frost & Snowfields" }
      ],
      regionalImpacts: [
        { region: "North & Northwest India (Delhi, Punjab, Haryana, Rajasthan)", risk: "Severe", icon: "fa-temperature-arrow-down", timing: "Days +7 to +21 post-onset", summary: "Sub-tropical jet displacement drives severe cold-day conditions; minimum temperatures predicted 2°C–5°C below normal with dense radiation fog." },
        { region: "North America (Central / Midwest / US East)", risk: "High", icon: "fa-snowflake", timing: "Days +5 to +18 post-onset", summary: "Arctic polar outbreak; negative Arctic Oscillation pushes Canadian polar vortex lobe into the Upper Midwest and East Coast." },
        { region: "Northern & Central Europe (UK, Scandinavia, Germany)", risk: "High", icon: "fa-wind", timing: "Days +10 to +25 post-onset", summary: "High-latitude Scandinavian blocking triggers Siberian easterly winds ('Beast from the East') and persistent sub-zero snowfall." },
        { region: "East Asia (Siberia, Northern China, Korea, Japan)", risk: "Moderate", icon: "fa-cloud-meatball", timing: "Days +8 to +20 post-onset", summary: "Intense Siberian High expansion causing sharp drops in surface temperatures across Manchuria and northern Honshu." }
      ]
    },
    "2024-01-16": {
      id: "2024-01-16",
      name: "January 2024 Major SSW (North India Cold Wave Case Study)",
      subtitle: "Verified Event: Detected at T-4d (73%) and Confirmed at T-3d (89%) prior to Onset",
      status: "HISTORICAL BENCHMARK",
      statusClass: "badge-green",
      currentLead: "T-4d & T-3d Window",
      onsetEta: "Onset Date: 2024-01-16",
      confidence: "91.2%",
      leadDays: ["T-7d (Jan 09)", "T-6d (Jan 10)", "T-5d (Jan 11)", "T-4d (Jan 12)", "T-3d (Jan 13)", "T-2d (Jan 14)", "T-1d (Jan 15)", "T0 (Jan 16)"],
      shortDays: ["T-7d", "T-6d", "T-5d", "T-4d", "T-3d", "T-2d", "T-1d", "T0"],
      timestamps: ["2024-01-09", "2024-01-10", "2024-01-11", "2024-01-12", "2024-01-13", "2024-01-14", "2024-01-15", "2024-01-16"],
      metrics: {
        lstmProb: [14, 22, 42, 73, 89, 94, 98, 99],
        uWind: [28.4, 24.1, 16.8, 8.2, 2.1, -1.8, -4.5, -8.4],
        tempAnomaly: [+1.8, +4.2, +9.5, +17.2, +24.8, +29.1, +32.4, +35.2],
        geoVariance: [14, 25, 48, 79, 94, 108, 118, 126],
        vWindFlux: [1.8, 2.9, 5.2, 8.7, 11.4, 13.2, 14.8, 15.6]
      },
      verticalCoupling: [
        { level: "10 hPa (Mid-Stratosphere)", tMinus4: "U dropped to 8.2 m/s", tZero: "Reversal U = -8.4 m/s", wPlus1: "Cap Warmth +35.2K", wPlus2: "Vortex Flattened", wPlus3: "Easterlies Wane" },
        { level: "50 hPa (Lower Stratosphere)", tMinus4: "Zonal Deceleration", tZero: "Westerly Collapse", wPlus1: "Negative U Reversal", wPlus2: "Thermal Core Intact", wPlus3: "Gradual Subsidence" },
        { level: "100 hPa (Tropopause)", tMinus4: "Normal Jet Stream", tZero: "Planetary Wave Peak", wPlus1: "Tropopause Distorted", wPlus2: "Anticyclone Aloft", wPlus3: "Strat-Trop Decoupling" },
        { level: "500 hPa (Mid-Troposphere)", tMinus4: "Westerly Flow", tZero: "Wave Amplification", wPlus1: "Urals Blocking High", wPlus2: "Sub-Tropical Jet Dips", wPlus3: "Trough Over N. India" },
        { level: "1000 hPa (Surface)", tMinus4: "Moderate Winter", tZero: "Cold Alert Issued", wPlus1: "Delhi 3.5°C Cold Day", wPlus2: "Dense Fog Across Punjab/UP", wPlus3: "Agricultural Frost" }
      ],
      regionalImpacts: [
        { region: "North & Northwest India", risk: "Extreme", icon: "fa-temperature-arrow-down", timing: "Late Jan – Mid Feb 2024", summary: "Documented historical prolonged cold wave: record low maximum temperatures in Delhi (12°C–14°C) and frost across Punjab/Rajasthan." },
        { region: "North America", risk: "High", icon: "fa-snowflake", timing: "Mid Jan 2024", summary: "Simultaneous Arctic blast across US Midwest and Texas, causing severe winter storm conditions." },
        { region: "Europe", risk: "Moderate", icon: "fa-wind", timing: "Late Jan 2024", summary: "Persistent cold advection across Central Europe and Scandinavia." },
        { region: "East Asia", risk: "Moderate", icon: "fa-cloud-meatball", timing: "Jan 20–Feb 05 2024", summary: "Cold Siberian surge pushing freezing isotherms into central China." }
      ]
    },
    "2026-03-04": {
      id: "2026-03-04",
      name: "March 2026 Deepest Reversal (Central Arctic U = -60 m/s)",
      subtitle: "Most extreme vortex collapse in the 6-year ERA5 dataset (+48K temperature spike)",
      status: "EXTREME HISTORICAL EVENT",
      statusClass: "badge-rose",
      currentLead: "T-4d & T-3d Window",
      onsetEta: "Onset Date: 2026-03-04",
      confidence: "94.8%",
      leadDays: ["T-7d (Feb 25)", "T-6d (Feb 26)", "T-5d (Feb 27)", "T-4d (Feb 28)", "T-3d (Mar 01)", "T-2d (Mar 02)", "T-1d (Mar 03)", "T0 (Mar 04)"],
      shortDays: ["T-7d", "T-6d", "T-5d", "T-4d", "T-3d", "T-2d", "T-1d", "T0"],
      timestamps: ["2026-02-25", "2026-02-26", "2026-02-27", "2026-02-28", "2026-03-01", "2026-03-02", "2026-03-03", "2026-03-04"],
      metrics: {
        lstmProb: [18, 31, 56, 82, 94, 98, 99, 100],
        uWind: [32.1, 26.4, 15.2, 5.1, -1.2, -18.4, -38.2, -60.0],
        tempAnomaly: [+2.4, +6.1, +14.2, +24.8, +34.5, +41.2, +45.8, +48.2],
        geoVariance: [18, 35, 62, 96, 122, 145, 162, 178],
        vWindFlux: [2.1, 3.8, 7.2, 11.8, 15.4, 18.2, 21.0, 22.8]
      },
      verticalCoupling: [
        { level: "10 hPa (Mid-Stratosphere)", tMinus4: "Massive Planetary Flux", tZero: "Extreme Reversal -60 m/s", wPlus1: "Record Warming +48K", wPlus2: "Vortex Annihilation", wPlus3: "Protracted Easterlies" },
        { level: "50 hPa (Lower Stratosphere)", tMinus4: "Violent Deceleration", tZero: "Complete Wind Flip", wPlus1: "Deep Easterlies Descent", wPlus2: "Stratospheric Core Heated", wPlus3: "Suppressed Cyclogenesis" },
        { level: "100 hPa (Tropopause)", tMinus4: "Wave Convergence", tZero: "Severe Tropopause Shock", wPlus1: "Arctic Geopotential Spike", wPlus2: "Negative AO Index (< -3.5)", wPlus3: "Widespread Jet Breakdown" },
        { level: "500 hPa (Mid-Troposphere)", tMinus4: "Planetary Wave 2 Spike", tZero: "Split Jet Branches", wPlus1: "Severe High-Latitude Block", wPlus2: "Meridional Arctic Trough", wPlus3: "Hemispheric Cold Outbreak" },
        { level: "1000 hPa (Surface)", tMinus4: "Early Alert Sent", tZero: "Emergency Advisory", wPlus1: "Severe Snowstorm (Europe)", wPlus2: "Unprecedented March Cold", wPlus3: "Agricultural Emergency" }
      ],
      regionalImpacts: [
        { region: "North & Northwest India", risk: "Severe", icon: "fa-temperature-arrow-down", timing: "Mid to Late March 2026", summary: "Unusual late-spring cold spells and heavy unseasonal precipitation across the Himalayan foothills." },
        { region: "Europe & UK", risk: "Extreme", icon: "fa-snowflake", timing: "March 10–28, 2026", summary: "Catastrophic late-winter cold surge; Siberian air mass covering 80% of continental Europe." },
        { region: "North America", risk: "High", icon: "fa-wind", timing: "March 08–22, 2026", summary: "Polar vortex split driving deep freezing conditions into Canadian Prairies and US Plains." },
        { region: "East Asia", risk: "High", icon: "fa-cloud-meatball", timing: "March 12–25, 2026", summary: "Sub-zero cold plunge across Beijing, Seoul, and Tokyo." }
      ]
    },
    "2023-02-16": {
      id: "2023-02-16",
      name: "February 2023 Major SSW (Vortex Split & European Freeze)",
      subtitle: "Classic Wave-2 polar vortex splitting with rapid onset and -18.5 m/s reversal",
      status: "HISTORICAL BENCHMARK",
      statusClass: "badge-green",
      currentLead: "T-4d & T-3d Window",
      onsetEta: "Onset Date: 2023-02-16",
      confidence: "88.6%",
      leadDays: ["T-7d (Feb 09)", "T-6d (Feb 10)", "T-5d (Feb 11)", "T-4d (Feb 12)", "T-3d (Feb 13)", "T-2d (Feb 14)", "T-1d (Feb 15)", "T0 (Feb 16)"],
      shortDays: ["T-7d", "T-6d", "T-5d", "T-4d", "T-3d", "T-2d", "T-1d", "T0"],
      timestamps: ["2023-02-09", "2023-02-10", "2023-02-11", "2023-02-12", "2023-02-13", "2023-02-14", "2023-02-15", "2023-02-16"],
      metrics: {
        lstmProb: [10, 16, 35, 68, 86, 92, 96, 98],
        uWind: [26.2, 22.8, 15.4, 7.8, 1.8, -3.2, -10.5, -18.5],
        tempAnomaly: [+1.2, +3.5, +8.1, +15.6, +23.4, +28.9, +32.8, +36.4],
        geoVariance: [12, 22, 42, 74, 90, 102, 114, 120],
        vWindFlux: [1.4, 2.4, 4.8, 8.1, 10.8, 12.6, 14.1, 14.8]
      },
      verticalCoupling: [
        { level: "10 hPa (Mid-Stratosphere)", tMinus4: "Vortex Bipolar Elongation", tZero: "Split into 2 Daughter Vortices", wPlus1: "Thermal Maximum +36.4K", wPlus2: "Reversal Persists 18 Days", wPlus3: "Re-merging Stage" },
        { level: "50 hPa (Lower Stratosphere)", tMinus4: "Deceleration Across 60°N", tZero: "Wind Weakens to Zero", wPlus1: "Full Easterlies Expansion", wPlus2: "Warming Settles Over Cap", wPlus3: "Slow Relaxation" },
        { level: "100 hPa (Tropopause)", tMinus4: "Moderate Planetary Waves", tZero: "Geopotential Bulge", wPlus1: "Tropopause Elevated", wPlus2: "Sub-Polar Ridge Anchored", wPlus3: "Atmospheric Stabilization" },
        { level: "500 hPa (Mid-Troposphere)", tMinus4: "Zonal Flow", tZero: "Meandering Rossby Wave", wPlus1: "Greenland Blocking Anticyclone", wPlus2: "Deep Troughs in Europe", wPlus3: "Extended Winter Pattern" },
        { level: "1000 hPa (Surface)", tMinus4: "Normal February", tZero: "Cold Watch Triggered", wPlus1: "Sub-Zero Blast Across UK/Nordics", wPlus2: "Heavy Snowfall in Alps", wPlus3: "Prolonged Late Freeze" }
      ],
      regionalImpacts: [
        { region: "Europe & UK", risk: "Severe", icon: "fa-snowflake", timing: "Late Feb – Early March 2023", summary: "High-pressure blocking brought extensive sub-zero cold and snowfall across the UK, Ireland, and Northern Europe." },
        { region: "North America", risk: "Moderate", icon: "fa-wind", timing: "Feb 20–28, 2023", summary: "Fluctuating polar jet stream causing alternating cold snaps in the Northeast." },
        { region: "North & Northwest India", risk: "Moderate", icon: "fa-temperature-arrow-down", timing: "Early March 2023", summary: "Western Disturbance interactions causing unseasonal temperature dips in Himachal Pradesh, Punjab, and Jammu." },
        { region: "East Asia", risk: "Moderate", icon: "fa-cloud-meatball", timing: "Late Feb 2023", summary: "Cold Siberian advection over Northern China and Korea." }
      ]
    }
  },

};

window.SCIENTIFIC_DATA = SCIENTIFIC_DATA;

