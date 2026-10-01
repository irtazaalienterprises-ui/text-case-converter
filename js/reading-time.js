document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("readingTextInput");
    const wpmInput = document.getElementById("wpmInput");
    const readingTimeDisplayEl = document.getElementById("readingTimeDisplay");
    const speakingTimeDisplayEl = document.getElementById("speakingTimeDisplay");
    const totalWordsEl = document.getElementById("totalWords");
    const totalCharsEl = document.getElementById("totalChars");
    const pillBtns = document.querySelectorAll(".pill-btn[data-wpm]");

    const copyBtn = document.getElementById("copyBtn");
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    function formatTime(totalSeconds) {
        if (totalSeconds <= 0) return "0 sec";
        if (totalSeconds < 60) return `${Math.ceil(totalSeconds)} sec`;
        const mins = Math.floor(totalSeconds / 60);
        const secs = Math.round(totalSeconds % 60);
        return secs > 0 ? `${mins} min ${secs} sec` : `${mins} min`;
    }

    function updateReadingTime() {
        const text = textInput.value;
        const stats = calculateTextStats(text);
        let wpm = parseInt(wpmInput.value, 10);
        if (isNaN(wpm) || wpm <= 0) wpm = 200;

        const readingSeconds = (stats.words / wpm) * 60;
        const speakingSeconds = (stats.words / 130) * 60; // 130 WPM average speaking speed

        readingTimeDisplayEl.textContent = formatTime(readingSeconds);
        speakingTimeDisplayEl.textContent = formatTime(speakingSeconds);
        totalWordsEl.textContent = stats.words;
        totalCharsEl.textContent = stats.charsWithSpaces;

        // Update active preset button state
        pillBtns.forEach(btn => {
            if (parseInt(btn.dataset.wpm, 10) === wpm) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    }

    pillBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            wpmInput.value = btn.dataset.wpm;
            updateReadingTime();
        });
    });

    wpmInput.addEventListener("input", updateReadingTime);
    textInput.addEventListener("input", updateReadingTime);

    copyBtn.addEventListener("click", () => {
        copyToClipboard(textInput.value, copyBtn);
    });

    clearBtn.addEventListener("click", () => {
        textInput.value = "";
        updateReadingTime();
        textInput.focus();
    });

    downloadBtn.addEventListener("click", () => {
        downloadTextFile("reading-time-text.txt", textInput.value);
    });

    updateReadingTime();
});
