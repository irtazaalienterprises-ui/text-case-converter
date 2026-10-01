document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("formatterTextInput");
    const outputText = document.getElementById("formatterOutputText");

    const linePrefixInput = document.getElementById("linePrefixInput");
    const lineSuffixInput = document.getElementById("lineSuffixInput");
    const indentSelect = document.getElementById("indentSelect");
    const spacingSelect = document.getElementById("spacingSelect");
    const chkParaCap = document.getElementById("chkParaCap");

    const btnBulletList = document.getElementById("bulletListBtn");
    const btnQuoteText = document.getElementById("quoteTextBtn");
    const btnIndentText = document.getElementById("indentTextBtn");

    const copyBtn = document.getElementById("copyBtn");
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    const totalWordsEl = document.getElementById("totalWords");
    const totalLinesEl = document.getElementById("totalLines");
    const totalCharsEl = document.getElementById("totalChars");

    function formatText() {
        let text = textInput.value || "";
        const stats = calculateTextStats(text);

        if (totalWordsEl) totalWordsEl.textContent = stats.words;
        if (totalLinesEl) totalLinesEl.textContent = stats.lines;
        if (totalCharsEl) totalCharsEl.textContent = stats.charsWithSpaces;

        if (!text) {
            outputText.value = "";
            return;
        }

        let lines = text.split(/\r?\n/);

        // Paragraph Capitalization
        if (chkParaCap && chkParaCap.checked) {
            lines = lines.map(line => {
                if (!line.trim()) return line;
                return line.replace(/(^\s*\w|[.!?]\s+\w)/g, match => match.toUpperCase());
            });
        }

        // Spacing adjustment
        const spacing = spacingSelect ? spacingSelect.value : "normal";
        if (spacing === "double") {
            lines = lines.map(line => line.replace(/([.!?])(\s+)/g, "$1  "));
        } else if (spacing === "single") {
            lines = lines.map(line => line.replace(/([.!?])\s{2,}/g, "$1 "));
        }

        // Line indentation
        const indent = indentSelect ? indentSelect.value : "none";
        let indentStr = "";
        if (indent === "2spaces") indentStr = "  ";
        else if (indent === "4spaces") indentStr = "    ";
        else if (indent === "tab") indentStr = "\t";

        // Line prefix & suffix
        const prefix = linePrefixInput ? linePrefixInput.value : "";
        const suffix = lineSuffixInput ? lineSuffixInput.value : "";

        lines = lines.map(line => {
            if (!line.trim() && !prefix && !suffix) return line;
            return indentStr + prefix + line + suffix;
        });

        outputText.value = lines.join("\n");
    }

    if (btnBulletList) {
        btnBulletList.addEventListener("click", () => {
            if (linePrefixInput) linePrefixInput.value = "• ";
            formatText();
        });
    }

    if (btnQuoteText) {
        btnQuoteText.addEventListener("click", () => {
            if (linePrefixInput) linePrefixInput.value = '"';
            if (lineSuffixInput) lineSuffixInput.value = '"';
            formatText();
        });
    }

    if (btnIndentText) {
        btnIndentText.addEventListener("click", () => {
            if (indentSelect) indentSelect.value = "4spaces";
            formatText();
        });
    }

    [linePrefixInput, lineSuffixInput, indentSelect, spacingSelect, chkParaCap].forEach(ctrl => {
        if (ctrl) {
            ctrl.addEventListener("input", formatText);
            ctrl.addEventListener("change", formatText);
        }
    });

    textInput.addEventListener("input", formatText);

    copyBtn.addEventListener("click", () => {
        copyToClipboard(outputText.value || textInput.value, copyBtn);
    });

    clearBtn.addEventListener("click", () => {
        textInput.value = "";
        outputText.value = "";
        if (linePrefixInput) linePrefixInput.value = "";
        if (lineSuffixInput) lineSuffixInput.value = "";
        formatText();
        textInput.focus();
    });

    downloadBtn.addEventListener("click", () => {
        downloadTextFile("formatted-text.txt", outputText.value || textInput.value);
    });

    formatText();
});
