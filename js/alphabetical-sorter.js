document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("sorterTextInput");
    const outputText = document.getElementById("sorterOutputText");

    const btnAtoZ = document.getElementById("sortAtoZBtn");
    const btnZtoA = document.getElementById("sortZtoABtn");
    const btnLength = document.getElementById("sortByLengthBtn");
    const btnReverse = document.getElementById("reverseListBtn");

    const chkCaseInsensitive = document.getElementById("chkCaseInsensitive");
    const chkRemoveDuplicates = document.getElementById("chkRemoveDuplicates");
    const chkTrimLines = document.getElementById("chkTrimLines");
    const chkRemoveEmpty = document.getElementById("chkRemoveEmpty");

    const copyBtn = document.getElementById("copyBtn");
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    const inputLinesEl = document.getElementById("inputLines");
    const outputLinesEl = document.getElementById("outputLines");
    const duplicatesRemovedEl = document.getElementById("duplicatesRemoved");

    let currentSortMode = "atoz"; // default

    function sortLines() {
        const rawText = textInput.value || "";
        if (!rawText) {
            outputText.value = "";
            if (inputLinesEl) inputLinesEl.textContent = "0";
            if (outputLinesEl) outputLinesEl.textContent = "0";
            if (duplicatesRemovedEl) duplicatesRemovedEl.textContent = "0";
            return;
        }

        let lines = rawText.split(/\r?\n/);
        const origCount = lines.length;

        if (chkTrimLines && chkTrimLines.checked) {
            lines = lines.map(line => line.trim());
        }

        if (chkRemoveEmpty && chkRemoveEmpty.checked) {
            lines = lines.filter(line => line.length > 0);
        }

        let dupsRemoved = 0;
        if (chkRemoveDuplicates && chkRemoveDuplicates.checked) {
            const seen = new Set();
            const uniqueLines = [];
            lines.forEach(line => {
                const key = (chkCaseInsensitive && chkCaseInsensitive.checked) ? line.toLowerCase() : line;
                if (!seen.has(key)) {
                    seen.add(key);
                    uniqueLines.push(line);
                } else {
                    dupsRemoved++;
                }
            });
            lines = uniqueLines;
        }

        const isCaseInsensitive = chkCaseInsensitive ? chkCaseInsensitive.checked : true;

        switch (currentSortMode) {
            case "atoz":
                lines.sort((a, b) => {
                    const strA = isCaseInsensitive ? a.toLowerCase() : a;
                    const strB = isCaseInsensitive ? b.toLowerCase() : b;
                    return strA.localeCompare(strB);
                });
                break;

            case "ztoa":
                lines.sort((a, b) => {
                    const strA = isCaseInsensitive ? a.toLowerCase() : a;
                    const strB = isCaseInsensitive ? b.toLowerCase() : b;
                    return strB.localeCompare(strA);
                });
                break;

            case "length":
                lines.sort((a, b) => a.length - b.length);
                break;

            case "reverse":
                lines.reverse();
                break;

            default:
                lines.sort();
        }

        const resultText = lines.join("\n");
        outputText.value = resultText;

        if (inputLinesEl) inputLinesEl.textContent = origCount;
        if (outputLinesEl) outputLinesEl.textContent = lines.length;
        if (duplicatesRemovedEl) duplicatesRemovedEl.textContent = dupsRemoved;
    }

    function setActiveSortButton(activeBtn) {
        [btnAtoZ, btnZtoA, btnLength, btnReverse].forEach(btn => {
            if (btn && btn === activeBtn) {
                btn.classList.add("primary");
            } else if (btn) {
                btn.classList.remove("primary");
            }
        });
    }

    if (btnAtoZ) btnAtoZ.addEventListener("click", () => { currentSortMode = "atoz"; setActiveSortButton(btnAtoZ); sortLines(); });
    if (btnZtoA) btnZtoA.addEventListener("click", () => { currentSortMode = "ztoa"; setActiveSortButton(btnZtoA); sortLines(); });
    if (btnLength) btnLength.addEventListener("click", () => { currentSortMode = "length"; setActiveSortButton(btnLength); sortLines(); });
    if (btnReverse) btnReverse.addEventListener("click", () => { currentSortMode = "reverse"; setActiveSortButton(btnReverse); sortLines(); });

    [chkCaseInsensitive, chkRemoveDuplicates, chkTrimLines, chkRemoveEmpty].forEach(chk => {
        if (chk) chk.addEventListener("change", sortLines);
    });

    textInput.addEventListener("input", sortLines);

    copyBtn.addEventListener("click", () => {
        copyToClipboard(outputText.value || textInput.value, copyBtn);
    });

    clearBtn.addEventListener("click", () => {
        textInput.value = "";
        outputText.value = "";
        sortLines();
        textInput.focus();
    });

    downloadBtn.addEventListener("click", () => {
        downloadTextFile("sorted-list.txt", outputText.value || textInput.value);
    });

    sortLines();
});
