// Theme and Favorites Utilities

// Dark Mode Management
export class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.applyTheme();
  }

  applyTheme() {
    if (this.theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  toggle() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.theme);
    this.applyTheme();
    return this.theme;
  }

  isDark() {
    return this.theme === 'dark';
  }

  addToggleButton() {
    // Check if button already exists
    if (document.querySelector('.dark-mode-toggle')) return;

    const button = document.createElement('button');
    button.className = 'dark-mode-toggle';
    button.setAttribute('aria-label', 'Toggle dark mode');
    button.innerHTML = this.isDark() ? 
      `<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
      </svg>` :
      `<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
      </svg>`;

    button.addEventListener('click', () => {
      const newTheme = this.toggle();
      button.innerHTML = newTheme === 'dark' ?
        `<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>` :
        `<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
        </svg>`;
    });

    document.body.appendChild(button);
  }
}

// Favorites Management
export class FavoritesManager {
  constructor() {
    this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  }

  isFavorite(noteId) {
    return this.favorites.includes(noteId);
  }

  toggle(noteId) {
    if (this.isFavorite(noteId)) {
      this.favorites = this.favorites.filter(id => id !== noteId);
    } else {
      this.favorites.push(noteId);
    }
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
    return this.isFavorite(noteId);
  }

  getAll() {
    return this.favorites;
  }

  count() {
    return this.favorites.length;
  }

  addFavoriteButton(noteCard, noteId) {
    const button = document.createElement('button');
    button.className = `favorite-btn ${this.isFavorite(noteId) ? 'favorited' : ''}`;
    button.setAttribute('aria-label', 'Toggle favorite');
    button.innerHTML = `
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
      </svg>
    `;

    button.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent note card click
      const isFav = this.toggle(noteId);
      button.classList.toggle('favorited', isFav);
    });

    noteCard.appendChild(button);
  }
}

// Text Highlighting
export class HighlightManager {
  constructor() {
    this.highlights = JSON.parse(localStorage.getItem('highlights') || '{}');
  }

  saveHighlight(noteId, text, color = 'yellow') {
    if (!this.highlights[noteId]) {
      this.highlights[noteId] = [];
    }
    this.highlights[noteId].push({ text, color, timestamp: new Date() });
    localStorage.setItem('highlights', JSON.stringify(this.highlights));
  }

  getHighlights(noteId) {
    return this.highlights[noteId] || [];
  }

  applyHighlights(contentElement, noteId) {
    const highlights = this.getHighlights(noteId);
    if (highlights.length === 0) return;

    let html = contentElement.innerHTML;
    highlights.forEach(highlight => {
      const regex = new RegExp(`(${this.escapeRegex(highlight.text)})`, 'gi');
      html = html.replace(regex, `<mark style="background-color: ${highlight.color};">$1</mark>`);
    });
    contentElement.innerHTML = html;
  }

  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  enableHighlighting(contentElement, noteId) {
    contentElement.addEventListener('mouseup', () => {
      const selection = window.getSelection();
      const text = selection.toString().trim();
      
      if (text.length > 0) {
        const highlight = confirm(`Highlight: "${text}"?`);
        if (highlight) {
          this.saveHighlight(noteId, text);
          this.applyHighlights(contentElement, noteId);
          selection.removeAllRanges();
        }
      }
    });
  }
}
