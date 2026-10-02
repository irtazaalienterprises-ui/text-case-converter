document.addEventListener('DOMContentLoaded', () => {
  const inputText = document.getElementById('inputText');
  const urlSafeCheck = document.getElementById('urlSafe');
  const encodeBtn = document.getElementById('encodeBtn');
  const totalCharsEl = document.getElementById('totalChars');

  function updateStats() {
    const text = inputText ? inputText.value : '';
    const stats = calculateTextStats(text);
    if (totalCharsEl) totalCharsEl.textContent = stats.charsWithSpaces.toLocaleString();
  }

  function encodeUtf8ToBase64(str) {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
      return '';
    }
  }

  function doEncode() {
    if (!inputText) return;
    const text = inputText.value;
    if (!text) {
      updateStats();
      return;
    }
    let encoded = encodeUtf8ToBase64(text);
    if (urlSafeCheck && urlSafeCheck.checked) {
      encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    inputText.value = encoded;
    updateStats();
  }

  const copyBtn = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const clearBtn = document.getElementById('clearBtn');

  if (inputText) inputText.addEventListener('input', updateStats);
  if (encodeBtn) encodeBtn.addEventListener('click', doEncode);

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (inputText) copyToClipboard(inputText.value, copyBtn);
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (inputText) downloadTextFile('base64-encoded.txt', inputText.value);
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
