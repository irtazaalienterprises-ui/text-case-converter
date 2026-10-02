document.addEventListener('DOMContentLoaded', () => {
  const inputText = document.getElementById('inputText');

  const trimLinesBtn = document.getElementById('trimLinesBtn');
  const collapseSpacesBtn = document.getElementById('collapseSpacesBtn');
  const removeTabsBtn = document.getElementById('removeTabsBtn');
  const removeAllSpacesBtn = document.getElementById('removeAllSpacesBtn');
  const removeAllWhitespaceBtn = document.getElementById('removeAllWhitespaceBtn');

  const totalCharsEl = document.getElementById('totalChars');
  const totalWordsEl = document.getElementById('totalWords');
  const totalLinesEl = document.getElementById('totalLines');

  function updateStats() {
    const text = inputText ? inputText.value : '';
    const stats = calculateTextStats(text);
    if (totalCharsEl) totalCharsEl.textContent = stats.charsWithSpaces.toLocaleString();
    if (totalWordsEl) totalWordsEl.textContent = stats.words.toLocaleString();
    if (totalLinesEl) totalLinesEl.textContent = stats.lines.toLocaleString();
  }

  if (inputText) {
    inputText.addEventListener('input', updateStats);
  }

  function applyTransform(fn) {
    if (!inputText) return;
    inputText.value = fn(inputText.value);
    updateStats();
  }

  if (trimLinesBtn) {
    trimLinesBtn.addEventListener('click', () => {
      applyTransform(text => text.split('\n').map(line => line.trim()).join('\n'));
    });
  }

  if (collapseSpacesBtn) {
    collapseSpacesBtn.addEventListener('click', () => {
      applyTransform(text => text.replace(/[ \t]+/g, ' '));
    });
  }

  if (removeTabsBtn) {
    removeTabsBtn.addEventListener('click', () => {
      applyTransform(text => text.replace(/\t/g, ''));
    });
  }

  if (removeAllSpacesBtn) {
    removeAllSpacesBtn.addEventListener('click', () => {
      applyTransform(text => text.replace(/ /g, ''));
    });
  }

  if (removeAllWhitespaceBtn) {
    removeAllWhitespaceBtn.addEventListener('click', () => {
      applyTransform(text => text.replace(/\s/g, ''));
    });
  }

  const copyBtn = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const clearBtn = document.getElementById('clearBtn');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (inputText) copyToClipboard(inputText.value, copyBtn);
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (inputText) downloadTextFile('whitespace-removed.txt', inputText.value);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (inputText) {
        inputText.value = '';
        updateStats();
        inputText.focus();
      }
    });
  }

  updateStats();
});
