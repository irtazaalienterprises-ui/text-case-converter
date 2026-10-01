document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("reverserTextInput");
    const outputText = document.getElementById("reverserOutputText");

    const btnChars = document.getElementById("reverseCharsBtn");
    const btnWords = document.getElementById("reverseWordsBtn");
    const btnLines = document.getElementById("reverseLinesBtn");
    const btnFlip = document.getElementById("flipTextBtn");

    const copyBtn = document.getElementById("copyBtn");
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    const totalCharsEl = document.getElementById("totalChars");
    const totalWordsEl = document.getElementById("totalWords");
    const totalLinesEl = document.getElementById("totalLines");

    let currentMode = "chars"; // default

    const upsideDownMap = {
        'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ı',
        'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ',
        's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
        'A': '∀', 'B': '𐐒', 'C': 'Ɔ', 'D': '◖', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': '⅁', 'H': 'H', 'I': 'I',
        'J': 'ſ', 'K': '⋊', 'L': '⅂', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ', 'Q': 'Ό', 'R': 'ᴚ',
        'S': 'S', 'T': '⊥', 'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z',
        '0': '0', '1': '⇂', '2': '乙', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6',
        '.': '˙', ',': '\'', '\'': ',', '"': ',,', '?': '¿', '!': '¡', '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<', '_': '‾'
    };

    function flipString(str) {
        return str.split('').map(char => upsideDownMap[char] || char).reverse().join('');
    }

    function processReverse() {
        const text = textInput.value;
        const stats = calculateTextStats(text);

        totalCharsEl.textContent = stats.charsWithSpaces;
        totalWordsEl.textContent = stats.words;
        totalLinesEl.textContent = stats.lines;

        if (!text) {
            outputText.value = "";
            return;
        }

        switch (currentMode) {
            case "chars":
                outputText.value = text.split('').reverse().join('');
                break;
            case "words":
                outputText.value = text.split(/(\s+)/).reverse().join('');
                break;
            case "lines":
                outputText.value = text.split(/\r?\n/).reverse().join('\n');
                break;
            case "flip":
                outputText.value = flipString(text);
                break;
            default:
                outputText.value = text.split('').reverse().join('');
        }
    }

    function setActiveModeButton(activeBtn) {
        [btnChars, btnWords, btnLines, btnFlip].forEach(btn => {
            if (btn === activeBtn) {
                btn.classList.add("primary");
            } else {
                btn.classList.remove("primary");
            }
        });
    }

    if (btnChars) btnChars.addEventListener("click", () => { currentMode = "chars"; setActiveModeButton(btnChars); processReverse(); });
    if (btnWords) btnWords.addEventListener("click", () => { currentMode = "words"; setActiveModeButton(btnWords); processReverse(); });
    if (btnLines) btnLines.addEventListener("click", () => { currentMode = "lines"; setActiveModeButton(btnLines); processReverse(); });
    if (btnFlip) btnFlip.addEventListener("click", () => { currentMode = "flip"; setActiveModeButton(btnFlip); processReverse(); });

    textInput.addEventListener("input", processReverse);

    copyBtn.addEventListener("click", () => {
        copyToClipboard(outputText.value || textInput.value, copyBtn);
    });

    clearBtn.addEventListener("click", () => {
        textInput.value = "";
        outputText.value = "";
        processReverse();
        textInput.focus();
    });

    downloadBtn.addEventListener("click", () => {
        downloadTextFile("reversed-text.txt", outputText.value || textInput.value);
    });

    processReverse();
});
