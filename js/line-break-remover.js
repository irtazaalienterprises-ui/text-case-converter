document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("breakTextInput");
    const outputText = document.getElementById("breakOutputText");

    const delimiterRadios = document.querySelectorAll("input[name='delimiter']");
    const customDelimiterInput = document.getElementById("customDelimiterInput");
    const chkPreserveParagraphs = document.getElementById("chkPreserveParagraphs");

    const btnRemoveBreaks = document.getElementById("removeBreaksBtn");
    const copyBtn = document.getElementById("copyBtn");
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    const origLinesEl = document.getElementById("origLines");
    const newLinesEl = document.getElementById("newLines");
    const totalCharsEl = document.getElementById("totalChars");

    function getSelectedDelimiter() {
        let selected = "space";
        delimiterRadios.forEach(radio => {
            if (radio.checked) selected = radio.value;
        });

        switch (selected) {
            case "space": return " ";
            case "comma": return ", ";
            case "none": return "";
            case "custom": return customDelimiterInput ? customDelimiterInput.value : " ";
            default: return " ";
        }
    }

    function removeLineBreaks() {
        const rawText = textInput.value || "";
        if (!rawText) {
            outputText.value = "";
            if (origLinesEl) origLinesEl.textContent = "0";
            if (newLinesEl) newLinesEl.textContent = "0";
            if (totalCharsEl) totalCharsEl.textContent = "0";
            return;
        }

        const delimiter = getSelectedDelimiter();
        const preserveParagraphs = chkPreserveParagraphs ? chkPreserveParagraphs.checked : false;

        let result = "";

        if (preserveParagraphs) {
            // Split into paragraphs by 2 or more newlines
            const paragraphs = rawText.split(/\r?\n\s*\r?\n/);
            const processedParagraphs = paragraphs.map(para => {
                return para.split(/\r?\n/).map(line => line.trim()).filter(l => l.length > 0).join(delimiter);
            });
            result = processedParagraphs.join("\n\n");
        } else {
            const lines = rawText.split(/\r?\n/).map(line => line.trim()).filter(l => l.length > 0);
            result = lines.join(delimiter);
        }

        outputText.value = result;

        const origLinesCount = rawText.split(/\r?\n/).length;
        const newLinesCount = result ? result.split(/\r?\n/).length : 0;

        if (origLinesEl) origLinesEl.textContent = origLinesCount;
        if (newLinesEl) newLinesEl.textContent = newLinesCount;
        if (totalCharsEl) totalCharsEl.textContent = result.length;
    }

    delimiterRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            if (customDelimiterInput) {
                customDelimiterInput.disabled = (radio.value !== "custom");
            }
            removeLineBreaks();
        });
    });

    if (customDelimiterInput) customDelimiterInput.addEventListener("input", removeLineBreaks);
    if (chkPreserveParagraphs) chkPreserveParagraphs.addEventListener("change", removeLineBreaks);

    textInput.addEventListener("input", removeLineBreaks);

    if (btnRemoveBreaks) btnRemoveBreaks.addEventListener("click", removeLineBreaks);

    copyBtn.addEventListener("click", () => {
        copyToClipboard(outputText.value || textInput.value, copyBtn);
    });

    clearBtn.addEventListener("click", () => {
        textInput.value = "";
        outputText.value = "";
        removeLineBreaks();
        textInput.focus();
    });

    downloadBtn.addEventListener("click", () => {
        downloadTextFile("line-breaks-removed.txt", outputText.value || textInput.value);
    });

    removeLineBreaks();
});
