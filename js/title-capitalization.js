document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("titleTextInput");
    const outputText = document.getElementById("titleOutputText");

    const styleSelect = document.getElementById("titleStyleSelect");
    const btnApStyle = document.getElementById("apStyleBtn");
    const btnChicagoStyle = document.getElementById("chicagoStyleBtn");
    const btnAllCap = document.getElementById("allCapBtn");

    const copyBtn = document.getElementById("copyBtn");
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    const totalWordsEl = document.getElementById("totalWords");
    const titleWordsEl = document.getElementById("titleWords");
    const minorWordsEl = document.getElementById("minorWords");

    const minorWordsSet = new Set([
        'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from',
        'by', 'in', 'of', 'with', 'as', 'via', 'vs', 'v', 'so', 'yet'
    ]);

    function toApTitleCase(text) {
        if (!text) return "";
        const lines = text.split(/\r?\n/);

        const convertedLines = lines.map(line => {
            if (!line.trim()) return line;
            const words = line.split(/(\s+)/);

            let wordIndex = 0;
            const totalWordsInLine = words.filter(w => /\S/.test(w)).length;

            return words.map((word) => {
                if (!/\S/.test(word)) return word; // whitespace divider

                const cleanLower = word.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '');
                const isFirst = (wordIndex === 0);
                const isLast = (wordIndex === totalWordsInLine - 1);
                wordIndex++;

                if (!isFirst && !isLast && minorWordsSet.has(cleanLower)) {
                    return word.toLowerCase();
                }

                // Capitalize first letter of word or sub-words if hyphenated
                return word.toLowerCase().replace(/\b[a-zA-Z]/g, letter => letter.toUpperCase());
            }).join('');
        });

        return convertedLines.join('\n');
    }

    function toAllCapitalized(text) {
        if (!text) return "";
        return text.toLowerCase().replace(/\b[a-zA-Z]/g, char => char.toUpperCase());
    }

    function convertTitleStyle() {
        const text = textInput.value || "";
        const stats = calculateTextStats(text);

        if (!text) {
            outputText.value = "";
            if (totalWordsEl) totalWordsEl.textContent = "0";
            if (titleWordsEl) titleWordsEl.textContent = "0";
            if (minorWordsEl) minorWordsEl.textContent = "0";
            return;
        }

        const selectedStyle = styleSelect ? styleSelect.value : "ap";
        let result = "";

        switch (selectedStyle) {
            case "ap":
            case "chicago":
                result = toApTitleCase(text);
                break;
            case "all":
                result = toAllCapitalized(text);
                break;
            case "upper":
                result = text.toUpperCase();
                break;
            case "lower":
                result = text.toLowerCase();
                break;
            default:
                result = toApTitleCase(text);
        }

        outputText.value = result;

        // Statistics calculation
        const wordsArr = text.toLowerCase().match(/\b[a-z'-]+\b/gi) || [];
        let minorCount = 0;
        wordsArr.forEach(w => {
            if (minorWordsSet.has(w)) minorCount++;
        });

        if (totalWordsEl) totalWordsEl.textContent = stats.words;
        if (titleWordsEl) titleWordsEl.textContent = Math.max(0, stats.words - minorCount);
        if (minorWordsEl) minorWordsEl.textContent = minorCount;
    }

    if (styleSelect) styleSelect.addEventListener("change", convertTitleStyle);

    if (btnApStyle) {
        btnApStyle.addEventListener("click", () => {
            if (styleSelect) styleSelect.value = "ap";
            convertTitleStyle();
        });
    }

    if (btnChicagoStyle) {
        btnChicagoStyle.addEventListener("click", () => {
            if (styleSelect) styleSelect.value = "chicago";
            convertTitleStyle();
        });
    }

    if (btnAllCap) {
        btnAllCap.addEventListener("click", () => {
            if (styleSelect) styleSelect.value = "all";
            convertTitleStyle();
        });
    }

    textInput.addEventListener("input", convertTitleStyle);

    copyBtn.addEventListener("click", () => {
        copyToClipboard(outputText.value || textInput.value, copyBtn);
    });

    clearBtn.addEventListener("click", () => {
        textInput.value = "";
        outputText.value = "";
        convertTitleStyle();
        textInput.focus();
    });

    downloadBtn.addEventListener("click", () => {
        downloadTextFile("title-capitalized.txt", outputText.value || textInput.value);
    });

    convertTitleStyle();
});
