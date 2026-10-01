document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("base64TextInput");
    const outputText = document.getElementById("base64OutputText");

    const formatSelect = document.getElementById("base64FormatSelect");
    const btnStandard = document.getElementById("standardBase64Btn");
    const btnUrlSafe = document.getElementById("urlSafeBase64Btn");

    const copyBtn = document.getElementById("copyBtn");
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    const presetBtns = document.querySelectorAll(".pill-btn[data-preset]");

    const origBytesEl = document.getElementById("origBytes");
    const encodedLengthEl = document.getElementById("encodedLength");

    function utf8ToBase64(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }

    function encodeBase64() {
        const text = textInput.value || "";
        const format = formatSelect ? formatSelect.value : "standard";

        if (!text) {
            outputText.value = "";
            if (origBytesEl) origBytesEl.textContent = "0";
            if (encodedLengthEl) encodedLengthEl.textContent = "0";
            return;
        }

        try {
            let encoded = utf8ToBase64(text);

            if (format === "urlsafe") {
                encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
            }

            outputText.value = encoded;

            const byteCount = new TextEncoder().encode(text).length;
            if (origBytesEl) origBytesEl.textContent = `${byteCount} Bytes`;
            if (encodedLengthEl) encodedLengthEl.textContent = `${encoded.length} Chars`;
        } catch (err) {
            outputText.value = "Encoding Error: Unable to encode text.";
        }
    }

    if (formatSelect) formatSelect.addEventListener("change", encodeBase64);

    if (btnStandard) btnStandard.addEventListener("click", () => { if (formatSelect) formatSelect.value = "standard"; encodeBase64(); });
    if (btnUrlSafe) btnUrlSafe.addEventListener("click", () => { if (formatSelect) formatSelect.value = "urlsafe"; encodeBase64(); });

    presetBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            textInput.value = btn.dataset.preset;
            encodeBase64();
        });
    });

    textInput.addEventListener("input", encodeBase64);

    copyBtn.addEventListener("click", () => {
        copyToClipboard(outputText.value || textInput.value, copyBtn);
    });

    clearBtn.addEventListener("click", () => {
        textInput.value = "";
        outputText.value = "";
        encodeBase64();
        textInput.focus();
    });

    downloadBtn.addEventListener("click", () => {
        downloadTextFile("encoded-base64.txt", outputText.value || textInput.value);
    });

    encodeBase64();
});
