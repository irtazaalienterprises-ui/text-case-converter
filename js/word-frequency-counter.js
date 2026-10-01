document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("freqTextInput");
    const minLengthInput = document.getElementById("minLengthInput");
    const chkStopWords = document.getElementById("chkStopWords");
    const sortSelect = document.getElementById("freqSortSelect");

    const totalWordsEl = document.getElementById("totalWords");
    const uniqueWordsEl = document.getElementById("uniqueWords");
    const avgWordLengthEl = document.getElementById("avgWordLength");
    const freqTableListEl = document.getElementById("freqTableList");

    const copyBtn = document.getElementById("copyBtn");
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    const stopWordsSet = new Set([
        'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he',
        'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
        'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about',
        'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
        'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then',
        'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our',
        'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
    ]);

    function analyzeWordFrequency() {
        const text = textInput.value || "";
        const minLen = minLengthInput ? (parseInt(minLengthInput.value, 10) || 1) : 1;
        const ignoreStopWords = chkStopWords ? chkStopWords.checked : false;
        const sortMode = sortSelect ? sortSelect.value : "freq_desc";

        const wordsMatch = text.toLowerCase().match(/\b[a-z0-9'-]+\b/gi) || [];
        const totalWords = wordsMatch.length;

        let filteredWords = wordsMatch.filter(word => {
            const clean = word.replace(/^[-']+|[-']+$/g, '');
            if (clean.length < minLen) return false;
            if (ignoreStopWords && stopWordsSet.has(clean)) return false;
            return true;
        });

        const uniqueWords = new Set(filteredWords).size;

        let totalWordLengthSum = 0;
        wordsMatch.forEach(w => totalWordLengthSum += w.length);
        const avgWordLen = totalWords > 0 ? (totalWordLengthSum / totalWords).toFixed(1) : "0";

        if (totalWordsEl) totalWordsEl.textContent = totalWords;
        if (uniqueWordsEl) uniqueWordsEl.textContent = uniqueWords;
        if (avgWordLengthEl) avgWordLengthEl.textContent = avgWordLen;

        const freqMap = {};
        filteredWords.forEach(word => {
            freqMap[word] = (freqMap[word] || 0) + 1;
        });

        let entries = Object.entries(freqMap);

        if (sortMode === "freq_desc") {
            entries.sort((a, b) => b[1] - a[1]);
        } else if (sortMode === "freq_asc") {
            entries.sort((a, b) => a[1] - b[1]);
        } else if (sortMode === "alpha") {
            entries.sort((a, b) => a[0].localeCompare(b[0]));
        }

        if (freqTableListEl) {
            if (entries.length === 0) {
                freqTableListEl.innerHTML = '<p class="subtitle" style="text-align:left; margin:0;">Enter text above to generate word frequency analysis.</p>';
            } else {
                const maxCount = Math.max(...entries.map(e => e[1]));
                freqTableListEl.innerHTML = entries.map(([word, count]) => {
                    const pct = Math.round((count / (filteredWords.length || 1)) * 100);
                    const barWidth = Math.max(10, Math.round((count / maxCount) * 100));
                    return `
                        <div class="freq-item">
                            <span class="freq-word">${escapeHtml(word)}</span>
                            <div class="freq-bar-bg">
                                <div class="freq-bar-fill" style="width: ${barWidth}%"></div>
                            </div>
                            <span class="freq-count">${count} (${pct}%)</span>
                        </div>
                    `;
                }).join("");
            }
        }
    }

    function escapeHtml(str) {
        return str.replace(/[&<>"']/g, match => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        })[match]);
    }

    if (minLengthInput) minLengthInput.addEventListener("input", analyzeWordFrequency);
    if (chkStopWords) chkStopWords.addEventListener("change", analyzeWordFrequency);
    if (sortSelect) sortSelect.addEventListener("change", analyzeWordFrequency);

    textInput.addEventListener("input", analyzeWordFrequency);

    copyBtn.addEventListener("click", () => {
        copyToClipboard(textInput.value, copyBtn);
    });

    clearBtn.addEventListener("click", () => {
        textInput.value = "";
        analyzeWordFrequency();
        textInput.focus();
    });

    downloadBtn.addEventListener("click", () => {
        downloadTextFile("word-frequency-analysis.txt", textInput.value);
    });

    analyzeWordFrequency();
});
