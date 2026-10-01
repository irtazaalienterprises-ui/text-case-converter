/**
 * Shared Utilities for Text Case Converter & Text Tools
 */

function copyToClipboard(text, buttonElement) {
    if (!text) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback(buttonElement);
        }).catch(() => {
            fallbackCopy(text, buttonElement);
        });
    } else {
        fallbackCopy(text, buttonElement);
    }
}

function fallbackCopy(text, buttonElement) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand("copy");
        showCopyFeedback(buttonElement);
    } catch (err) {
        console.error("Copy failed", err);
    }
    document.body.removeChild(textArea);
}

function showCopyFeedback(buttonElement) {
    if (!buttonElement) return;
    const originalText = buttonElement.textContent;
    buttonElement.textContent = "Copied!";
    buttonElement.classList.add("copied");
    setTimeout(() => {
        buttonElement.textContent = originalText;
        buttonElement.classList.remove("copied");
    }, 1500);
}

function downloadTextFile(filename, content) {
    if (!content) return;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "text-tool-output.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function calculateTextStats(text) {
    const raw = text || "";
    const trimmed = raw.trim();

    const charsWithSpaces = raw.length;
    const charsNoSpaces = raw.replace(/\s/g, "").length;

    const words = trimmed ? trimmed.split(/\s+/).length : 0;

    // Accurate sentence counting handling abbreviations & punctuation
    let sentences = 0;
    if (trimmed) {
        const sanitized = trimmed.replace(/(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|vs|etc|e\.g|i\.e)\./gi, "$1_DOT_");
        const matches = sanitized.match(/[^.!?\s][^.!?]*[.!?]+(?=\s|$)/g);
        sentences = matches ? matches.length : 1;
    }

    const paragraphs = trimmed ? raw.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
    const lines = raw ? raw.split(/\r?\n/).length : 0;

    return {
        charsWithSpaces,
        charsNoSpaces,
        words,
        sentences,
        paragraphs,
        lines
    };
}

// Highlight active nav item automatically
document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPath || (currentPath === "" && href === "index.html")) {
            link.classList.add("active");
        }
    });
});
