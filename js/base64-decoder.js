document.addEventListener('DOMContentLoaded', () => {
  const inputText = document.getElementById('inputText');
  const decodeBtn = document.getElementById('decodeBtn');
  const alertBox = document.getElementById('alertBox');
  const totalCharsEl = document.getElementById('totalChars');

  function updateStats() {
    const text = inputText ? inputText.value : '';
    const stats = calculateTextStats(text);
    if (totalCharsEl) totalCharsEl.textContent = stats.charsWithSpaces.toLocaleString();
  }

  function decodeBase64ToUtf8(str) {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    return decodeURIComponent(escape(atob(base64)));
  }

  function doDecode() {
    if (!inputText) return;
    if (alertBox) alertBox.style.display = 'none';

    const text = inputText.value.trim();
    if (!text) {
      updateStats();
      return;
    }

    try {
      const decoded = decodeBase64ToUtf8(text);
      inputText.value = decoded;
      updateStats();
    } catch (e) {
      if (alertBox) {
        alertBox.style.display = 'block';
      }
    }
  }

  if (inputText) {
    inputText.addEventListener('input', () => {
      if (alertBox) alertBox.style.display = 'none';
      updateStats();
    });
  }

  const copyBtn = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const clearBtn = document.getElementById('clearBtn');

  if (decodeBtn) decodeBtn.addEventListener('click', doDecode);

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (inputText) copyToClipboard(inputText.value, copyBtn);
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (inputText) downloadTextFile('base64-decoded.txt', inputText.value);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (inputText) {
        inputText.value = '';
        if (alertBox) alertBox.style.display = 'none';
        updateStats();
        inputText.focus();
      }
    });
  }

  updateStats();
});
