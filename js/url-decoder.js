document.addEventListener('DOMContentLoaded', () => {
  const inputText = document.getElementById('inputText');
  const decodeUrlBtn = document.getElementById('decodeUrlBtn');
  const encodeUrlBtn = document.getElementById('encodeUrlBtn');
  const alertBox = document.getElementById('alertBox');
  const totalCharsEl = document.getElementById('totalChars');

  function updateStats() {
    const text = inputText ? inputText.value : '';
    const stats = calculateTextStats(text);
    if (totalCharsEl) totalCharsEl.textContent = stats.charsWithSpaces.toLocaleString();
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
      const decoded = decodeURIComponent(text.replace(/\+/g, ' '));
      inputText.value = decoded;
      updateStats();
    } catch (e) {
      if (alertBox) {
        alertBox.style.display = 'block';
      }
    }
  }

  function doEncode() {
    if (!inputText) return;
    if (alertBox) alertBox.style.display = 'none';

    const text = inputText.value;
    if (!text) {
      updateStats();
      return;
    }

    try {
      const encoded = encodeURIComponent(text);
      inputText.value = encoded;
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

  if (decodeUrlBtn) decodeUrlBtn.addEventListener('click', doDecode);
  if (encodeUrlBtn) encodeUrlBtn.addEventListener('click', doEncode);

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
      if (inputText) downloadTextFile('url-decoded-encoded.txt', inputText.value);
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
