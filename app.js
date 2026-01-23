// Patch Tuesday Calculator - Simplified JavaScript

/**
 * Get Patch Tuesday (second Tuesday) for a given month and year
 */
function getPatchTuesday(year, month) {
  const firstDay = new Date(year, month, 1);
  const dayOfWeek = firstDay.getDay();
  const daysUntilTuesday = (9 - dayOfWeek) % 7;
  const firstTuesday = 1 + daysUntilTuesday;
  const secondTuesday = firstTuesday + 7;
  return new Date(year, month, secondTuesday);
}

/**
 * Get the next N Patch Tuesdays from today
 */
function getNextPatchTuesdays(count) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dates = [];
  let year = today.getFullYear();
  let month = today.getMonth();

  while (dates.length < count) {
    const patchTuesday = getPatchTuesday(year, month);
    if (patchTuesday >= today) {
      dates.push(patchTuesday);
    }
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
  }
  return dates;
}

/**
 * Get number of days from today to a given date
 */
function getDaysAway(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = date.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Format a date to a readable string
 */
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format days away as a human-readable string
 */
function formatDaysAway(days) {
  if (days === 0) return 'Today';
  if (days === 1) return '1 day';
  if (days === -1) return '1 day ago';
  if (days > 0) return `${days} days`;
  return `${Math.abs(days)} days ago`;
}

/**
 * Render the list of upcoming Patch Tuesdays
 */
function renderUpcomingDates() {
  const container = document.getElementById('upcoming-dates');
  const dates = getNextPatchTuesdays(12);

  // Clear existing content
  container.replaceChildren();

  dates.forEach((date, index) => {
    const daysAway = getDaysAway(date);
    const isFirst = index === 0;

    const dateItem = document.createElement('div');
    dateItem.className = isFirst ? 'date-item highlight' : 'date-item';

    const dateSpan = document.createElement('span');
    dateSpan.className = 'date';
    dateSpan.textContent = formatDate(date);

    const badgeSpan = document.createElement('span');
    badgeSpan.className = isFirst ? 'badge primary' : 'badge';
    badgeSpan.textContent = formatDaysAway(daysAway);

    dateItem.appendChild(dateSpan);
    dateItem.appendChild(badgeSpan);
    container.appendChild(dateItem);
  });
}

/**
 * Populate the month and year selectors
 */
function populateSelectors() {
  const monthSelect = document.getElementById('month-select');
  const yearSelect = document.getElementById('year-select');
  const currentYear = new Date().getFullYear();
  
  // Default to the next Patch Tuesday's month/year instead of current month/year
  const nextPatchTuesday = getNextPatchTuesdays(1)[0];
  const defaultMonth = nextPatchTuesday.getMonth();
  const defaultYear = nextPatchTuesday.getFullYear();

  // Populate months
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Clear existing options and populate months
  monthSelect.replaceChildren();
  months.forEach((month, index) => {
    const isSelected = index === defaultMonth;
    const option = new Option(month, index, isSelected, isSelected);
    monthSelect.add(option);
  });

  // Populate years (5 years before to 10 years after current year)
  yearSelect.replaceChildren();
  for (let y = currentYear - 5; y <= currentYear + 10; y++) {
    const isSelected = y === defaultYear;
    const option = new Option(y, y, isSelected, isSelected);
    yearSelect.add(option);
  }
}

/**
 * Update the lookup result based on selected month/year
 */
function updateLookupResult() {
  const month = parseInt(document.getElementById('month-select').value);
  const year = parseInt(document.getElementById('year-select').value);
  const patchTuesday = getPatchTuesday(year, month);
  const daysAway = getDaysAway(patchTuesday);

  document.getElementById('result-date').textContent = formatDate(patchTuesday);

  const badgeEl = document.getElementById('result-badge');
  let badgeText;
  if (daysAway === 0) {
    badgeText = 'Today';
  } else if (daysAway === 1) {
    badgeText = '1 day away';
  } else if (daysAway > 0) {
    badgeText = `${daysAway} days away`;
  } else if (daysAway === -1) {
    badgeText = '1 day ago';
  } else {
    badgeText = `${Math.abs(daysAway)} days ago`;
  }

  badgeEl.textContent = badgeText;
  badgeEl.className = 'badge' + (daysAway >= 0 ? ' accent' : '');
}

/**
 * Initialize the application
 */
function init() {
  renderUpcomingDates();
  populateSelectors();
  updateLookupResult();

  // Add event listeners for selectors
  document.getElementById('month-select').addEventListener('change', updateLookupResult);
  document.getElementById('year-select').addEventListener('change', updateLookupResult);
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', init);
