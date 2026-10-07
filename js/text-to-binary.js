/**
 * Text to Binary Converter JavaScript Logic
 * Encodes plain text and Unicode characters into 8-bit binary representations using UTF-8 byte encoding,
 * and decodes binary sequences back into text.
 */

document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("inputText");
    const outputText = document.getElementById("outputText");
    const modeSelect = document.getElementById("modeSelect");
    const delimiterSelect = document.getElementById("delimiterSelect");
    const inputLabel = document.getElementById("inputLabel");
    const outputLabel = document.getElementById("outputLabel");
    const alertBox = document.getElementById("alertBox");
    const alertMessage = document.getElementById("alertMessage");

    const copyBtn = document.getElementById("copyBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const swapBtn = document.getElementById("swapBtn");
    const clearBtn = document.getElementById("clearBtn");

    const statCharCount = document.getElementById("statCharCount");
    const statByteCount = document.getElementById("statByteCount");
    const statBitCount = document.getElementById("statBitCount");
    const statOnesZeros = document.getElementById("statOnesZeros");

    const presetButtons = document.querySelectorAll(".pill-btn[data-preset]");

    // UTF-8 Text to Binary Encoder
    function convertTextToBinary(text, delimiter) {
        if (!text) return "";
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        const binArray = Array.from(bytes).map(byte => byte.toString(2).padStart(8, "0"));

        let separator = " ";
        if (delimiter === "none") separator = "";
        else if (delimiter === "comma") separator = ", ";
        else if (delimiter === "dash") separator = "-";
        else if (delimiter === "newline") separator = "\n";

        return binArray.join(separator);
    }

    // Binary to UTF-8 Text Decoder
    function convertBinaryToText(binaryStr) {
        if (!binaryStr || !binaryStr.trim()) {
            return { text: "", valid: true, errorMessage: "" };
        }

        // Standardize delimiters (commas, dashes, newlines to spaces)
        let normalized = binaryStr.trim().replace(/[,\-\n\r]+/g, " ");
        let tokens = normalized.split(/\s+/).filter(Boolean);

        // If continuous unspaced binary string (e.g. 0100100001101001)
        if (tokens.length === 1 && tokens[0].length > 8 && tokens[0].length % 8 === 0 && /^[01]+$/.test(tokens[0])) {
            const rawStr = tokens[0];
            tokens = [];
            for (let i = 0; i < rawStr.length; i += 8) {
                tokens.push(rawStr.substring(i, i + 8));
            }
        }

        const bytes = [];
        let isValid = true;
        for (let token of tokens) {
            token = token.trim();
            if (!token) continue;
            if (!/^[01]{1,8}$/.test(token)) {
                isValid = false;
                break;
            }
            const val = parseInt(token, 2);
            if (isNaN(val) || val < 0 || val > 255) {
                isValid = false;
                break;
            }
            bytes.push(val);
        }

        if (!isValid || bytes.length === 0) {
            return {
                text: "",
                valid: false,
                errorMessage: "Invalid binary input. Please enter valid 8-bit binary numbers consisting only of 0s and 1s."
            };
        }

        try {
            const decoder = new TextDecoder("utf-8", { fatal: true });
            const decoded = decoder.decode(new Uint8Array(bytes));
            return { text: decoded, valid: true, errorMessage: "" };
        } catch (e) {
            // Fallback for non-strict UTF-8 sequences
            const decoded = String.fromCharCode(...bytes);
            return { text: decoded, valid: true, errorMessage: "" };
        }
    }

    // Main update function
    function processConversion() {
        const inputVal = inputText.value;
        const mode = modeSelect ? modeSelect.value : "textToBinary";
        const delimiter = delimiterSelect ? delimiterSelect.value : "space";

        if (!inputVal) {
            outputText.value = "";
            if (alertBox) alertBox.classList.remove("show");
            updateStats("", "", mode);
            return;
        }

        if (mode === "textToBinary") {
            if (alertBox) alertBox.classList.remove("show");
            const binaryResult = convertTextToBinary(inputVal, delimiter);
            outputText.value = binaryResult;
            updateStats(inputVal, binaryResult, "textToBinary");
        } else {
            const result = convertBinaryToText(inputVal);
            if (!result.valid) {
                outputText.value = "";
                if (alertBox && alertMessage) {
                    alertMessage.textContent = "⚠️ " + result.errorMessage;
                    alertBox.classList.add("show");
                }
                updateStats("", "", "binaryToText");
            } else {
                if (alertBox) alertBox.classList.remove("show");
                outputText.value = result.text;
                updateStats(result.text, inputVal, "binaryToText");
            }
        }
    }

    // Statistics calculator
    function updateStats(textVal, binaryVal, mode) {
        if (!textVal && !binaryVal) {
            if (statCharCount) statCharCount.textContent = "0";
            if (statByteCount) statByteCount.textContent = "0";
            if (statBitCount) statBitCount.textContent = "0";
            if (statOnesZeros) statOnesZeros.textContent = `${ones.toLocaleString()} / ${zeros.toLocaleString()}`;
        }

        const encoder = new TextEncoder();
        const bytes = encoder.encode(textVal);
        const charLen = textVal.length;
        const byteLen = bytes.length;
        const bitLen = byteLen * 8;

        // Count ones and zeros in the binary representation
        let rawBinStr = binaryVal.replace(/[^01]/g, "");
        if (!rawBinStr && textVal) {
            // Generate raw bin string for counting if not already available
            const bArr = Array.from(bytes).map(b => b.toString(2).padStart(8, "0"));
            rawBinStr = bArr.join("");
        }

        let ones = 0;
        let zeros = 0;
        for (let i = 0; i < rawBinStr.length; i++) {
            if (rawBinStr[i] === "1") ones++;
            else if (rawBinStr[i] === "0") zeros++;
        }

        if (statCharCount) statCharCount.textContent = charLen.toLocaleString();
        if (statByteCount) statByteCount.textContent = byteLen.toLocaleString();
        if (statBitCount) statBitCount.textContent = bitLen.toLocaleString();
        if (statOnesZeros) statOnesZeros.textContent = `${ones.toLocaleString()} / ${zeros.toLocaleString()}`;
    }

    // Event listeners for inputs and controls
    inputText.addEventListener("input", processConversion);
    if (delimiterSelect) delimiterSelect.addEventListener("change", processConversion);

    if (modeSelect) {
        modeSelect.addEventListener("change", () => {
            const mode = modeSelect.value;
            if (mode === "textToBinary") {
                if (inputLabel) inputLabel.textContent = "Text Input:";
                if (outputLabel) outputLabel.textContent = "Binary Output (8-bit bytes):";
                inputText.placeholder = "Type or paste text here to convert to binary... e.g. Hi";
                outputText.placeholder = "Binary code output will appear here...";
            } else {
                if (inputLabel) inputLabel.textContent = "Binary Input (0s and 1s):";
                if (outputLabel) outputLabel.textContent = "Decoded Text Output:";
                inputText.placeholder = "Type or paste binary code here... e.g. 01001000 01101001";
                outputText.placeholder = "Decoded text will appear here...";
            }
            processConversion();
        });
    }

    // Presets
    presetButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const presetVal = btn.getAttribute("data-preset");
            if (presetVal) {
                if (modeSelect && modeSelect.value !== "textToBinary") {
                    modeSelect.value = "textToBinary";
                    if (inputLabel) inputLabel.textContent = "Text Input:";
                    if (outputLabel) outputLabel.textContent = "Binary Output (8-bit bytes):";
                    inputText.placeholder = "Type or paste text here to convert to binary... e.g. Hi";
                    outputText.placeholder = "Binary code output will appear here...";
                }
                inputText.value = presetVal;
                processConversion();
            }
        });
    });

    // Copy Button
    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            if (typeof copyToClipboard === "function") {
                copyToClipboard(outputText.value, copyBtn);
            } else {
                navigator.clipboard.writeText(outputText.value);
            }
        });
    }

    // Download Button
    if (downloadBtn) {
        downloadBtn.addEventListener("click", () => {
            if (!outputText.value) return;
            const mode = modeSelect ? modeSelect.value : "textToBinary";
            const filename = mode === "textToBinary" ? "text-to-binary-output.txt" : "binary-decoded-text.txt";
            if (typeof downloadTextFile === "function") {
                downloadTextFile(filename, outputText.value);
            }
        });
    }

    // Swap Button
    if (swapBtn) {
        swapBtn.addEventListener("click", () => {
            const currentInput = inputText.value;
            const currentOutput = outputText.value;
            const currentMode = modeSelect ? modeSelect.value : "textToBinary";

            if (currentMode === "textToBinary") {
                modeSelect.value = "binaryToText";
                if (inputLabel) inputLabel.textContent = "Binary Input (0s and 1s):";
                if (outputLabel) outputLabel.textContent = "Decoded Text Output:";
                inputText.placeholder = "Type or paste binary code here... e.g. 01001000 01101001";
                outputText.placeholder = "Decoded text will appear here...";
                inputText.value = currentOutput;
            } else {
                modeSelect.value = "textToBinary";
                if (inputLabel) inputLabel.textContent = "Text Input:";
                if (outputLabel) outputLabel.textContent = "Binary Output (8-bit bytes):";
                inputText.placeholder = "Type or paste text here to convert to binary... e.g. Hi";
                outputText.placeholder = "Binary code output will appear here...";
                inputText.value = currentOutput;
            }
            processConversion();
        });
    }

    // Clear Button
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            inputText.value = "";
            outputText.value = "";
            if (alertBox) alertBox.classList.remove("show");
            updateStats("", "", modeSelect ? modeSelect.value : "textToBinary");
            inputText.focus();
        });
    }
});
