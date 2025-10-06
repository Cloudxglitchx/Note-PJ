import { SimpleAuth } from './auth-simple.js';

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------
  // Authentication
  // -------------------------
  const auth = new SimpleAuth();
  if (!auth.requireAuth()) return;

  // -------------------------
  // DOM Elements
  // -------------------------
  const noteTitle = document.getElementById('note-title');
  const noteContent = document.getElementById('note-content');
  const docTitleDisplay = document.getElementById('doc-title-display');
  const wordCount = document.getElementById('word-count');
  const saveDraftBtn = document.getElementById('save-draft-btn');
  const publishBtn = document.getElementById('publish-btn');
  const metadataPanel = document.getElementById('metadata-panel');
  const closePanel = document.getElementById('close-panel');
  const lessonSelect = document.getElementById('lesson-select');
  const subjectInput = document.getElementById('subject-input');
  const addResourceMeta = document.getElementById('add-resource-meta');
  const resourcesList = document.getElementById('resources-list');
  const fileDropZone = document.getElementById('file-drop-zone');
  const fileInput = document.getElementById('file-input');
  const fileList = document.getElementById('file-list');

  // Toolbar buttons
  const boldBtn = document.getElementById('bold-btn');
  const italicBtn = document.getElementById('italic-btn');
  const underlineBtn = document.getElementById('underline-btn');
  const fontSizeSelect = document.getElementById('font-size');
  const bulletBtn = document.getElementById('bullet-btn');
  const numberBtn = document.getElementById('number-btn');

  // -------------------------
  // State
  // -------------------------
  let autoSaveTimer;
  let isDirty = false;
  let uploadedFiles = [];

  // -------------------------
  // Load Draft
  // -------------------------
  function loadDraft() {
    const draft = localStorage.getItem('noteDraft');
    if (draft) {
      const data = JSON.parse(draft);
      noteTitle.value = data.title || '';
      noteContent.value = data.content || '';
      subjectInput.value = data.subject || '';
      updateWordCount();
      updateTitle();
    }
  }

  // -------------------------
  // Auto-save Draft
  // -------------------------
  function saveDraft() {
    const draft = {
      title: noteTitle.value,
      content: noteContent.value,
      subject: subjectInput.value,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem('noteDraft', JSON.stringify(draft));
    isDirty = false;
    
    // Show saved indicator
    saveDraftBtn.textContent = 'Saved ✓';
    setTimeout(() => {
      saveDraftBtn.textContent = 'Save Draft';
    }, 2000);
  }

  // -------------------------
  // Update Word Count
  // -------------------------
  function updateWordCount() {
    const text = noteContent.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = text.length;
    wordCount.textContent = `${words} words • ${chars} characters`;
  }

  // -------------------------
  // Update Title Display
  // -------------------------
  function updateTitle() {
    const title = noteTitle.value.trim();
    docTitleDisplay.textContent = title || 'Untitled Note';
  }

  // -------------------------
  // Populate Lesson Dropdown
  // -------------------------
  function populateLessons() {
    const lessons = JSON.parse(localStorage.getItem('lessons') || '[]');
    lessonSelect.innerHTML = '<option value="">Select a lesson...</option>';
    lessons.forEach(lesson => {
      const option = document.createElement('option');
      option.value = lesson.id;
      option.textContent = `${lesson.title} (${new Date(lesson.date).toLocaleDateString()})`;
      lessonSelect.appendChild(option);
    });
  }

  // -------------------------
  // Text Formatting (Basic)
  // -------------------------
  function insertFormatting(before, after = '') {
    const start = noteContent.selectionStart;
    const end = noteContent.selectionEnd;
    const text = noteContent.value;
    const selectedText = text.substring(start, end);
    
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    noteContent.value = newText;
    
    // Restore cursor position
    noteContent.selectionStart = start + before.length;
    noteContent.selectionEnd = end + before.length;
    noteContent.focus();
    
    isDirty = true;
  }

  // -------------------------
  // Event Listeners
  // -------------------------
  
  // Title changes
  noteTitle.addEventListener('input', () => {
    updateTitle();
    isDirty = true;
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(saveDraft, 2000);
  });

  // Content changes
  noteContent.addEventListener('input', () => {
    updateWordCount();
    isDirty = true;
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(saveDraft, 2000);
  });

  // Save draft button
  saveDraftBtn.addEventListener('click', saveDraft);

  // Publish button
  publishBtn.addEventListener('click', () => {
    metadataPanel.classList.remove('translate-x-full');
  });

  // Close metadata panel
  closePanel.addEventListener('click', () => {
    metadataPanel.classList.add('translate-x-full');
  });

  // Toolbar buttons
  boldBtn.addEventListener('click', () => insertFormatting('**', '**'));
  italicBtn.addEventListener('click', () => insertFormatting('*', '*'));
  underlineBtn.addEventListener('click', () => insertFormatting('_', '_'));
  
  bulletBtn.addEventListener('click', () => {
    const start = noteContent.selectionStart;
    const text = noteContent.value;
    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    noteContent.value = text.substring(0, lineStart) + '• ' + text.substring(lineStart);
    noteContent.selectionStart = noteContent.selectionEnd = start + 2;
    noteContent.focus();
  });

  numberBtn.addEventListener('click', () => {
    const start = noteContent.selectionStart;
    const text = noteContent.value;
    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    noteContent.value = text.substring(0, lineStart) + '1. ' + text.substring(lineStart);
    noteContent.selectionStart = noteContent.selectionEnd = start + 3;
    noteContent.focus();
  });

  // Font size
  fontSizeSelect.addEventListener('change', (e) => {
    noteContent.style.fontSize = e.target.value;
  });

  // Add resource
  let resourceCount = 1;
  addResourceMeta.addEventListener('click', () => {
    const newResource = document.createElement('div');
    newResource.className = 'flex gap-2';
    newResource.innerHTML = `
      <input type="text" placeholder="Resource name" 
        class="flex-1 px-3 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm resource-name">
      <input type="text" placeholder="Link" 
        class="flex-1 px-3 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm resource-link">
      <button type="button" class="remove-resource p-2 text-red-600 hover:bg-red-50 rounded-lg">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `;
    resourcesList.appendChild(newResource);
    
    newResource.querySelector('.remove-resource').addEventListener('click', () => {
      newResource.remove();
    });
    
    resourceCount++;
  });

  // Keyboard shortcuts
  noteContent.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          insertFormatting('**', '**');
          break;
        case 'i':
          e.preventDefault();
          insertFormatting('*', '*');
          break;
        case 'u':
          e.preventDefault();
          insertFormatting('_', '_');
          break;
        case 's':
          e.preventDefault();
          saveDraft();
          break;
      }
    }
  });

  // -------------------------
  // File Upload Handling
  // -------------------------
  
  // Click to upload
  fileDropZone.addEventListener('click', () => {
    fileInput.click();
  });

  // File input change
  fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
  });

  // Drag and drop
  fileDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileDropZone.classList.add('border-purple-500', 'bg-purple-50');
  });

  fileDropZone.addEventListener('dragleave', () => {
    fileDropZone.classList.remove('border-purple-500', 'bg-purple-50');
  });

  fileDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    fileDropZone.classList.remove('border-purple-500', 'bg-purple-50');
    handleFiles(e.dataTransfer.files);
  });

  function handleFiles(files) {
    Array.from(files).forEach(file => {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Max size is 5MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size,
          data: e.target.result // base64 data
        };

        uploadedFiles.push(fileData);
        renderFileList();
      };

      reader.readAsDataURL(file);
    });
  }

  function renderFileList() {
    if (uploadedFiles.length === 0) {
      fileList.innerHTML = '';
      return;
    }

    fileList.innerHTML = uploadedFiles.map(file => {
      const sizeKB = (file.size / 1024).toFixed(1);
      const isImage = file.type.startsWith('image/');
      
      return `
        <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div class="flex-shrink-0">
            ${isImage ? `
              <img src="${file.data}" alt="${file.name}" class="w-12 h-12 object-cover rounded">
            ` : `
              <div class="w-12 h-12 bg-purple-100 rounded flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
            `}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-900 truncate">${file.name}</p>
            <p class="text-xs text-slate-500">${sizeKB} KB</p>
          </div>
          <button type="button" class="remove-file flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all" data-file-id="${file.id}">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      `;
    }).join('');

    // Add remove handlers
    document.querySelectorAll('.remove-file').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const fileId = parseFloat(e.currentTarget.dataset.fileId);
        uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
        renderFileList();
      });
    });
  }

  // -------------------------
  // Publish Note
  // -------------------------
  document.getElementById('metadata-form').addEventListener('submit', (e) => {
    e.preventDefault();
    publishNote();
  });

  // Also allow publishing by clicking outside the form
  publishBtn.addEventListener('click', () => {
    // Wait a bit for panel to open, then user can fill metadata
    setTimeout(() => {
      // Auto-publish if they click publish again
      const publishConfirm = document.createElement('button');
      publishConfirm.textContent = 'Confirm & Publish';
      publishConfirm.className = 'w-full mt-4 bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition-all';
      publishConfirm.onclick = publishNote;
      
      const form = document.getElementById('metadata-form');
      if (!form.querySelector('button[type="button"]')) {
        form.appendChild(publishConfirm);
      }
    }, 100);
  });

  function publishNote() {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();
    
    if (!title) {
      alert('Please add a title to your note');
      noteTitle.focus();
      return;
    }
    
    if (!content) {
      alert('Please add some content to your note');
      noteContent.focus();
      return;
    }

    // Create snippet (first 150 characters)
    const snippet = content.substring(0, 150) + (content.length > 150 ? '...' : '');

    // Collect resources
    const resources = [];
    const resourceInputs = document.querySelectorAll('.resource-name');
    resourceInputs.forEach((input, index) => {
      const name = input.value.trim();
      const link = document.querySelectorAll('.resource-link')[index].value.trim() || '#';
      if (name) {
        resources.push({ name, link });
      }
    });

    // Create note object
    const newNote = {
      id: Date.now(),
      title,
      snippet,
      content,
      author: auth.getUserName() || 'Anonymous',
      timestamp: new Date(),
      rating: 0,
      comments: 0,
      resources,
      files: uploadedFiles, // Include uploaded files
      lessonId: lessonSelect.value ? parseInt(lessonSelect.value) : null,
      subject: subjectInput.value.trim() || null
    };

    // Load existing notes
    const notes = JSON.parse(localStorage.getItem('studentNotes') || '[]');
    notes.unshift(newNote);
    localStorage.setItem('studentNotes', JSON.stringify(notes));

    // Clear draft
    localStorage.removeItem('noteDraft');

    // Show success and redirect
    alert('Note published successfully!');
    window.location.href = 'index-simple.html';
  }

  // -------------------------
  // Prevent accidental navigation
  // -------------------------
  window.addEventListener('beforeunload', (e) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  // -------------------------
  // Initialize
  // -------------------------
  loadDraft();
  populateLessons();
  updateWordCount();
  noteTitle.focus();
});
