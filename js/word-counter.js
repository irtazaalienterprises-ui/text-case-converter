document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("wordTextInput");
    const totalWordsEl = document.getElementById("totalWords");
    const totalCharsEl = document.getElementById("totalChars");
    const charsNoSpacesEl = document.getElementById("charsNoSpaces");
    const uniqueWordsEl = document.getElementById("uniqueWords");
    const readingTimeEl = document.getElementById("readingTime");
    const totalParagraphsEl = document.getElementById("totalParagraphs");
    const freqListEl = document.getElementById("freqList");

    const copyBtn = document.getElementById("copyBtn");
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    function getWordFrequency(text, limit = 8) {
        const words = text.toLowerCase().match(/\b[a-z0-9'-]{2,}\b/gi);
        if (!words) return [];
        const freqMap = {};
        words.forEach(word => {
            freqMap[word] = (freqMap[word] || 0) + 1;
        });

        const totalCount = words.length;
        return Object.entries(freqMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([word, count]) => ({
                word,
                count,
                percentage: Math.round((count / totalCount) * 100)
            }));
    }

    function updateWordStats() {
        const text = textInput.value;
        const stats = calculateTextStats(text);

        // Unique words calculation
        const wordsArray = text.toLowerCase().match(/\b[a-z0-9'-]+\b/gi) || [];
        const uniqueWordsCount = new Set(wordsArray).size;

        // Reading time calculation (average 200 WPM)
        const minutes = stats.words / 200;
        let readingTimeStr = "0 sec";
        if (stats.words > 0) {
            if (minutes < 1) {
                const sec = Math.ceil(minutes * 60);
                readingTimeStr = `${sec} sec`;
            } else {
                const min = Math.floor(minutes);
                const sec = Math.round((minutes - min) * 60);
                readingTimeStr = sec > 0 ? `${min} min ${sec} sec` : `${min} min`;
            }
        }

        totalWordsEl.textContent = stats.words;
        totalCharsEl.textContent = stats.charsWithSpaces;
        charsNoSpacesEl.textContent = stats.charsNoSpaces;
        uniqueWordsEl.textContent = uniqueWordsCount;
        readingTimeEl.textContent = readingTimeStr;
        totalParagraphsEl.textContent = stats.paragraphs;

        // Update Frequency List
        if (freqListEl) {
            const freqData = getWordFrequency(text);
            if (freqData.length === 0) {
                freqListEl.innerHTML = '<p class="subtitle" style="text-align:left; margin:0;">Enter text above to see word frequency analysis.</p>';
            } else {
                const maxCount = freqData[0].count;
                freqListEl.innerHTML = freqData.map(item => {
                    const barWidth = Math.max(10, Math.round((item.count / maxCount) * 100));
                    return `
                        <div class="freq-item">
                            <span class="freq-word">${escapeHtml(item.word)}</span>
                            <div class="freq-bar-bg">
                                <div class="freq-bar-fill" style="width: ${barWidth}%"></div>
                            </div>
                            <span class="freq-count">${item.count} (${item.percentage}%)</span>
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

    textInput.addEventListener("input", updateWordStats);

    copyBtn.addEventListener("click", () => {
        copyToClipboard(textInput.value, copyBtn);
    });

    clearBtn.addEventListener("click", () => {
        textInput.value = "";
        updateWordStats();
        textInput.focus();
    });

    downloadBtn.addEventListener("click", () => {
        downloadTextFile("word-count-text.txt", textInput.value);
    });

    updateWordStats();
});
