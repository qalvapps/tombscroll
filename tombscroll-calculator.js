console.log("✅ Tombscroll script loaded");
function createCalculator() {
    const container = document.createElement('div');
    container.id = 'tombscroll-calculator';

    // Force Carrd-friendly styles
    container.style.display = 'block';
    container.style.maxWidth = '100%';
    container.style.marginTop = '40px';
    container.style.background = 'white';
    container.style.zIndex = '9999';
    container.style.position = 'relative';

    container.innerHTML = `
        <div style="
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 20px;
            padding: 30px;
            color: white;
            max-width: 500px;
            margin: 20px auto;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        ">
            <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 10px;">Tombscroll Calculator</h1>
            <p style="font-size: 0.9rem; opacity: 0.9;">See how much of your life you're scrolling away.</p>
            <p style="font-size: 0.8rem; margin-top: 10px; opacity: 0.7;">(Full UI continues here...)</p>
        </div>
    `;

    const targetElement = document.body;
    targetElement.appendChild(container);
    console.log("📌 Appended calculator to document.body");

    container.scrollIntoView({ behavior: 'smooth' });

    setupEventListeners();
}
