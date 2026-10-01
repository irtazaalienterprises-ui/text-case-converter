document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("letterTextInput");

    const totalLettersEl = document.getElementById("totalLetters");
    const vowelsCountEl = document.getElementById("vowelsCount");
    const consonantsCountEl = document.getElementById("consonantsCount");
    const totalCharsEl = document.getElementById("totalChars");
    const totalWordsEl = document.getElementById("totalWords");
    const nonLettersCountEl = document.getElementById("nonLettersCount");

    const freqListEl = document.getElementById("letterFreqList");

    const copyBtn = document.getElementById("copyBtn");
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    function updateLetterStats() {
        const text = textInput.value || "";
        const stats = calculateTextStats(text);

        const lettersMatch = text.match(/[a-zA-Z]/g) || [];
        const totalLetters = lettersMatch.length;

        const vowelsMatch = text.match(/[aeiouAEIOU]/g) || [];
        const vowels = vowelsMatch.length;
        const consonants = Math.max(0, totalLetters - vowels);

        const nonLetters = text.length - totalLetters;

        totalLettersEl.textContent = totalLetters;
        vowelsCountEl.textContent = vowels;
        consonantsCountEl.textContent = consonants;
        totalCharsEl.textContent = stats.charsWithSpaces;
        totalWordsEl.textContent = stats.words;
        nonLettersCountEl.textContent = nonLetters;

        // Letter Frequency Analysis
        if (freqListEl) {
            const freqMap = {};
            lettersMatch.forEach(char => {
                const upper = char.toUpperCase();
                freqMap[upper] = (freqMap[upper] || 0) + 1;
            });

            const sortedEntries = Object.entries(freqMap).sort((a, b) => b[1] - a[1]);

            if (sortedEntries.length === 0) {
                freqListEl.innerHTML = '<p class="subtitle" style="text-align:left; margin:0;">Enter text above to see letter frequency analysis.</p>';
            } else {
                const maxCount = sortedEntries[0][1];
                freqListEl.innerHTML = sortedEntries.map(([letter, count]) => {
                    const pct = Math.round((count / totalLetters) * 100);
                    const barWidth = Math.max(10, Math.round((count / maxCount) * 100));
                    return `
                        <div class="freq-item">
                            <span class="freq-word" style="font-size:15px; font-weight:800;">${letter}</span>
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

    textInput.addEventListener("input", updateLetterStats);

    copyBtn.addEventListener("click", () => {
        copyToClipboard(textInput.value, copyBtn);
    });

    clearBtn.addEventListener("click", () => {
        textInput.value = "";
        updateLetterStats();
        textInput.focus();
    });

    downloadBtn.addEventListener("click", () => {
        downloadTextFile("letter-count-text.txt", textInput.value);
    });

    updateLetterStats();
});
