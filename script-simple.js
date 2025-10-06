import { SimpleAuth } from './auth-simple.js';

document.addEventListener('DOMContentLoaded', async () => {
  // -------------------------
  // Authentication
  // -------------------------
  const auth = new SimpleAuth();
  
  // Require authentication
  if (!auth.requireAuth()) return;

  // Add logout button to nav
  const nav = document.getElementById('main-nav');
  auth.addLogoutButton(nav);

  // -------------------------
  // DOM Elements
  // -------------------------
  const dateElement = document.getElementById('current-date');
  const teacherPostContainer = document.getElementById('teacher-post');
  const notesGrid = document.getElementById('notes-grid');
  const filterContainer = document.getElementById('filter-container');
  const searchBar = document.getElementById('search-bar');

  // -------------------------
  // Display current date
  // -------------------------
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  dateElement.textContent = today.toLocaleDateString(undefined, options);

  // -------------------------
  // Load/Save Notes from localStorage
  // -------------------------
  function loadNotes() {
    const saved = localStorage.getItem('studentNotes');
    if (saved) {
      const notes = JSON.parse(saved);
      // Convert timestamp strings back to Date objects
      return notes.map(note => ({
        ...note,
        timestamp: new Date(note.timestamp)
      }));
    }
    // Default notes if none saved
    return [
      { id: 1, title: "AI Note Summaries", snippet: 'Using AI to condense lengthy notes into key points.', author: 'Amelia', timestamp: new Date(), rating: 28, comments: 5, resources: [{ name: 'AI Summary Tips.pdf', link: '#' }] },
      { id: 2, title: "Smart Flashcards", snippet: 'Generating personalized flashcards with AI.', author: 'Ben', timestamp: new Date(), rating: 45, comments: 8, resources: [{ name: 'Flashcard Examples', link: '#' }] },
      { id: 3, title: "AI Study Planner", snippet: 'Organizing your study schedule efficiently using AI.', author: 'Chloe', timestamp: new Date(), rating: 15, comments: 2, resources: [] }
    ];
  }

  function saveNotes() {
    localStorage.setItem('studentNotes', JSON.stringify(studentNotes));
  }

  // -------------------------
  // Teacher post data
  // -------------------------
  const teacherPost = {
    title: 'Lesson Overview: AI-Powered Study Tips',
    summary: 'Exploring how AI can help optimize learning, summarize notes, and generate quiz questions.',
    author: 'Ms. Nguyen',
    timestamp: new Date('2025-09-27T09:00:00Z'),
    resources: [
      { name: 'AI Study Guide.pdf', link: '#' },
      { name: 'Interactive Quiz Link', link: '#' }
    ]
  };

  // -------------------------
  // Student notes
  // -------------------------
  let studentNotes = loadNotes();
  let currentSort = 'newest';
  let searchTerm = '';

  // -------------------------
  // Helper: Time ago format
  // -------------------------
  const timeAgo = date => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // -------------------------
  // Render Teacher Post
  // -------------------------
  const renderTeacherPost = () => {
    teacherPostContainer.innerHTML = `
      <div class="teacher-card bg-white p-6 rounded-xl shadow-sm border-2 border-indigo-500">
        <h2 class="text-2xl font-bold mb-2">${teacherPost.title}</h2>
        <p>${teacherPost.summary}</p>
        <div class="mt-2">
          ${teacherPost.resources.map(res => `
            <a href="${res.link}" class="resource-link" target="_blank">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              ${res.name}
            </a>
          `).join('')}
        </div>
        <p class="text-sm text-slate-500 mt-2">Posted by ${teacherPost.author} &bull; ${timeAgo(teacherPost.timestamp)}</p>
      </div>
    `;
  };

  // -------------------------
  // Render Student Notes
  // -------------------------
  const renderStudentNotes = () => {
    notesGrid.innerHTML = '';

    const filtered = studentNotes.filter(note =>
      note.title.toLowerCase().includes(searchTerm) ||
      note.snippet.toLowerCase().includes(searchTerm)
    );

    const sorted = [...filtered].sort((a,b) =>
      currentSort === 'top' ? b.rating - a.rating : b.timestamp - a.timestamp
    );

    const topNoteId = sorted.length ? sorted[0].id : null;

    sorted.forEach(note => {
      const isTopNote = currentSort === 'top' && note.id === topNoteId;

      const resourcesHTML = note.resources.length ? `
        <div class="mt-2 flex flex-wrap gap-1">
          ${note.resources.map(res => `
            <a href="${res.link}" class="resource-link" target="_blank">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg>
              ${res.name}
            </a>
          `).join('')}
        </div>` : '';

      const noteCard = document.createElement('div');
      noteCard.className = 'note-card bg-white p-6 rounded-lg shadow-sm relative cursor-pointer hover:shadow-lg transition-all';
      noteCard.innerHTML = `
        ${isTopNote ? `<div class="top-note-badge">★ Top Note</div>` : ''}
        <h3 class="text-xl font-bold mb-2">${note.title}</h3>
        <p class="text-slate-600 mb-2 text-sm">${note.snippet}</p>
        ${resourcesHTML}
        <div class="flex justify-between items-center mt-4 text-sm text-slate-500">
          <span>${note.author} &bull; ${timeAgo(note.timestamp)}</span>
          <div class="flex items-center gap-3">
            <a href="note-detail.html?id=${note.id}" class="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-semibold" onclick="event.stopPropagation()">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              ${note.comments || 0}
            </a>
            <div class="flex items-center gap-2">
              <button class="vote-btn" data-id="${note.id}" data-action="upvote" onclick="event.stopPropagation()">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="m5 12 7-7 7 7M12 19V5"/></svg>
              </button>
              <span data-rating-id="${note.id}">${note.rating}</span>
              <button class="vote-btn" data-id="${note.id}" data-action="downvote" onclick="event.stopPropagation()">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 5v14m7-7-7 7-7-7"/></svg>
              </button>
            </div>
          </div>
        </div>
      `;
      
      // Click card to view details
      noteCard.addEventListener('click', () => {
        window.location.href = `note-detail.html?id=${note.id}`;
      });
      
      notesGrid.appendChild(noteCard);
    });

    if(sorted.length === 0) {
      notesGrid.innerHTML = '<p class="text-slate-500 col-span-full text-center">No notes found.</p>';
    }
  };

  // -------------------------
  // Event Listeners
  // -------------------------
  notesGrid.addEventListener('click', e => {
    const voteBtn = e.target.closest('.vote-btn');
    if(!voteBtn) return;

    const noteId = parseInt(voteBtn.dataset.id);
    const action = voteBtn.dataset.action;
    const note = studentNotes.find(n => n.id === noteId);

    if(note) {
      action === 'upvote' ? note.rating++ : note.rating--;
      document.querySelector(`[data-rating-id="${noteId}"]`).textContent = note.rating;
      saveNotes(); // Save to localStorage
      if(currentSort === 'top') renderStudentNotes();
    }
  });

  filterContainer.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if(!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentSort = btn.dataset.sort;
    renderStudentNotes();
  });

  searchBar.addEventListener('input', e => {
    searchTerm = e.target.value.toLowerCase();
    renderStudentNotes();
  });

  // -------------------------
  // Initial Render
  // -------------------------
  renderTeacherPost();
  renderStudentNotes();
});
