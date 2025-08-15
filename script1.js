const optionButtons = document.querySelectorAll('.option-btn');
const submitBtn = document.getElementById('submit-btn');
const calendar = document.getElementById('calendar');
const monthYear = document.getElementById('month-year');
const prevBtn = document.getElementById('prev-month');
const nextBtn = document.getElementById('next-month');
const clearAllBtn = document.getElementById('clear-all');
const clearDateBtn = document.getElementById('clear-date');

let selectedOption = null;
let selectedSymbol = null;
let selectedDate = null;

const entries = JSON.parse(localStorage.getItem('learningEntries')) || {};

// Track current month/year
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();

// Option selection
optionButtons.forEach(button => {
  button.addEventListener('click', () => {
    optionButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    selectedOption = button.getAttribute('data-name');
    selectedSymbol = button.getAttribute('data-symbol');
  });
});
// Select "Today" by default if not manually selected
const defaultButton = [...optionButtons].find(btn => btn.getAttribute('data-name') === 'Today');
if (defaultButton) {
  // defaultButton.click(); // This triggers the same click logic
  defaultButton.classList.add('selected');
  selectedOption = defaultButton.getAttribute('data-name');
  selectedSymbol = defaultButton.getAttribute('data-symbol');
}

// Submit entry
submitBtn.addEventListener('click', () => {
  if (!selectedSymbol || !selectedDate) {
    alert('Please select an option and a date!');
    return;
  }

  if (!entries[selectedDate]) {
    entries[selectedDate] = [];
  }

  if (!entries[selectedDate].includes(selectedSymbol)) {
    entries[selectedDate].push(selectedSymbol);
  }

  localStorage.setItem('learningEntries', JSON.stringify(entries));
  buildCalendar(currentYear, currentMonth);
  optionButtons.forEach(btn => btn.classList.remove('selected'));
  selectedOption = null;
  selectedSymbol = null;
});

// Build calendar with proper structure
function buildCalendar(year, month) {
  calendar.innerHTML = '';

  // Day name headers
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  dayNames.forEach(day => {
    const header = document.createElement('div');
    header.textContent = day;
    header.style.fontWeight = 'bold';
    header.style.textAlign = 'center';
    calendar.appendChild(header);
  });

  const firstDay = new Date(year, month, 1);
  const totalDays = new Date(year, month + 1, 0).getDate();
  const startDay = firstDay.getDay();

  monthYear.textContent = firstDay.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Blank days before 1st
  for (let i = 0; i < startDay; i++) {
    const blank = document.createElement('div');
    blank.classList.add('day');
    blank.style.visibility = 'hidden';
    calendar.appendChild(blank);
  }

  // Calendar days
  for (let day = 1; day <= totalDays; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

   const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');

    const dateNum = document.createElement('div');
    dateNum.classList.add('date-num');
    dateNum.textContent = day;
    dayDiv.appendChild(dateNum);

    if (entries[dateStr]) {
      entries[dateStr].forEach(symbol => {
        const mark = document.createElement('div');
        mark.classList.add('option-mark');
        mark.textContent = symbol;
        dayDiv.appendChild(mark);
      });
    }

    // Highlight selected
    if (selectedDate === dateStr) {
      dayDiv.classList.add('selected-date');
    }

    // Select date
    dayDiv.addEventListener('click', () => {
      document.querySelectorAll('.day').forEach(d => d.classList.remove('selected-date'));
      dayDiv.classList.add('selected-date');
      selectedDate = dateStr;

      // Show/hide clear selected date button
      if (entries[selectedDate] && entries[selectedDate].length > 0) {
        clearDateBtn.style.display = 'inline-block';
      } else {
        clearDateBtn.style.display = 'none';
      }
    });

    calendar.appendChild(dayDiv);
  }
}

// Prev/Next month
prevBtn.addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  buildCalendar(currentYear, currentMonth);
});

nextBtn.addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  buildCalendar(currentYear, currentMonth);
});

// Clear all entries
clearAllBtn.addEventListener('click', () => {
  if (confirm('Clear ALL entries?')) {
    localStorage.removeItem('learningEntries');
    for (let key in entries) delete entries[key];
    buildCalendar(currentYear, currentMonth);
    clearDateBtn.style.display = 'none';
  }
});

// Clear selected date
clearDateBtn.addEventListener('click', () => {
  if (selectedDate && entries[selectedDate]) {
    delete entries[selectedDate];
    localStorage.setItem('learningEntries', JSON.stringify(entries));
    buildCalendar(currentYear, currentMonth);
    clearDateBtn.style.display = 'none';
  }
});

// Initial calendar
buildCalendar(currentYear, currentMonth);


// Only Saved on req. browser
const userFlagKey = 'consistentCoderUser';

// localStorage.setItem(userFlagKey, 'true');
window.onload = function() {
  const isUser = localStorage.getItem(userFlagKey);
  if (isUser === 'true') {
    // Load saved data for you
    loadSavedCalendar();
  } else {
    // Fresh blank calendar for others
    createBlankCalendar();
  }
};


