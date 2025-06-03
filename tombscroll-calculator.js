console.log("✅ Tombscroll script loaded");
const CONFIG = {
    // Life expectancy by gender (years)
    LIFE_EXPECTANCY: {
        male: 76,
        female: 81,
        other: 79
    },
    
    // Scrolling distance calculation
    INCHES_PER_DAY_FOR_3_HOURS: 519,  // 43 feet = 519 inches for 3 hours daily
    INCHES_TO_MILES: 63360,           // 12 inches × 5280 feet
    INCHES_TO_KM: 0.0000254,          // Conversion factor
    
    // Screen time limits
    MIN_SCREEN_TIME: 0.5,
    MAX_SCREEN_TIME: 8,
    DEFAULT_SCREEN_TIME: 3,
    
    // Age limits
    MIN_AGE: 13,
    MAX_AGE: 100,
    
    // Colors and styling
    COLORS: {
        primary: '#667eea',
        secondary: '#764ba2',
        accent: '#ffa500',
        warning: '#ff6b6b'
    }
};

// ===== MAIN CALCULATOR SCRIPT =====
document.addEventListener('DOMContentLoaded', function() {
    
    let selectedGender = null;
    
    function createCalculator() {
        const container = document.createElement('div');
        container.id = 'tombscroll-calculator';
        container.innerHTML = `
            <div style="
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, ${CONFIG.COLORS.primary} 0%, ${CONFIG.COLORS.secondary} 100%);
                border-radius: 20px;
                padding: 30px;
                color: white;
                max-width: 500px;
                margin: 20px auto;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            ">
                <!-- Header -->
                <div style="margin-bottom: 25px;">
                    <div style="
                        background: linear-gradient(45deg, ${CONFIG.COLORS.warning}, ${CONFIG.COLORS.accent});
                        color: white;
                        padding: 6px 12px;
                        border-radius: 15px;
                        font-size: 0.8rem;
                        font-weight: 600;
                        display: inline-block;
                        margin-bottom: 15px;
                    ">⚠️ Reality Check Incoming</div>
                    <h1 style="
                        font-size: 2.2rem;
                        font-weight: 800;
                        margin: 0 0 8px 0;
                        line-height: 1.1;
                    ">Tombscroll Calculator</h1>
                    <p style="
                        font-size: 1rem;
                        opacity: 0.9;
                        margin: 0;
                    ">How much of your life are you scrolling away?</p>
                </div>
                <!-- Age Input -->
                <div style="margin-bottom: 20px;">
                    <label style="
                        display: block;
                        font-weight: 600;
                        margin-bottom: 8px;
                        font-size: 0.9rem;
                    ">Your Age</label>
                    <input type="number" 
                           id="ts-age" 
                           placeholder="25" 
                           min="${CONFIG.MIN_AGE}" 
                           max="${CONFIG.MAX_AGE}" 
                           style="
                        width: 100px;
                        padding: 10px;
                        border: none;
                        border-radius: 8px;
                        font-size: 1.1rem;
                        text-align: center;
                        font-weight: 600;
                        color: #333;
                    ">
                </div>
                
                <!-- Gender Selection -->
                <div style="margin-bottom: 20px;">
                    <label style="
                        display: block;
                        font-weight: 600;
                        margin-bottom: 8px;
                        font-size: 0.9rem;
                    ">Gender</label>
                    <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                        <button type="button" class="ts-gender" data-gender="male" style="
                            padding: 8px 16px;
                            border: 2px solid rgba(255,255,255,0.4);
                            border-radius: 20px;
                            background: rgba(255,255,255,0.1);
                            color: white;
                            font-weight: 500;
                            cursor: pointer;
                            font-size: 0.85rem;
                        ">Male</button>
                        <button type="button" class="ts-gender" data-gender="female" style="
                            padding: 8px 16px;
                            border: 2px solid rgba(255,255,255,0.4);
                            border-radius: 20px;
                            background: rgba(255,255,255,0.1);
                            color: white;
                            font-weight: 500;
                            cursor: pointer;
                            font-size: 0.85rem;
                        ">Female</button>
                        <button type="button" class="ts-gender" data-gender="other" style="
                            padding: 8px 16px;
                            border: 2px solid rgba(255,255,255,0.4);
                            border-radius: 20px;
                            background: rgba(255,255,255,0.1);
                            color: white;
                            font-weight: 500;
                            cursor: pointer;
                            font-size: 0.85rem;
                        ">Other</button>
                    </div>
                </div>
                
                <!-- Screen Time -->
                <div style="margin-bottom: 25px;">
                    <label style="
                        display: block;
                        font-weight: 600;
                        margin-bottom: 8px;
                        font-size: 0.9rem;
                    ">Daily Screen Time</label>
                    <input type="range" 
                           id="ts-screentime" 
                           min="${CONFIG.MIN_SCREEN_TIME}" 
                           max="${CONFIG.MAX_SCREEN_TIME}" 
                           step="0.5" 
                           value="${CONFIG.DEFAULT_SCREEN_TIME}"
                           style="
                        width: 100%;
                        max-width: 250px;
                        margin-bottom: 8px;
                    ">
                    <div style="
                        font-size: 1rem;
                        font-weight: 600;
                        color: ${CONFIG.COLORS.accent};
                    ">
                        <span id="ts-screentime-value">${CONFIG.DEFAULT_SCREEN_TIME}.0</span> hours/day
                    </div>
                </div>
                
                <!-- Calculate Button -->
                <button id="ts-calculate" disabled style="
                    background: linear-gradient(45deg, ${CONFIG.COLORS.accent}, ${CONFIG.COLORS.warning});
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 25px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: not-allowed;
                    opacity: 0.5;
                    margin-bottom: 20px;
                ">Calculate My Tombscroll 💀</button>
                <!-- Results -->
                <div id="ts-results" style="display: none;">
                    <div style="
                        background: rgba(255,255,255,0.15);
                        border-radius: 10px;
                        padding: 15px;
                        margin-bottom: 12px;
                        border-left: 4px solid ${CONFIG.COLORS.accent};
                    ">
                        <div style="font-size: 1.8rem; font-weight: 800; color: ${CONFIG.COLORS.accent}; margin-bottom: 3px;" id="ts-years-scrolling"></div>
                        <div style="font-size: 0.9rem; margin-bottom: 3px;">Years spent scrolling</div>
                        <div style="font-size: 0.75rem; opacity: 0.8; font-style: italic;" id="ts-basis-screen"></div>
                    </div>
                    <div style="
                        background: rgba(255,255,255,0.15);
                        border-radius: 10px;
                        padding: 15px;
                        margin-bottom: 12px;
                        border-left: 4px solid ${CONFIG.COLORS.accent};
                    ">
                        <div style="font-size: 1.8rem; font-weight: 800; color: ${CONFIG.COLORS.accent}; margin-bottom: 3px;" id="ts-days-remaining"></div>
                        <div style="font-size: 0.9rem; margin-bottom: 3px;">Days remaining in your life</div>
                        <div style="font-size: 0.75rem; opacity: 0.8; font-style: italic;" id="ts-basis-life"></div>
                    </div>
                    <div style="
                        background: rgba(255,255,255,0.15);
                        border-radius: 10px;
                        padding: 15px;
                        margin-bottom: 12px;
                        border-left: 4px solid ${CONFIG.COLORS.accent};
                    ">
                        <div style="font-size: 1.8rem; font-weight: 800; color: ${CONFIG.COLORS.accent}; margin-bottom: 3px;" id="ts-days-scrolling"></div>
                        <div style="font-size: 0.9rem; margin-bottom: 3px;">Days you'll spend scrolling</div>
                        <div style="font-size: 0.75rem; opacity: 0.8; font-style: italic;">based on your daily screen time</div>
                    </div>
                    <div style="
                        background: rgba(255,255,255,0.15);
                        border-radius: 10px;
                        padding: 15px;
                        margin-bottom: 15px;
                        border-left: 4px solid ${CONFIG.COLORS.accent};
                    ">
                        <div style="font-size: 1.8rem; font-weight: 800; color: ${CONFIG.COLORS.accent}; margin-bottom: 3px;" id="ts-distance"></div>
                        <div style="font-size: 0.9rem; margin-bottom: 3px;">Distance you'll scroll</div>
                        <div style="font-size: 0.75rem; opacity: 0.8; font-style: italic;">based on ${CONFIG.INCHES_PER_DAY_FOR_3_HOURS / 12} feet daily (3hrs)</div>
                    </div>
                    <div style="
                        background: linear-gradient(45deg, ${CONFIG.COLORS.warning}, ${CONFIG.COLORS.accent});
                        padding: 15px;
                        border-radius: 10px;
                        font-weight: 600;
                        line-height: 1.3;
                        margin-bottom: 15px;
                    " id="ts-insight"></div>
                    <div style="
                        padding-top: 15px;
                        border-top: 1px solid rgba(255,255,255,0.3);
                    ">
                        <p style="opacity: 0.9; margin: 0 0 10px 0;">Ready to reclaim your mornings?</p>
                        <a href="#" style="
                            background: linear-gradient(45deg, ${CONFIG.COLORS.accent}, ${CONFIG.COLORS.warning});
                            color: white;
                            text-decoration: none;
                            padding: 10px 20px;
                            border-radius: 20px;
                            font-weight: 600;
                            display: inline-block;
                        ">Try Sunlock ☀️</a>
                    </div>
                </div>
            </div>
        `;
        
        // Find a good place to insert the calculator
        const targetElement = document.body.querySelector('main') || document.body;
        targetElement.appendChild(container);
        
        setupEventListeners();
    }
    
    function setupEventListeners() {
        // Gender buttons
        document.querySelectorAll('.ts-gender').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.ts-gender').forEach(b => {
                    b.style.background = 'rgba(255,255,255,0.1)';
                    b.style.borderColor = 'rgba(255,255,255,0.4)';
                });
                this.style.background = 'rgba(255,165,0,0.8)';
                this.style.borderColor = CONFIG.COLORS.accent;
                selectedGender = this.dataset.gender;
                checkForm();
            });
        });

        // Screen time slider
        const slider = document.getElementById('ts-screentime');
        const display = document.getElementById('ts-screentime-value');
        
        slider.addEventListener('input', function() {
            display.textContent = parseFloat(this.value).toFixed(1);
            checkForm();
        });

        // Age input
        document.getElementById('ts-age').addEventListener('input', checkForm);

        // Calculate button
        document.getElementById('ts-calculate').addEventListener('click', calculate);
    }

    function checkForm() {
        const age = parseInt(document.getElementById('ts-age').value);
        const btn = document.getElementById('ts-calculate');
        
        if (age && age >= CONFIG.MIN_AGE && age <= CONFIG.MAX_AGE && selectedGender) {
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
        
        if (!age || !selectedGender) return;

        // Get life expectancy
        const lifeExpectancy = CONFIG.LIFE_EXPECTANCY[selectedGender];
        const genderText = selectedGender === 'male' ? 'males' : 
                          selectedGender === 'female' ? 'females' : 'global average';
        
        // Calculate remaining time
        const remainingYears = Math.max(0, lifeExpectancy - age);
        const remainingDays = Math.floor(remainingYears * 365);
        
        // Calculate scrolling time
        const totalHoursScrolling = remainingYears * 365 * screenTime;
        const yearsScrolling = (totalHoursScrolling / (24 * 365)).toFixed(1);
        const daysScrolling = Math.floor(totalHoursScrolling / 24);
        
        // Calculate distance (scale from 3-hour baseline)
        const scrollInchesPerHour = CONFIG.INCHES_PER_DAY_FOR_3_HOURS / 3;
        const totalInches = remainingYears * 365 * screenTime * scrollInchesPerHour;
        const miles = Math.floor(totalInches / CONFIG.INCHES_TO_MILES);
        const km = Math.floor(totalInches * CONFIG.INCHES_TO_KM);
        
        // Generate insight
        const scrollPercentage = ((daysScrolling / remainingDays) * 100).toFixed(1);
        let insight;
        
        if (remainingYears <= 0) {
            insight = "You've exceeded average life expectancy! Every moment is precious. 🌅";
        } else if (screenTime >= 5) {
            insight = `${scrollPercentage}% of your remaining life will be spent scrolling. That's like spending every weekend for the rest of your life on your phone. 📱💔`;
        } else if (screenTime >= 3) {
            insight = `You'll spend ${scrollPercentage}% of your remaining life scrolling. Time to scroll less and live more! 🛣️`;
        } else {
            insight = `Even with moderate usage, you'll scroll ${miles} miles. That's a serious thumb workout! 👍`;
        }

        // Display results
        document.getElementById('ts-years-scrolling').textContent = yearsScrolling;
        document.getElementById('ts-days-remaining').textContent = remainingDays.toLocaleString();
        document.getElementById('ts-days-scrolling').textContent = daysScrolling.toLocaleString();
        document.getElementById('ts-distance').textContent = `${miles} miles (${km} km)`;
        document.getElementById('ts-insight').textContent = insight;
        document.getElementById('ts-basis-screen').textContent = `(based on your ${screenTime} hours daily)`;
        document.getElementById('ts-basis-life').textContent = `(based on ${lifeExpectancy} years avg for ${genderText})`;
        document.getElementById('ts-results').style.display = 'block';
        document.getElementById('ts-results').scrollIntoView({ behavior: 'smooth' });
    }

    // Initialize calculator
    createCalculator();
});
