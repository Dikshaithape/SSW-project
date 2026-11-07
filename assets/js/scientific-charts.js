/**
 * PolarWatch Analytics — Scientific Engine & Interactive Charts
 * Clean Minimalist Prototype / Hackathon Dashboard
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

  // Set default Chart.js styling
  Chart.defaults.font.family = "'Inter', -apple-system, sans-serif";
  Chart.defaults.color = "#78716c";

  // Initialize charts
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
          label: "10 hPa Polar Cap Mean Temperature (°C)",
          data: temps,
          borderColor: "#c2410c",
          backgroundColor: "rgba(194, 65, 12, 0.08)",
          borderWidth: 2,
          fill: true,
          tension: 0.25,
          pointRadius: dataPoints.map(d => d.isEvent ? 5 : (d.isExcluded ? 4 : 1.5)),
          pointBackgroundColor: dataPoints.map(d => d.isEvent ? "#be123c" : (d.isExcluded ? "#b45309" : "#c2410c")),
          pointBorderColor: "#ffffff",
          pointBorderWidth: dataPoints.map(d => (d.isEvent || d.isExcluded) ? 1.5 : 0),
          pointHoverRadius: 7
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { boxWidth: 12 } },
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
          ticks: { maxTicksLimit: 10, font: { size: 10 } },
          grid: { color: "rgba(120, 113, 108, 0.12)" }
        },
        y: {
          title: { display: true, text: "Temperature (°C)", font: { size: 11 } },
          ticks: { font: { size: 10 } },
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
    if (f.category === "Geopotential") return "#c2410c";
    if (f.category === "Temperature") return "#be123c";
    return "#1e3a8a";
  });

  if (featureChartInstance) featureChartInstance.destroy();

  featureChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Gini Importance Score",
          data: values,
          backgroundColor: colors,
          borderRadius: 3
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
              return `Type: ${item.category}\nDesc: ${item.desc}`;
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: "Score (0 to 1)", font: { size: 10 } },
          ticks: { font: { size: 10 } },
          grid: { color: "rgba(120, 113, 108, 0.12)" }
        },
        y: {
          ticks: { font: { size: 10, family: "monospace" } },
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

  const metricsNames = ["Accuracy", "Precision", "Recall", "F1", "ROC-AUC"];
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
          label: "Random Forest",
          data: rfData,
          backgroundColor: "#1e3a8a",
          borderRadius: 3
        },
        {
          label: "Linear Regression",
          data: lrData,
          backgroundColor: "#b45309",
          borderRadius: 3
        },
        {
          label: "LSTM Sequence",
          data: lstmData,
          backgroundColor: "#15803d",
          borderRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { boxWidth: 12, font: { size: 11 } } }
      },
      scales: {
        x: { ticks: { font: { size: 11 } }, grid: { display: false } },
        y: {
          min: 0,
          max: 1.0,
          title: { display: true, text: "Metric Score", font: { size: 10 } },
          ticks: { font: { size: 10 } },
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
          borderColor: "#15803d",
          backgroundColor: "rgba(21, 128, 61, 0.05)",
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 2
        },
        {
          label: "Random Forest (AUC = 0.689)",
          data: curves.rf.map(pt => ({ x: pt.fpr, y: pt.tpr })),
          borderColor: "#1e3a8a",
          borderWidth: 1.75,
          tension: 0.3,
          pointRadius: 2
        },
        {
          label: "Linear Regression (AUC = 0.594)",
          data: curves.lr.map(pt => ({ x: pt.fpr, y: pt.tpr })),
          borderColor: "#b45309",
          borderWidth: 1.5,
          tension: 0.2,
          pointRadius: 2
        },
        {
          label: "Random (0.50)",
          data: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
          borderColor: "rgba(120, 113, 108, 0.4)",
          borderDash: [4, 4],
          borderWidth: 1.25,
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { boxWidth: 12, font: { size: 11 } } }
      },
      scales: {
        x: {
          type: "linear",
          min: 0,
          max: 1.0,
          title: { display: true, text: "False Positive Rate", font: { size: 10 } },
          ticks: { font: { size: 10 } },
          grid: { color: "rgba(120, 113, 108, 0.12)" }
        },
        y: {
          type: "linear",
          min: 0,
          max: 1.0,
          title: { display: true, text: "True Positive Rate (Recall)", font: { size: 10 } },
          ticks: { font: { size: 10 } },
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
      labels: history.epochs.map(e => `Ep ${e}`),
      datasets: [
        {
          label: "Training Loss",
          data: history.trainLoss,
          borderColor: "#c2410c",
          backgroundColor: "rgba(194, 65, 12, 0.05)",
          borderWidth: 2,
          pointRadius: 2.5,
          tension: 0.2
        },
        {
          label: "Validation Loss (Best @ Ep 2 = 0.612)",
          data: history.valLoss,
          borderColor: "#b45309",
          borderWidth: 1.75,
          pointRadius: 2.5,
          tension: 0.2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { boxWidth: 12, font: { size: 11 } } }
      },
      scales: {
        x: { ticks: { font: { size: 10 } }, grid: { color: "rgba(120, 113, 108, 0.12)" } },
        y: {
          title: { display: true, text: "Binary Cross-Entropy Loss", font: { size: 10 } },
          ticks: { font: { size: 10 } },
          grid: { color: "rgba(120, 113, 108, 0.12)" }
        }
      }
    }
  });
}

/* Dynamic theme update for charts */
window.updateChartColors = function(themeName) {
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
      "geopotential": "Geopotential Height (m) — Tracks polar vortex mass restructuring and displacement.",
      "u_wind": "Zonal U-Wind (m/s) — Reversal from westerly flow (+) to easterly circulation (-).",
      "temperature": "Temperature (K / °C) — Polar cap stratospheric warming excursion.",
      "v_wind": "Meridional V-Wind (m/s) — Planetary wave breaking and eddy heat momentum flux."
    };

    if (captionEl) {
      captionEl.innerHTML = `<strong>${varLabels[v]}</strong> 15 days before, onset day (${ev}), and 15 days after. Source: ECMWF ERA5 (10 hPa).`;
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

    // Sequence surrogate probability calculation
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
      statusPill.className = "pill-clean pill-rose";
      statusPill.innerText = "HIGH RISK: POLAR BREAKDOWN LIKELY";
      probBar.style.backgroundColor = "var(--accent-primary)";
    } else if (probPct >= 35) {
      statusPill.className = "pill-clean pill-amber";
      statusPill.innerText = "ELEVATED: VORTEX UNSTABLE";
      probBar.style.backgroundColor = "var(--accent-amber)";
    } else {
      statusPill.className = "pill-clean pill-green";
      statusPill.innerText = "NORMAL: STABLE POLAR VORTEX";
      probBar.style.backgroundColor = "var(--accent-emerald)";
    }
  }

  [geoSlider, tempSlider, tempStdSlider, vWindSlider].forEach(slider => {
    slider.addEventListener("input", updateInference);
  });

  updateInference();
}
