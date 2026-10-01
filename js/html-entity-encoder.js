document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("entityTextInput");
    const outputText = document.getElementById("entityOutputText");

    const modeSelect = document.getElementById("entityModeSelect");
    const btnNamed = document.getElementById("namedEntityBtn");
    const btnDecimal = document.getElementById("decimalEntityBtn");
    const btnHex = document.getElementById("hexEntityBtn");

    const copyBtn = document.getElementById("copyBtn");
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    const presetBtns = document.querySelectorAll(".pill-btn[data-preset]");

    const origCharsEl = document.getElementById("origChars");
    const encodedCharsEl = document.getElementById("encodedChars");
    const entitiesCountEl = document.getElementById("entitiesCount");

    const namedEntityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };

    function encodeHtmlEntities() {
        const text = textInput.value || "";
        const mode = modeSelect ? modeSelect.value : "named";

        if (!text) {
            outputText.value = "";
            if (origCharsEl) origCharsEl.textContent = "0";
            if (encodedCharsEl) encodedCharsEl.textContent = "0";
            if (entitiesCountEl) entitiesCountEl.textContent = "0";
            return;
        }

        let result = "";
        let entityCount = 0;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const code = text.charCodeAt(i);

            if (mode === "named") {
                if (namedEntityMap[char]) {
                    result += namedEntityMap[char];
                    entityCount++;
                } else {
                    result += char;
                }
            } else if (mode === "decimal") {
                if (/[^a-zA-Z0-9\s]/.test(char)) {
                    result += `&#${code};`;
                    entityCount++;
                } else {
                    result += char;
                }
            } else if (mode === "hex") {
                if (/[^a-zA-Z0-9\s]/.test(char)) {
                    result += `&#x${code.toString(16).toUpperCase()};`;
                    entityCount++;
                } else {
                    result += char;
                }
            } else if (mode === "all") {
                result += `&#${code};`;
                entityCount++;
            }
        }

        outputText.value = result;

        if (origCharsEl) origCharsEl.textContent = text.length;
        if (encodedCharsEl) encodedCharsEl.textContent = result.length;
        if (entitiesCountEl) entitiesCountEl.textContent = entityCount;
    }

    if (modeSelect) modeSelect.addEventListener("change", encodeHtmlEntities);

    if (btnNamed) btnNamed.addEventListener("click", () => { if (modeSelect) modeSelect.value = "named"; encodeHtmlEntities(); });
    if (btnDecimal) btnDecimal.addEventListener("click", () => { if (modeSelect) modeSelect.value = "decimal"; encodeHtmlEntities(); });
    if (btnHex) btnHex.addEventListener("click", () => { if (modeSelect) modeSelect.value = "hex"; encodeHtmlEntities(); });

    presetBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            textInput.value = btn.dataset.preset;
            encodeHtmlEntities();
        });
    });

    textInput.addEventListener("input", encodeHtmlEntities);

    copyBtn.addEventListener("click", () => {
        copyToClipboard(outputText.value || textInput.value, copyBtn);
    });

    clearBtn.addEventListener("click", () => {
        textInput.value = "";
        outputText.value = "";
        encodeHtmlEntities();
        textInput.focus();
    });

    downloadBtn.addEventListener("click", () => {
        downloadTextFile("encoded-html-entities.txt", outputText.value || textInput.value);
    });

    encodeHtmlEntities();
});
