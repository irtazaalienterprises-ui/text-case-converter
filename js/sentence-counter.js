document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("sentenceTextInput");
    const totalSentencesEl = document.getElementById("totalSentences");
    const totalWordsEl = document.getElementById("totalWords");
    const totalCharsEl = document.getElementById("totalChars");
    const avgWordsPerSentenceEl = document.getElementById("avgWordsPerSentence");
    const avgCharsPerSentenceEl = document.getElementById("avgCharsPerSentence");
    const totalParagraphsEl = document.getElementById("totalParagraphs");

    const copyBtn = document.getElementById("copyBtn");
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    function updateSentenceStats() {
        const text = textInput.value;
        const stats = calculateTextStats(text);

        const avgWords = stats.sentences > 0 ? (stats.words / stats.sentences).toFixed(1) : "0";
        const avgChars = stats.sentences > 0 ? (stats.charsWithSpaces / stats.sentences).toFixed(1) : "0";

        totalSentencesEl.textContent = stats.sentences;
        totalWordsEl.textContent = stats.words;
        totalCharsEl.textContent = stats.charsWithSpaces;
        avgWordsPerSentenceEl.textContent = avgWords;
        avgCharsPerSentenceEl.textContent = avgChars;
        totalParagraphsEl.textContent = stats.paragraphs;
    }

    textInput.addEventListener("input", updateSentenceStats);

    copyBtn.addEventListener("click", () => {
        copyToClipboard(textInput.value, copyBtn);
    });

    clearBtn.addEventListener("click", () => {
        textInput.value = "";
        updateSentenceStats();
        textInput.focus();
    });

    downloadBtn.addEventListener("click", () => {
        downloadTextFile("sentence-counter-text.txt", textInput.value);
    });

    updateSentenceStats();
});
