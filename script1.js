const optionButtons = document.querySelectorAll('.option-btn');
const submitBtn = document.getElementById('submit-btn');
const calendar = document.getElementById('calendar');
const monthYear = document.getElementById('month-year');
const prevBtn = document.getElementById('prev-month');
const nextBtn = document.getElementById('next-month');
const clearAllBtn = document.getElementById('clear-all');

let selectedOption = null;
let selectedSymbol = null;
const entries = JSON.parse(localStorage.getItem('learningEntries')) || {};

// 🗓️ Track current visible month
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();

optionButtons.forEach(button => {
  button.addEventListener('click', () => {
    optionButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    selectedOption = button.getAttribute('data-name');
    selectedSymbol = button.getAttribute('data-symbol');
  });
});

submitBtn.addEventListener('click', () => {
  if (!selectedSymbol) {
    alert('Please select an option!');
    return;
  }

  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  entries[dateStr] = selectedSymbol;
  localStorage.setItem('learningEntries', JSON.stringify(entries));

  // Rebuild current calendar
  buildCalendar(currentYear, currentMonth);

  optionButtons.forEach(btn => btn.classList.remove('selected'));
  selectedOption = null;
  selectedSymbol = null;
});

function buildCalendar(year, month) {
  calendar.innerHTML = '';
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();
  const startDay = firstDay.getDay(); // Sunday = 0

  monthYear.textContent = firstDay.toLocaleString('default', { month: 'long', year: 'numeric' });

  for (let i = 0; i < startDay; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('day');
    emptyDiv.style.visibility = 'hidden';
    calendar.appendChild(emptyDiv);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dateStr = `${year}-${String(month+1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');

    const dateNum = document.createElement('div');
    dateNum.classList.add('date-num');
    dateNum.textContent = day;
    dayDiv.appendChild(dateNum);

    if (entries[dateStr]) {
      const mark = document.createElement('div');
      mark.classList.add('option-mark');
      mark.textContent = entries[dateStr];
      dayDiv.appendChild(mark);
    }

    calendar.appendChild(dayDiv);
  }
}

// 📅 Prev / Next Month Buttons
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

// ❌ Clear All Button
clearAllBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all entries?')) {
    localStorage.removeItem('learningEntries');
    for (const key in entries) {
      delete entries[key];
    }
    buildCalendar(currentYear, currentMonth);
  }
});

// 🔁 Initial render
buildCalendar(currentYear, currentMonth);
