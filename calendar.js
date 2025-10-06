import { SimpleAuth } from './auth-simple.js';

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------
  // Authentication
  // -------------------------
  const auth = new SimpleAuth();
  if (!auth.requireAuth()) return;

  const nav = document.getElementById('main-nav');
  auth.addLogoutButton(nav);

  // -------------------------
  // DOM Elements
  // -------------------------
  const currentMonthEl = document.getElementById('current-month');
  const calendarGrid = document.getElementById('calendar-grid');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');
  const todayBtn = document.getElementById('today-btn');
  const calendarViewBtn = document.getElementById('calendar-view');
  const listViewBtn = document.getElementById('list-view');
  const calendarContainer = document.getElementById('calendar-container');
  const listContainer = document.getElementById('list-container');
  const dateDetails = document.getElementById('date-details');
  const closeDetailsBtn = document.getElementById('close-details');

  // -------------------------
  // State
  // -------------------------
  let currentDate = new Date();
  let selectedDate = null;
  let viewMode = 'calendar'; // 'calendar' or 'list'

  // -------------------------
  // Sample Lessons Data
  // -------------------------
  function loadLessons() {
    const saved = localStorage.getItem('lessons');
    if (saved) {
      const lessons = JSON.parse(saved);
      return lessons.map(lesson => ({
        ...lesson,
        date: new Date(lesson.date)
      }));
    }
    
    // Default lessons
    const today = new Date();
    return [
      {
        id: 1,
        title: 'Introduction to AI',
        subject: 'Computer Science',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
        teacher: 'Ms. Nguyen',
        description: 'Overview of artificial intelligence and machine learning basics',
        resources: ['AI Basics.pdf', 'Lecture Slides']
      },
      {
        id: 2,
        title: 'AI Study Tools',
        subject: 'Computer Science',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
        teacher: 'Ms. Nguyen',
        description: 'How to use AI for studying and note-taking',
        resources: ['Study Guide.pdf']
      },
      {
        id: 3,
        title: 'Machine Learning Basics',
        subject: 'Computer Science',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        teacher: 'Ms. Nguyen',
        description: 'Introduction to supervised and unsupervised learning',
        resources: ['ML Tutorial.pdf', 'Practice Problems']
      }
    ];
  }

  let lessons = loadLessons();

  // -------------------------
  // Load Notes
  // -------------------------
  function loadNotes() {
    const saved = localStorage.getItem('studentNotes');
    if (saved) {
      const notes = JSON.parse(saved);
      return notes.map(note => ({
        ...note,
        timestamp: new Date(note.timestamp)
      }));
    }
    return [];
  }

  let notes = loadNotes();

  // -------------------------
  // Helper Functions
  // -------------------------
  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
  }

  function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  function getLessonsForDate(date) {
    return lessons.filter(lesson => isSameDay(lesson.date, date));
  }

  function getNotesForDate(date) {
    return notes.filter(note => isSameDay(note.timestamp, date));
  }

  function hasActivityOnDate(date) {
    return getLessonsForDate(date).length > 0 || getNotesForDate(date).length > 0;
  }

  // -------------------------
  // Render Calendar
  // -------------------------
  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();

    // Update month title
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    currentMonthEl.textContent = `${monthNames[month]} ${year}`;

    // Clear grid
    calendarGrid.innerHTML = '';

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'h-24 bg-slate-50 rounded-lg';
      calendarGrid.appendChild(emptyCell);
    }

    // Add days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayCell = document.createElement('div');
      const isToday = isSameDay(date, today);
      const hasActivity = hasActivityOnDate(date);
      const lessonsCount = getLessonsForDate(date).length;
      const notesCount = getNotesForDate(date).length;

      dayCell.className = `h-24 p-2 rounded-lg border-2 transition-all cursor-pointer ${
        isToday ? 'border-purple-600 bg-purple-50' : 
        hasActivity ? 'border-indigo-300 bg-white hover:border-indigo-500' :
        'border-slate-200 bg-white hover:border-slate-300'
      }`;

      dayCell.innerHTML = `
        <div class="font-bold text-slate-900 mb-1">${day}</div>
        ${hasActivity ? `
          <div class="space-y-1">
            ${lessonsCount > 0 ? `
              <div class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                ${lessonsCount} lesson${lessonsCount > 1 ? 's' : ''}
              </div>
            ` : ''}
            ${notesCount > 0 ? `
              <div class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                ${notesCount} note${notesCount > 1 ? 's' : ''}
              </div>
            ` : ''}
          </div>
        ` : ''}
      `;

      dayCell.addEventListener('click', () => showDateDetails(date));
      calendarGrid.appendChild(dayCell);
    }
  }

  // -------------------------
  // Render List View
  // -------------------------
  function renderListView() {
    const lessonsList = document.getElementById('lessons-list');
    lessonsList.innerHTML = '';

    // Group lessons by date
    const lessonsByDate = {};
    lessons.forEach(lesson => {
      const dateKey = lesson.date.toDateString();
      if (!lessonsByDate[dateKey]) {
        lessonsByDate[dateKey] = [];
      }
      lessonsByDate[dateKey].push(lesson);
    });

    // Sort dates (newest first)
    const sortedDates = Object.keys(lessonsByDate).sort((a, b) => 
      new Date(b) - new Date(a)
    );

    if (sortedDates.length === 0) {
      lessonsList.innerHTML = '<p class="text-slate-500 text-center">No lessons yet.</p>';
      return;
    }

    sortedDates.forEach(dateKey => {
      const date = new Date(dateKey);
      const dateLessons = lessonsByDate[dateKey];
      const dateNotes = getNotesForDate(date);

      const dateGroup = document.createElement('div');
      dateGroup.className = 'bg-white rounded-xl shadow-lg p-6';
      
      dateGroup.innerHTML = `
        <h3 class="text-xl font-bold text-slate-900 mb-4">
          ${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </h3>
        
        <div class="space-y-4">
          ${dateLessons.map(lesson => `
            <div class="border-l-4 border-purple-500 pl-4 py-2">
              <h4 class="font-bold text-lg text-slate-900">${lesson.title}</h4>
              <p class="text-sm text-slate-600">${lesson.subject} • ${lesson.teacher}</p>
              <p class="text-sm text-slate-700 mt-1">${lesson.description}</p>
              ${lesson.resources.length > 0 ? `
                <div class="mt-2 flex flex-wrap gap-2">
                  ${lesson.resources.map(resource => `
                    <span class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">${resource}</span>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
          
          ${dateNotes.length > 0 ? `
            <div class="mt-4 pt-4 border-t border-slate-200">
              <p class="text-sm font-semibold text-slate-700 mb-2">${dateNotes.length} Student Note${dateNotes.length > 1 ? 's' : ''}</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                ${dateNotes.slice(0, 4).map(note => `
                  <div class="text-sm bg-slate-50 p-3 rounded-lg">
                    <p class="font-semibold text-slate-900">${note.title}</p>
                    <p class="text-slate-600 text-xs mt-1">${note.author}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;

      lessonsList.appendChild(dateGroup);
    });
  }

  // -------------------------
  // Show Date Details
  // -------------------------
  function showDateDetails(date) {
    selectedDate = date;
    const dateLessons = getLessonsForDate(date);
    const dateNotes = getNotesForDate(date);

    if (dateLessons.length === 0 && dateNotes.length === 0) {
      return; // Don't show details if no activity
    }

    document.getElementById('selected-date-title').textContent = 
      date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Render lessons
    const lessonsContainer = document.getElementById('lessons-for-date');
    if (dateLessons.length > 0) {
      lessonsContainer.innerHTML = dateLessons.map(lesson => `
        <div class="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
          <div class="flex items-start justify-between mb-2">
            <h4 class="text-xl font-bold text-slate-900">${lesson.title}</h4>
            <span class="text-sm bg-purple-600 text-white px-3 py-1 rounded-full">${lesson.subject}</span>
          </div>
          <p class="text-sm text-slate-600 mb-3">Taught by ${lesson.teacher}</p>
          <p class="text-slate-700 mb-4">${lesson.description}</p>
          ${lesson.resources.length > 0 ? `
            <div class="flex flex-wrap gap-2">
              ${lesson.resources.map(resource => `
                <a href="#" class="resource-link">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  </svg>
                  ${resource}
                </a>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('');
    } else {
      lessonsContainer.innerHTML = '<p class="text-slate-500">No lessons on this date.</p>';
    }

    // Render notes
    const notesContainer = document.getElementById('notes-for-date');
    if (dateNotes.length > 0) {
      notesContainer.innerHTML = dateNotes.map(note => `
        <div class="note-card bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <h5 class="font-bold text-slate-900 mb-1">${note.title}</h5>
          <p class="text-sm text-slate-600 mb-2">${note.snippet}</p>
          <p class="text-xs text-slate-500">${note.author} • ${note.rating} votes</p>
        </div>
      `).join('');
    } else {
      notesContainer.innerHTML = '<p class="text-slate-500">No notes on this date.</p>';
    }

    dateDetails.classList.remove('hidden');
    calendarContainer.classList.add('opacity-50');
    
    // Scroll to date details section smoothly after showing it
    setTimeout(() => {
      dateDetails.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }

  // -------------------------
  // Event Listeners
  // -------------------------
  prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  todayBtn.addEventListener('click', () => {
    currentDate = new Date();
    renderCalendar();
  });

  calendarViewBtn.addEventListener('click', () => {
    viewMode = 'calendar';
    calendarViewBtn.classList.add('bg-purple-600', 'text-white');
    calendarViewBtn.classList.remove('bg-white', 'text-slate-700', 'border');
    listViewBtn.classList.remove('bg-purple-600', 'text-white');
    listViewBtn.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-300');
    calendarContainer.classList.remove('hidden');
    listContainer.classList.add('hidden');
  });

  listViewBtn.addEventListener('click', () => {
    viewMode = 'list';
    listViewBtn.classList.add('bg-purple-600', 'text-white');
    listViewBtn.classList.remove('bg-white', 'text-slate-700', 'border');
    calendarViewBtn.classList.remove('bg-purple-600', 'text-white');
    calendarViewBtn.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-300');
    listContainer.classList.remove('hidden');
    calendarContainer.classList.add('hidden');
    renderListView();
  });

  closeDetailsBtn.addEventListener('click', () => {
    dateDetails.classList.add('hidden');
    calendarContainer.classList.remove('opacity-50');
  });

  // -------------------------
  // Initial Render
  // -------------------------
  renderCalendar();
});
