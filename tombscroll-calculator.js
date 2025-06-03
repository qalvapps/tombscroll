// 🌄 Constants
const LIFE_EXPECTANCY = {
  male: 76,
  female: 81
};
const AVERAGE_SCROLL_HOURS_PER_DAY = 3.5;
const SCROLL_DISTANCE_PER_DAY_INCHES = 519;

const INCHES_PER_MILE = 63360;
const INCHES_PER_KM = 39370.1;
const EIFFEL_TOWER_HEIGHT_INCHES = 1063 * 12;
const EVEREST_HEIGHT_INCHES = 348031;
const EVEREST_BASE_CAMP_INCHES = 211176;

function waitForTombRoot() {
  return new Promise((resolve) => {
    const check = () => {
      const el = document.getElementById("tombscroll-root");
      if (el) return resolve(el);
      requestAnimationFrame(check);
    };
    check();
  });
}

function formatNum(n) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function buildCalculator(el) {
  el.innerHTML = `
    <style>
      #tomb-form {
        display: flex;
        flex-direction: column;
        gap: 12px;
        font-family: system-ui, sans-serif;
        max-width: 400px;
        padding: 16px;
        background: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      }
      #tomb-form input, #tomb-form select, #tomb-form button {
        padding: 8px;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 6px;
      }
      #tomb-results {
        margin-top: 24px;
        font-size: 1rem;
        line-height: 1.6;
      }
    </style>
    <form id="tomb-form">
      <label>
        Your age:
        <input type="number" id="age" min="1" max="120" required />
      </label>
      <label>
        Gender:
        <select id="gender" required>
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </label>
      <button type="submit">Calculate</button>
    </form>
    <div id="tomb-results"></div>
  `;

  const form = el.querySelector("#tomb-form");
  const results = el.querySelector("#tomb-results");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const age = parseInt(form.age.value);
    const gender = form.gender.value;
    if (!age || !gender) return;

    const expectancy = LIFE_EXPECTANCY[gender];
    const daysLeft = Math.max(0, (expectancy - age) * 365);
    const scrollDays = Math.round((AVERAGE_SCROLL_HOURS_PER_DAY / 24) * daysLeft);
    const scrollYears = scrollDays / 365;
    const lifeYearsLeft = daysLeft / 365;

    const totalScrollInches = scrollDays * SCROLL_DISTANCE_PER_DAY_INCHES;
    const miles = totalScrollInches / INCHES_PER_MILE;
    const km = totalScrollInches / INCHES_PER_KM;
    const towers = totalScrollInches / EIFFEL_TOWER_HEIGHT_INCHES;
    const everests = totalScrollInches / EVEREST_HEIGHT_INCHES;
    const baseCamps = totalScrollInches / EVEREST_BASE_CAMP_INCHES;

    results.innerHTML = `
      <p><strong>${formatNum(daysLeft)}</strong> days (${formatNum(lifeYearsLeft)} years) remaining in your life <em>(based on a lifespan of ${expectancy} years for ${gender}s)</em>.</p>
      <p><strong>${formatNum(scrollDays)}</strong> of those days (${formatNum(scrollYears)} years) will be spent scrolling <em>(at ${AVERAGE_SCROLL_HOURS_PER_DAY} hrs/day)</em>.</p>
      <p>Your thumb will travel:</p>
      <ul style="margin-left: 1.5em;">
        <li><strong>${formatNum(miles)}</strong> miles</li>
        <li><strong>${formatNum(km)}</strong> kilometers</li>
        <li><strong>${formatNum(towers)}</strong> Eiffel Towers tall</li>
        <li><strong>${formatNum(everests)}</strong> Everests high</li>
        <li><strong>${formatNum(baseCamps)}</strong> Base Camp ascents</li>
      </ul>
      <p style="margin-top: 1em;">
        That’s more vertical scrolling than hiking to Base Camp — and halfway to the summit of Everest.<br>
        <em>Every scroll is a choice. Make it count.</em>
      </p>
    `;
  });
}

waitForTombRoot().then(buildCalculator);
//console.log("✅ Tombscroll script loaded");
