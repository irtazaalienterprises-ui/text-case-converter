document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("charTextInput");
    const totalCharsEl = document.getElementById("totalChars");
    const charsNoSpacesEl = document.getElementById("charsNoSpaces");
    const totalWordsEl = document.getElementById("totalWords");
    const totalSentencesEl = document.getElementById("totalSentences");
    const totalParagraphsEl = document.getElementById("totalParagraphs");
    const totalLinesEl = document.getElementById("totalLines");

    // Breakdown elements
    const lettersCountEl = document.getElementById("lettersCount");
    const digitsCountEl = document.getElementById("digitsCount");
    const spacesCountEl = document.getElementById("spacesCount");
    const symbolsCountEl = document.getElementById("symbolsCount");

    // Action buttons
    const copyBtn = document.getElementById("copyBtn");
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    function updateCharacterStats() {
        const text = textInput.value;
        const stats = calculateTextStats(text);

        totalCharsEl.textContent = stats.charsWithSpaces;
        charsNoSpacesEl.textContent = stats.charsNoSpaces;
        totalWordsEl.textContent = stats.words;
        totalSentencesEl.textContent = stats.sentences;
        totalParagraphsEl.textContent = stats.paragraphs;
        totalLinesEl.textContent = stats.lines;

        // Detailed breakdown
        const letters = (text.match(/[a-zA-Z]/g) || []).length;
        const digits = (text.match(/[0-9]/g) || []).length;
        const spaces = (text.match(/\s/g) || []).length;
        const symbols = text.length - (letters + digits + spaces);

        if (lettersCountEl) lettersCountEl.textContent = letters;
        if (digitsCountEl) digitsCountEl.textContent = digits;
        if (spacesCountEl) spacesCountEl.textContent = spaces;
        if (symbolsCountEl) symbolsCountEl.textContent = symbols;
    }

    textInput.addEventListener("input", updateCharacterStats);

    copyBtn.addEventListener("click", () => {
        copyToClipboard(textInput.value, copyBtn);
    });

    clearBtn.addEventListener("click", () => {
        textInput.value = "";
        updateCharacterStats();
        textInput.focus();
    });

    downloadBtn.addEventListener("click", () => {
        downloadTextFile("character-count-text.txt", textInput.value);
    });

    updateCharacterStats();
});
