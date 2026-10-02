document.addEventListener('DOMContentLoaded', () => {
  const inputText = document.getElementById('inputText');

  const encodeNamedBtn = document.getElementById('encodeNamedBtn');
  const encodeDecimalBtn = document.getElementById('encodeDecimalBtn');
  const encodeHexBtn = document.getElementById('encodeHexBtn');
  const decodeBtn = document.getElementById('decodeBtn');

  const totalCharsEl = document.getElementById('totalChars');
  const totalLinesEl = document.getElementById('totalLines');

  function updateStats() {
    const text = inputText ? inputText.value : '';
    const stats = calculateTextStats(text);
    if (totalCharsEl) totalCharsEl.textContent = stats.charsWithSpaces.toLocaleString();
    if (totalLinesEl) totalLinesEl.textContent = stats.lines.toLocaleString();
  }

  if (inputText) inputText.addEventListener('input', updateStats);

  const NAMED_MAP = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  if (encodeNamedBtn) {
    encodeNamedBtn.addEventListener('click', () => {
      if (!inputText) return;
      inputText.value = inputText.value.replace(/[&<>"']/g, match => NAMED_MAP[match]);
      updateStats();
    });
  }

  if (encodeDecimalBtn) {
    encodeDecimalBtn.addEventListener('click', () => {
      if (!inputText) return;
      inputText.value = inputText.value.replace(/[&<>"']/g, match => `&#${match.charCodeAt(0)};`);
      updateStats();
    });
  }

  if (encodeHexBtn) {
    encodeHexBtn.addEventListener('click', () => {
      if (!inputText) return;
      inputText.value = inputText.value.replace(/[&<>"']/g, match => `&#x${match.charCodeAt(0).toString(16).toUpperCase()};`);
      updateStats();
    });
  }

  if (decodeBtn) {
    decodeBtn.addEventListener('click', () => {
      if (!inputText) return;
      let text = inputText.value;
      text = text.replace(/&amp;/g, '&')
                 .replace(/&lt;/g, '<')
                 .replace(/&gt;/g, '>')
                 .replace(/&quot;/g, '"')
                 .replace(/&#39;/g, "'")
                 .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
                 .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
      inputText.value = text;
      updateStats();
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
      if (inputText) downloadTextFile('html-entities.txt', inputText.value);
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
