document.addEventListener("DOMContentLoaded", () => {
    const decimalInput = document.getElementById("decimalInput");
    const hexOutput = document.getElementById("hexOutput");
    const prefixSelect = document.getElementById("prefixSelect");
    const caseSelect = document.getElementById("caseSelect");
    const paddingSelect = document.getElementById("paddingSelect");
    const alertBox = document.getElementById("alertBox");

    const copyBtn = document.getElementById("copyHexBtn");
    const clearBtn = document.getElementById("clearBtn");
    const presetBtns = document.querySelectorAll(".pill-btn[data-decimal]");

    // Stats elements
    const inputDecStat = document.getElementById("inputDecStat");
    const outputHexStat = document.getElementById("outputHexStat");
    const outputBinaryStat = document.getElementById("outputBinaryStat");
    const byteCountStat = document.getElementById("byteCountStat");

    function convertDecimalToHex() {
        const rawInput = decimalInput.value.trim();
        alertBox.classList.remove("show");

        if (!rawInput) {
            hexOutput.value = "";
            if (inputDecStat) inputDecStat.textContent = "-";
            if (outputHexStat) outputHexStat.textContent = "-";
            if (outputBinaryStat) outputBinaryStat.textContent = "-";
            if (byteCountStat) byteCountStat.textContent = "-";
            return;
        }

        // Split by line or comma/whitespace for batch conversion support
        const tokens = rawInput.split(/[\s,]+/).filter(t => t.length > 0);
        const results = [];
        let hasError = false;
        let firstDec = null;
        let firstHex = null;
        let firstBin = null;
        let firstBytes = null;

        const prefix = prefixSelect ? prefixSelect.value : "0x";
        const isUpper = caseSelect ? caseSelect.value === "upper" : true;
        const padding = paddingSelect ? parseInt(paddingSelect.value, 10) : 0;

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            // Check if valid integer string (only non-negative digits)
            if (!/^\d+$/.test(token)) {
                hasError = true;
                break;
            }

            try {
                const bigNum = BigInt(token);
                let hexStr = bigNum.toString(16);

                if (padding > 0 && hexStr.length < padding) {
                    hexStr = hexStr.padStart(padding, "0");
                }

                if (isUpper) {
                    hexStr = hexStr.toUpperCase();
                } else {
                    hexStr = hexStr.toLowerCase();
                }

                const formattedHex = prefix + hexStr;
                results.push(formattedHex);

                if (i === 0) {
                    firstDec = token;
                    firstHex = formattedHex;

                    // Binary string representation for first number
                    try {
                        const binStr = bigNum.toString(2);
                        firstBin = binStr.length <= 32 ? binStr.padStart(Math.ceil(binStr.length / 8) * 8, "0") : binStr;
                    } catch {
                        firstBin = "N/A";
                    }

                    // Byte count
                    const byteLen = Math.ceil(hexStr.length / 2);
                    firstBytes = `${byteLen} ${byteLen === 1 ? "Byte" : "Bytes"}`;
                }
            } catch (err) {
                hasError = true;
                break;
            }
        }

        if (hasError) {
            alertBox.classList.add("show");
            hexOutput.value = "";
            if (inputDecStat) inputDecStat.textContent = "Invalid";
            if (outputHexStat) outputHexStat.textContent = "Invalid";
            if (outputBinaryStat) outputBinaryStat.textContent = "Invalid";
            if (byteCountStat) byteCountStat.textContent = "Invalid";
        } else {
            hexOutput.value = results.join("\n");
            if (inputDecStat) inputDecStat.textContent = firstDec || "-";
            if (outputHexStat) outputHexStat.textContent = firstHex || "-";
            if (outputBinaryStat) outputBinaryStat.textContent = firstBin || "-";
            if (byteCountStat) byteCountStat.textContent = firstBytes || "-";
        }
    }

    presetBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            decimalInput.value = btn.dataset.decimal;
            convertDecimalToHex();
        });
    });

    decimalInput.addEventListener("input", convertDecimalToHex);
    if (prefixSelect) prefixSelect.addEventListener("change", convertDecimalToHex);
    if (caseSelect) caseSelect.addEventListener("change", convertDecimalToHex);
    if (paddingSelect) paddingSelect.addEventListener("change", convertDecimalToHex);

    copyBtn.addEventListener("click", () => {
        copyToClipboard(hexOutput.value, copyBtn);
    });

    clearBtn.addEventListener("click", () => {
        decimalInput.value = "";
        hexOutput.value = "";
        alertBox.classList.remove("show");
        convertDecimalToHex();
        decimalInput.focus();
    });

    convertDecimalToHex();
});
