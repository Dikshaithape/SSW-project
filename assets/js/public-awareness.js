// STRATOWATCH — Public Awareness Interactive Engine
// Accurately replicates all state management and interactivity from App.tsx

const CITIES = [
  { name: "Reykjavik", country: "Iceland", lat: 64.1466, lon: -21.9426, risk: "Low", region: "North Atlantic", note: "Limited surface signal" },
  { name: "Oslo", country: "Norway", lat: 59.9139, lon: 10.7522, risk: "High", region: "Nordic corridor", note: "Strongest cold-air signal" },
  { name: "Stockholm", country: "Sweden", lat: 59.3293, lon: 18.0686, risk: "High", region: "Nordic corridor", note: "Strongest cold-air signal" },
  { name: "Helsinki", country: "Finland", lat: 60.1699, lon: 24.9384, risk: "High", region: "Nordic corridor", note: "Strongest cold-air signal" },
  { name: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278, risk: "Medium", region: "UK & North Atlantic", note: "Variable jet-stream response" },
  { name: "Dublin", country: "Ireland", lat: 53.3498, lon: -6.2603, risk: "Medium", region: "UK & North Atlantic", note: "Variable jet-stream response" },
  { name: "Berlin", country: "Germany", lat: 52.5200, lon: 13.4050, risk: "Medium", region: "Central Europe", note: "Possible cold-air spillover" },
  { name: "Warsaw", country: "Poland", lat: 52.2297, lon: 21.0122, risk: "Medium", region: "Central Europe", note: "Possible cold-air spillover" },
  { name: "Ottawa", country: "Canada", lat: 45.4215, lon: -75.6972, risk: "Low", region: "Eastern Canada", note: "Lower confidence" },
  { name: "Montreal", country: "Canada", lat: 45.5017, lon: -73.5673, risk: "Low", region: "Eastern Canada", note: "Lower confidence" }
];

const REGIONS = [
  {
    id: "nordic",
    name: "Nordic corridor",
    risk: "High",
    color: "#ec8c55",
    summary: "The strongest signal is currently focused across Scandinavia, where a displaced polar vortex can increase the chance of colder conditions.",
    cities: ["Oslo", "Stockholm", "Helsinki"],
    window: "5-10 day watch"
  },
  {
    id: "atlantic",
    name: "UK & North Atlantic",
    risk: "Medium",
    color: "#53bdca",
    summary: "A medium signal reaches the North Atlantic. Local weather depends on the jet-stream response, so the app keeps this area on watch rather than issuing a high alert.",
    cities: ["London", "Dublin", "Reykjavik"],
    window: "7-14 day watch"
  },
  {
    id: "europe",
    name: "Central Europe",
    risk: "Medium",
    color: "#72cdbf",
    summary: "Central Europe sits on the edge of the projected pathway. The outlook is meaningful but less certain than the Nordic corridor.",
    cities: ["Berlin", "Warsaw"],
    window: "10-14 day watch"
  },
  {
    id: "canada",
    name: "Eastern Canada",
    risk: "Low",
    color: "#94a7b7",
    summary: "The current model signal is low for eastern Canada. The app keeps the region visible so users can see the difference between watch levels.",
    cities: ["Ottawa", "Montreal"],
    window: "10-14 day watch"
  }
];

const PRECAUTION_LEVELS = {
  High: {
    label: "High alert",
    title: "Prepare now and limit exposure",
    intro: "A high signal means your area is closest to the projected cold-air pathway. Follow local weather warnings first and make your home, travel, and support plan ready.",
    actions: [
      { icon: "01", title: "Stay indoors when advised", body: "Avoid unnecessary travel during local winter-storm warnings. If you must go out, keep the trip short and tell someone your route." },
      { icon: "02", title: "Build a 3-day home kit", body: "Keep water, non-perishable food, medicines, a torch, spare batteries, blankets, and a charged power bank ready." },
      { icon: "03", title: "Protect people and pipes", body: "Check older adults, children, and neighbours who may need help. Keep heat on, insulate drafts, and know where the water shut-off is." },
      { icon: "04", title: "Watch for cold injury", body: "Use layers, a hat, scarf, mittens, and waterproof outerwear. Numbness, confusion, or uncontrolled shivering needs urgent help." }
    ]
  },
  Medium: {
    label: "Medium watch",
    title: "Plan before conditions change",
    intro: "A medium signal is a planning window. Local weather may vary, but you have time to prepare supplies, check travel routes, and contact your support circle.",
    actions: [
      { icon: "01", title: "Check your local forecast", body: "Turn on official weather alerts and check the forecast before leaving. Do not rely on the SSW signal alone for street-level conditions." },
      { icon: "02", title: "Prepare your travel kit", body: "Keep warm clothes, a blanket, water, snacks, a flashlight, and a charged phone in your vehicle or day bag." },
      { icon: "03", title: "Make a check-in plan", body: "Message family, friends, and vulnerable neighbours now. Agree who will check in if power, roads, or communications are disrupted." },
      { icon: "04", title: "Keep heat safe", body: "Test smoke and carbon-monoxide alarms. Never use a gas oven, grill, or outdoor generator to heat an indoor space." }
    ]
  },
  Low: {
    label: "Low watch",
    title: "Stay informed without panic",
    intro: "A low signal means the current pathway is less likely to create a major local disruption. Keep normal plans, but stay connected to official updates.",
    actions: [
      { icon: "01", title: "Keep alerts on", body: "Allow the app and your local weather service to send updates. A low SSW signal can still combine with a separate local storm." },
      { icon: "02", title: "Do a quick home check", body: "Make sure you have a torch, basic medicines, warm layers, and enough food for a short power interruption." },
      { icon: "03", title: "Offer practical help", body: "Ask neighbours if they need a lift, groceries, or a warm place. Small check-ins help communities respond early." },
      { icon: "04", title: "Travel normally, stay flexible", body: "Continue normal travel unless local authorities advise otherwise, and save a route update before setting out." }
    ]
  }
};

const NEARBY_PEOPLE = [
  { id: "p1", name: "Maya", role: "Can help", x: 29, y: 37, status: "Warm shelter" },
  { id: "p2", name: "Jonas", role: "Needs help", x: 62, y: 28, status: "Power outage" },
  { id: "p3", name: "Ari", role: "Can help", x: 48, y: 69, status: "Has transport" },
  { id: "p4", name: "Lina", role: "Needs help", x: 76, y: 67, status: "Needs medicine" }
];

// App State
let state = {
  selectedRegionId: "nordic",
  precautionLevel: "High",
  helpMode: "ask", // "ask" -> show helpers; "offer" -> show requests
  alertOpen: false,
  alertsEnabled: false,
  locationSet: false,
  locationStatus: "Approximate area only",
  userCoords: null,
  selectedPerson: null,
  chatOpen: false,
  messages: [
    { from: "Jonas", text: "Hi, I'm near the community centre. The power is out on my street." }
  ]
};

function project(lat, lon) {
  const x = ((lon + 80) / 115) * 100;
  const y = ((70 - lat) / 32) * 100;
  return {
    x: Math.max(3, Math.min(97, x)),
    y: Math.max(5, Math.min(94, y))
  };
}

// Render City Markers on Coordinate Map
function renderCityMarkers() {
  const container = document.getElementById("map-city-markers");
  if (!container) return;
  const currentRegion = REGIONS.find(r => r.id === state.selectedRegionId);
  const regionCities = currentRegion ? currentRegion.cities : [];

  container.innerHTML = CITIES.map(city => {
    const point = project(city.lat, city.lon);
    const active = regionCities.includes(city.name);
    const riskCls = city.risk.toLowerCase();
    return `
      <a class="city-marker ${riskCls} ${active ? 'active' : ''}"
         href="https://www.google.com/maps?q=${city.lat},${city.lon}"
         target="_blank" rel="noreferrer"
         style="left: ${point.x}%; top: ${point.y}%;"
         title="${city.name}: ${city.risk} signal">
        <span class="marker-pulse"></span>
        <span class="marker-dot"></span>
        <b>${city.name}</b>
      </a>
    `;
  }).join("");
}

// Render Region Panel
function renderRegionPanel() {
  const region = REGIONS.find(r => r.id === state.selectedRegionId) || REGIONS[0];
  const riskCls = region.risk.toLowerCase();
  
  const panelKicker = document.getElementById("region-panel-kicker");
  if (panelKicker) {
    panelKicker.innerHTML = `<span class="risk-dot ${riskCls}"></span> Selected area <span class="risk-pill ${riskCls}">${region.risk} signal</span>`;
  }
  
  const title = document.getElementById("region-panel-title");
  if (title) title.textContent = region.name;
  
  const summary = document.getElementById("region-panel-summary");
  if (summary) summary.textContent = region.summary;
  
  const windowEl = document.getElementById("region-panel-window");
  if (windowEl) windowEl.textContent = region.window;
  
  const countEl = document.getElementById("region-panel-city-count");
  if (countEl) countEl.textContent = `${region.cities.length} locations`;
  
  const listEl = document.getElementById("region-panel-city-list");
  if (listEl) {
    listEl.innerHTML = region.cities.map((cityName, index) => {
      const city = CITIES.find(c => c.name === cityName);
      if (!city) return '';
      const cRiskCls = city.risk.toLowerCase();
      return `
        <a class="city-row" href="https://www.google.com/maps?q=${city.lat},${city.lon}" target="_blank" rel="noreferrer">
          <span class="city-number">0${index + 1}</span>
          <span>
            <b>${city.name}</b>
            <small>${city.note}</small>
          </span>
          <span class="city-risk ${cRiskCls}">${city.risk}</span>
          <span class="city-arrow">OPEN</span>
        </a>
      `;
    }).join("");
  }
}

// Select Region
function selectRegion(regionId) {
  state.selectedRegionId = regionId;
  const region = REGIONS.find(r => r.id === regionId);
  if (region) {
    state.precautionLevel = region.risk;
    renderPrecautions();
  }
  renderCityMarkers();
  renderRegionPanel();
}

// Render Precautions
function renderPrecautions() {
  const current = PRECAUTION_LEVELS[state.precautionLevel];
  const riskCls = state.precautionLevel.toLowerCase();

  // Update tabs
  ["High", "Medium", "Low"].forEach(level => {
    const tab = document.getElementById(`tab-level-${level.toLowerCase()}`);
    if (tab) {
      if (level === state.precautionLevel) {
        tab.classList.add("selected");
      } else {
        tab.classList.remove("selected");
      }
    }
  });

  // Update intro card
  const introContainer = document.getElementById("precaution-intro-container");
  if (introContainer) {
    introContainer.innerHTML = `
      <span class="risk-pill ${riskCls}">${current.label}</span>
      <h3>${current.title}</h3>
      <p>${current.intro}</p>
    `;
  }

  // Update grid
  const grid = document.getElementById("precaution-grid");
  if (grid) {
    grid.innerHTML = current.actions.map(action => `
      <article class="precaution-card">
        <span class="card-number">${action.icon}</span>
        <span class="card-tag">${state.precautionLevel}</span>
        <h3>${action.title}</h3>
        <p>${action.body}</p>
        <span class="card-link">Action to take <span>OPEN</span></span>
      </article>
    `).join("");
  }

  // Update Phone 3
  const phoneHead = document.getElementById("phone-precaution-head");
  if (phoneHead) {
    phoneHead.innerHTML = `
      <small>${current.label.toUpperCase()}</small>
      <strong>${state.precautionLevel} alert</strong>
      <p>${current.title}</p>
    `;
  }
  const phoneList = document.getElementById("phone-precaution-list");
  if (phoneList) {
    phoneList.innerHTML = current.actions.slice(0, 3).map(item => `
      <div><span>${item.icon}</span><b>${item.title}</b></div>
    `).join("");
  }
}

function setPrecautionLevel(level) {
  state.precautionLevel = level;
  renderPrecautions();
}

// Community Help Layer
function renderCommunityMap() {
  const container = document.getElementById("community-markers");
  if (!container) return;

  const people = NEARBY_PEOPLE.filter(p => {
    return state.helpMode === "ask" ? p.role === "Can help" : p.role === "Needs help";
  });

  container.innerHTML = people.map(p => {
    const isNeeds = p.role === "Needs help";
    return `
      <button class="person-marker ${isNeeds ? 'needs' : 'offers'}"
              style="left: ${p.x}%; top: ${p.y}%;"
              onclick="openChat('${p.id}')"
              title="${p.name}: ${p.status}">
        <span>${isNeeds ? 'HELP' : 'OFFER'}</span>
        <b>${p.name}</b>
      </button>
    `;
  }).join("");

  const footerText = document.getElementById("community-footer-text");
  if (footerText) {
    footerText.textContent = state.helpMode === "ask" ? "Showing people who can help" : "Showing people who need help";
  }

  const topText = document.getElementById("community-top-text");
  if (topText) {
    topText.textContent = `NEARBY ${state.helpMode === "ask" ? "HELPERS" : "REQUESTS"}  /  2.4 KM`;
  }
}

function setHelpMode(mode) {
  state.helpMode = mode;
  document.getElementById("btn-help-ask")?.classList.toggle("selected", mode === "ask");
  document.getElementById("btn-help-offer")?.classList.toggle("selected", mode === "offer");
  renderCommunityMap();
}

function openChat(personId) {
  const person = NEARBY_PEOPLE.find(p => p.id === personId);
  if (!person) return;
  state.selectedPerson = person;
  state.chatOpen = true;
  renderChatPanel();
}

function closeChat() {
  state.chatOpen = false;
  state.selectedPerson = null;
  const panel = document.getElementById("chat-panel-container");
  if (panel) panel.style.display = "none";
}

function renderChatPanel() {
  const panel = document.getElementById("chat-panel-container");
  if (!panel || !state.selectedPerson || !state.chatOpen) {
    if (panel) panel.style.display = "none";
    return;
  }
  panel.style.display = "block";
  const p = state.selectedPerson;
  const isNeeds = p.role === "Needs help";

  panel.innerHTML = `
    <div class="chat-panel">
      <button class="chat-close" onclick="closeChat()" aria-label="Close chat">CLOSE</button>
      <div class="chat-head">
        <span class="chat-avatar ${isNeeds ? 'needs' : 'offers'}">${p.name[0]}</span>
        <div>
          <b>${p.name}</b>
          <small>${p.status}  /  approximate area</small>
        </div>
      </div>
      <div class="chat-messages" id="chat-messages-box">
        ${state.messages.map((m, idx) => `
          <div class="chat-message ${m.from === 'You' ? 'mine' : ''}">
            <small>${m.from}</small>
            <span>${m.text}</span>
          </div>
        `).join("")}
      </div>
      <div class="chat-compose">
        <input id="chat-input" placeholder="Write a safe check-in..." onkeydown="handleChatKeyDown(event)" />
        <button onclick="sendChatMessage()">OPEN</button>
      </div>
    </div>
  `;

  setTimeout(() => {
    const box = document.getElementById("chat-messages-box");
    if (box) box.scrollTop = box.scrollHeight;
    const inp = document.getElementById("chat-input");
    if (inp) inp.focus();
  }, 50);
}

function sendChatMessage() {
  const inp = document.getElementById("chat-input");
  if (!inp) return;
  const text = inp.value.trim();
  if (!text) return;
  state.messages.push({ from: "You", text });
  inp.value = "";
  renderChatPanel();
}

function handleChatKeyDown(e) {
  if (e.key === "Enter") {
    sendChatMessage();
  }
}

// Location Services
function enableLiveLocation() {
  if (!navigator.geolocation) {
    applyLocationDemo("Demo location active", "59.914° N  /  10.752° E");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const coordStr = `${coords.latitude.toFixed(3)} deg  /  ${coords.longitude.toFixed(3)} deg`;
      applyLocationDemo("Live location active", coordStr);
    },
    () => {
      applyLocationDemo("Demo location active", "59.914 deg N  /  10.752 deg E");
    },
    { enableHighAccuracy: false, timeout: 5000 }
  );
}

function applyLocationDemo(statusText, coordStr) {
  state.locationSet = true;
  state.locationStatus = statusText;
  state.userCoords = coordStr;

  const btnPhone = document.getElementById("phone-location-btn");
  if (btnPhone) btnPhone.innerHTML = `Location saved SAVED <span>OPEN</span>`;

  const privPhone = document.getElementById("phone-location-privacy");
  if (privPhone) privPhone.textContent = `${statusText}  /  ${coordStr}`;

  const areaStrong = document.getElementById("phone-area-name");
  if (areaStrong) areaStrong.textContent = "Nordic corridor";

  const areaCoords = document.getElementById("phone-area-coords");
  if (areaCoords) areaCoords.textContent = coordStr;

  const locAction = document.getElementById("location-action-btn");
  if (locAction) locAction.textContent = "Location sharing active SAVED";

  const privLine = document.getElementById("community-privacy-line");
  if (privLine) privLine.textContent = `LOCATION ${statusText}  /  Exact home addresses stay hidden`;
}

// Alert Modal
function openAlertModal() {
  state.alertOpen = true;
  const modal = document.getElementById("alert-modal-backdrop");
  if (modal) {
    modal.style.display = "grid";
    const region = REGIONS.find(r => r.id === state.selectedRegionId) || REGIONS[0];
    const riskCls = region.risk.toLowerCase();
    
    document.getElementById("modal-warning-area").textContent = region.name;
    document.getElementById("modal-warning-subtitle").textContent = `Warning for ${region.name}`;
    const pill = document.getElementById("modal-warning-pill");
    if (pill) {
      pill.className = `risk-pill ${riskCls}`;
      pill.textContent = `${region.risk.toUpperCase()} ALERT`;
    }
    const citiesBox = document.getElementById("modal-warning-cities");
    if (citiesBox) {
      citiesBox.innerHTML = region.cities.map(c => `<b> ${c}</b>`).join("");
    }
  }
}

function closeAlertModal() {
  state.alertOpen = false;
  const modal = document.getElementById("alert-modal-backdrop");
  if (modal) modal.style.display = "none";
}

function enableAlertsFromModal() {
  state.alertsEnabled = true;
  closeAlertModal();
  updateAlertButton();
  showDemoToast();
  document.getElementById("precautions")?.scrollIntoView({ behavior: "smooth" });
}

function toggleAlerts() {
  state.alertsEnabled = !state.alertsEnabled;
  updateAlertButton();
}

function updateAlertButton() {
  const bell = document.getElementById("btn-alert-bell");
  if (bell) {
    if (state.alertsEnabled) {
      bell.classList.add("enabled");
      bell.textContent = "SAVED";
    } else {
      bell.classList.remove("enabled");
      bell.textContent = "ALERTS";
    }
  }
}

function showDemoToast() {
  const toast = document.getElementById("demo-toast-btn");
  if (toast) toast.style.display = "flex";
}

// Smart Cross-Page Navigation
function initNavigation() {
  document.querySelectorAll('a[href="/science"], a[href="science.html"]').forEach(a => {
    a.addEventListener('click', (e) => {
      if (window.location.protocol === 'file:') {
        e.preventDefault();
        window.location.href = 'science.html';
      }
    });
  });
  document.querySelectorAll('a[href="/"], a[href="index.html"]').forEach(a => {
    a.addEventListener('click', (e) => {
      if (window.location.protocol === 'file:') {
        e.preventDefault();
        window.location.href = 'index.html';
      }
    });
  });
}

// Initialise everything on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  renderCityMarkers();
  renderRegionPanel();
  renderPrecautions();
  renderCommunityMap();
  initNavigation();

  // Auto trigger alert modal after 850ms as per design
  setTimeout(() => {
    openAlertModal();
  }, 850);
});
