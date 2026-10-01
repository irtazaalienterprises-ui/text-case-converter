document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("base64DecodeInput");
    const outputText = document.getElementById("base64DecodeOutput");
    const alertBox = document.getElementById("alertBox");

    const copyBtn = document.getElementById("copyBtn");
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    const presetBtns = document.querySelectorAll(".pill-btn[data-preset]");

    const inputCharsEl = document.getElementById("inputChars");
    const decodedBytesEl = document.getElementById("decodedBytes");

    function base64ToUtf8(str) {
        let cleanStr = str.trim().replace(/-/g, '+').replace(/_/g, '/');
        while (cleanStr.length % 4 !== 0) {
            cleanStr += '=';
        }
        return decodeURIComponent(escape(atob(cleanStr)));
    }

    function decodeBase64() {
        const rawInput = textInput.value.trim();
        if (alertBox) alertBox.classList.remove("show");

        if (!rawInput) {
            outputText.value = "";
            if (inputCharsEl) inputCharsEl.textContent = "0";
            if (decodedBytesEl) decodedBytesEl.textContent = "0";
            return;
        }

        try {
            const decoded = base64ToUtf8(rawInput);
            outputText.value = decoded;

            const byteCount = new TextEncoder().encode(decoded).length;
            if (inputCharsEl) inputCharsEl.textContent = `${rawInput.length} Chars`;
            if (decodedBytesEl) decodedBytesEl.textContent = `${byteCount} Bytes`;
        } catch (err) {
            outputText.value = "";
            if (alertBox) alertBox.classList.add("show");
            if (inputCharsEl) inputCharsEl.textContent = "Invalid";
            if (decodedBytesEl) decodedBytesEl.textContent = "Invalid";
        }
    }

    presetBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            textInput.value = btn.dataset.preset;
            decodeBase64();
        });
    });

    textInput.addEventListener("input", decodeBase64);

    copyBtn.addEventListener("click", () => {
        copyToClipboard(outputText.value, copyBtn);
    });

    clearBtn.addEventListener("click", () => {
        textInput.value = "";
        outputText.value = "";
        if (alertBox) alertBox.classList.remove("show");
        decodeBase64();
        textInput.focus();
    });

    downloadBtn.addEventListener("click", () => {
        downloadTextFile("decoded-text.txt", outputText.value);
    });

    decodeBase64();
});
