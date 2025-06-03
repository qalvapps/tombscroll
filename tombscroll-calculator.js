console.log("✅ Tombscroll script loaded");

// --- CONFIG ---
const CONFIG = {
  background: '#fffbe6',
  textColor: '#333',
  borderRadius: '20px',
  maxWidth: '500px',
  padding: '30px',
  zIndex: 9999,
};

// --- FUNCTION TO BUILD CALCULATOR UI ---
function createCalculatorUI() {
  const container = document.createElement('div');
  container.id = 'tombscroll-calculator';
  container.style.background = '#fffbe6';
  container.style.color = '#333';
  container.style.padding = '30px';
  container.style.borderRadius = '20px';
  container.style.margin = '40px auto';
  container.style.maxWidth = '500px';
  container.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  container.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
  container.style.zIndex = '9999';
  container.style.position = 'relative';
  container.style.textAlign = 'center';

  container.innerHTML = `
    <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 10px;">Tombscroll Calculator</h1>
    <p style="font-size: 0.9rem; opacity: 0.9;">See how much of your life you're scrolling away.</p>

    <div style="margin-top: 20px;">
      <label for="ts-age" style="display: block; font-weight: 600; margin-bottom: 6px;">Your Age</label>
      <input type="number" id="ts-age" min="13" max="100" placeholder="e.g. 35" style="padding: 10px; border-radius: 6px; width: 80px; text-align: center;">
    </div>

    <div style="margin-top: 20px;">
      <label style="display: block; font-weight: 600; margin-bottom: 6px;">Gender</label>
      <div>
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

// --- SAFE APPEND FUNCTION ---
function waitForTombRoot(attempts = 10) {
  const embedRoot = document.getElementById('tomb-root');

  if (embedRoot) {
    const targetElement = embedRoot.parentElement || document.body;
    const calculator = createCalculatorUI();
    targetElement.appendChild(calculator);
    console.log("📌 Appended calculator to:", targetElement);

    // Scroll to it
    setTimeout(() => {
      calculator.scrollIntoView({ behavior: 'smooth' });
    }, 300);

  } else if (attempts > 0) {
    console.log(`⏳ Waiting for #tomb-root... (${10 - attempts + 1})`);
    setTimeout(() => waitForTombRoot(attempts - 1), 300);
  } else {
    console.warn("❌ Failed to find #tomb-root after multiple retries.");
  }
}

// --- START ---
waitForTombRoot();
