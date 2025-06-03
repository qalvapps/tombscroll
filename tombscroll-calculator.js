// --- CONFIG ---
const CONFIG = {
  background: '#fffef3',
  textColor: '#333',
  borderRadius: '24px',
  maxWidth: '520px',
  padding: '40px',
  zIndex: 9999,

  LIFE_EXPECTANCY: { male: 76, female: 81, other: 79 },
  INCHES_PER_DAY_3HRS: 519,
  INCHES_TO_MILES: 63360,
  INCHES_TO_KM: 0.0000254,
  EIFFEL_HEIGHT_INCHES: 12996,
  EVEREST_HEIGHT_INCHES: 348031,
  EVEREST_BASE_CAMP_INCHES: 211176,
};

// --- STYLE INJECTION ---
const style = document.createElement('style');
style.innerHTML = `
  #tombscroll-calculator {
    font-size: 16px;
    border-radius: 24px !important;
    padding: 40px !important;
    box-shadow: 0 20px 60px rgba(0,0,0,0.1);
    background: #fffef3;
    max-width: 520px;
    margin: 60px auto;
    text-align: center;
  }
  #tombscroll-calculator h1 {
    font-size: 2.4rem;
    margin-bottom: 0.5em;
    color: #1e1e1e;
  }
  #tombscroll-calculator p,
  #tombscroll-calculator ul {
    font-size: 1rem;
    line-height: 1.6;
    color: #333;
  }
  #tombscroll-calculator input[type=number],
  #tombscroll-calculator input[type=range] {
    border: 2px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    font-size: 1.2rem;
    width: 80px;
    text-align: center;
  }
  #tombscroll-calculator button.ts-gender {
    padding: 8px 16px;
    border: 2px solid #aaa;
    background: #f4f4f4;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
  }
  #tombscroll-calculator button.ts-gender:hover {
    background: #ddd;
  }
  #tombscroll-calculator button.ts-gender.active {
    background: #ffc107;
    border-color: #ffc107;
  }
  #tombscroll-calculator #ts-calculate {
    background: #6a00ff;
    padding: 12px 24px;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 12px;
    margin-top: 20px;
    border: none;
    color: white;
  }
  #tombscroll-calculator #ts-calculate:enabled {
    cursor: pointer;
    opacity: 1;
  }
  #tombscroll-calculator #ts-calculate:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
document.head.appendChild(style);

// --- BUILD UI ---
function createCalculatorUI() {
  const container = document.createElement('div');
  container.id = 'tombscroll-calculator';
  container.innerHTML = `
    <h1>Tombscroll Calculator</h1>
    <p>How much of your life is getting swiped away?</p>
  
    <div style="margin-top: 20px;">
      <label>Your Age</label><br>
      <input type="number" id="ts-age" min="13" max="100" placeholder="e.g. 35">
    </div>
  
    <div style="margin-top: 20px;">
      <label>Gender</label><br>
      <div style="display: flex; justify-content: center; gap: 10px; margin-top: 6px;">
        <button class="ts-gender" data-gender="male">Male</button>
        <button class="ts-gender" data-gender="female">Female</button>
        <button class="ts-gender" data-gender="other">Other</button>
      </div>
    </div>
  
    <div style="margin-top: 20px;">
      <label>Daily Screen Time (hrs)</label><br>
      <input type="range" id="ts-screentime" min="0.5" max="8" step="0.5" value="3">
      <div><strong><span id="ts-screentime-value">3.0</span> hrs/day</strong></div>
    </div>
  
    <button id="ts-calculate" disabled>Calculate 💀</button>
    <div id="ts-results" style="display: none; margin-top: 30px;"></div>
  `;
  return container;
}

// --- MAIN ---
function waitForTombRoot(attempts = 10) {
  const embedRoot = document.getElementById('tomb-root');
  if (embedRoot) {
    const target = embedRoot.parentElement || document.body;
    const calc = createCalculatorUI();
    target.appendChild(calc);
    setupEventListeners();
  } else if (attempts > 0) {
    setTimeout(() => waitForTombRoot(attempts - 1), 300);
  }
}
waitForTombRoot();

// --- EVENT LOGIC ---
let selectedGender = null;

function setupEventListeners() {
  document.querySelectorAll('.ts-gender').forEach(btn => {
    btn.addEventListener('click', function () {
      selectedGender = this.dataset.gender;
      document.querySelectorAll('.ts-gender').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      checkForm();
    });
  });

  document.getElementById('ts-screentime').addEventListener('input', function () {
    document.getElementById('ts-screentime-value').textContent = parseFloat(this.value).toFixed(1);
    checkForm();
  });

  document.getElementById('ts-age').addEventListener('input', checkForm);
  document.getElementById('ts-calculate').addEventListener('click', calculate);
}

function checkForm() {
  const age = parseInt(document.getElementById('ts-age').value);
  const btn = document.getElementById('ts-calculate');
  btn.disabled = !(age && selectedGender);
}

function calculate() {
  const age = parseInt(document.getElementById('ts-age').value);
  const screenTime = parseFloat(document.getElementById('ts-screentime').value);
  const expectancy = CONFIG.LIFE_EXPECTANCY[selectedGender];
  const remainingDays = Math.max(0, Math.floor((expectancy - age) * 365));
  const yearsRemaining = (remainingDays / 365).toFixed(1);

  const scrollDays = Math.floor((remainingDays * screenTime) / 24);
  const yearsScrolling = (scrollDays / 365).toFixed(1);

  const inchesPerHour = CONFIG.INCHES_PER_DAY_3HRS / 3;
  const totalInches = scrollDays * 24 * inchesPerHour / screenTime;
  const miles = (totalInches / CONFIG.INCHES_TO_MILES).toFixed(1);
  const km = (totalInches * CONFIG.INCHES_TO_KM).toFixed(1);
  const towers = Math.floor(totalInches / CONFIG.EIFFEL_HEIGHT_INCHES);
  const everests = Math.floor(totalInches / CONFIG.EVEREST_HEIGHT_INCHES);
  const baseCamps = Math.floor(totalInches / CONFIG.EVEREST_BASE_CAMP_INCHES);
  
  document.getElementById('ts-results').style.display = 'block';
  document.getElementById('ts-results').innerHTML = `
    <p><strong>${remainingDays.toLocaleString()}</strong> days (<strong>${yearsRemaining}</strong> years) remaining in your life<br>
    <span style="opacity: 0.7;">based on a lifespan of ${expectancy} years for ${selectedGender}s</span></p>
  
    <p><strong>${scrollDays.toLocaleString()}</strong> days (<strong>${yearsScrolling}</strong> years) will be spent scrolling<br>
    <span style="opacity: 0.7;">at ${screenTime} hrs/day</span></p>
  
    <p>Your thumb will travel:</p>
    <ul style="margin-left: 1.5em;">
      <li><strong>${miles}</strong> miles</li>
      <li><strong>${km}</strong> kilometers</li>
      <li><strong>${towers}</strong> Eiffel Towers tall</li>
      <li><strong>${everests}</strong> Everests high</li>
      <li><strong>${baseCamps}</strong> Base Camp ascents</li>
    </ul>
  
    <p style="font-style: italic; opacity: 0.75; margin-top: 20px;">
      Every scroll is a choice. Make it count.
    </p>
  `;
}
