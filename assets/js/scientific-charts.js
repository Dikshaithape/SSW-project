/**
 * PolarWatch AI — Scientific Analytics Engine & Interactive Charts
 * Team CipheI / PCCOE Pune
 * Tanmay Joshi (125B1C170)
 */

let tempChartInstance = null;
let featureChartInstance = null;
let comparisonChartInstance = null;
let rocChartInstance = null;
let lossChartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
  if (typeof Chart === "undefined" || !window.SCIENTIFIC_DATA) {
    console.warn("Chart.js or SCIENTIFIC_DATA not loaded.");
    return;
  }

  // Set default Chart.js font & color
  Chart.defaults.font.family = "'Inter', -apple-system, sans-serif";
  Chart.defaults.color = "#78716c";

  // Initialize all charts
  initTemperatureChart();
  initFeatureImportanceChart();
  initModelComparisonChart();
  initRocChart();
  initLstmTrainingLossChart();
  initSpatialMapSelector();
  initPredictionSandbox();
});

/* 1. Multi-Year Polar Cap Temperature Chart */
function initTemperatureChart() {
  const ctx = document.getElementById("tempTimeSeriesChart");
  if (!ctx) return;

  const dataPoints = window.SCIENTIFIC_DATA.temperatureSeries;
  const labels = dataPoints.map(d => d.date);
  const temps = dataPoints.map(d => d.temp);

  if (tempChartInstance) tempChartInstance.destroy();

  tempChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Polar Cap Temperature at 10 hPa (°C)",
          data: temps,
          borderColor: "#c2410c", // Terracotta
          backgroundColor: "rgba(194, 65, 12, 0.08)",
          borderWidth: 2,
          fill: true,
          tension: 0.25,
          pointRadius: dataPoints.map(d => d.isEvent ? 6 : (d.isExcluded ? 5 : 2)),
          pointBackgroundColor: dataPoints.map(d => d.isEvent ? "#be123c" : (d.isExcluded ? "#b45309" : "#c2410c")),
          pointBorderColor: "#ffffff",
          pointBorderWidth: dataPoints.map(d => (d.isEvent || d.isExcluded) ? 1.5 : 0),
          pointHoverRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { boxWidth: 14 } },
        tooltip: {
          callbacks: {
            label: function(context) {
              const item = dataPoints[context.dataIndex];
              let desc = `${context.parsed.y}°C`;
              if (item.label) desc += ` — ${item.label}`;
              return desc;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { maxTicksLimit: 12 },
          grid: { color: "rgba(120, 113, 108, 0.12)" }
        },
        y: {
          title: { display: true, text: "Temperature (°C)" },
          grid: { color: "rgba(120, 113, 108, 0.12)" }
        }
      }
    }
  });
}

/* 2. Feature Importance Horizontal Bar Chart */
function initFeatureImportanceChart() {
  const ctx = document.getElementById("featureImportanceChart");
  if (!ctx) return;

  const features = [...window.SCIENTIFIC_DATA.featureImportances].reverse();
  const labels = features.map(f => f.feature);
  const values = features.map(f => f.importance);
  const colors = features.map(f => {
    if (f.category === "Geopotential") return "#c2410c"; // Terracotta
    if (f.category === "Temperature") return "#be123c";  // Crimson
    return "#1e3a8a";                                    // Navy
  });

  if (featureChartInstance) featureChartInstance.destroy();

  featureChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Importance Score",
          data: values,
          backgroundColor: colors,
          borderRadius: 4
        }
      ]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            afterLabel: function(context) {
              const item = features[context.dataIndex];
              return `Type: ${item.category}\nMeaning: ${item.desc}`;
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: "Gini Importance Score (0 to 1)" },
          grid: { color: "rgba(120, 113, 108, 0.12)" }
        },
        y: {
          grid: { display: false }
        }
      }
    }
  });
}

/* 3. Model Comparison Grouped Bar Chart */
function initModelComparisonChart() {
  const ctx = document.getElementById("modelComparisonBarChart");
  if (!ctx) return;

  const metricsNames = ["Accuracy", "Precision", "Recall", "F1-Score", "ROC-AUC"];
  const rfData = [0.824, 0.385, 0.238, 0.294, 0.689];
  const lrData = [0.485, 0.173, 0.378, 0.271, 0.594];
  const lstmData = [0.779, 0.378, 0.667, 0.483, 0.909];

  if (comparisonChartInstance) comparisonChartInstance.destroy();

  comparisonChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: metricsNames,
      datasets: [
        {
          label: "Random Forest (Ensemble)",
          data: rfData,
          backgroundColor: "#1e3a8a", // Navy
          borderRadius: 4
        },
        {
          label: "Linear Regression (Baseline)",
          data: lrData,
          backgroundColor: "#b45309", // Raw Amber
          borderRadius: 4
        },
        {
          label: "LSTM Sequence (Best Model)",
          data: lstmData,
          backgroundColor: "#15803d", // Sage Forest
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { boxWidth: 14 } }
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          min: 0,
          max: 1.0,
          title: { display: true, text: "Metric Score (0 to 1)" },
          grid: { color: "rgba(120, 113, 108, 0.12)" }
        }
      }
    }
  });
}

/* 4. Overlaid ROC Curves Chart */
function initRocChart() {
  const ctx = document.getElementById("rocCurvesChart");
  if (!ctx) return;

  const curves = window.SCIENTIFIC_DATA.rocCurves;

  if (rocChartInstance) rocChartInstance.destroy();

  rocChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "LSTM (AUC = 0.909)",
          data: curves.lstm.map(pt => ({ x: pt.fpr, y: pt.tpr })),
          borderColor: "#15803d", // Sage Forest
          backgroundColor: "rgba(21, 128, 61, 0.05)",
          borderWidth: 2.5,
          tension: 0.3,
          pointRadius: 2.5
        },
        {
          label: "Random Forest (AUC = 0.689)",
          data: curves.rf.map(pt => ({ x: pt.fpr, y: pt.tpr })),
          borderColor: "#1e3a8a", // Navy
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 2.5
        },
        {
          label: "Linear Regression (AUC = 0.594)",
          data: curves.lr.map(pt => ({ x: pt.fpr, y: pt.tpr })),
          borderColor: "#b45309", // Amber
          borderWidth: 1.5,
          tension: 0.2,
          pointRadius: 2
        },
        {
          label: "Random Guess (0.50)",
          data: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
          borderColor: "rgba(120, 113, 108, 0.4)",
          borderDash: [5, 5],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { boxWidth: 14 } }
      },
      scales: {
        x: {
          type: "linear",
          min: 0,
          max: 1.0,
          title: { display: true, text: "False Positive Rate (1 - Specificity)" },
          grid: { color: "rgba(120, 113, 108, 0.12)" }
        },
        y: {
          type: "linear",
          min: 0,
          max: 1.0,
          title: { display: true, text: "True Positive Rate (Recall / Sensitivity)" },
          grid: { color: "rgba(120, 113, 108, 0.12)" }
        }
      }
    }
  });
}

/* 5. LSTM Training Loss Progression Chart */
function initLstmTrainingLossChart() {
  const ctx = document.getElementById("lstmLossChart");
  if (!ctx) return;

  const history = window.SCIENTIFIC_DATA.lstmTrainingHistory;

  if (lossChartInstance) lossChartInstance.destroy();

  lossChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: history.epochs.map(e => `Epoch ${e}`),
      datasets: [
        {
          label: "Training Loss",
          data: history.trainLoss,
          borderColor: "#c2410c", // Terracotta
          backgroundColor: "rgba(194, 65, 12, 0.05)",
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.2
        },
        {
          label: "Validation Loss (Best @ Epoch 2 = 0.612)",
          data: history.valLoss,
          borderColor: "#b45309", // Amber
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { boxWidth: 14 } }
      },
      scales: {
        x: { grid: { color: "rgba(120, 113, 108, 0.12)" } },
        y: {
          title: { display: true, text: "Binary Cross-Entropy Loss" },
          grid: { color: "rgba(120, 113, 108, 0.12)" }
        }
      }
    }
  });
}

/* Dynamic theme update for charts */
window.updateChartColors = function(themeName) {
  // Let the charts re-initialize with current theme styling
  initTemperatureChart();
  initFeatureImportanceChart();
  initModelComparisonChart();
  initRocChart();
  initLstmTrainingLossChart();
};

/* 6. Interactive Spatial Map Selector */
function initSpatialMapSelector() {
  const varSelect = document.getElementById("spatialVarSelect");
  const eventSelect = document.getElementById("spatialEventSelect");
  const mapImg = document.getElementById("spatialMapImg");
  const captionEl = document.getElementById("spatialMapCaption");

  if (!varSelect || !eventSelect || !mapImg) return;

  function updateMap() {
    const v = varSelect.value;
    const ev = eventSelect.value;
    const filename = `map_${v}_${ev}.png`;
    mapImg.src = `assets/images/${filename}`;

    const varLabels = {
      "geopotential": "Geopotential Height (m) — Tracks the physical shape & splitting of the polar vortex.",
      "u_wind": "Zonal U-Wind (m/s) — Shows the classic wind flip from West-to-East (+) to backwards East-to-West (-).",
      "temperature": "Temperature (K / °C) — Displays the rapid warming spike across the Arctic cap.",
      "v_wind": "Meridional V-Wind (m/s) — Illustrates atmospheric waves and north-south storm turbulence."
    };

    if (captionEl) {
      captionEl.innerHTML = `<strong>${varLabels[v]}</strong> Comparing conditions 15 days before, on the day of the event (${ev}), and 15 days after. Generated from real ECMWF ERA5 satellite reanalysis.`;
    }
  }

  varSelect.addEventListener("change", updateMap);
  eventSelect.addEventListener("change", updateMap);
}

/* 7. Interactive Model Inference Sandbox */
function initPredictionSandbox() {
  const geoSlider = document.getElementById("sbGeo");
  const tempSlider = document.getElementById("sbTemp");
  const tempStdSlider = document.getElementById("sbTempStd");
  const vWindSlider = document.getElementById("sbVWind");

  if (!geoSlider || !tempSlider) return;

  function updateInference() {
    const geo = parseFloat(geoSlider.value);
    const temp = parseFloat(tempSlider.value);
    const tempStd = parseFloat(tempStdSlider.value);
    const vWind = parseFloat(vWindSlider.value);

    document.getElementById("sbGeoVal").innerText = `${geo > 0 ? "+" : ""}${geo} m²/s²`;
    document.getElementById("sbTempVal").innerText = `${temp > 0 ? "+" : ""}${temp}°C`;
    document.getElementById("sbTempStdVal").innerText = `${tempStd.toFixed(1)}°C`;
    document.getElementById("sbVWindVal").innerText = `${vWind.toFixed(1)} m/s`;

    // Surrogate sequence probability
    const zScore = (geo * 0.0035) + (temp * 0.09) + (tempStd * 0.35) + (Math.abs(vWind) * 0.08) - 1.8;
    const lstmProb = 1 / (1 + Math.exp(-zScore));

    const rfScore = (geo * 0.002) + (temp * 0.06) + (tempStd * 0.22) - 1.2;
    const rfProb = Math.max(0.02, Math.min(0.95, 1 / (1 + Math.exp(-rfScore))));

    const probPct = Math.round(lstmProb * 100);
    const probBar = document.getElementById("sbProbBar");
    const probText = document.getElementById("sbProbText");
    const statusPill = document.getElementById("sbStatusPill");
    const rfCompText = document.getElementById("sbRfProb");

    if (probBar) probBar.style.width = `${probPct}%`;
    if (probText) probText.innerText = `${probPct}%`;
    if (rfCompText) rfCompText.innerText = `${Math.round(rfProb * 100)}%`;

    if (probPct >= 65) {
      statusPill.className = "badge-clean badge-rose";
      statusPill.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> HIGH RISK: SSW POLAR BREAKDOWN LIKELY';
      probBar.style.backgroundColor = "var(--accent-primary)";
    } else if (probPct >= 35) {
      statusPill.className = "badge-clean badge-amber";
      statusPill.innerHTML = '<i class="fa-solid fa-bell"></i> ELEVATED: VORTEX UNSTABLE';
      probBar.style.backgroundColor = "var(--accent-amber)";
    } else {
      statusPill.className = "badge-clean badge-green";
      statusPill.innerHTML = '<i class="fa-solid fa-circle-check"></i> NORMAL: STABLE POLAR VORTEX';
      probBar.style.backgroundColor = "var(--accent-emerald)";
    }
  }

  [geoSlider, tempSlider, tempStdSlider, vWindSlider].forEach(slider => {
    slider.addEventListener("input", updateInference);
  });

  updateInference();
}
