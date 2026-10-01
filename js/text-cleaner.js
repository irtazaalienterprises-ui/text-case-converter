document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("cleanerTextInput");
    const outputText = document.getElementById("cleanerOutputText");

    const chkSpaces = document.getElementById("chkSpaces");
    const chkTrim = document.getElementById("chkTrim");
    const chkLineBreaks = document.getElementById("chkLineBreaks");
    const chkHtml = document.getElementById("chkHtml");
    const chkSymbols = document.getElementById("chkSymbols");
    const chkNumbers = document.getElementById("chkNumbers");

    const btnClean = document.getElementById("cleanTextBtn");
    const btnStripHtml = document.getElementById("stripHtmlBtn");
    const btnRemoveSpaces = document.getElementById("removeSpacesBtn");
    const btnRemoveBreaks = document.getElementById("removeBreaksBtn");

    const copyBtn = document.getElementById("copyBtn");
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    const origCharsEl = document.getElementById("origChars");
    const cleanCharsEl = document.getElementById("cleanChars");
    const charsRemovedEl = document.getElementById("charsRemoved");

    function cleanText() {
        let result = textInput.value || "";

        if (chkHtml && chkHtml.checked) {
            result = result.replace(/<[^>]*>?/gm, '');
        }

        if (chkSymbols && chkSymbols.checked) {
            result = result.replace(/[^a-zA-Z0-9\s]/g, '');
        }

        if (chkNumbers && chkNumbers.checked) {
            result = result.replace(/[0-9]/g, '');
        }

        if (chkSpaces && chkSpaces.checked) {
            result = result.replace(/[ \t]+/g, ' ');
        }

        if (chkLineBreaks && chkLineBreaks.checked) {
            result = result.replace(/\n\s*\n/g, '\n');
        }

        if (chkTrim && chkTrim.checked) {
            result = result.split('\n').map(line => line.trim()).join('\n').trim();
        }

        outputText.value = result;

        const origLen = textInput.value.length;
        const cleanLen = result.length;
        const removed = Math.max(0, origLen - cleanLen);

        if (origCharsEl) origCharsEl.textContent = origLen;
        if (cleanCharsEl) cleanCharsEl.textContent = cleanLen;
        if (charsRemovedEl) charsRemovedEl.textContent = removed;
    }

    [chkSpaces, chkTrim, chkLineBreaks, chkHtml, chkSymbols, chkNumbers].forEach(chk => {
        if (chk) chk.addEventListener("change", cleanText);
    });

    textInput.addEventListener("input", cleanText);

    if (btnClean) btnClean.addEventListener("click", cleanText);

    if (btnStripHtml) {
        btnStripHtml.addEventListener("click", () => {
            if (chkHtml) chkHtml.checked = true;
            cleanText();
        });
    }

    if (btnRemoveSpaces) {
        btnRemoveSpaces.addEventListener("click", () => {
            if (chkSpaces) chkSpaces.checked = true;
            if (chkTrim) chkTrim.checked = true;
            cleanText();
        });
    }

    if (btnRemoveBreaks) {
        btnRemoveBreaks.addEventListener("click", () => {
            if (chkLineBreaks) chkLineBreaks.checked = true;
            cleanText();
        });
    }

    copyBtn.addEventListener("click", () => {
        copyToClipboard(outputText.value || textInput.value, copyBtn);
    });

    clearBtn.addEventListener("click", () => {
        textInput.value = "";
        outputText.value = "";
        cleanText();
        textInput.focus();
    });

    downloadBtn.addEventListener("click", () => {
        downloadTextFile("cleaned-text.txt", outputText.value || textInput.value);
    });

    cleanText();
});
