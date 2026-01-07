let editor;
let wordCountDisplay;

window.onload = () => {
    editor = document.getElementById('editor');
    wordCountDisplay = document.getElementById('wordCount');

    // Word Counter
    editor.addEventListener('input', () => {
        const text = editor.innerText || "";
        const count = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        wordCountDisplay.innerText = count;
    });
};

function formatDoc(cmd, value = null) {
    document.execCommand(cmd, false, value);
    editor.focus();
}

/**
 * Modern Dropdown Font Size Logic
 */
function changeFontSize(size) {
    if (!size) return;

    // Standardize to use CSS for exact pixels
    document.execCommand("styleWithCSS", false, true);
    
    // We use a temporary command to find the correct spot in the HTML
    document.execCommand("fontSize", false, "7");

    // Replace the browser's "Size 7" with your actual choice
    const fontTags = editor.querySelectorAll("font, span");
    fontTags.forEach(tag => {
        if (tag.getAttribute("size") === "7" || tag.style.fontSize === "xxx-large") {
            tag.removeAttribute("size");
            tag.style.fontSize = size + "px";
        }
    });

    editor.focus();
}
