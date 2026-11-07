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
};

window.SCIENTIFIC_DATA = SCIENTIFIC_DATA;

