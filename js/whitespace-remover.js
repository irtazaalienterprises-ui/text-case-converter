document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("spaceTextInput");
    const outputText = document.getElementById("spaceOutputText");

    const chkAllSpaces = document.getElementById("chkAllSpaces");
    const chkExtraSpaces = document.getElementById("chkExtraSpaces");
    const chkTrimLines = document.getElementById("chkTrimLines");
    const chkEmptyLines = document.getElementById("chkEmptyLines");
    const chkTabs = document.getElementById("chkTabs");

    const btnAllSpaces = document.getElementById("removeAllSpacesBtn");
    const btnCollapseSpaces = document.getElementById("collapseSpacesBtn");
    const btnTrimLines = document.getElementById("trimLinesBtn");

    const copyBtn = document.getElementById("copyBtn");
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    const origCharsEl = document.getElementById("origChars");
    const cleanCharsEl = document.getElementById("cleanChars");
    const spacesRemovedEl = document.getElementById("spacesRemoved");

    function removeWhitespace() {
        let text = textInput.value || "";
        const origLen = text.length;

        if (chkAllSpaces && chkAllSpaces.checked) {
            text = text.replace(/\s+/g, '');
        } else {
            if (chkTabs && chkTabs.checked) {
                text = text.replace(/\t/g, '');
            }

            if (chkExtraSpaces && chkExtraSpaces.checked) {
                text = text.replace(/[ \t]+/g, ' ');
            }

            if (chkEmptyLines && chkEmptyLines.checked) {
                text = text.replace(/\n\s*\n/g, '\n');
            }

            if (chkTrimLines && chkTrimLines.checked) {
                text = text.split('\n').map(line => line.trim()).join('\n').trim();
            }
        }

        outputText.value = text;

        const cleanLen = text.length;
        const removed = Math.max(0, origLen - cleanLen);

        if (origCharsEl) origCharsEl.textContent = origLen;
        if (cleanCharsEl) cleanCharsEl.textContent = cleanLen;
        if (spacesRemovedEl) spacesRemovedEl.textContent = removed;
    }

    [chkAllSpaces, chkExtraSpaces, chkTrimLines, chkEmptyLines, chkTabs].forEach(chk => {
        if (chk) chk.addEventListener("change", removeWhitespace);
    });

    if (btnAllSpaces) {
        btnAllSpaces.addEventListener("click", () => {
            if (chkAllSpaces) chkAllSpaces.checked = true;
            removeWhitespace();
        });
    }

    if (btnCollapseSpaces) {
        btnCollapseSpaces.addEventListener("click", () => {
            if (chkAllSpaces) chkAllSpaces.checked = false;
            if (chkExtraSpaces) chkExtraSpaces.checked = true;
            if (chkTrimLines) chkTrimLines.checked = true;
            removeWhitespace();
        });
    }

    if (btnTrimLines) {
        btnTrimLines.addEventListener("click", () => {
            if (chkTrimLines) chkTrimLines.checked = true;
            removeWhitespace();
        });
    }

    textInput.addEventListener("input", removeWhitespace);

    copyBtn.addEventListener("click", () => {
        copyToClipboard(outputText.value || textInput.value, copyBtn);
    });

    clearBtn.addEventListener("click", () => {
        textInput.value = "";
        outputText.value = "";
        removeWhitespace();
        textInput.focus();
    });

    downloadBtn.addEventListener("click", () => {
        downloadTextFile("whitespace-removed.txt", outputText.value || textInput.value);
    });

    removeWhitespace();
});
