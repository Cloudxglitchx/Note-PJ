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
  // Get Note ID from URL
  // -------------------------
  const urlParams = new URLSearchParams(window.location.search);
  const noteId = parseInt(urlParams.get('id'));

  if (!noteId) {
    alert('Note not found');
    window.location.href = 'index-simple.html';
    return;
  }

  // -------------------------
  // Load Note and Comments
  // -------------------------
  const notes = JSON.parse(localStorage.getItem('studentNotes') || '[]');
  const note = notes.find(n => n.id === noteId);

  if (!note) {
    alert('Note not found');
    window.location.href = 'index-simple.html';
    return;
  }

  // Load comments for this note
  function loadComments() {
    const allComments = JSON.parse(localStorage.getItem('comments') || '[]');
    return allComments.filter(c => c.noteId === noteId).map(c => ({
      ...c,
      timestamp: new Date(c.timestamp)
    }));
  }

  function saveComments(comments) {
    const allComments = JSON.parse(localStorage.getItem('comments') || '[]');
    // Remove old comments for this note
    const otherComments = allComments.filter(c => c.noteId !== noteId);
    // Add updated comments
    const updatedComments = [...otherComments, ...comments];
    localStorage.setItem('comments', JSON.stringify(updatedComments));
    
    // Update comment count in note
    note.comments = comments.length;
    const notes = JSON.parse(localStorage.getItem('studentNotes') || '[]');
    const noteIndex = notes.findIndex(n => n.id === noteId);
    if (noteIndex !== -1) {
      notes[noteIndex] = note;
      localStorage.setItem('studentNotes', JSON.stringify(notes));
    }
  }

  let comments = loadComments();

  // -------------------------
  // Helper: Time ago
  // -------------------------
  const timeAgo = date => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // -------------------------
  // Render Note
  // -------------------------
  function renderNote() {
    document.getElementById('note-title-header').textContent = note.title;
    document.getElementById('note-title').textContent = note.title;
    document.getElementById('note-author').textContent = `By ${note.author}`;
    document.getElementById('note-date').textContent = timeAgo(new Date(note.timestamp));
    document.getElementById('note-rating').textContent = note.rating || 0;
    
    // Subject
    const subjectEl = document.getElementById('note-subject');
    if (note.subject) {
      subjectEl.textContent = note.subject;
    } else {
      subjectEl.classList.add('hidden');
    }

    // Content
    const contentEl = document.getElementById('note-content');
    contentEl.textContent = note.content || note.snippet;

    // Resources
    const resourcesEl = document.getElementById('note-resources');
    if (note.resources && note.resources.length > 0) {
      resourcesEl.innerHTML = `
        <h4 class="font-semibold text-slate-900 mb-3">Resources</h4>
        <div class="flex flex-wrap gap-2">
          ${note.resources.map(res => `
            <a href="${res.link}" class="resource-link" target="_blank">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              </svg>
              ${res.name}
            </a>
          `).join('')}
        </div>
      `;
    }

    // Attached Files
    const filesEl = document.getElementById('note-files');
    if (note.files && note.files.length > 0) {
      filesEl.innerHTML = `
        <h4 class="font-semibold text-slate-900 mb-3">Attached Files (${note.files.length})</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${note.files.map(file => {
            const sizeKB = (file.size / 1024).toFixed(1);
            const isImage = file.type.startsWith('image/');
            
            return `
              <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-purple-300 transition-all">
                <div class="flex-shrink-0">
                  ${isImage ? `
                    <img src="${file.data}" alt="${file.name}" class="w-16 h-16 object-cover rounded cursor-pointer" onclick="window.open('${file.data}', '_blank')">
                  ` : `
                    <div class="w-16 h-16 bg-purple-100 rounded flex items-center justify-center">
                      <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  `}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-slate-900 truncate">${file.name}</p>
                  <p class="text-xs text-slate-500">${sizeKB} KB</p>
                </div>
                <a href="${file.data}" download="${file.name}" class="flex-shrink-0 p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all" title="Download">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                </a>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
  }

  // -------------------------
  // Render Comments
  // -------------------------
  function renderComments() {
    const commentsList = document.getElementById('comments-list');
    const noComments = document.getElementById('no-comments');
    const commentCount = document.getElementById('comment-count');

    commentCount.textContent = `(${comments.length})`;

    if (comments.length === 0) {
      commentsList.innerHTML = '';
      noComments.classList.remove('hidden');
      return;
    }

    noComments.classList.add('hidden');

    // Sort by newest first
    const sortedComments = [...comments].sort((a, b) => b.timestamp - a.timestamp);

    commentsList.innerHTML = sortedComments.map(comment => `
      <div class="comment-item border-l-4 border-purple-300 pl-4 py-3 bg-slate-50 rounded-r-lg" data-comment-id="${comment.id}">
        <div class="flex items-start justify-between mb-2">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
              ${comment.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <p class="font-semibold text-slate-900">${comment.author}</p>
              <p class="text-xs text-slate-500">${timeAgo(comment.timestamp)}</p>
            </div>
          </div>
          ${comment.author === auth.getUserName() ? `
            <button class="delete-comment text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all" data-comment-id="${comment.id}">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          ` : ''}
        </div>
        <p class="text-slate-700 whitespace-pre-wrap">${comment.text}</p>
        
        <!-- Reply button (for future feature) -->
        <button class="reply-btn mt-2 text-sm text-purple-600 hover:text-purple-700 font-semibold" data-comment-id="${comment.id}">
          Reply
        </button>
      </div>
    `).join('');

    // Add delete handlers
    document.querySelectorAll('.delete-comment').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const commentId = parseInt(e.currentTarget.dataset.commentId);
        deleteComment(commentId);
      });
    });
  }

  // -------------------------
  // Add Comment
  // -------------------------
  const commentInput = document.getElementById('comment-input');
  const postCommentBtn = document.getElementById('post-comment');
  const cancelCommentBtn = document.getElementById('cancel-comment');

  postCommentBtn.addEventListener('click', () => {
    const text = commentInput.value.trim();
    
    if (!text) {
      alert('Please enter a comment');
      return;
    }

    const newComment = {
      id: Date.now(),
      noteId: noteId,
      author: auth.getUserName() || 'Anonymous',
      text: text,
      timestamp: new Date(),
      replies: []
    };

    comments.push(newComment);
    saveComments(comments);
    
    commentInput.value = '';
    renderComments();
  });

  cancelCommentBtn.addEventListener('click', () => {
    commentInput.value = '';
  });

  // Enter to post (Ctrl+Enter)
  commentInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      postCommentBtn.click();
    }
  });

  // -------------------------
  // Delete Comment
  // -------------------------
  function deleteComment(commentId) {
    if (!confirm('Delete this comment?')) return;
    
    comments = comments.filter(c => c.id !== commentId);
    saveComments(comments);
    renderComments();
  }

  // -------------------------
  // Voting
  // -------------------------
  const upvoteBtn = document.getElementById('upvote-btn');
  const downvoteBtn = document.getElementById('downvote-btn');
  const ratingEl = document.getElementById('note-rating');

  upvoteBtn.addEventListener('click', () => {
    note.rating = (note.rating || 0) + 1;
    updateNoteRating();
  });

  downvoteBtn.addEventListener('click', () => {
    note.rating = (note.rating || 0) - 1;
    updateNoteRating();
  });

  function updateNoteRating() {
    ratingEl.textContent = note.rating;
    
    // Save to localStorage
    const notes = JSON.parse(localStorage.getItem('studentNotes') || '[]');
    const noteIndex = notes.findIndex(n => n.id === noteId);
    if (noteIndex !== -1) {
      notes[noteIndex].rating = note.rating;
      localStorage.setItem('studentNotes', JSON.stringify(notes));
    }
  }

  // -------------------------
  // Initial Render
  // -------------------------
  renderNote();
  renderComments();
});
