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
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  #tombscroll-calculator {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 16px;
    border-radius: 24px !important;
    padding: 40px !important;
    box-shadow: 0 20px 60px rgba(0,0,0,0.1);
    background: #fffef3;
    max-width: 520px;
    margin: 60px auto;
    text-align: center;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  #tombscroll-calculator h1 {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 2.0rem;
    font-weight: 700;
    margin-bottom: 0.5em;
    color: #1e1e1e;
    letter-spacing: -0.02em;
  }
  #tombscroll-calculator p,
  #tombscroll-calculator ul {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 1rem;
    line-height: 1.6;
    color: #333;
    font-weight: 400;
  }
  #tombscroll-calculator label {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-weight: 500;
    font-size: 0.95rem;
    color: #1e1e1e;
  }
  #tombscroll-calculator input[type=number],
  #tombscroll-calculator input[type=range] {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    border: 2px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    font-size: 1.2rem;
    font-weight: 500;
    width: 80px;
    text-align: center;
  }
  #tombscroll-calculator button.ts-gender {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 8px 16px;
    border: 2px solid #aaa;
    background: #f4f4f4;
    font-weight: 500;
    font-size: 0.9rem;
    border-radius: 8px;
    cursor: pointer;
  }
  #tombscroll-calculator button.ts-gender:hover {
    background: #ddd;
  }
  #tombscroll-calculator button.ts-gender.active {
    background: #ffc107;
    border-color: #ffc107;
    font-weight: 600;
  }
  #tombscroll-calculator #ts-calculate {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #6a00ff;
    padding: 12px 24px;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 12px;
    margin-top: 20px;
    border: none;
    color: white;
    letter-spacing: -0.01em;
  }
  #tombscroll-calculator #ts-calculate:enabled {
    cursor: pointer;
    opacity: 1;
  }
  #tombscroll-calculator #ts-calculate:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  #tombscroll-calculator #ts-reset {
    background: #333;
    color: white;
    padding: 10px 20px;
    font-size: 0.9rem;
    font-weight: 500;
    border-radius: 8px;
    margin-top: 20px;
    border: none;
    cursor: pointer;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  #tombscroll-calculator #ts-reset:hover {
    background: #555;
  }
  #tombscroll-calculator strong {
    font-weight: 600;
  }
`;
document.head.appendChild(style);

// --- BUILD UI ---
function createCalculatorUI() {
  const container = document.createElement('div');
  container.id = 'tombscroll-calculator';
  container.innerHTML = `
    <h1>Tombscroll.com</h1>
    <p>How many of your remaining years will be spent scrolling?</p>
  
    <div id="ts-form">
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
    </div>
    
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

function resetCalculator() {
  // Show form
  document.getElementById('ts-form').style.display = 'block';
  
  // Hide results
  document.getElementById('ts-results').style.display = 'none';
  
  // Reset form values
  document.getElementById('ts-age').value = '';
  document.getElementById('ts-screentime').value = '3';
  document.getElementById('ts-screentime-value').textContent = '3.0';
  
  // Reset gender selection
  document.querySelectorAll('.ts-gender').forEach(b => b.classList.remove('active'));
  selectedGender = null;
  
  // Disable calculate button
  document.getElementById('ts-calculate').disabled = true;
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
  const userScrollPerDay = inchesPerHour * screenTime;
  const totalInches = remainingDays * userScrollPerDay;
  
  const miles = (totalInches / CONFIG.INCHES_TO_MILES).toFixed(1);
  const km = (totalInches * CONFIG.INCHES_TO_KM).toFixed(1);
  const towers = Math.floor(totalInches / CONFIG.EIFFEL_HEIGHT_INCHES);
  const everests = Math.floor(totalInches / CONFIG.EVEREST_HEIGHT_INCHES);
  const baseCamps = Math.floor(totalInches / CONFIG.EVEREST_BASE_CAMP_INCHES);
  
  // Hide the form
  document.getElementById('ts-form').style.display = 'none';
  
  // Show results with user input summary
  document.getElementById('ts-results').style.display = 'block';
  document.getElementById('ts-results').innerHTML = `
    <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 30px; border-left: 4px solid #6a00ff;">
      <h3 style="margin: 0 0 10px 0; font-size: 1.1rem; font-weight: 600; color: #1e1e1e;">You:</h3>
      <p style="margin: 5px 0; font-size: 0.95rem; color: #555;">
        ${age} yr old ${selectedGender}<br><strong>Screen Time:</strong> ${screenTime} hrs/day
      </p>
    </div>

    <!-- Primary Shocking Stat: Years Scrolling -->
    <div style="background: linear-gradient(135deg, #ff6b6b, #ee5a52); color: white; padding: 25px; border-radius: 16px; margin-bottom: 25px; text-align: center;">
      <div style="font-size: 3.2rem; font-weight: 700; line-height: 1; margin-bottom: 8px;">${yearsScrolling}</div>
      <div style="font-size: 1.3rem; font-weight: 600; margin-bottom: 5px;">YEARS OF YOUR LIFE</div>
      <div style="font-size: 1rem; opacity: 0.9;">will be spent scrolling</div>
      <div style="font-size: 0.85rem; opacity: 0.8; margin-top: 8px;">${scrollDays.toLocaleString()} days at ${screenTime} hrs/day</div>
    </div>

    <!-- Secondary Shocking Stat: Distance -->
    <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 25px; border-radius: 16px; margin-bottom: 25px; text-align: center;">
      <div style="font-size: 2.8rem; font-weight: 700; line-height: 1; margin-bottom: 8px;">${miles}</div>
      <div style="font-size: 1.2rem; font-weight: 600; margin-bottom: 5px;">MILES</div>
      <div style="font-size: 1rem; opacity: 0.9;">your thumb will travel scrolling</div>
      <div style="font-size: 0.85rem; opacity: 0.8; margin-top: 8px;">${km} kilometers</div>
    </div>

    <!-- Mind-Blowing Comparisons -->
    <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
      <h3 style="margin: 0 0 15px 0; font-size: 1.1rem; font-weight: 600; color: #1e1e1e; text-align: center;">🤯 That's equivalent to scrolling...</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: center;">
        <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <div style="font-size: 1.8rem; font-weight: 700; color: #ff6b6b; margin-bottom: 5px;">${towers}</div>
          <div style="font-size: 0.85rem; color: #666;">Eiffel Towers</div>
        </div>
        <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <div style="font-size: 1.8rem; font-weight: 700; color: #667eea; margin-bottom: 5px;">${everests}</div>
          <div style="font-size: 0.85rem; color: #666;">Mount Everests</div>
        </div>
      </div>
    </div>

    <!-- Life Context -->
    <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
      <div style="text-align: center;">
        <div style="font-size: 1rem; color: #856404; margin-bottom: 8px;">⏳ <strong>Life remaining:</strong> ${yearsRemaining} yrs<br>(${remainingDays.toLocaleString()} days)</div>
        <div style="font-size: 0.9rem; color: #856404; opacity: 0.8;">*${expectancy} year lifespan for ${selectedGender}s</div>
      </div>
    </div>
  
    <p style="font-style: italic; opacity: 0.75; margin-top: 30px; font-size: 1.1rem; text-align: center; color: #666;">
      Every scroll is a choice.<br>Make it count.
    </p>
    
    <button id="ts-reset" onclick="resetCalculator()">Tombscroll Again</button>
  `;
}
