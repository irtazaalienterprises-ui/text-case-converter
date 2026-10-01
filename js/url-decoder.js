document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("urlDecodeInput");
    const outputText = document.getElementById("urlDecodeOutput");
    const alertBox = document.getElementById("alertBox");
    const queryParamsCard = document.getElementById("queryParamsCard");
    const queryParamsList = document.getElementById("queryParamsList");

    const copyBtn = document.getElementById("copyBtn");
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    const presetBtns = document.querySelectorAll(".pill-btn[data-preset]");

    const encodedCharsEl = document.getElementById("encodedChars");
    const decodedCharsEl = document.getElementById("decodedChars");
    const paramsCountEl = document.getElementById("paramsCount");

    function decodeUrl() {
        const rawInput = textInput.value.trim();
        if (alertBox) alertBox.classList.remove("show");
        if (queryParamsCard) queryParamsCard.style.display = "none";

        if (!rawInput) {
            outputText.value = "";
            if (encodedCharsEl) encodedCharsEl.textContent = "0";
            if (decodedCharsEl) decodedCharsEl.textContent = "0";
            if (paramsCountEl) paramsCountEl.textContent = "0";
            return;
        }

        try {
            // Replace plus signs with spaces if query string component
            const formattedInput = rawInput.replace(/\+/g, "%20");
            const decoded = decodeURIComponent(formattedInput);
            outputText.value = decoded;

            if (encodedCharsEl) encodedCharsEl.textContent = rawInput.length;
            if (decodedCharsEl) decodedCharsEl.textContent = decoded.length;

            // Query parameter breakdown check
            let queryString = "";
            if (decoded.includes("?")) {
                queryString = decoded.split("?")[1] || "";
            } else if (decoded.includes("=") || decoded.includes("&")) {
                queryString = decoded;
            }

            if (queryString) {
                const params = new URLSearchParams(queryString);
                const entries = Array.from(params.entries());

                if (paramsCountEl) paramsCountEl.textContent = entries.length;

                if (entries.length > 0 && queryParamsCard && queryParamsList) {
                    queryParamsCard.style.display = "block";
                    queryParamsList.innerHTML = entries.map(([key, value]) => `
                        <div class="freq-item" style="grid-template-columns: 140px 1fr;">
                            <span class="freq-word">${escapeHtml(key)}</span>
                            <span class="freq-count" style="text-align:left; color:var(--text); font-family:monospace;">${escapeHtml(value)}</span>
                        </div>
                    `).join("");
                }
            } else {
                if (paramsCountEl) paramsCountEl.textContent = "0";
            }
        } catch (err) {
            outputText.value = "";
            if (alertBox) alertBox.classList.add("show");
            if (encodedCharsEl) encodedCharsEl.textContent = "Invalid";
            if (decodedCharsEl) decodedCharsEl.textContent = "Invalid";
            if (paramsCountEl) paramsCountEl.textContent = "Invalid";
        }
    }

    function escapeHtml(str) {
        return str.replace(/[&<>"']/g, match => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        })[match]);
    }

    presetBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            textInput.value = btn.dataset.preset;
            decodeUrl();
        });
    });

    textInput.addEventListener("input", decodeUrl);

    copyBtn.addEventListener("click", () => {
        copyToClipboard(outputText.value, copyBtn);
    });

    clearBtn.addEventListener("click", () => {
        textInput.value = "";
        outputText.value = "";
        if (alertBox) alertBox.classList.remove("show");
        if (queryParamsCard) queryParamsCard.style.display = "none";
        decodeUrl();
        textInput.focus();
    });

    downloadBtn.addEventListener("click", () => {
        downloadTextFile("decoded-url-text.txt", outputText.value);
    });

    decodeUrl();
});
