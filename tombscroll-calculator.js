console.log("✅ Tombscroll script loaded");

// --- CONFIG ---
const CONFIG = {
  background: '#fffbe6',
  textColor: '#333',
  borderRadius: '20px',
  maxWidth: '500px',
  padding: '30px',
  zIndex: 9999,

  // Life Expectancy by gender
  LIFE_EXPECTANCY: {
    male: 76,
    female: 81,
    other: 79,
  },

  // Scroll metrics
  INCHES_PER_DAY_3HRS: 519,
  INCHES_TO_MILES: 63360,
  INCHES_TO_KM: 0.0000254,

  // Visual metaphors
  EIFFEL_HEIGHT_INCHES: 12996,  // 1,083 feet
};

function createCalculatorUI() {
  const container = document.createElement('div');
  container.id = 'tombscroll-calculator';
  container.style.background = CONFIG.background;
  container.style.color = CONFIG.textColor;
  container.style.padding = CONFIG.padding;
  container.style.borderRadius = CONFIG.borderRadius;
  container.style.margin = '40px auto';
  container.style.maxWidth = CONFIG.maxWidth;
  container.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  container.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
  container.style.zIndex = CONFIG.zIndex;
  container.style.position = 'relative';
  container.style.textAlign = 'center';

  container.innerHTML = `
    <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 10px;">Tombscroll Calculator</h1>
    <p style="font-size: 0.9rem; opacity: 0.9;">How much of your life is getting swiped away?</p>

    <div style="margin-top: 20px;">
      <label for="ts-age" style="display: block; font-weight: 600; margin-bottom: 6px;">Your Age</label>
      <input type="number" id="ts-age" min="13" max="100" placeholder="e.g. 35" style="padding: 10px; border-radius: 6px; width: 80px; text-align: center;">
    </div>

    <div style="margin-top: 20px;">
      <label style="display: block; font-weight: 600; margin-bottom: 6px;">Gender</label>
      <div style="display: flex; justify-content: center; gap: 10px;">
        <button class="ts-gender" data-gender="male">Male</button>
        <button class="ts-gender" data-gender="female">Female</button>
        <button class="ts-gender" data-gender="other">Other</button>
      </div>
    </div>

    <div style="margin-top: 20px;">
      <label for="ts-screentime" style="display: block; font-weight: 600; margin-bottom: 6px;">Daily Screen Time (hrs)</label>
      <input type="range" id="ts-screentime" min="0.5" max="8" step="0.5" value="3">
      <div><strong><span id="ts-screentime-value">3.0</span> hrs/day</strong></div>
    </div>

    <button id="ts-calculate" disabled style="margin-top: 25px; padding: 12px 25px; background: #764ba2; color: white; font-weight: 600; border-radius: 8px; border: none; cursor: not-allowed; opacity: 0.5;">Calculate 💀</button>

    <div id="ts-results" style="display: none; margin-top: 30px; text-align: left;"></div>
  `;
  return container;
}

function waitForTombRoot(attempts = 10) {
  const embedRoot = document.getElementById('tomb-root');

  if (embedRoot) {
    const targetElement = embedRoot.parentElement || document.body;
    const calculator = createCalculatorUI();
    targetElement.appendChild(calculator);
    console.log("📌 Appended calculator to:", targetElement);

    setTimeout(() => {
      setupEventListeners();
      calculator.scrollIntoView({ behavior: 'smooth' });
    }, 0);

  } else if (attempts > 0) {
    console.log(`⏳ Waiting for #tomb-root... (${10 - attempts + 1})`);
    setTimeout(() => waitForTombRoot(attempts - 1), 300);
  } else {
    console.warn("❌ Failed to find #tomb-root after multiple retries.");
  }
}

waitForTombRoot();

let selectedGender = null;

function setupEventListeners() {
  document.querySelectorAll('.ts-gender').forEach(btn => {
    btn.addEventListener('click', function () {
      selectedGender = this.dataset.gender;
      document.querySelectorAll('.ts-gender').forEach(b => {
        b.style.background = '#eee';
      });
      this.style.background = '#ffc107';
      checkForm();
    });
  });

  const slider = document.getElementById('ts-screentime');
  const display = document.getElementById('ts-screentime-value');
  slider.addEventListener('input', function () {
    display.textContent = parseFloat(this.value).toFixed(1);
    checkForm();
  });

  document.getElementById('ts-age').addEventListener('input', checkForm);
  document.getElementById('ts-calculate').addEventListener('click', calculate);
}

function checkForm() {
  const age = parseInt(document.getElementById('ts-age').value);
  const btn = document.getElementById('ts-calculate');

  if (age && selectedGender) {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';
  } else {
    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.style.cursor = 'not-allowed';
  }
}

function calculate() {
  const age = parseInt(document.getElementById('ts-age').value);
  const screenTime = parseFloat(document.getElementById('ts-screentime').value);
  const gender = selectedGender;

  const lifeExpectancy = CONFIG.LIFE_EXPECTANCY[gender];
  const remainingYears = Math.max(0, lifeExpectancy - age);
  const totalRemainingDays = Math.floor(remainingYears * 365);

  const scrollHours = totalRemainingDays * screenTime;
  const scrollDays = Math.floor(scrollHours / 24);

  const inchesPerHour = CONFIG.INCHES_PER_DAY_3HRS / 3;
  const totalInches = scrollHours * inchesPerHour;
  const miles = (totalInches / CONFIG.INCHES_TO_MILES).toFixed(1);
  const km = (totalInches * CONFIG.INCHES_TO_KM).toFixed(1);
  const eiffelCount = Math.floor(totalInches / CONFIG.EIFFEL_HEIGHT_INCHES);

  const results = document.getElementById('ts-results');
  results.style.display = 'block';
  const yearsRemaining = (totalRemainingDays / 365).toFixed(1);

  results.innerHTML = `
    <p><strong>${totalRemainingDays.toLocaleString()}</strong> days (<strong>${yearsRemaining}</strong> years) remaining in your life<br>
    <span style="opacity: 0.7;">(based on a lifespan of ${lifeExpectancy} years for ${gender}s)</span>.</p>
  
    <p><strong>${scrollDays.toLocaleString()}</strong> of those days will be spent scrolling<br>
    <span style="opacity: 0.7;">(at ${screenTime} hrs/day)</span>.</p>
  
    <p>Your thumb will travel:</p>
    <ul style="margin-left: 1em;">
      <li><strong>${miles}</strong> miles</li>
      <li><strong>${km}</strong> kilometers</li>
      <li><strong>${eiffelCount}</strong> Eiffel Towers tall</li>
    </ul>
  
    <p style="margin-top: 20px; font-style: italic; opacity: 0.8;">
      Every scroll is a choice. Make it count.
    </p>
  `;
}
