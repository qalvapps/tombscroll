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
    <p style="font-size: 0.9rem; opacity: 0.9;">See how much of your life you're scrolling away.</p>
    <p style="font-size: 0.8rem; margin-top: 10px; opacity: 0.7;">(More interactive elements coming soon)</p>
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
