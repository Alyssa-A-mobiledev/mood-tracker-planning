const form = document.getElementById('mood-form');
const moodSelect = document.getElementById('mood');
const noteInput = document.getElementById('note');
const entryList = document.getElementById('entry-list');

function loadEntries() {
  return JSON.parse(localStorage.getItem('moodEntries') || '[]');
}

function saveEntries(entries) {
  localStorage.setItem('moodEntries', JSON.stringify(entries));
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function renderEntries() {
  const entries = loadEntries();
  entryList.innerHTML = '';

  if (entries.length === 0) {
    entryList.innerHTML = '<li class="empty">No entries yet. Log your first mood above!</li>';
    return;
  }

  entries.forEach((entry, index) => {
    const li = document.createElement('li');
    li.className = 'entry';
    li.innerHTML = `
      <div class="entry-header">
        <span class="entry-mood">${entry.mood}</span>
        <span class="entry-date">${formatDate(entry.timestamp)}</span>
      </div>
      ${entry.note ? `<p class="entry-note">${entry.note}</p>` : ''}
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;
    entryList.appendChild(li);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const newEntry = {
    mood: moodSelect.value,
    note: noteInput.value.trim(),
    timestamp: new Date().toISOString(),
  };

  const entries = loadEntries();
  entries.unshift(newEntry);
  saveEntries(entries);
  renderEntries();

  form.reset();
});

entryList.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const index = parseInt(e.target.dataset.index);
    const entries = loadEntries();
    entries.splice(index, 1);
    saveEntries(entries);
    renderEntries();
  }
});

renderEntries();
