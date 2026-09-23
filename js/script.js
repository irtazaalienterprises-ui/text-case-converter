const textInput = document.getElementById("textInput");
const wordCount = document.getElementById("wordCount");
const charCount = document.getElementById("charCount");
const lineCount = document.getElementById("lineCount");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const downloadBtn = document.getElementById("downloadBtn");

function updateStats() {
    const text = textInput.value;

    const words = text.trim()
        ? text.trim().split(/\s+/).length
        : 0;

    const characters = text.length;

    const lines = text
        ? text.split(/\r?\n/).length
        : 0;

    wordCount.textContent = words;
    charCount.textContent = characters;
    lineCount.textContent = lines;
}

function toTitleCase(text) {
    return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

function toSentenceCase(text) {
    return text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s+\w)/g, match => match.toUpperCase());
}

function toCapitalizedCase(text) {
    return text
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
}

document.querySelectorAll("[data-case]").forEach(button => {
    button.addEventListener("click", () => {
        const value = textInput.value;

        switch (button.dataset.case) {
            case "upper":
                textInput.value = value.toUpperCase();
                break;

            case "lower":
                textInput.value = value.toLowerCase();
                break;

            case "title":
                textInput.value = toTitleCase(value);
                break;

            case "sentence":
                textInput.value = toSentenceCase(value);
                break;

            case "capitalized":
                textInput.value = toCapitalizedCase(value);
                break;
        }

        updateStats();
    });
});

copyBtn.addEventListener("click", async () => {
    if (!textInput.value) return;

    try {
        await navigator.clipboard.writeText(textInput.value);
        const original = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
            copyBtn.textContent = original;
        }, 1200);
    } catch {
        textInput.select();
        document.execCommand("copy");
    }
});

clearBtn.addEventListener("click", () => {
    textInput.value = "";
    updateStats();
    textInput.focus();
});

downloadBtn.addEventListener("click", () => {
    if (!textInput.value) return;

    const blob = new Blob([textInput.value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "converted-text.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
});

textInput.addEventListener("input", updateStats);

updateStats();
