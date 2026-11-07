/**
 * PolarWatch Analytics — Scientific Charts & Interactive Analytics
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

  // Set global Chart defaults
  Chart.defaults.font.family = "'Inter', -apple-system, sans-serif";
  Chart.defaults.color = "#64748b";

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
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.06)",
          borderWidth: 2,
          fill: true,
          tension: 0.2,
          pointRadius: dataPoints.map(d => d.isEvent ? 5 : (d.isExcluded ? 4 : 1.5)),
          pointBackgroundColor: dataPoints.map(d => d.isEvent ? "#dc2626" : (d.isExcluded ? "#d97706" : "#2563eb")),
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
        legend: { labels: { boxWidth: 12, font: { size: 12 } } },
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
          ticks: { maxTicksLimit: 12, font: { size: 11 } },
          grid: { color: "rgba(0, 0, 0, 0.05)" }
        },
        y: {
          title: { display: true, text: "Temperature (°C)", font: { size: 12 } },
          ticks: { font: { size: 11 } },
          grid: { color: "rgba(0, 0, 0, 0.05)" }
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
    if (f.category === "Geopotential") return "#2563eb";
    if (f.category === "Temperature") return "#dc2626";
    return "#7c3aed";
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
          title: { display: true, text: "Score (0 to 1)", font: { size: 11 } },
          ticks: { font: { size: 11 } },
          grid: { color: "rgba(0, 0, 0, 0.05)" }
        },
        y: {
          ticks: { font: { size: 11, family: "monospace" } },
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
          label: "Random Forest",
          data: rfData,
          backgroundColor: "#2563eb",
          borderRadius: 3
        },
        {
          label: "Linear Regression",
          data: lrData,
          backgroundColor: "#d97706",
          borderRadius: 3
        },
        {
          label: "LSTM Sequence",
          data: lstmData,
          backgroundColor: "#059669",
          borderRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { boxWidth: 12, font: { size: 12 } } }
      },
      scales: {
        x: { ticks: { font: { size: 11 } }, grid: { display: false } },
        y: {
          min: 0,
          max: 1.0,
          title: { display: true, text: "Metric Score", font: { size: 11 } },
          ticks: { font: { size: 11 } },
          grid: { color: "rgba(0, 0, 0, 0.05)" }
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
          borderColor: "#059669",
          backgroundColor: "rgba(5, 150, 105, 0.05)",
          borderWidth: 2.2,
          tension: 0.3,
          pointRadius: 2
        },
        {
          label: "Random Forest (AUC = 0.689)",
          data: curves.rf.map(pt => ({ x: pt.fpr, y: pt.tpr })),
          borderColor: "#2563eb",
          borderWidth: 1.8,
          tension: 0.3,
          pointRadius: 2
        },
        {
          label: "Linear Regression (AUC = 0.594)",
          data: curves.lr.map(pt => ({ x: pt.fpr, y: pt.tpr })),
          borderColor: "#d97706",
          borderWidth: 1.5,
          tension: 0.2,
          pointRadius: 2
        },
        {
          label: "Random Guess (0.50)",
          data: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
          borderColor: "#94a3b8",
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
        legend: { labels: { boxWidth: 12, font: { size: 12 } } }
      },
      scales: {
        x: {
          type: "linear",
          min: 0,
          max: 1.0,
          title: { display: true, text: "False Positive Rate (1 - Specificity)", font: { size: 11 } },
          ticks: { font: { size: 11 } },
          grid: { color: "rgba(0, 0, 0, 0.05)" }
        },
        y: {
          type: "linear",
          min: 0,
          max: 1.0,
          title: { display: true, text: "True Positive Rate (Recall)", font: { size: 11 } },
          ticks: { font: { size: 11 } },
          grid: { color: "rgba(0, 0, 0, 0.05)" }
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
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.05)",
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.2
        },
        {
          label: "Validation Loss (Best @ Epoch 2 = 0.612)",
          data: history.valLoss,
          borderColor: "#d97706",
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
        legend: { labels: { boxWidth: 12, font: { size: 12 } } }
      },
      scales: {
        x: { ticks: { font: { size: 11 } }, grid: { color: "rgba(0, 0, 0, 0.05)" } },
        y: {
          title: { display: true, text: "Binary Cross-Entropy Loss", font: { size: 11 } },
          ticks: { font: { size: 11 } },
          grid: { color: "rgba(0, 0, 0, 0.05)" }
        }
      }
    }
  });
}

window.updateChartColors = function() {
  if (tempChartInstance) tempChartInstance.resize();
  if (featureChartInstance) featureChartInstance.resize();
  if (comparisonChartInstance) comparisonChartInstance.resize();
  if (rocChartInstance) rocChartInstance.resize();
  if (lossChartInstance) lossChartInstance.resize();
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
      "geopotential": "Geopotential Height (m) — Polar vortex structure and mass displacement.",
      "u_wind": "Zonal U-Wind (m/s) — Reversal from westerly flow (+) to easterly circulation (-).",
      "temperature": "Temperature (K / °C) — Polar cap stratospheric warming excursion.",
      "v_wind": "Meridional V-Wind (m/s) — Planetary wave breaking and eddy heat momentum flux."
    };

    if (captionEl) {
      captionEl.innerHTML = `<strong>${varLabels[v]}</strong> 15 days before onset, during event onset (${ev}), and 15 days after. Source: ECMWF ERA5 (10 hPa).`;
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

    // Calibrated surrogate prediction
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
      statusPill.className = "pill pill-rose";
      statusPill.innerText = "HIGH RISK: POLAR BREAKDOWN LIKELY";
      probBar.style.backgroundColor = "#dc2626";
    } else if (probPct >= 35) {
      statusPill.className = "pill pill-amber";
      statusPill.innerText = "ELEVATED: VORTEX UNSTABLE";
      probBar.style.backgroundColor = "#d97706";
    } else {
      statusPill.className = "pill pill-green";
      statusPill.innerText = "NORMAL: STABLE POLAR VORTEX";
      probBar.style.backgroundColor = "#059669";
    }
  }

  [geoSlider, tempSlider, tempStdSlider, vWindSlider].forEach(slider => {
    slider.addEventListener("input", updateInference);
  });

  updateInference();
}
