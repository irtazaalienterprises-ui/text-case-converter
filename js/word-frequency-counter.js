document.addEventListener('DOMContentLoaded', () => {
  const inputText = document.getElementById('inputText');
  const ignoreStopWordsCheck = document.getElementById('ignoreStopWords');
  const caseSensitiveCheck = document.getElementById('caseSensitive');
  const totalWordsEl = document.getElementById('totalWords');
  const uniqueWordsEl = document.getElementById('uniqueWords');
  const freqListEl = document.getElementById('freqList');

  const STOP_WORDS = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot', 'could',
    'did', 'do', 'does', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
    'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how',
    'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me',
    'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our',
    'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'so', 'some', 'such',
    'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they',
    'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very',
    'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'where',
    'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours'
  ]);

  function analyzeFrequency() {
    const rawText = inputText ? inputText.value : '';
    const ignoreStopWords = ignoreStopWordsCheck ? ignoreStopWordsCheck.checked : false;
    const caseSensitive = caseSensitiveCheck ? caseSensitiveCheck.checked : false;

    if (!rawText.trim()) {
      if (totalWordsEl) totalWordsEl.textContent = '0';
      if (uniqueWordsEl) uniqueWordsEl.textContent = '0';
      if (freqListEl) freqListEl.innerHTML = '<p style="color:var(--text-muted);">Enter text above to see word frequency distribution.</p>';
      return;
    }

    const words = rawText.match(/[\w'-]+/g) || [];
    const totalWords = words.length;

    const freqMap = {};
    let filteredTotal = 0;

    words.forEach(w => {
      let key = caseSensitive ? w : w.toLowerCase();
      if (ignoreStopWords && STOP_WORDS.has(key.toLowerCase())) {
        return;
      }
      freqMap[key] = (freqMap[key] || 0) + 1;
      filteredTotal++;
    });

    const sorted = Object.entries(freqMap).sort((a, b) => b[1] - a[1]);
    const uniqueCount = Object.keys(freqMap).length;

    if (totalWordsEl) totalWordsEl.textContent = totalWords.toLocaleString();
    if (uniqueWordsEl) uniqueWordsEl.textContent = uniqueCount.toLocaleString();

    if (!freqListEl) return;

    if (sorted.length === 0) {
      freqListEl.innerHTML = '<p style="color:var(--text-muted);">No words matched the selected filters.</p>';
      return;
    }

    const maxCount = sorted[0][1];
    let html = '<div style="display:flex; flex-direction:column; gap:0.6rem;">';

    sorted.slice(0, 50).forEach(([word, count]) => {
      const percentage = filteredTotal > 0 ? ((count / filteredTotal) * 100).toFixed(1) : 0;
      const barWidth = Math.max(5, Math.round((count / maxCount) * 100));

      html += `
        <div style="display:grid; grid-template-columns: 120px 60px 1fr 60px; align-items:center; gap:0.8rem; font-size:0.9rem;">
          <span style="font-weight:600; text-overflow:ellipsis; overflow:hidden; white-space:nowrap; color:white;">${word}</span>
          <span style="color:var(--primary); font-weight:600;">${count}x</span>
          <div style="background:rgba(255,255,255,0.1); height:8px; border-radius:4px; overflow:hidden;">
            <div style="width:${barWidth}%; background:var(--primary); height:100%;"></div>
          </div>
          <span style="color:var(--text-muted); font-size:0.85rem; text-align:right;">${percentage}%</span>
        </div>
      `;
    });

    html += '</div>';
    freqListEl.innerHTML = html;
  }

  if (inputText) inputText.addEventListener('input', analyzeFrequency);
  if (ignoreStopWordsCheck) ignoreStopWordsCheck.addEventListener('change', analyzeFrequency);
  if (caseSensitiveCheck) caseSensitiveCheck.addEventListener('change', analyzeFrequency);

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
      if (inputText) downloadTextFile('word-frequency-input.txt', inputText.value);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (inputText) {
        inputText.value = '';
        analyzeFrequency();
        inputText.focus();
      }
    });
  }

  analyzeFrequency();
});
