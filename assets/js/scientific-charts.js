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
  initLeadTimeTracker();

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

      statusPill.innerHTML = 'HIGH RISK: SSW POLAR BREAKDOWN LIKELY';

      probBar.style.backgroundColor = "var(--accent-primary)";

    } else if (probPct >= 35) {

      statusPill.className = "badge-clean badge-amber";

      statusPill.innerHTML = 'ELEVATED: VORTEX UNSTABLE';

      probBar.style.backgroundColor = "var(--accent-amber)";

    } else {

      statusPill.className = "badge-clean badge-green";

      statusPill.innerHTML = 'NORMAL: STABLE POLAR VORTEX';

      probBar.style.backgroundColor = "var(--accent-emerald)";

    }

  }



  [geoSlider, tempSlider, tempStdSlider, vWindSlider].forEach(slider => {

    slider.addEventListener("input", () => {

      document.querySelectorAll(".sb-preset-btn").forEach(b => b.classList.remove("active"));

      updateInference();

    });

  });



  // Hackathon demo one-click presets

  const presetButtons = document.querySelectorAll(".sb-preset-btn");

  presetButtons.forEach(btn => {

    btn.addEventListener("click", () => {

      presetButtons.forEach(b => b.classList.remove("active"));

      btn.classList.add("active");

      const geo = btn.getAttribute("data-geo");

      const temp = btn.getAttribute("data-temp");

      const tempStd = btn.getAttribute("data-tempstd");

      const vwind = btn.getAttribute("data-vwind");

      if (geo !== null) geoSlider.value = geo;

      if (temp !== null) tempSlider.value = temp;

      if (tempStd !== null) tempStdSlider.value = tempStd;

      if (vwind !== null) vWindSlider.value = vwind;

      updateInference();

    });

  });



  updateInference();

}



/* ===================================================================
   8. 3-TO-4 DAY PRE-ONSET EARLY WARNING HORIZON & HEATMAP TRACKER
   =================================================================== */
let leadTrajectoryChartInstance = null;

function initLeadTimeTracker() {
  const chartCanvas = document.getElementById("leadTrajectoryChart");
  const tabBtns = document.querySelectorAll(".horizon-tab-btn");
  if (!chartCanvas || !window.SCIENTIFIC_DATA || !window.SCIENTIFIC_DATA.leadTimeForecasts) return;

  function renderEvent(eventKey) {
    const ev = window.SCIENTIFIC_DATA.leadTimeForecasts[eventKey];
    if (!ev) return;

    // Active tab state
    tabBtns.forEach(btn => {
      if (btn.getAttribute("data-event") === eventKey) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // 1. Update Mission Control Alert Banner
    const bannerTitle = document.getElementById("horizonBannerTitle");
    const bannerSubtitle = document.getElementById("horizonBannerSubtitle");
    const bannerConfidence = document.getElementById("horizonConfidence");
    const bannerEta = document.getElementById("horizonEta");
    const bannerStatusBadge = document.getElementById("horizonStatusBadge");

    if (bannerTitle) bannerTitle.innerText = ev.name;
    if (bannerSubtitle) bannerSubtitle.innerText = ev.subtitle;
    if (bannerConfidence) bannerConfidence.innerText = ev.confidence;
    if (bannerEta) bannerEta.innerText = ev.onsetEta;
    if (bannerStatusBadge) {
      bannerStatusBadge.className = `badge-clean ${ev.statusClass}`;
      bannerStatusBadge.innerText = ev.status;
    }

    // 2. Render Heatmap Matrix
    renderHeatmapMatrix(ev);

    // 3. Render Trajectory Chart
    renderTrajectoryChart(ev);

    // 4. Render Downward Stratospheric-Tropospheric Coupling Table
    renderDownwardCouplingTable(ev);

    // 5. Render Regional Impact Cards
    renderRegionalImpactCards(ev);
  }

  function renderHeatmapMatrix(ev) {
    const container = document.getElementById("leadHeatmapContainer");
    if (!container) return;

    const days = ev.shortDays;
    const m = ev.metrics;

    let html = `
      <table class="heatmap-table">
        <thead>
          <tr>
            <th style="text-align: left; padding-left: 1rem;">Precursor Diagnostic Indicator</th>
    `;

    days.forEach((d, idx) => {
      const isWindow = (idx === 3 || idx === 4); // T-4d and T-3d
      html += `
        <th class="heatmap-th-lead ${isWindow ? 'col-window-highlight' : ''}">
          ${d}
          ${isWindow ? '<div style="font-size: 0.65rem; color: var(--accent-primary); font-weight: 800; margin-top: 2px;">★ ACTION WINDOW</div>' : ''}
        </th>
      `;
    });
    html += `</tr></thead><tbody>`;

    // Row 1: LSTM Probability
    html += `<tr><td class="heatmap-row-header">LSTM Breakdown Probability P(SSW)</td>`;
    m.lstmProb.forEach((prob, idx) => {
      const isWindow = (idx === 3 || idx === 4);
      let bg, fg;
      if (prob >= 80) { bg = "rgba(225, 29, 72, 0.85)"; fg = "#ffffff"; }
      else if (prob >= 60) { bg = "rgba(234, 88, 12, 0.80)"; fg = "#ffffff"; }
      else if (prob >= 35) { bg = "rgba(245, 158, 11, 0.50)"; fg = "#1c1917"; }
      else { bg = "rgba(59, 130, 246, 0.20)"; fg = "var(--text-primary)"; }
      html += `<td class="heatmap-cell ${isWindow ? 'col-window-highlight' : ''}" style="background-color: ${bg}; color: ${fg};" title="Lead ${days[idx]}: Probability ${prob}%">${prob}%</td>`;
    });
    html += `</tr>`;

    // Row 2: Zonal Mean U-Wind at 60°N
    html += `<tr><td class="heatmap-row-header">Zonal U-Wind at 60°N, 10 hPa (m/s)</td>`;
    m.uWind.forEach((uw, idx) => {
      const isWindow = (idx === 3 || idx === 4);
      let bg, fg;
      if (uw < 0) { bg = "rgba(225, 29, 72, 0.90)"; fg = "#ffffff"; }
      else if (uw <= 5) { bg = "rgba(234, 88, 12, 0.70)"; fg = "#ffffff"; }
      else if (uw <= 15) { bg = "rgba(245, 158, 11, 0.40)"; fg = "#1c1917"; }
      else { bg = "rgba(59, 130, 246, 0.15)"; fg = "var(--text-primary)"; }
      html += `<td class="heatmap-cell ${isWindow ? 'col-window-highlight' : ''}" style="background-color: ${bg}; color: ${fg};" title="Lead ${days[idx]}: U-wind ${uw > 0 ? '+' : ''}${uw} m/s">${uw > 0 ? '+' : ''}${uw}</td>`;
    });
    html += `</tr>`;

    // Row 3: Polar Cap Temp Anomaly
    html += `<tr><td class="heatmap-row-header">Polar Cap Temp Anomaly ΔT (K)</td>`;
    m.tempAnomaly.forEach((t, idx) => {
      const isWindow = (idx === 3 || idx === 4);
      let bg, fg;
      if (t >= 30) { bg = "rgba(225, 29, 72, 0.85)"; fg = "#ffffff"; }
      else if (t >= 20) { bg = "rgba(234, 88, 12, 0.75)"; fg = "#ffffff"; }
      else if (t >= 10) { bg = "rgba(245, 158, 11, 0.45)"; fg = "#1c1917"; }
      else { bg = "rgba(59, 130, 246, 0.15)"; fg = "var(--text-primary)"; }
      html += `<td class="heatmap-cell ${isWindow ? 'col-window-highlight' : ''}" style="background-color: ${bg}; color: ${fg};" title="Lead ${days[idx]}: Temp Anomaly +${t} K">+${t}°</td>`;
    });
    html += `</tr>`;

    // Row 4: Geopotential Variance
    html += `<tr><td class="heatmap-row-header">Geopotential Wave Variance σ_Z (%)</td>`;
    m.geoVariance.forEach((gv, idx) => {
      const isWindow = (idx === 3 || idx === 4);
      let bg, fg;
      if (gv >= 100) { bg = "rgba(109, 40, 217, 0.85)"; fg = "#ffffff"; }
      else if (gv >= 70) { bg = "rgba(124, 58, 237, 0.60)"; fg = "#ffffff"; }
      else if (gv >= 40) { bg = "rgba(139, 92, 246, 0.35)"; fg = "var(--text-primary)"; }
      else { bg = "rgba(148, 163, 184, 0.15)"; fg = "var(--text-primary)"; }
      html += `<td class="heatmap-cell ${isWindow ? 'col-window-highlight' : ''}" style="background-color: ${bg}; color: ${fg};" title="Lead ${days[idx]}: Geopotential variance +${gv}%">+${gv}%</td>`;
    });
    html += `</tr>`;

    // Row 5: Meridional Wave Flux
    html += `<tr><td class="heatmap-row-header">Meridional Wave Flux V-Wind (m/s)</td>`;
    m.vWindFlux.forEach((vw, idx) => {
      const isWindow = (idx === 3 || idx === 4);
      let bg, fg;
      if (vw >= 14) { bg = "rgba(225, 29, 72, 0.80)"; fg = "#ffffff"; }
      else if (vw >= 9) { bg = "rgba(234, 88, 12, 0.65)"; fg = "#ffffff"; }
      else if (vw >= 5) { bg = "rgba(245, 158, 11, 0.40)"; fg = "#1c1917"; }
      else { bg = "rgba(14, 165, 233, 0.15)"; fg = "var(--text-primary)"; }
      html += `<td class="heatmap-cell ${isWindow ? 'col-window-highlight' : ''}" style="background-color: ${bg}; color: ${fg};" title="Lead ${days[idx]}: Meridional Wave Flux ${vw} m/s">${vw}</td>`;
    });
    html += `</tr></tbody></table>`;

    container.innerHTML = html;
  }

  function renderTrajectoryChart(ev) {
    const ctx = document.getElementById("leadTrajectoryChart");
    if (!ctx) return;

    if (leadTrajectoryChartInstance) {
      leadTrajectoryChartInstance.destroy();
    }

    const labels = ev.leadDays;
    const uData = ev.metrics.uWind;
    const tData = ev.metrics.tempAnomaly;
    const pData = ev.metrics.lstmProb;

    leadTrajectoryChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Zonal Mean U-Wind (m/s)",
            data: uData,
            borderColor: "#2563eb",
            backgroundColor: "transparent",
            borderWidth: 2.5,
            pointBackgroundColor: "#2563eb",
            pointRadius: 5,
            yAxisID: "y1",
            tension: 0.3
          },
          {
            label: "Polar Cap Temp Anomaly (°C)",
            data: tData,
            borderColor: "#ea580c",
            backgroundColor: "transparent",
            borderDash: [5, 4],
            borderWidth: 2.5,
            pointBackgroundColor: "#ea580c",
            pointRadius: 5,
            yAxisID: "y1",
            tension: 0.3
          },
          {
            label: "LSTM Breakdown Probability (%)",
            data: pData,
            borderColor: "#16a34a",
            backgroundColor: "rgba(22, 163, 74, 0.14)",
            fill: true,
            borderWidth: 3,
            pointBackgroundColor: "#16a34a",
            pointRadius: 6,
            pointHoverRadius: 9,
            yAxisID: "y2",
            tension: 0.35
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              boxWidth: 14,
              font: { weight: 600 }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const val = context.parsed.y;
                if (label.includes("Probability")) return `${label}: ${val}% (Critical Precursor)`;
                if (label.includes("U-Wind")) return `${label}: ${val} m/s ${val < 0 ? '⚠️ (Easterly Reversal)' : ''}`;
                return `${label}: +${val}°C`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: "rgba(120, 113, 108, 0.12)" }
          },
          y1: {
            type: "linear",
            display: true,
            position: "left",
            title: { display: true, text: "U-Wind (m/s) & Temp Anomaly (°C)" },
            grid: { color: "rgba(120, 113, 108, 0.12)" }
          },
          y2: {
            type: "linear",
            display: true,
            position: "right",
            min: 0,
            max: 100,
            title: { display: true, text: "LSTM SSW Risk Probability (%)" },
            grid: { drawOnChartArea: false }
          }
        }
      }
    });
  }

  function renderDownwardCouplingTable(ev) {
    const container = document.getElementById("downwardCouplingContainer");
    if (!container || !ev.verticalCoupling) return;

    let html = `
      <div class="table-container">
        <table class="table-clean">
          <thead>
            <tr>
              <th style="min-width: 200px;">Atmospheric Depth & Level</th>
              <th>Pre-Event (T-4d Alert)</th>
              <th>Event Onset (T0)</th>
              <th>Week +1 (Descent)</th>
              <th>Week +2 (Coupling)</th>
              <th>Week +3 (Persistence)</th>
            </tr>
          </thead>
          <tbody>
    `;

    ev.verticalCoupling.forEach(row => {
      html += `
        <tr>
          <td><strong style="color: var(--accent-navy);">${row.level}</strong></td>
          <td style="color: var(--accent-amber); font-weight: 500;">${row.tMinus4}</td>
          <td style="color: var(--accent-rose); font-weight: 600;">${row.tZero}</td>
          <td>${row.wPlus1}</td>
          <td style="color: var(--accent-primary); font-weight: 600;">${row.wPlus2}</td>
          <td style="color: var(--text-muted);">${row.wPlus3}</td>
        </tr>
      `;
    });

    html += `</tbody></table></div>`;
    container.innerHTML = html;
  }

  function renderRegionalImpactCards(ev) {
    const container = document.getElementById("regionalImpactsContainer");
    if (!container || !ev.regionalImpacts) return;

    let html = `<div class="regional-impact-grid">`;
    ev.regionalImpacts.forEach(item => {
      let badgeClass = "badge-rose";
      if (item.risk === "High") badgeClass = "badge-amber";
      if (item.risk === "Moderate") badgeClass = "badge-blue";

      html += `
        <div class="regional-impact-card">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.6rem;">
              <span class="badge-clean ${badgeClass}">${item.risk} Risk</span>
              <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">${item.timing}</span>
            </div>
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">
              ${item.region}
            </h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.45;">
              ${item.summary}
            </p>
          </div>
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;
  }

  // Attach button click events
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const eventKey = btn.getAttribute("data-event");
      renderEvent(eventKey);
    });
  });

  // Default initial load
  renderEvent("simulated-impending");
}
