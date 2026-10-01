document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("lineTextInput");

    const totalLinesEl = document.getElementById("totalLines");
    const nonEmptyLinesEl = document.getElementById("nonEmptyLines");
    const emptyLinesEl = document.getElementById("emptyLines");
    const totalCharsEl = document.getElementById("totalChars");
    const totalWordsEl = document.getElementById("totalWords");
    const avgCharsPerLineEl = document.getElementById("avgCharsPerLine");

    const btnRemoveEmpty = document.getElementById("removeEmptyLinesBtn");
    const btnNumberLines = document.getElementById("numberLinesBtn");

    const copyBtn = document.getElementById("copyBtn");
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    function updateLineStats() {
        const text = textInput.value || "";
        const stats = calculateTextStats(text);

        const linesArray = text ? text.split(/\r?\n/) : [];
        const totalLines = linesArray.length;
        const nonEmptyLines = linesArray.filter(line => line.trim().length > 0).length;
        const emptyLines = Math.max(0, totalLines - nonEmptyLines);

        const avgChars = totalLines > 0 ? (stats.charsWithSpaces / totalLines).toFixed(1) : "0";

        totalLinesEl.textContent = totalLines;
        nonEmptyLinesEl.textContent = nonEmptyLines;
        emptyLinesEl.textContent = emptyLines;
        totalCharsEl.textContent = stats.charsWithSpaces;
        totalWordsEl.textContent = stats.words;
        avgCharsPerLineEl.textContent = avgChars;
    }

    if (btnRemoveEmpty) {
        btnRemoveEmpty.addEventListener("click", () => {
            if (!textInput.value) return;
            const lines = textInput.value.split(/\r?\n/);
            textInput.value = lines.filter(line => line.trim().length > 0).join("\n");
            updateLineStats();
        });
    }

    if (btnNumberLines) {
        btnNumberLines.addEventListener("click", () => {
            if (!textInput.value) return;
            const lines = textInput.value.split(/\r?\n/);
            // Check if already numbered to toggle off or re-number
            const isNumbered = lines.every(line => /^\d+\.\s/.test(line));
            if (isNumbered) {
                textInput.value = lines.map(line => line.replace(/^\d+\.\s/, "")).join("\n");
            } else {
                textInput.value = lines.map((line, idx) => `${idx + 1}. ${line}`).join("\n");
            }
            updateLineStats();
        });
    }

    textInput.addEventListener("input", updateLineStats);

    copyBtn.addEventListener("click", () => {
        copyToClipboard(textInput.value, copyBtn);
    });

    clearBtn.addEventListener("click", () => {
        textInput.value = "";
        updateLineStats();
        textInput.focus();
    });

    downloadBtn.addEventListener("click", () => {
        downloadTextFile("line-count-text.txt", textInput.value);
    });

    updateLineStats();
});
