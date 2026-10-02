document.addEventListener('DOMContentLoaded', () => {
  const inputText = document.getElementById('inputText');
  const prefixInput = document.getElementById('prefixInput');
  const suffixInput = document.getElementById('suffixInput');
  const indentSpaces = document.getElementById('indentSpaces');

  const applyPrefixSuffixBtn = document.getElementById('applyPrefixSuffixBtn');
  const bulletListBtn = document.getElementById('bulletListBtn');
  const numberListBtn = document.getElementById('numberListBtn');
  const quoteLinesBtn = document.getElementById('quoteLinesBtn');
  const indentBtn = document.getElementById('indentBtn');

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

  function getLines() {
    return (inputText ? inputText.value : '').split('\n');
  }

  function setLines(linesArr) {
    if (inputText) {
      inputText.value = linesArr.join('\n');
      updateStats();
    }
  }

  if (applyPrefixSuffixBtn) {
    applyPrefixSuffixBtn.addEventListener('click', () => {
      const prefix = prefixInput ? prefixInput.value : '';
      const suffix = suffixInput ? suffixInput.value : '';
      const formatted = getLines().map(line => prefix + line + suffix);
      setLines(formatted);
    });
  }

  if (bulletListBtn) {
    bulletListBtn.addEventListener('click', () => {
      const formatted = getLines().map(line => line.trim() ? `• ${line.replace(/^[•\-\*]\s*/, '')}` : line);
      setLines(formatted);
    });
  }

  if (numberListBtn) {
    numberListBtn.addEventListener('click', () => {
      let count = 1;
      const formatted = getLines().map(line => {
        if (!line.trim()) return line;
        const clean = line.replace(/^\d+[\.\)]\s*/, '');
        return `${count++}. ${clean}`;
      });
      setLines(formatted);
    });
  }

  if (quoteLinesBtn) {
    quoteLinesBtn.addEventListener('click', () => {
      const formatted = getLines().map(line => line.trim() ? `> ${line.replace(/^>\s*/, '')}` : line);
      setLines(formatted);
    });
  }

  if (indentBtn) {
    indentBtn.addEventListener('click', () => {
      const count = parseInt(indentSpaces ? indentSpaces.value : '2', 10) || 2;
      const spaces = ' '.repeat(count);
      const formatted = getLines().map(line => line.trim() ? spaces + line : line);
      setLines(formatted);
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
      if (inputText) downloadTextFile('formatted-text.txt', inputText.value);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (inputText) {
        inputText.value = '';
        if (prefixInput) prefixInput.value = '';
        if (suffixInput) suffixInput.value = '';
        if (indentSpaces) indentSpaces.value = 0;
        updateStats();
        inputText.focus();
      }
    });
  }

  updateStats();
});
